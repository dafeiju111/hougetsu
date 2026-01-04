import { NextResponse } from 'next/server';
import OpenAI from "openai";


export async function POST(req: Request) {

  // debug
  console.log("--- detect enviroment ---");
  console.log("DEEPSEEK_KEY is exit:", !!process.env.DEEPSEEK_API_KEY);
  console.log("MODEL_TYPE:", process.env.NEXT_PUBLIC_TRANSLATION_MODEL);
  console.log("-------------------");


  try {
    const { text, targetLang, sourceLang, context, contextBefore } = await req.json();
    const model = process.env.NEXT_PUBLIC_TRANSLATION_MODEL;

    if (model === 'deepseek') {

      const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: process.env.DEEPSEEK_API_KEY,
      });
      let langInstruction = "";
      if (targetLang === 'ja') {
            langInstruction = ` 
            ### 役割 (ROLE)
            あなたはあらゆる分野（文芸、ニュース、技術、実務）に通じたキャリア20年の超一流翻訳家です。
            提供されるテキストの「ジャンル」を瞬時に判別し、その領域において最も適切で自然な日本語に翻訳してください。

            ### 翻訳指針 (GUIDELINES)
            1. **体裁・文体の自動選択 (Genre Adaptation)**:
              - **文芸・小説**: 登場人物の性格や背景を汲み取り、「役割語」や情景描写を駆使してドラマチックに。地は「だ・である」。
              - **ニュース・記事**: 客観的で明瞭な「だ・である」または「です・ます」を選択。
              - **技術・実務**: 正確性と論理性を最優先し、専門用語を適切に使用。
              - **随筆・エッセイ**: 筆者のパーソナリティを感じさせる親しみやすく洗練された文体へ。

            2. **文脈の推論 (Contextual Inference)**:
              提供された「Story Context」や前後の流れから、専門用語の統一や、代詞（彼/彼女/それ）が指す対象を正確に把握して訳文に反映させてください。

            3. **日本語としての完成度**:
              直訳を避け、日本語として読みやすく、かつ原文の意図を完璧に再現する「再構築」を行ってください。

            ### 出力ルール (OUTPUT RULES)
            1. **翻訳結果のみを出力**: 
              解説、挨拶、原文の再記載、水平線などは**一切禁止**です。翻訳後の日本語のみを返してください。
            2. **装飾の禁止**: 
              指示がない限り、太字や記号による装飾は行わないでください。
            3. **書式**: 
              - 小説の場合は「 」や破折号（――）を使用。
              - 実務・技術文書の場合は適切な箇条書きや句読点を使用。;`
      } 
      else if(targetLang === 'zh') {
          langInstruction = `
          ### 角色 (ROLE)
          你是一位通晓各领域（文学、新闻、技术、商务）且拥有20年经验的顶级翻译专家。
          请根据提供文本的“体裁”，瞬间判定其所属领域，并转化为最地道、自然的中文。

          ### 翻译指针 (GUIDELINES)
          1. **体裁与文体自适应 (Genre Adaptation)**:
            - **文学·小说**: 深入揣摩人物性格与背景，灵活运用“语气词”与情景描写增强戏剧感。叙述语感需流畅且具文学性。
            - **新闻·报刊**: 保持客观中立，语言明晰干练。根据内容选择正式或平实的表述。
            - **技术·实务**: 准确性与逻辑性至上，严谨使用专业术语，确保表达不留歧义。
            - **散文·随笔**: 传达作者的个性，语言需亲切、洗练且富有美感。

          2. **语境推论 (Contextual Inference)**:
            参考提供的“Story Context”及前后文，确保专业术语统一。准确识别代词（他/她/它）对应的对象，并在译文中体现。

          3. **中文完成度**:
            严禁直译或机器翻译感。在保持原文意图的前提下，通过“重构”句式，使其读起来像是由中文母语作家创作的作品。

          ### 输出规则 (OUTPUT RULES)
          1. **仅输出翻译结果**: 
            严禁包含任何解释、寒暄、重复原文或分隔符。只需返回翻译后的中文文本。
          2. **严禁装饰**: 
            除非原文有特殊排版需求，否则严禁使用粗体、特殊符号或其他装饰。
          3. **格式规范**: 
            - 小说类：使用中文引号“ ”，对话衔接需自然。
            - 技术类：使用规范的中文标点，必要时保留通用的专业英文缩写。
          `;
      }

      else{
          langInstruction =`
          ### ROLE
          You are a world-class translator with 20 years of experience across all fields (literature, news, technology, and business).
          Instantly identify the genre of the provided text and translate it into the most appropriate and natural English for that specific domain.

          ### GUIDELINES
          1. **Genre Adaptation**:
            - **Literature/Fiction**: Capture character personalities and subtext. Use vivid imagery and narrative flair. Ensure the narrative voice is consistent.
            - **News/Articles**: Maintain an objective, clear, and journalistic tone. Focus on readability and directness.
            - **Tech/Business**: Prioritize accuracy and logic. Use industry-specific terminology correctly and maintain a professional tone.
            - **Essays/Prose**: Reflect the author's unique voice. The prose should be engaging, nuanced, and sophisticated.

          2. **Contextual Inference**:
            Utilize the provided "Story Context" and surrounding flow to maintain consistency in terminology. Ensure pronouns (he/she/it) correctly reflect their intended subjects.

          3. **Localization & Natural Flow**:
            Avoid literal translation. Reconstruct sentences to ensure they read as if they were originally written by a native English speaker while preserving the original intent.

          ### OUTPUT RULES
          1. **Output Translation ONLY**: 
            Explaining, greeting, repeating the source text, or using horizontal rules is **STRICTLY PROHIBITED**. Return only the translated English text.
          2. **No Decorations**: 
            Do not use bold text or unnecessary symbols unless explicitly instructed.
          3. **Formatting**: 
            - For Fiction: Use standard English quotation marks (" ") and appropriate punctuation (e.g., em-dashes for pauses).
            - For Tech/Business: Use clear paragraph structures and standard professional formatting.
          `
      }


      // analyze Background
      let contextPrompt = "";
      if(context){
        contextPrompt = `
        ### 故事背景信息 (CONTEXT):
        - 类型: ${context.type}
        - 世界观背景: ${context.background}
        - 风格/人称提示: ${context.style_hint}
        请在翻译过程中严格遵守以上设定，确保译文中的术语和语气在整部作品中保持一致。`;
      }

      let referenceBlock = ""
      if((contextBefore && contextBefore.length > 0)){
        referenceBlock = `
          ### 周边上下文 (仅供参考，请勿翻译):
          ${contextBefore?.length > 0 ? `[前文内容]:\n${contextBefore.join('\n')}\n` : ""}---
        `;
      }
      const finalSystemPrompt = `${langInstruction}\n${contextPrompt}`;
      const completion = await openai.chat.completions.create({
      model: "deepseek-chat", 
      messages: [
        { 
          role: "system", 
          content: finalSystemPrompt 
        },
        { 
          role: "user", 
          content: `${referenceBlock}### 待翻译目标 (TARGET):\n${text}`
       }
    ],
 
    temperature: 0.6 
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
