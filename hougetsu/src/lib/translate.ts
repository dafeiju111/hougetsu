// for simulating AI request

// export const fetchTranslation = async (text: string): Promise<string> => {
  
//   await new Promise((resolve) => setTimeout(resolve, 1500));
  
//   return `[simulation]：${text.split('').reverse().join('')}`;
// };

export const fetchTranslation = async (
  text: string,
  context:any,
  sourceLang: string,
  targetLang: string,
  contextBefore: string[],
  contextAfter: string[]
): Promise<string> => {
  const response = await fetch('/api/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, context, sourceLang, targetLang }),
  });

  if (!response.ok) {
    throw new Error('can\'t access Internet');
  }

  const data = await response.json();
  return data.translation;
};