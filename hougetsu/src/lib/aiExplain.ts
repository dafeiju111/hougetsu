export async function fetchAiExplanation(
    text: string,
    sourceLang: string,
    targetLang: string,
    context: any
) : Promise<string>{
    const response = await fetch("/api/explain",{
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
            text,
            sourceLang,
            targetLang,
            context,
        }),
    });
    if(!response.ok) throw new Error("AI Explanation request failed");
    const data = await response.json();
    return data.explanation || "Please try again";

}