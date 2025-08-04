import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export async function generateAIResponse(message: string, language: string = 'en'): Promise<string> {
  try {
    // Mental health focused system prompt with language-specific instructions
    const languageName = getLanguageName(language);
    const systemPrompt = `You are SupportGPT, a compassionate AI mental health support companion for students and youth. You provide empathetic, non-judgmental support and always respond in a warm, caring tone. You are not a replacement for professional therapy but offer peer-like emotional support. 

CRITICAL: You MUST respond in ${languageName} language only. Do not use English unless the user specifically wrote in English.

Key guidelines:
1. Always acknowledge their feelings with empathy
2. Show understanding and validate their experience
3. Ask gentle follow-up questions to encourage sharing
4. Provide practical coping strategies when appropriate
5. Remind them they're not alone and that seeking help is brave
6. In crisis situations, gently suggest professional help
7. ALWAYS respond in the same language as the user's message (${languageName})
8. Keep responses conversational and supportive, like a caring friend
9. Avoid being overly clinical or robotic

IMPORTANT: The user wrote in ${languageName}, so respond ONLY in ${languageName}. If the detected language is not English, do not include any English words in your response.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user", 
          content: message
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const aiResponse = response.choices[0].message.content;
    if (aiResponse) {
      return aiResponse.trim();
    }

    // Fallback if no response
    return getFallbackResponse(language);

  } catch (error) {
    console.error('OpenAI API error:', error);
    return getFallbackResponse(language);
  }
}

function getLanguageName(code: string): string {
  const languages: Record<string, string> = {
    'en': 'English',
    'es': 'Spanish', 
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'pt': 'Portuguese',
    'ru': 'Russian',
    'ja': 'Japanese',
    'ko': 'Korean', 
    'zh': 'Chinese',
    'ar': 'Arabic',
    'hi': 'Hindi'
  };
  
  return languages[code] || 'English';
}

function getFallbackResponse(language: string): string {
  const fallbackResponses: Record<string, string[]> = {
    'en': [
      "I hear you, and I want you to know that your feelings are completely valid. Sometimes just talking about what's on our mind can help us process things better. Can you tell me more about what's been weighing on you?",
      "Thank you for sharing that with me. It takes courage to reach out, and I'm glad you're here. What you're going through sounds really challenging. How long have you been feeling this way?",
      "I can sense that you're going through something difficult right now. Your feelings matter, and you deserve support. Would it help to talk about what's been the most overwhelming part of your day?",
      "I'm here to listen without judgment. Sometimes when we're struggling, it can feel isolating, but you're not alone in this. What's been on your mind lately that you'd like to share?"
    ],
    'es': [
      "Te escucho, y quiero que sepas que tus sentimientos son completamente válidos. A veces solo hablar de lo que tenemos en mente puede ayudarnos a procesar mejor las cosas. ¿Puedes contarme más sobre lo que te ha estado preocupando?",
      "Gracias por compartir eso conmigo. Se necesita valor para buscar ayuda, y me alegra que estés aquí. Lo que estás pasando suena realmente desafiante. ¿Cuánto tiempo has estado sintiéndote así?"
    ],
    'fr': [
      "Je t'entends, et je veux que tu saches que tes sentiments sont complètement valides. Parfois, simplement parler de ce qui nous préoccupe peut nous aider à mieux traiter les choses. Peux-tu me dire plus sur ce qui t'a pesé?",
      "Merci de partager cela avec moi. Il faut du courage pour tendre la main, et je suis content que tu sois là. Ce que tu traverses semble vraiment difficile. Depuis combien de temps te sens-tu ainsi?"
    ],
    'zh': [
      "我听到了你的话，我想让你知道你的感受是完全有效的。有时候仅仅谈论我们心中的想法就能帮助我们更好地处理事情。你能告诉我更多关于什么一直困扰着你的吗？",
      "谢谢你与我分享这些。寻求帮助需要勇气，我很高兴你在这里。你所经历的听起来真的很具有挑战性。你有这种感觉多长时间了？"
    ],
    'ja': [
      "あなたの話を聞いています。あなたの気持ちは完全に正当なものだということを知ってほしいです。時には心にあることを話すだけで、物事をより良く処理するのに役立ちます。あなたを悩ませていることについて、もっと教えてもらえますか？",
      "それを私と共有してくれてありがとう。手を差し伸べるには勇気が必要で、あなたがここにいることを嬉しく思います。あなたが経験していることは本当に困難に聞こえます。どのくらいの間、このように感じていますか？"
    ]
  };

  const responses = fallbackResponses[language] || fallbackResponses['en'];
  return responses[Math.floor(Math.random() * responses.length)];
}