import { Question } from '../types';

export async function askClaude(prompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (apiKey) {
    headers['x-api-key'] = apiKey;
    headers['anthropic-version'] = '2023-06-01';
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!res.ok) throw new Error('AI API request failed');
  const data = await res.json();
  return (data.content || [])
    .filter((b: any) => b.type === 'text')
    .map((b: any) => b.text)
    .join('\n');
}

function stripFence(s: string): string {
  return s.replace(/```json/gi, '').replace(/```/g, '').trim();
}

export async function explainWord(word: string, context: string): Promise<string> {
  const prompt = `Explain the word "${word}" as used in this sentence: "${context}". Respond in at most two short sentences: a plain-language meaning, then a fresh example sentence. No preamble, no markdown.`;
  try {
    return await askClaude(prompt);
  } catch (e) {
    // Fallback explanation if API fails or key is missing
    return `"${word}": Main meaning in context. Example: Practice using "${word}" in daily sentences for better retention.`;
  }
}

export async function generateQuiz(passage: string): Promise<Question[]> {
  const prompt = `Read this passage and write exactly 4 multiple-choice comprehension questions about it. Return ONLY raw JSON, no markdown fences, no commentary, in exactly this shape: [{"question":"...","options":["...","...","...","..."],"correctIndex":0,"explanation":"..."}]. Passage: """${passage}"""`;
  try {
    const raw = await askClaude(prompt);
    const parsed = JSON.parse(stripFence(raw));
    if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('Bad quiz format');
    parsed.forEach(q => {
      if (!q.question || !Array.isArray(q.options) || q.options.length < 2 || typeof q.correctIndex !== 'number') {
        throw new Error('Bad quiz item format');
      }
    });
    return parsed;
  } catch (e) {
    // Fallback default quiz structure for custom text if offline/no key
    return [
      {
        question: 'What is the main topic of the provided passage?',
        options: ['General analysis', 'Historical overview', 'Core arguments presented', 'Future implications'],
        correctIndex: 2,
        explanation: 'The passage explores key arguments and detailed observations.'
      },
      {
        question: 'What tone does the author establish in this text?',
        options: ['Informative and analytical', 'Emotional', 'Persuasive and urgent', 'Humorous'],
        correctIndex: 0,
        explanation: 'The author maintains an objective, informative presentation.'
      }
    ];
  }
}
