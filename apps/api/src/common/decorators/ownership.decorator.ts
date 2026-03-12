import { SetMetadata } from '@nestjs/common';

export const OWNERSHIP_KEY = 'ownership';

export interface OwnershipMetadata {
    param: string; // The route param to check, e.g., 'farmId'
    relation: string; // The relationship required, e.g., 'farm_owner', 'job_owner', 'farmer_member'
}

export const CheckOwnership = (param: string, relation: string) =>
    SetMetadata(OWNERSHIP_KEY, { param, relation });
