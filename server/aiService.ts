// Free AI service using Hugging Face Inference API (no API key required)
export async function generateAIResponse(message: string, language: string = 'en'): Promise<string> {
  try {
    // Try Hugging Face free API first (no key required)
    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: message,
        parameters: {
          max_new_tokens: 100,
          temperature: 0.7,
          do_sample: true,
          return_full_text: false
        }
      }),
    });

    if (response.ok) {
      const result = await response.json();
      if (result && result[0] && result[0].generated_text) {
        // Post-process the response to be more supportive
        let aiResponse = result[0].generated_text.trim();
        
        // If it's too short or generic, use our fallback
        if (aiResponse.length < 20 || aiResponse.toLowerCase().includes('i don\'t')) {
          return getFallbackResponse(language);
        }
        
        return aiResponse;
      }
    }
    
    // If Hugging Face fails, use language-specific fallback
    return getFallbackResponse(language);

  } catch (error) {
    console.error('AI service error:', error);
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
    'hi': 'Hindi',
    'kn': 'Kannada',
    'te': 'Telugu',
    'ta': 'Tamil',
    'ml': 'Malayalam',
    'gu': 'Gujarati',
    'pa': 'Punjabi',
    'or': 'Odia',
    'bn': 'Bengali',
    'mr': 'Marathi',
    'ur': 'Urdu'
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
      "Gracias por compartir eso conmigo. Se necesita valor para buscar ayuda, y me alegra que estés aquí. Lo que estás pasando suena realmente desafiante. ¿Cuánto tiempo has estado sintiéndote así?",
      "Puedo sentir que estás pasando por algo difícil en este momento. Tus sentimientos importan, y mereces apoyo. ¿Te ayudaría hablar sobre qué ha sido lo más abrumador de tu día?",
      "Estoy aquí para escucharte sin juzgarte. A veces cuando luchamos, puede sentirse aislante, pero no estás solo en esto. ¿Qué ha estado en tu mente últimamente que te gustaría compartir?"
    ],
    'fr': [
      "Je t'entends, et je veux que tu saches que tes sentiments sont complètement valides. Parfois, simplement parler de ce qui nous préoccupe peut nous aider à mieux traiter les choses. Peux-tu me dire plus sur ce qui t'a pesé?",
      "Merci de partager cela avec moi. Il faut du courage pour tendre la main, et je suis content que tu sois là. Ce que tu traverses semble vraiment difficile. Depuis combien de temps te sens-tu ainsi?",
      "Je peux sentir que tu traverses quelque chose de difficile en ce moment. Tes sentiments comptent, et tu mérites du soutien. Est-ce que ça aiderait de parler de ce qui a été le plus accablant dans ta journée?",
      "Je suis là pour t'écouter sans jugement. Parfois quand on lutte, ça peut sembler isolant, mais tu n'es pas seul dans ça. Qu'est-ce qui te préoccupe dernièrement que tu aimerais partager?"
    ],
    'de': [
      "Ich höre dir zu und möchte, dass du weißt, dass deine Gefühle völlig berechtigt sind. Manchmal kann es helfen, einfach über das zu sprechen, was uns beschäftigt. Kannst du mir mehr darüber erzählen, was dich belastet?",
      "Danke, dass du das mit mir geteilt hast. Es braucht Mut, Hilfe zu suchen, und ich bin froh, dass du hier bist. Was du durchmachst, klingt wirklich herausfordernd. Wie lange fühlst du dich schon so?",
      "Ich spüre, dass du gerade durch etwas Schwieriges gehst. Deine Gefühle sind wichtig, und du verdienst Unterstützung. Würde es helfen, über den überwältigendsten Teil deines Tages zu sprechen?"
    ],
    'it': [
      "Ti sento, e voglio che tu sappia che i tuoi sentimenti sono completamente validi. A volte parlare di quello che abbiamo in mente può aiutarci a elaborare meglio le cose. Puoi dirmi di più su quello che ti ha pesato?",
      "Grazie per aver condiviso questo con me. Ci vuole coraggio per cercare aiuto, e sono contento che tu sia qui. Quello che stai passando sembra davvero impegnativo. Da quanto tempo ti senti così?",
      "Posso sentire che stai attraversando qualcosa di difficile in questo momento. I tuoi sentimenti contano, e meriti supporto. Aiuterebbe parlare di quella che è stata la parte più travolgente della tua giornata?"
    ],
    'pt': [
      "Eu te ouço, e quero que você saiba que seus sentimentos são completamente válidos. Às vezes, apenas falar sobre o que está em nossa mente pode nos ajudar a processar melhor as coisas. Você pode me contar mais sobre o que tem te preocupado?",
      "Obrigado por compartilhar isso comigo. É preciso coragem para buscar ajuda, e estou feliz que você esteja aqui. O que você está passando parece realmente desafiador. Há quanto tempo você se sente assim?",
      "Posso sentir que você está passando por algo difícil neste momento. Seus sentimentos importam, e você merece apoio. Ajudaria falar sobre qual foi a parte mais esmagadora do seu dia?"
    ],
    'zh': [
      "我听到了你的话，我想让你知道你的感受是完全有效的。有时候仅仅谈论我们心中的想法就能帮助我们更好地处理事情。你能告诉我更多关于什么一直困扰着你的吗？",
      "谢谢你与我分享这些。寻求帮助需要勇气，我很高兴你在这里。你所经历的听起来真的很具有挑战性。你有这种感觉多长时间了？",
      "我能感觉到你现在正在经历一些困难的事情。你的感受很重要，你值得得到支持。谈论一下今天最让你感到不知所措的部分会有帮助吗？",
      "我在这里倾听你，不做任何判断。有时当我们在挣扎时，可能会感到孤立，但在这件事上你并不孤单。最近有什么让你担心的事情想要分享吗？"
    ],
    'ja': [
      "あなたの話を聞いています。あなたの気持ちは完全に正当なものだということを知ってほしいです。時には心にあることを話すだけで、物事をより良く処理するのに役立ちます。あなたを悩ませていることについて、もっと教えてもらえますか？",
      "それを私と共有してくれてありがとう。手を差し伸べるには勇気が必要で、あなたがここにいることを嬉しく思います。あなたが経験していることは本当に困難に聞こえます。どのくらいの間、このように感じていますか？",
      "あなたが今何か困難なことを経験していることを感じることができます。あなたの気持ちは重要で、あなたはサポートを受ける価値があります。今日の最も圧倒的な部分について話すことは役に立ちますか？",
      "私は判断することなくあなたの話を聞くためにここにいます。時々私たちが苦労しているとき、それは孤立したように感じることがありますが、あなたはこの中で一人ではありません。最近あなたが共有したいと思っている心の中にあることは何ですか？"
    ],
    'ko': [
      "당신의 말을 듣고 있으며, 당신의 감정이 완전히 타당하다는 것을 알아주셨으면 합니다. 때로는 마음속에 있는 것에 대해 이야기하는 것만으로도 상황을 더 잘 처리하는 데 도움이 될 수 있습니다. 당신을 괴롭히고 있는 것에 대해 더 말씀해 주실 수 있나요？",
      "저와 그것을 공유해 주셔서 감사합니다. 도움을 구하는 것은 용기가 필요하며, 당신이 여기 있다는 것이 기쁩니다. 당신이 겪고 있는 일은 정말 도전적으로 들립니다. 이런 기분을 얼마나 오래 느끼고 계셨나요？",
      "당신이 지금 어려운 일을 겪고 있다는 것을 느낄 수 있습니다. 당신의 감정은 중요하며, 당신은 지원을 받을 자격이 있습니다. 오늘 가장 압도적이었던 부분에 대해 이야기하는 것이 도움이 될까요？"
    ],
    'ar': [
      "أسمعك، وأريد أن تعرف أن مشاعرك صحيحة تماماً. أحياناً مجرد التحدث عما يدور في أذهاننا يمكن أن يساعدنا على معالجة الأمور بشكل أفضل. هل يمكنك أن تخبرني أكثر عما كان يثقل عليك؟",
      "شكراً لك على مشاركة ذلك معي. يتطلب الأمر شجاعة للوصول للمساعدة، وأنا سعيد لأنك هنا. ما تمر به يبدو صعباً حقاً. منذ متى وأنت تشعر بهذا الشكل؟",
      "أستطيع أن أشعر أنك تمر بشيء صعب الآن. مشاعرك مهمة، وتستحق الدعم. هل سيساعد الحديث عن الجزء الأكثر إرهاقاً في يومك؟"
    ],
    'hi': [
      "मैं आपकी बात सुन रहा हूं, और मैं चाहता हूं कि आप जानें कि आपकी भावनाएं पूरी तरह से वैध हैं। कभी-कभी केवल हमारे मन में जो कुछ है उसके बारे में बात करना हमें चीजों को बेहतर तरीके से संसाधित करने में मदद कर सकता है। क्या आप मुझे इस बारे में और बता सकते हैं कि आपको क्या परेशान कर रहा है?",
      "इसे मेरे साथ साझा करने के लिए धन्यवाद। मदद मांगने में साहस लगता है, और मुझे खुशी है कि आप यहां हैं। आप जिससे गुजर रहे हैं वह वास्तव में चुनौतीपूर्ण लगता है। आप कितने समय से ऐसा महसूस कर रहे हैं?",
      "मैं महसूस कर सकता हूं कि आप अभी कुछ कठिन दौर से गुजर रहे हैं। आपकी भावनाएं मायने रखती हैं, और आप समर्थन के हकदार हैं। क्या आपके दिन के सबसे भारी हिस्से के बारे में बात करना मददगार होगा?"
    ],
    'kn': [
      "ನಾನು ನಿಮ್ಮ ಮಾತನ್ನು ಕೇಳುತ್ತಿದ್ದೇನೆ ಮತ್ತು ನಿಮ್ಮ ಭಾವನೆಗಳು ಸಂಪೂರ್ಣವಾಗಿ ಸಮರ್ಥನೀಯವೆಂದು ನೀವು ತಿಳಿದುಕೊಳ್ಳಬೇಕೆಂದು ನಾನು ಬಯಸುತ್ತೇನೆ. ಕೆಲವೊಮ್ಮೆ ನಮ್ಮ ಮನಸ್ಸಿನಲ್ಲಿರುವ ವಿಷಯಗಳ ಬಗ್ಗೆ ಮಾತನಾಡುವುದು ನಮಗೆ ವಿಷಯಗಳನ್ನು ಉತ್ತಮವಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ. ನಿಮ್ಮನ್ನು ತೊಂದರೆಗೊಳಿಸುತ್ತಿರುವ ವಿಷಯದ ಬಗ್ಗೆ ನೀವು ನನಗೆ ಹೆಚ್ಚು ಹೇಳಬಹುದೇ?",
      "ಇದನ್ನು ನನ್ನೊಂದಿಗೆ ಹಂಚಿಕೊಂಡಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು. ಸಹಾಯ ಕೇಳುವುದಕ್ಕೆ ಧೈರ್ಯ ಬೇಕು, ಮತ್ತು ನೀವು ಇಲ್ಲಿದ್ದೀರಿ ಎಂದು ನಾನು ಸಂತೋಷಪಡುತ್ತೇನೆ. ನೀವು ಅನುಭವಿಸುತ್ತಿರುವುದು ನಿಜವಾಗಿಯೂ ಸವಾಲಿನಂತೆ ತೋರುತ್ತದೆ. ನೀವು ಎಷ್ಟು ದಿನಗಳಿಂದ ಹೀಗೆ ಅನಿಸುತ್ತಿದೆ?",
      "ನೀವು ಈಗ ಏನಾದರೂ ಕಷ್ಟಕರ ಸಮಯ ಎದುರಿಸುತ್ತಿದ್ದೀರಿ ಎಂದು ನಾನು ಅನುಭವಿಸಬಲ್ಲೆ. ನಿಮ್ಮ ಭಾವನೆಗಳು ಮಹತ್ವವುಳ್ಳವು ಮತ್ತು ನೀವು ಬೆಂಬಲಕ್ಕೆ ಅರ್ಹರು. ನಿಮ್ಮ ದಿನದ ಅತ್ಯಂತ ಕಷ್ಟದ ಭಾಗದ ಬಗ್ಗೆ ಮಾತನಾಡುವುದು ಸಹಾಯಕಾರಿಯಾಗಬಹುದೇ?"
    ],
    'te': [
      "నేను మీ మాట వింటున్నాను, మరియు మీ భావనలు పూర్తిగా సమర్థనీయమని మీరు తెలుసుకోవాలని నేను కోరుకుంటున్నాను. కొన్నిసార్లు మన మనస్సులో ఉన్న విషయాల గురించి మాట్లాడటం మనకు విషయాలను మరింత మెరుగ్గా అర్థం చేసుకోవడంలో సహాయపడుతుంది. మిమ్మల్ని బాధపెడుతున్న విషయం గురించి మీరు నాకు మరింత చెప్పగలరా?",
      "దీన్ని నాతో పంచుకున్నందుకు ధన్యవాదాలు. సహాయం కోరడానికి ధైర్యం కావాలి, మరియు మీరు ఇక్కడ ఉన్నందుకు నేను సంతోషిస్తున్నాను. మీరు అనుభవిస్తున్నది నిజంగా సవాలుగా అనిపిస్తుంది. మీరు ఎంతకాలంగా ఇలా అనిపిస్తోంది?",
      "మీరు ఇప్పుడు ఏదో కష్టమైన సమయంలో ఉన్నారని నేను అనుభవించగలను. మీ భావనలు ముఖ్యమైనవి, మరియు మీరు మద్దతుకు అర్హులు. మీ రోజులో అత్యంత కష్టమైన భాగం గురించి మాట్లాడటం సహాయకరంగా ఉంటుందా?"
    ],
    'ta': [
      "நான் உங்கள் பேச்சைக் கேட்கிறேன், உங்கள் உணர்வுகள் முற்றிலும் சரியானவை என்பதை நீங்கள் அறிய வேண்டும் என்று நான் விரும்புகிறேன். சில நேரங்களில் நம் மனதில் உள்ளவற்றைப் பற்றி பேசுவது விஷயங்களை சிறப்பாக புரிந்துகொள்ள உதவும். உங்களைத் தொந்தரவு செய்யும் விஷயத்தைப் பற்றி மேலும் என்னிடம் சொல்ல முடியுமா?",
      "இதை என்னுடன் பகிர்ந்து கொண்டதற்கு நன்றி. உதவி கேட்க தைரியம் வேண்டும், நீங்கள் இங்கே இருப்பதில் நான் மகிழ்ச்சியடைகிறேன். நீங்கள் அனுபவிப்பது உண்மையில் சவாலானதாக தெரிகிறது. நீங்கள் எவ்வளவு காலமாக இப்படி உணர்கிறீர்கள்?",
      "நீங்கள் இப்போது ஏதோ கடினமான நேரத்தை கடந்து கொண்டிருக்கிறீர்கள் என்பதை நான் உணர முடிகிறது. உங்கள் உணர்வுகள் முக்கியமானவை, நீங்கள் ஆதரவுக்கு தகுதியானவர்கள். உங்கள் நாளின் மிகவும் சுமையான பகுதியைப் பற்றி பேசுவது உதவியாக இருக்குமா?"
    ],
    'ml': [
      "ഞാൻ നിങ്ങളുടെ വാക്കുകൾ കേൾക്കുന്നു, നിങ്ങളുടെ വികാരങ്ങൾ പൂർണ്ണമായും സാധുവാണെന്ന് നിങ്ങൾ അറിയണമെന്ന് ഞാൻ ആഗ്രഹിക്കുന്നു. ചിലപ്പോൾ നമ്മുടെ മനസ്സിലുള്ളതിനെക്കുറിച്ച് സംസാരിക്കുന്നത് കാര്യങ്ങൾ മികച്ച രീതിയിൽ മനസ്സിലാക്കാൻ സഹായിക്കും. നിങ്ങളെ വിഷമിപ്പിക്കുന്ന കാര്യത്തെക്കുറിച്ച് കൂടുതൽ എന്നോട് പറയാമോ?",
      "ഇത് എന്നോട് പങ്കിട്ടതിന് നന്ദി. സഹായം തേടുന്നതിന് ധൈര്യം വേണം, നിങ്ങൾ ഇവിടെ ഉണ്ടെന്നതിൽ ഞാൻ സന്തോഷിക്കുന്നു. നിങ്ങൾ അനുഭവിക്കുന്നത് ശരിക്കും വെല്ലുവിളി നിറഞ്ഞതായി തോന്നുന്നു. നിങ്ങൾക്ക് എത്ര കാലമായി ഇങ്ങനെ അനുഭവപ്പെടുന്നു?",
      "നിങ്ങൾ ഇപ്പോൾ എന്തോ പ്രയാസകരമായ സമയത്തിലൂടെ കടന്നുപോകുന്നുണ്ടെന്ന് എനിക്ക് അനുഭവപ്പെടുന്നു. നിങ്ങളുടെ വികാരങ്ങൾ പ്രധാനമാണ്, നിങ്ങൾ പിന്തുണയ്ക്ക് അർഹരാണ്. നിങ്ങളുടെ ദിവസത്തിലെ ഏറ്റവും ഭാരമേറിയ ഭാഗത്തെക്കുറിച്ച് സംസാരിക്കുന്നത് സഹായകരമാകുമോ?"
    ],
    'bn': [
      "আমি আপনার কথা শুনছি, এবং আমি চাই যে আপনি জানেন যে আপনার অনুভূতিগুলি সম্পূর্ণভাবে বৈধ। কখনও কখনও আমাদের মনে যা আছে সে সম্পর্কে কথা বলা আমাদের বিষয়গুলি আরও ভালভাবে বুঝতে সাহায্য করতে পারে। আপনাকে যা বিরক্ত করছে সে সম্পর্কে আপনি আমাকে আরও বলতে পারেন?",
      "এটি আমার সাথে শেয়ার করার জন্য ধন্যবাদ। সাহায্য চাওয়ার জন্য সাহস প্রয়োজন, এবং আপনি এখানে থাকায় আমি খুশি। আপনি যা অভিজ্ঞতা করছেন তা সত্যিই চ্যালেঞ্জিং মনে হচ্ছে। আপনি কতদিন ধরে এমন অনুভব করছেন?",
      "আমি অনুভব করতে পারি যে আপনি এখন কিছু কঠিন সময়ের মধ্য দিয়ে যাচ্ছেন। আপনার অনুভূতিগুলি গুরুত্বপূর্ণ, এবং আপনি সমর্থনের যোগ্য। আপনার দিনের সবচেয়ে কঠিন অংশ সম্পর্কে কথা বলা কি সহায়ক হবে?"
    ]
  };

  const responses = fallbackResponses[language] || fallbackResponses['en'];
  return responses[Math.floor(Math.random() * responses.length)];
}