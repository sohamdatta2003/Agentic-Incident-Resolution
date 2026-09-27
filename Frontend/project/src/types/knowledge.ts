/** Runbook / knowledge base entry. */
export interface Runbook {
  id: string;
  filename: string;
  category: string;
  title: string;
  description: string;
  source: string;
  content?: string;
  lastUpdated?: string;
  similarity?: number;
}
