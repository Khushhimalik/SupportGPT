import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { aiService } from '@/lib/aiService';
import { detectTextLanguage, detectBrowserLanguage } from '@/lib/languageDetection';
import type { Message } from '@shared/schema';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState<string>(detectBrowserLanguage());
  const [sessionInitialized, setSessionInitialized] = useState(false);

  // Initialize session
  useEffect(() => {
    const initSession = async () => {
      try {
        await aiService.createSession();
        setSessionInitialized(true);
        
        // Add welcome message
        const welcomeMessage: Message = {
          id: 'welcome',
          content: "Hi there! 👋 I'm SupportGPT, and I'm here to listen and support you 24/7. I'll automatically detect your language and respond in the same language. You're completely anonymous here - no registration needed. How are you feeling today?",
          isUser: false,
          timestamp: new Date(),
          language: 'en'
        };
        setMessages([welcomeMessage]);
      } catch (error) {
        console.error('Failed to initialize chat session:', error);
      }
    };

    initSession();
  }, []);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      const userLanguage = detectTextLanguage(messageText);
      setDetectedLanguage(userLanguage);
      
      const userMessage: Message = {
        id: Date.now().toString(),
        content: messageText,
        isUser: true,
        timestamp: new Date(),
        language: userLanguage
      };

      setMessages(prev => [...prev, userMessage]);
      setIsTyping(true);

      const response = await aiService.sendMessage(messageText, userLanguage);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.response,
        isUser: false,
        timestamp: new Date(),
        language: response.detectedLanguage || userLanguage
      };

      return aiMessage;
    },
    onSuccess: (aiMessage) => {
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    },
    onError: (error) => {
      console.error('Failed to send message:', error);
      setIsTyping(false);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment. If you're in crisis, please reach out to a crisis helpline immediately.",
        isUser: false,
        timestamp: new Date(),
        language: detectedLanguage
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  });

  const sendMessage = useCallback((messageText: string) => {
    if (messageText.trim() && sessionInitialized) {
      sendMessageMutation.mutate(messageText.trim());
    }
  }, [sendMessageMutation, sessionInitialized]);

  return {
    messages,
    sendMessage,
    isTyping,
    detectedLanguage,
    isLoading: sendMessageMutation.isPending,
    sessionInitialized
  };
}
