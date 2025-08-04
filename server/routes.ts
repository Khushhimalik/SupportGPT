import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { aiRequestSchema, messageSchema } from "@shared/schema";
import { randomUUID } from "crypto";
import { generateAIResponse } from "./aiService";

// Enhanced language detection using character patterns and common words
async function detectLanguage(text: string): Promise<string> {
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
    const text_lower = cleanText;
    
    // Assamese vs Bengali distinction
    if (/[\u0980-\u09ff]/.test(text) && /\b(মই|আমি|তুমি|আপুনি)\b/.test(text_lower)) return 'as';
    if (/[\u0980-\u09ff]/.test(text) && /\b(আমি|তুমি|তোমার|আমার)\b/.test(text_lower)) return 'bn';
    
    // Sanskrit vs Hindi distinction
    if (/[\u0900-\u097f]/.test(text) && /\b(अहम्|त्वम्|एतत्|तत्|किम्)\b/.test(text_lower)) return 'sa';
    
    // Marathi vs Hindi distinction
    if (/[\u0900-\u097f]/.test(text) && /\b(मी|तू|तुम्ही|आम्ही|माझा|तुझा)\b/.test(text_lower)) return 'mr';
    
    // Nepali vs Hindi distinction
    if (/[\u0900-\u097f]/.test(text) && /\b(म|तिमी|तपाईं|हामी|मेरो|तिम्रो)\b/.test(text_lower)) return 'ne';
    
    // Konkani (uses Devanagari)
    if (/[\u0900-\u097f]/.test(text) && /\b(हांव|तूं|आमी|तुमी)\b/.test(text_lower)) return 'kok';
    
    // Maithili (uses Devanagari)
    if (/[\u0900-\u097f]/.test(text) && /\b(हम|अहाँ|तोहर|हमर)\b/.test(text_lower)) return 'mai';
    
    // Urdu (uses Arabic script but may have some Devanagari)
    if (/[\u0600-\u06ff]/.test(text) && /\b(میں|تم|آپ|ہم)\b/.test(text_lower)) return 'ur';
    
    // Kashmiri (uses both Arabic and Devanagari)
    if (/[\u0600-\u06ff\u0900-\u097f]/.test(text) && /\b(بہ|تہ|یہ|اسہ)\b/.test(text_lower)) return 'ks';
    
    // Sindhi (uses both Arabic and Devanagari)
    if (/[\u0600-\u06ff\u0900-\u097f]/.test(text) && /\b(مان|توهان|هي|اهو)\b/.test(text_lower)) return 'sd';
    
    // Bodo (uses Devanagari)
    if (/[\u0900-\u097f]/.test(text) && /\b(आं|नों|बे|सिन)\b/.test(text_lower)) return 'brx';
    
    // Dogri (uses Devanagari)
    if (/[\u0900-\u097f]/.test(text) && /\b(मैं|तुसां|असां|तुंदा)\b/.test(text_lower)) return 'doi';
    
    // European language detection with more comprehensive patterns
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

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Create new chat session
  app.post("/api/chat/session", async (req, res) => {
    try {
      const session = await storage.createSession();
      res.json({ sessionId: session.id });
    } catch (error) {
      res.status(500).json({ error: "Failed to create chat session" });
    }
  });

  // Send message and get AI response
  app.post("/api/chat/message", async (req, res) => {
    try {
      const { message, sessionId, language } = aiRequestSchema.parse(req.body);
      
      const session = await storage.getSession(sessionId);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      // Detect language if not provided
      const detectedLanguage = language || await detectLanguage(message);
      
      // Add user message
      const userMessage = {
        id: randomUUID(),
        content: message,
        isUser: true,
        timestamp: new Date(),
        language: detectedLanguage
      };
      
      await storage.addMessage(sessionId, userMessage);
      await storage.updateSessionLanguage(sessionId, detectedLanguage);

      // Generate AI response
      const aiResponse = await generateAIResponse(message, detectedLanguage);
      
      // Add AI message
      const aiMessage = {
        id: randomUUID(),
        content: aiResponse,
        isUser: false,
        timestamp: new Date(),
        language: detectedLanguage
      };
      
      await storage.addMessage(sessionId, aiMessage);

      res.json({
        response: aiResponse,
        detectedLanguage,
        sessionId
      });

    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ error: "Failed to process message" });
    }
  });

  // Get chat history
  app.get("/api/chat/session/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const session = await storage.getSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve session" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
