import { NextResponse } from 'next/server';
import OpenAI from "openai";


export async function POST(req: Request) {

  // debug
  console.log("--- detect enviroment ---");
  console.log("DEEPSEEK_KEY is exit:", !!process.env.DEEPSEEK_API_KEY);
  console.log("MODEL_TYPE:", process.env.NEXT_PUBLIC_TRANSLATION_MODEL);
  console.log("-------------------");


  try {
    const { text } = await req.json();
    const model = process.env.NEXT_PUBLIC_TRANSLATION_MODEL;

    if (model === 'deepseek') {

      const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: process.env.DEEPSEEK_API_KEY,
      });
      const completion = await openai.chat.completions.create({
      model: "deepseek-chat", 
      messages: [
        { 
          role: "system", 
          content: "你是一位精通中日文学翻译的专家，请将日文翻译成优雅自然的中文。" 
        },
        { 
          role: "user", 
          content: text 
       }
    ],
 
    temperature: 0.7 
  });

  // 直接返回提取后的内容
  const translatedText = completion.choices[0].message.content;
  return NextResponse.json({ translation: translatedText?.trim() });
}

    if (model === 'gemini') {
      const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY as string
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `翻译这段日文：${text}` }] }]
        })
      });
      const data = await response.json();
      return NextResponse.json({ translation: data.candidates[0].content.parts[0].text });
    }

  } catch (error) {
    console.error("切换模型出错:", error);
    return NextResponse.json({ error: "翻译服务不可用" }, { status: 500 });
  }
}
