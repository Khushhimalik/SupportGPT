import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { aiRequestSchema, messageSchema } from "@shared/schema";
import { randomUUID } from "crypto";
import { generateAIResponse } from "./aiService";

// Language detection using character patterns
async function detectLanguage(text: string): Promise<string> {
  try {
    // Simple language detection based on character patterns
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
