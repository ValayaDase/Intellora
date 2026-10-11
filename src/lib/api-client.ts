import { AnswerResponse, SupportedLanguage } from '@/types/answer';
import { DocumentItem, DocumentLanguage } from '@/types/document';
import { KnowledgeGraphData } from '@/types/graph';
import { EvaluationReport } from '@/types/evaluation';

const FASTAPI_BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = FASTAPI_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  async checkHealth(): Promise<{ status: 'connected' | 'disconnected'; latencyMs?: number; message: string }> {
    const start = Date.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${this.baseUrl}/health`, {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        return {
          status: 'connected',
          latencyMs: Date.now() - start,
          message: 'FastAPI GraphRAG backend is online',
        };
      }
      return {
        status: 'disconnected',
        message: `Backend returned HTTP ${res.status}`,
      };
    } catch {
      return {
        status: 'disconnected',
        message: `No active backend service detected at ${this.baseUrl}. Check server status or update URL in Settings.`,
      };
    }
  }

  async askQuestion(query: string, language: SupportedLanguage = 'auto'): Promise<AnswerResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(`${this.baseUrl}/api/v1/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, language }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorText = await res.text().catch(() => '');
        throw new Error(`Query failed (HTTP ${res.status}): ${errorText || res.statusText}`);
      }

      return await res.json();
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof Error) {
        throw err;
      }
      throw new Error(`Unable to reach FastAPI backend at ${this.baseUrl}. Please ensure the service is running.`);
    }
  }

  async getDocuments(): Promise<DocumentItem[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(`${this.baseUrl}/api/v1/documents`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Backend not running; return empty list
    }
    return [];
  }

  async uploadDocument(file: File, language: DocumentLanguage): Promise<DocumentItem> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', language);

    const res = await fetch(`${this.baseUrl}/api/v1/documents`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Upload failed with HTTP ${res.status}`);
    }

    return await res.json();
  }

  async deleteDocument(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/api/v1/documents/${id}`, {
        method: 'DELETE',
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async getKnowledgeGraph(search?: string): Promise<KnowledgeGraphData> {
    try {
      const url = new URL(`${this.baseUrl}/api/v1/graph`);
      if (search) url.searchParams.set('q', search);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(url.toString(), { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Backend not running; return empty graph
    }
    return { entities: [], relationships: [] };
  }

  async getEvaluationMetrics(): Promise<EvaluationReport | null> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(`${this.baseUrl}/api/v1/evaluation`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Backend not running; return null
    }
    return null;
  }
}

export const apiClient = new ApiClient();
