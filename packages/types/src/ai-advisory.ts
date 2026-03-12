// AI Advisory Service Shared Contracts

export type RiskLevel = "low" | "medium" | "high";

export interface SourceReference {
    source_id: string; // UUID
    title: string;
    source_type: string;
    url?: string | null;
    published_at?: string | null; // ISO Date string
    updated_date?: string | null; // Normalized string e.g., "Oct 24, 2023" for Trust UI
    relevance_score: number;
}

export interface ActionCard {
    type: string; // e.g., "call_help", "save_advice", "ask_followup", "escalate"
    label: string;
    payload?: Record<string, any> | null;
}

export interface AdvisoryRequest {
    question: string;
    // user_id is injected by NestJS proxy, not sent by frontend client
    farm_id?: string | null; // UUID
    language?: string; // defaults to "en"
    crop?: string | null;
    district?: string | null;
    session_id?: string | null; // UUID
}

export interface AdvisoryResponse {
    answer_id: string; // UUID
    answer: string;
    detailed_explanation?: string | null;
    confidence: number;
    risk_level: RiskLevel;
    sources: SourceReference[];
    action_cards: ActionCard[];
    abstained: boolean;
    abstained_reason?: string | null;
    language: string;
    warnings: string[];
    escalated: boolean;
    prompt_version: string;
    knowledge_version: string;
}

export interface FeedbackRequest {
    answer_id: string; // UUID
    // user_id is injected by NestJS proxy
    helpful: boolean;
    comment?: string | null;
}

export interface EscalationRequest {
    answer_id: string; // UUID
    // user_id is injected by NestJS proxy
    reason?: string | null;
}
