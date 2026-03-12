import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { AdvisoryRequest, FeedbackRequest, EscalationRequest } from '@farmer-platform/types';

/**
 * Validates the incoming chat request from the React Native/Web client.
 * Note: user_id is stripped here because it must come from the JWT, not the payload.
 */
export class ChatRequestDto implements Omit<AdvisoryRequest, 'user_id' | 'farm_id'> {
    @IsString()
    question: string;

    @IsOptional()
    @IsString()
    language?: string;

    @IsOptional()
    @IsString()
    crop?: string;

    @IsOptional()
    @IsString()
    district?: string;

    @IsOptional()
    @IsString()
    session_id?: string;

    // Optional farm context from client dropdown
    @IsOptional()
    @IsString()
    farm_id?: string;
}

export class SubmitFeedbackDto implements Omit<FeedbackRequest, 'user_id'> {
    @IsString()
    answer_id: string;

    @IsBoolean()
    helpful: boolean;

    @IsOptional()
    @IsString()
    comment?: string;
}

export class EscalateDto implements Omit<EscalationRequest, 'user_id'> {
    @IsString()
    answer_id: string;

    @IsOptional()
    @IsString()
    reason?: string;
}
