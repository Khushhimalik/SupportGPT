// Simple client-side language detection utilities
export function detectBrowserLanguage(): string {
  const lang = navigator.language || navigator.languages?.[0] || 'en';
  return lang.split('-')[0]; // Get just the language code
}

export function getLanguageDisplayName(code: string): string {
  const languages: Record<string, string> = {
    // International languages
    'en': 'English',
    'es': 'Español',
    'fr': 'Français',
    'de': 'Deutsch',
    'it': 'Italiano',
    'pt': 'Português',
    'ru': 'Русский',
    'ja': '日本語',
    'ko': '한국어',
    'zh': '中文',
    'ar': 'العربية',
    
    // 22 Official Indian Languages
    'hi': 'हिन्दी', // Hindi
    'bn': 'বাংলা', // Bengali
    'te': 'తెలుగు', // Telugu
    'mr': 'मराठी', // Marathi
    'ta': 'தமிழ்', // Tamil
    'ur': 'اردو', // Urdu
    'gu': 'ગુજરાતી', // Gujarati
    'kn': 'ಕನ್ನಡ', // Kannada
    'ml': 'മലയാളം', // Malayalam
    'or': 'ଓଡ଼ିଆ', // Odia
    'pa': 'ਪੰਜਾਬੀ', // Punjabi
    'as': 'অসমীয়া', // Assamese
    'mai': 'मैथिली', // Maithili
    'sa': 'संस्कृतम्', // Sanskrit
    'ne': 'नेपाली', // Nepali
    'ks': 'कॉशुर / کٲشُر', // Kashmiri
    'kok': 'कोंकणी', // Konkani
    'sd': 'سنڌي / सिन्धी', // Sindhi
    'mni': 'ꯃꯤꯇꯩ ꯂꯣꯟ', // Meitei (Manipuri)
    'brx': 'बड़ो', // Bodo
    'sat': 'ᱥᱟᱱᱛᱟᱲᱤ', // Santali
    'doi': 'डोगरी' // Dogri
  };
  
  return languages[code] || 'Unknown Language';
}

