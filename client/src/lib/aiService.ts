import { apiRequest } from './queryClient';
import type { AiRequest, AiResponse } from '@shared/schema';

export class AIService {
  private sessionId: string | null = null;

  async createSession(): Promise<string> {
    const response = await apiRequest('POST', '/api/chat/session');
    const data = await response.json();
    this.sessionId = data.sessionId;
    return this.sessionId!;
  }

  async sendMessage(message: string, language?: string): Promise<AiResponse> {
    if (!this.sessionId) {
      await this.createSession();
    }

    const request: AiRequest = {
      message,
      language,
      sessionId: this.sessionId!
    };

    const response = await apiRequest('POST', '/api/chat/message', request);
    return await response.json();
  }

  async getSession(): Promise<any> {
    if (!this.sessionId) return null;
    
    const response = await apiRequest('GET', `/api/chat/session/${this.sessionId}`);
    return await response.json();
  }

  getSessionId(): string | null {
    return this.sessionId;
  }
}

export const aiService = new AIService();
