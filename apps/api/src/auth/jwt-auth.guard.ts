import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('No token found');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET || 'fallback_secret',
            });
            request['user'] = payload;
        } catch (err) {
            throw new UnauthorizedException('Invalid token');
        }

        return true;
    }

    private extractTokenFromHeader(request: any): string | undefined {
        // First check cookies since we migrated to HTTP-Only
        if (request.cookies && request.cookies['krishi_auth_token']) {
            return request.cookies['krishi_auth_token'];
        }
        
        // Fallback for native mobile app compatibility
        const authHeader = request.headers.authorization;
        if (!authHeader) return undefined;
        const [type, token] = authHeader.split(' ');
        return type === 'Bearer' ? token : undefined;
    }
}
