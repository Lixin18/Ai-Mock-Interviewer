import Session from '../models/Session.js';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export const startInterview = async (req, res) => {
    try {
        const { name, role, difficulty } = req.body;
        
        if (!name || !role || !difficulty) {
            return res.status(400).json({ error: 'Name, role, and difficulty are required.' });
        }

        const systemPrompt = `You are a senior technical interviewer. Generate exactly 5 interview questions for a ${role} position at ${difficulty} difficulty. Return ONLY a JSON array of question strings in the format ["Question 1", "Question 2"], no extra text, backticks, or markdown formatting.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: systemPrompt
        });

        let questionsText = response.text;
        
        // Advanced markdown stripping for Gemini
        questionsText = questionsText.replace(/```json/gi, '').replace(/```/g, '').trim();

        let questions;
        try {
            questions = JSON.parse(questionsText);
        } catch (e) {
            console.error("Failed to parse Gemini response:", questionsText);
            return res.status(500).json({ error: 'Failed to generate valid questions.' });
        }

        const session = new Session({
            name,
            role,
            difficulty,
            questions,
            status: 'in-progress'
        });

        await session.save();

        res.status(201).json({ sessionId: session._id, questions });
    } catch (error) {
        console.error("Error in startInterview:", error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};

export const evaluateAnswer = async (req, res) => {
    try {
        const { sessionId, questionIndex, question, answer } = req.body;

        if (!sessionId || questionIndex === undefined || !question || !answer) {
            return res.status(400).json({ error: 'Missing required parameters.' });
        }

        const systemPrompt = `You are an expert interviewer evaluating a candidate's answer. Given the question: "${question}"\nAnd the Candidate Answer: "${answer}"\nReturn ONLY a JSON object with keys: "goodPoints" (string), "missingPoints" (string), "score" (number 1-10). Return NO OTHER text, json blocks, or markdown.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: systemPrompt
        });

        let feedbackText = response.text;
        
        // Advanced markdown stripping for Gemini
        feedbackText = feedbackText.replace(/```json/gi, '').replace(/```/g, '').trim();
        
        let feedback;
        try {
            feedback = JSON.parse(feedbackText);
        } catch (e) {
            console.error("Failed to parse Gemini feedback response:", feedbackText);
            // Fallback object so it doesn't crash the user experience completely
            feedback = {
                goodPoints: "Could not fetch AI evaluation.",
                missingPoints: "Please try submitting a more detailed answer.",
                score: 5
            };
        }
        
        const session = await Session.findById(sessionId);
        if (session) {
            // Safe push arrays mapped accurately to Mongoose
            if (!session.answers) session.answers = [];
            if (!session.feedbacks) session.feedbacks = [];
            
            session.answers[questionIndex] = answer;
            session.feedbacks[questionIndex] = feedback;
            
            // Explicitly mark modified for mixed arrays in Mongoose
            session.markModified('answers');
            session.markModified('feedbacks');
            await session.save();
        }

        res.status(200).json(feedback);
    } catch (error) {
        console.error("Error in evaluateAnswer:", error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};

export const completeInterview = async (req, res) => {
    try {
        const { sessionId, answers, feedbacks } = req.body;

        if (!sessionId || !answers || !feedbacks) {
            return res.status(400).json({ error: 'Missing required parameters.' });
        }

        let totalScore = 0;
        let validScores = 0;
        
        feedbacks.forEach(f => {
            if (f && f.score !== undefined) {
                totalScore += f.score;
                validScores++;
            }
        });

        const overallScore = validScores > 0 ? Math.round(totalScore / validScores) : 0;

        let summary = "The candidate demonstrated a solid foundation but could improve on structuring answers with more concrete examples.";
        
        try {
             const summaryPrompt = `You are an expert technical interviewer. Summarize the candidate's performance in 2-3 sentences based on their overall score of ${overallScore}/10. Be encouraging but realistic.`;
             const summaryResponse = await ai.models.generateContent({
                 model: "gemini-2.5-flash",
                 contents: summaryPrompt
             });
             summary = summaryResponse.text.trim();
        } catch (e) {
             console.log("Failed to generate summary via Gemini, using default fallback.");
        }

        const session = await Session.findByIdAndUpdate(sessionId, {
            answers,
            feedbacks,
            overallScore,
            summary,
            status: 'completed'
        }, { new: true });

        if (!session) {
             return res.status(404).json({ error: 'Session not found.' });
        }

        res.status(200).json({ overallScore, summary, session });
    } catch (error) {
        console.error("Error in completeInterview:", error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getHistory = async (req, res) => {
    try {
        const sessions = await Session.find({ status: 'completed' }).sort({ createdAt: -1 });
        res.status(200).json(sessions);
    } catch (error) {
        console.error("Error in getHistory:", error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getSession = async (req, res) => {
    try {
        const { id } = req.params;
        const session = await Session.findById(id);
        
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        res.status(200).json(session);
    } catch (error) {
        console.error("Error in getSession:", error);
        res.status(500).json({ error: 'Server error' });
    }
};
