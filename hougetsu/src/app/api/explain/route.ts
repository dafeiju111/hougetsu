import { NextResponse } from 'next/server';
import OpenAI from "openai";

const langMap: Record<string, string> = {
  ja: "日本語 (Japanese)",
  en: "English",
  ko: "한국어 (Korean)",
  zh: "中文 (Chinese)"
};


export async function POST(req: Request) {

  // debug
  console.log("--- detect enviroment ---");
  console.log("DEEPSEEK_KEY is exit:", !!process.env.DEEPSEEK_API_KEY);
  console.log("MODEL_TYPE:", process.env.NEXT_PUBLIC_TRANSLATION_MODEL);
  console.log("-------------------");


  try {
    const { text, targetLang, sourceLang, context} = await req.json();
    const model = process.env.NEXT_PUBLIC_TRANSLATION_MODEL;
    const fullSourceLang = langMap[sourceLang] || sourceLang;
    const fullTargetLang = langMap[targetLang] || targetLang;

    if (model === 'deepseek') {

      const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: process.env.DEEPSEEK_API_KEY,
      });

    let langSpecificInstruction = "";
    if (targetLang === 'ja') {
           langSpecificInstruction = ` 
            - 请使用【中文】进行教学。
            - 语法术语请采用中文习惯（如：主谓宾、补语、状语）。
            `
    } 
    else if(targetLang === 'zh') {
          langSpecificInstruction = `
          - 解説はすべて【日本語】で行ってください。
          - 学習者に優しく教える先生のような口調（です・ます体）で書いてください。
          `;
    }

    else if(targetLang === 'eu'){
        langSpecificInstruction = `
          - Please provide all explanations in 【English】.
          - Use clear and professional linguistic terminology.
          `;
    }
    else{
          langSpecificInstruction =`
          - Please provide all explanations in 【English】.
          - Use clear and professional linguistic terminology.
          `
    }

    const promptTemplates: Record<string, any> = {
        zh: {
            role: `你是一个精简的【${fullSourceLang}】词典工具。`,
            task: `解析文本。要求：仅输出读音和意思。**绝对禁止使用 #、*、-、>、** 等任何格式符号。**`,
            logic: `
            请严格执行以下格式输出，每个词条占一行：

            单词/短语：(读音) 中文意思

            如果是句子，请在最下方补充：
            翻译：(整句翻译)
            语法：(一句话极简说明)
            `,
            example: `
            示例 1 (日语)：
            斬撃：(ざんげき) 斩击
            翻译：这是斩击。
            语法：名词短语。

            示例 2 (英语)：
            Awful：(/ˈɔːfl/) 糟糕的
            翻译：It is awful.
            语法：形容词作表语。
            `,
            footer: `
            注意：
            1. 严禁输出任何 Markdown 符号（如加粗、列表、标题）。
            2. 关于读音标注：日语请标注【平假名】，英语请标注【音标】，其他语言标注【标准发音转写】。
            3. 严禁输出任何开场白、结束语或多余的解释。
            4. 仅输出文字、换行、冒号和括号。`
            },
        ja: {
            role: `${fullSourceLang} のための簡潔な辞書ツール。`,
            task: `テキストを解析し、読みと意味のみを出力してください。**記号（#、*、-、>、**）は一切使用禁止です。**`,
            logic: `
            以下の形式で、1項目につき1行で出力してください：

            単語/フレーズ：(読み) 意味

            文章の場合は、最後に以下を追加してください：
            翻訳：(全体の翻訳)
            文法：(一文での簡潔な説明)
            `,
            example: `
            出力例1 (英語の場合)：
            Apple：(/ˈæp.əl/) りんご
            翻訳：これはりんごです。
            文法：第2文型の肯定文。

            出力例2 (韓国語の場合)：
            한국어：(Hangugeo) 韓国語
            翻訳：韓国語を学びます。
            文法：目的語と動詞の構成。
            `,
            footer: `
            注意：
            1. Markdown記号（太字、リスト、見出し）は絶対に使わないでください。
            2. 読み方の表記：日本語は【ひらがな】、英語は【発音記号】、その他の言語は【標準的なカタカナまたはローマ字表記】を使用してください。
            3. 挨拶や余計な解説は一切省いてください。`
            
        },
        en: {
            role: `You are a concise dictionary tool for ${fullSourceLang}.`,
            task: `Analyze the text. Output ONLY pronunciation and meaning. **Absolutely NO symbols like #, *, -, >, or **.**`,
            logic: `
            Strictly follow this format, one entry per line:

            Word/Phrase: (pronunciation) Meaning

            If the input is a sentence, add at the bottom:
            Translation: (Full translation)
            Grammar: (One-sentence brief explanation)
            `,
            example: `
            Example 1 (Japanese text):
            斬撃: (zangeki) Slashing attack
            Translation: It was a slashing attack.
            Grammar: Noun-based phrase.

            Example 2 (French text):
            Bonjour: (bon-zhoor) Hello
            Translation: Hello, how are you?
            Grammar: Common greeting.
            `,
            footer: `
            Note:
            1. NO Markdown formatting (bold, lists, headings).
            2. Pronunciation: Use Hiragana for Japanese, IPA/phonetics for English, and standard transliteration for other languages.
            3. No conversational filler or extra explanations.`
        }
    };

    const p = promptTemplates[targetLang] || promptTemplates['en'];
    const systemPrompt = `
            ### ROLE
            ${p.role}

            ### TASK
            ${p.task}

            ### LOGIC
            ${p.logicWord}
            ${p.logicSentence}

            ### STORY CONTEXT
            - Background: ${context?.background || 'N/A'}
            - Genre: ${context?.type || 'General'}

            ### EXAMPLE
            ${p.example}

            ### FINAL STRICTURES (MUST FOLLOW)
            ${p.footer}
            `;
            
    const response = await openai.chat.completions.create({
        model: "deepseek-chat",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Text: "${text}"` }
        ],
        temperature: 0.3,
    });
    return NextResponse.json({ explanation: response.choices[0].message.content });
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