export function detectTextLanguage(text: string): string {
  try {
    const cleanText = text.toLowerCase().trim();
    
    // Character-based detection for non-Latin scripts
    if (/[\u4e00-\u9fff]/.test(text)) return 'zh';
    if (/[\u0600-\u06ff]/.test(text)) return 'ar';
    if (/[\u0400-\u04ff]/.test(text)) return 'ru';
    if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) return 'ja';
    if (/[\uac00-\ud7af]/.test(text)) return 'ko';
    if (/[\u0e00-\u0e7f]/.test(text)) return 'th';
    
    // Indian languages detection (22 official languages)
    if (/[\u0900-\u097f]/.test(text)) return 'hi'; // Devanagari (Hindi, Sanskrit, Marathi, Nepali)
    if (/[\u0980-\u09ff]/.test(text)) return 'bn'; // Bengali (also Assamese)
    if (/[\u0a00-\u0a7f]/.test(text)) return 'pa'; // Punjabi
    if (/[\u0a80-\u0aff]/.test(text)) return 'gu'; // Gujarati
    if (/[\u0b00-\u0b7f]/.test(text)) return 'or'; // Odia
    if (/[\u0b80-\u0bff]/.test(text)) return 'ta'; // Tamil
    if (/[\u0c00-\u0c7f]/.test(text)) return 'te'; // Telugu
    if (/[\u0c80-\u0cff]/.test(text)) return 'kn'; // Kannada
    if (/[\u0d00-\u0d7f]/.test(text)) return 'ml'; // Malayalam
    if (/[\u1c50-\u1c7f]/.test(text)) return 'sat'; // Santali
    if (/[\uabc0-\uabff]/.test(text)) return 'mni'; // Meitei (Manipuri)
    
    // Check for common words to differentiate similar scripts
    
    // Assamese vs Bengali distinction
    if (/[\u0980-\u09ff]/.test(text) && /\b(মই|আমি|তুমি|আপুনি)\b/.test(cleanText)) return 'as';
    if (/[\u0980-\u09ff]/.test(text) && /\b(আমি|তুমি|তোমার|আমার)\b/.test(cleanText)) return 'bn';
    
    // Sanskrit vs Hindi distinction
    if (/[\u0900-\u097f]/.test(text) && /\b(अहम्|त्वम्|एतत्|तत्|किम्)\b/.test(cleanText)) return 'sa';
    
    // Marathi vs Hindi distinction
    if (/[\u0900-\u097f]/.test(text) && /\b(मी|तू|तुम्ही|आम्ही|माझा|तुझा)\b/.test(cleanText)) return 'mr';
    
    // Nepali vs Hindi distinction
    if (/[\u0900-\u097f]/.test(text) && /\b(म|तिमी|तपाईं|हामी|मेरो|तिम्रो)\b/.test(cleanText)) return 'ne';
    
    // Konkani (uses Devanagari)
    if (/[\u0900-\u097f]/.test(text) && /\b(हांव|तूं|आमी|तुमी)\b/.test(cleanText)) return 'kok';
    
    // Maithili (uses Devanagari)
    if (/[\u0900-\u097f]/.test(text) && /\b(हम|अहाँ|तोहर|हमर)\b/.test(cleanText)) return 'mai';
    
    // Urdu (uses Arabic script)
    if (/[\u0600-\u06ff]/.test(text) && /\b(میں|تم|آپ|ہم)\b/.test(cleanText)) return 'ur';
    
    // Kashmiri (uses both Arabic and Devanagari)
    if (/[\u0600-\u06ff\u0900-\u097f]/.test(text) && /\b(بہ|تہ|یہ|اسہ)\b/.test(cleanText)) return 'ks';
    
    // Sindhi (uses both Arabic and Devanagari)
    if (/[\u0600-\u06ff\u0900-\u097f]/.test(text) && /\b(مان|توهان|هي|اهو)\b/.test(cleanText)) return 'sd';
    
    // Bodo (uses Devanagari)
    if (/[\u0900-\u097f]/.test(text) && /\b(आं|नों|बे|सिन)\b/.test(cleanText)) return 'brx';
    
    // Dogri (uses Devanagari)
    if (/[\u0900-\u097f]/.test(text) && /\b(मैं|तुसां|असां|तुंदा)\b/.test(cleanText)) return 'doi';
    
    // European language detection with comprehensive patterns
    // Spanish
    if (/\b(soy|estoy|tengo|quiero|necesito|me|mi|tu|su|el|la|los|las|de|que|en|es|y|a|por|para|con|se|del|al|muy|más|pero|como|cuando|donde|hola|adiós|gracias|por favor)\b/.test(cleanText)) return 'es';
    
    // French  
    if (/\b(je|tu|il|elle|nous|vous|ils|elles|suis|es|est|sommes|êtes|sont|ai|as|a|avons|avez|ont|le|la|les|de|du|des|et|en|pour|avec|ce|cette|ces|bonjour|merci|s'il vous plaît)\b/.test(cleanText)) return 'fr';
    
    // German
    if (/\b(ich|du|er|sie|es|wir|ihr|bin|bist|ist|sind|seid|haben|habe|hast|hat|habt|der|die|das|und|in|zu|mit|auf|für|von|dem|den|aber|wenn|wie|wo|hallo|danke|bitte)\b/.test(cleanText)) return 'de';
    
    // Italian
    if (/\b(io|tu|lui|lei|noi|voi|loro|sono|sei|è|siamo|siete|ho|hai|ha|abbiamo|avete|hanno|il|la|lo|gli|le|di|che|e|in|per|con|del|della|ma|se|come|dove|ciao|grazie|prego)\b/.test(cleanText)) return 'it';
    
    // Portuguese
    if (/\b(eu|tu|você|ele|ela|nós|vocês|eles|elas|sou|és|é|somos|são|tenho|tens|tem|temos|têm|o|a|os|as|de|que|e|em|para|com|do|da|dos|das|mas|se|como|onde|olá|obrigado|por favor)\b/.test(cleanText)) return 'pt';
    
    // Dutch
    if (/\b(ik|jij|hij|zij|wij|jullie|ben|bent|is|zijn|heb|hebt|heeft|hebben|de|het|een|en|in|op|van|voor|met|maar|als|wat|waar|hallo|dank|alsjeblieft)\b/.test(cleanText)) return 'nl';
    
    // Default to English
    return 'en';
  } catch (error) {
    return 'en';
  }
}
