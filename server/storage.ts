import { type ChatSession, type Message } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createSession(): Promise<ChatSession>;
  getSession(id: string): Promise<ChatSession | undefined>;
  addMessage(sessionId: string, message: Message): Promise<void>;
  updateSessionLanguage(sessionId: string, language: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private sessions: Map<string, ChatSession>;

  constructor() {
    this.sessions = new Map();
    
    // Clean up old sessions every hour (to prevent memory leaks)
    setInterval(() => {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      Array.from(this.sessions.entries()).forEach(([id, session]) => {
        if (session.createdAt < oneHourAgo) {
          this.sessions.delete(id);
        }
      });
    }, 60 * 60 * 1000);
  }

  async createSession(): Promise<ChatSession> {
    const id = randomUUID();
    const session: ChatSession = {
      id,
      messages: [],
      createdAt: new Date(),
    };
    this.sessions.set(id, session);
    return session;
  }

  async getSession(id: string): Promise<ChatSession | undefined> {
    return this.sessions.get(id);
  }

  async addMessage(sessionId: string, message: Message): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.messages.push(message);
    }
  }

  async updateSessionLanguage(sessionId: string, language: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.detectedLanguage = language;
    }
  }
}

export const storage = new MemStorage();
