export const getStoryBackground = async (text: string, targetLang: string) => {
    const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            fullText: text.slice(0, 2000),
            targetLang
        }),
    });

    if (!res.ok) {
        throw new Error("Background analysis API failed");
    }

    return await res.json();
};