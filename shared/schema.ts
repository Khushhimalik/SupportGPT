import { z } from "zod";

export const messageSchema = z.object({
  id: z.string(),
  content: z.string(),
  isUser: z.boolean(),
  timestamp: z.date(),
  language: z.string().optional(),
});

export const chatSessionSchema = z.object({
  id: z.string(),
  messages: z.array(messageSchema),
  detectedLanguage: z.string().optional(),
  createdAt: z.date(),
});

export const aiRequestSchema = z.object({
  message: z.string(),
  language: z.string().optional(),
  sessionId: z.string(),
});

export const aiResponseSchema = z.object({
  response: z.string(),
  detectedLanguage: z.string().optional(),
  sessionId: z.string(),
});

export type Message = z.infer<typeof messageSchema>;
export type ChatSession = z.infer<typeof chatSessionSchema>;
export type AiRequest = z.infer<typeof aiRequestSchema>;
export type AiResponse = z.infer<typeof aiResponseSchema>;
