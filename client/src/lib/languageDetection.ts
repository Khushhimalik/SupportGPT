// Simple client-side language detection utilities
export function detectBrowserLanguage(): string {
  const lang = navigator.language || navigator.languages?.[0] || 'en';
  return lang.split('-')[0]; // Get just the language code
}

export function getLanguageDisplayName(code: string): string {
  const languages: Record<string, string> = {
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
    'hi': 'हिन्दी'
  };
  
  return languages[code] || 'Unknown Language';
}

export function detectTextLanguage(text: string): string {
  // Basic language detection based on character patterns
  if (/[\u4e00-\u9fff]/.test(text)) return 'zh';
  if (/[\u0600-\u06ff]/.test(text)) return 'ar';
  if (/[\u0400-\u04ff]/.test(text)) return 'ru';
  if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) return 'ja';
  if (/[\uac00-\ud7af]/.test(text)) return 'ko';
  if (/[\u0900-\u097f]/.test(text)) return 'hi';
  
  // European language detection (basic)
  const text_lower = text.toLowerCase();
  if (/\b(el|la|los|las|de|que|en|es|y|a|por|para|con|se|del|al)\b/.test(text_lower)) return 'es';
  if (/\b(le|la|les|de|que|et|en|est|pour|avec|ce|du|au|des)\b/.test(text_lower)) return 'fr';
  if (/\b(der|die|das|und|in|zu|mit|ist|auf|für|von|dem|den)\b/.test(text_lower)) return 'de';
  if (/\b(il|la|di|che|e|in|è|per|con|del|della|dal)\b/.test(text_lower)) return 'it';
  if (/\b(o|a|de|que|e|em|é|para|com|do|da|dos)\b/.test(text_lower)) return 'pt';
  
  // Default to English
  return 'en';
}
