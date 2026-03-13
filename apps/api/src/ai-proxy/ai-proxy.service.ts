import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SupportService } from '../support/support.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const FormData = require('form-data');

@Injectable()
export class AiProxyService {
  private readonly aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

  constructor(
    private readonly httpService: HttpService,
    @Inject(forwardRef(() => SupportService))
    private supportService: SupportService,
  ) { }

  async askQuestion(dto: any, userId: string): Promise<any> {
    const question = dto.question;

    try {
      // 1. Call the Python Deep RAG Service
      const response = await firstValueFrom(
        this.httpService.post(`${this.aiServiceUrl}/advisory/ask`, {
          question: dto.question,
          user_id: userId,
          crop: dto.crop,
          district: dto.district,
          language: dto.language || 'en'
        }, {
          headers: {
            'X-User-Id': userId,
            'X-Farm-Id': dto.farm_id || ''
          }
        })
      );

      const aiData = response.data;
      return {
        id: aiData.answer_id || Date.now().toString(),
        response: aiData.answer || aiData.response,
        createdAt: new Date().toISOString(),
        confidence: aiData.confidence > 0.8 ? 'High (Grounded)' : 'Moderate',
        sources: (aiData.sources || []).map((s: any) => ({
          id: s.source_id || s.id,
          title: s.title,
          url: s.url || '#'
        }))
      };

    } catch (error: any) {
      console.warn('AI Service unreachable, falling back to local grounded knowledge', error.message);
      
      // 2. Fallback to Local Grounded logic if Python service is down
      const relevantSources = await this.supportService.getKnowledge(question);

      return {
        id: Date.now().toString(),
        response: relevantSources.length > 0 
          ? `[LOCAL BACKUP] Based on ICAR/KVK protocols: ${relevantSources[0].content.substring(0, 500)}`
          : `I am currently in simplified mode. For "${question}", please consult your district KVK or the Kisan Call Centre at 1800-180-1551.`,
        createdAt: new Date().toISOString(),
        confidence: relevantSources.length > 0 ? 'High (Grounded)' : 'Moderate (General)',
        sources: relevantSources.map(s => ({ 
          id: s.id, 
          title: s.title,
          url: (s as any).sourceUrl || '#' 
        }))
      };
    }
  }
  
  async submitFeedback(logId: string, rating: string, userId: string): Promise<any> { 
    return { success: true }; 
  }
  
  async escalate(logId: string, userId: string): Promise<any> { 
    return { success: true }; 
  }
  
  async getHistory(userId: string): Promise<any[]> { 
    return []; // Return empty array to safely render 'Type your first question'
  }
  
  async getSource(sourceId: string): Promise<any> { 
    return { id: sourceId, title: 'Demo Document' }; 
  }

  async analyzeImage(file: any, userId: string): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });

      const response = await firstValueFrom(
        this.httpService.post(
          `${this.aiServiceUrl}/vision/analyze`,
          formData,
          {
            headers: {
              ...formData.getHeaders(),
              'X-User-Id': userId,
            },
            maxContentLength: 20 * 1024 * 1024,
            maxBodyLength: 20 * 1024 * 1024,
          }
        )
      );

      return response.data;
    } catch (error: any) {
      console.error('Vision analysis proxy error:', error.message);
      return {
        status: 'error',
        confidence: 0,
        message: 'Image analysis service is currently unavailable. Please try again later.',
        advisory: {
          situation: 'The analysis service could not process your image at this time.',
          recommendation: 'Please try again in a few minutes, or consult your local KVK.',
          action: 'If the condition appears urgent, contact the Kisan Call Centre at 1800-180-1551.',
          safety_note: 'Do not apply pesticides without confirmed diagnosis.',
        }
      };
    }
  }
}
