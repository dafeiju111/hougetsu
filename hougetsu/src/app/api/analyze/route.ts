import { NextResponse } from 'next/server';
import OpenAI from "openai";


export async function POST(req: Request) {

  // debug
  console.log("--- detect enviroment ---");
  console.log("DEEPSEEK_KEY is exit:", !!process.env.DEEPSEEK_API_KEY);
  console.log("MODEL_TYPE:", process.env.NEXT_PUBLIC_TRANSLATION_MODEL);
 


  try {
    const { fullText, targetLang } = await req.json();
    const model = process.env.NEXT_PUBLIC_TRANSLATION_MODEL;

    if (model === 'deepseek') {

      const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: process.env.DEEPSEEK_API_KEY,
      });

      let systemPrompt = "";

      if(targetLang ==='ja'){
        systemPrompt = `あなたはプロの文芸エディターです。
        提供されたテキストを分析し、以下の情報をJSON形式で抽出してください。
        特に、日本語翻訳において重要な【文体（です・ます体か、だ・である体か）】の判断材料を含めてください。

        必ず以下のJSON形式で回答してください：
        {
            "type": "文章の種類（例：ライトノベル、技術ドキュメント、ニュース、ビジネスメール等）",
            "background": "物語の背景、設定、または記事の主旨。",
            "characters": "登場人物の設定、または説明文における主要な対象オブジェクト。",
            "terminology": "重要な用語や固有名詞の日本語訳案。",
            "style_hint": "推奨される文体（例：『だ・である』体、丁寧な『です・ます』体、口語体など）"
        }
        返信はJSONデータのみとし、余計な説明は一切排除してください。`;
      }
      else if(targetLang ==='zh'){
        systemPrompt = `你是一位专业的文学编辑和文本分析专家。
        请分析所提供的文本，并以 JSON 格式提取以下信息。
        特别地，请包含对中文翻译至关重要的【语体风格（是书面语还是口语，是否需要特定的文学修辞）】的判断依据。

        必须按照以下 JSON 格式回答：
        {
            "type": "文章类型（例如：轻小说、技术文档、新闻、商务邮件等）",
            "background": "故事背景、设定或文章主旨。",
            "characters": "角色设定或说明文中的主要对象。",
            "terminology": "重要术语或专有名词的中文翻译建议。",
            "style_hint": "推荐的语体风格（例如：正式书面语、自然口语、古风、特定行业术语风格等）"
        }
        回复必须仅包含 JSON 数据，严禁包含任何多余的解释说明。`;
      }
      else if(targetLang ==='en'){
        systemPrompt = `You are a professional literary editor and text analyst.
        Analyze the provided text and extract the following information in JSON format.
        In particular, include criteria for determining the [Tone and Style], which is crucial for English translation (e.g., formal vs. informal, archaic vs. modern).

        You must respond strictly in the following JSON format:
        {
            "type": "Type of text (e.g., Light Novel, Technical Document, News, Business Email, etc.)",
            "background": "Story background, setting, or the main theme of the article.",
            "characters": "Character settings or primary objects/subjects in descriptive text.",
            "terminology": "Suggested English translations for key terms and proper nouns.",
            "style_hint": "Recommended tone/style (e.g., Formal, Casual, First-person narrative, Academic, etc.)"
        }
        The response must contain ONLY the JSON data. Any additional explanation or chatter is strictly prohibited.`;
      }
      else{// default to english
        systemPrompt = `You are a professional literary editor and text analyst.
        Analyze the provided text and extract the following information in JSON format.
        In particular, include criteria for determining the [Tone and Style], which is crucial for English translation (e.g., formal vs. informal, archaic vs. modern).

        You must respond strictly in the following JSON format:
        {
            "type": "Type of text (e.g., Light Novel, Technical Document, News, Business Email, etc.)",
            "background": "Story background, setting, or the main theme of the article.",
            "characters": "Character settings or primary objects/subjects in descriptive text.",
            "terminology": "Suggested English translations for key terms and proper nouns.",
            "style_hint": "Recommended tone/style (e.g., Formal, Casual, First-person narrative, Academic, etc.)"
        }
        The response must contain ONLY the JSON data. Any additional explanation or chatter is strictly prohibited.`;
      }
      

      const completion = await openai.chat.completions.create({
        model: "deepseek-chat", 
        messages: [
            { 
            role: "system", 
            content: systemPrompt
            },
            { 
            role: "user", 
            content: `原文内容：\n\n${fullText}`
        }
        ],
    
        temperature: 0.3,
        response_format : { type: 'json_object' }
  });
  try{
    const resContent = completion.choices[0].message.content;
    const analyzeData = JSON.parse(resContent || "{}");
    return NextResponse.json({analyzeData});
  }catch(e){
    console.error("background JSON error:",e);
    return NextResponse.json({ error: "background JSON parse error" }, { status: 500 });
  }

}

    if (model === 'gemini') {
    }

  } catch (error) {
    console.error("model error:", error);
    return NextResponse.json({ error: "can't use api from LLM model" }, { status: 500 });
  }
}