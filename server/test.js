async function test() {
    try {
        const res = await fetch('https://ai-mock-interviewer-8w1o.onrender.com/api/interview/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "Test User",
                role: "Frontend Developer",
                difficulty: "Easy"
            })
        });
        const contentType = res.headers.get("content-type");
        const body = await res.text();
        console.log("STATUS:", res.status);
        console.log("CONTENT-TYPE:", contentType);
        console.log("BODY:", body);
    } catch (e) {
        console.log("NETWORK ERROR:", e.message);
    }
}

test();
