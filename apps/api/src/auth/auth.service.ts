import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, IsNull } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { User } from '../database/entities/user.entity';
import { Session } from '../database/entities/session.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  // In-memory store for OTPs (for MVP, replacing with Redis later)
  private otps: Record<string, { otp: string; expiresAt: Date; attempts: number }> = {};

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    private readonly jwtService: JwtService,
  ) { }

  private normalizePhone(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) return `+91${digits}`;
    if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`;
    if (phone.startsWith('+') && digits.length === 12) return `+${digits}`;
    return phone;
  }

  async requestOtp(phoneInput: string, ip: string): Promise<void> {
    const phone = this.normalizePhone(phoneInput);
    const now = new Date();
    if (this.otps[phone] && this.otps[phone].attempts >= 5) {
      throw new BadRequestException('Too many failed attempts. Try again later.');
    }

    // Generate 6-digit OTP - allow '123456' for the canonical demo phone
    const isProduction = process.env.NODE_ENV === 'production';
    const isDemoAccount = phone === '+919999999999';
    const otp = (isDemoAccount || (!isProduction && process.env.NODE_ENV === 'test'))
      ? '123456'
      : Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date(now.getTime() + 5 * 60000);
    this.otps[phone] = { otp, expiresAt, attempts: 0 };

    this.logger.log(`Created OTP ${otp} for phone ${phone}`);
  }

  async verifyOtp(phoneInput: string, otp: string, ip: string, userAgent: string) {
    const phone = this.normalizePhone(phoneInput);
    const record = this.otps[phone];

    if (!record) {
      throw new UnauthorizedException('No OTP requested or OTP expired.');
    }

    if (record.expiresAt < new Date()) {
      delete this.otps[phone];
      throw new UnauthorizedException('OTP expired.');
    }

    if (record.otp !== otp) {
      record.attempts++;
      if (record.attempts >= 5) {
        delete this.otps[phone];
        throw new UnauthorizedException('Too many failed attempts. OTP invalidated.');
      }
      throw new UnauthorizedException('Invalid OTP.');
    }

    delete this.otps[phone];

    let user = await this.userRepository.findOne({ where: { phone } });
    if (!user) {
      user = this.userRepository.create({
        phone,
        role: 'farmer',
        updated_at: new Date(),
      });
      user = await this.userRepository.save(user);
    }

    return await this.generateTokens(user.id, ip, userAgent);
  }

  async refreshToken(refreshToken: string, ip: string, userAgent: string) {
    if (!refreshToken) throw new UnauthorizedException('No refresh token provided.');

    const sessions = await this.sessionRepository.find({
      where: {
        expires_at: MoreThan(new Date()),
        revoked_at: IsNull()
      },
    });

    let foundSession = null;
    let userId = null;

    for (const s of sessions) {
      const isMatch = await bcrypt.compare(refreshToken, s.refresh_token_hash);
      if (isMatch) {
        foundSession = s;
        userId = s.user_id;
        break;
      }
    }

    if (!foundSession || !userId) {
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }

    foundSession.revoked_at = new Date();
    await this.sessionRepository.save(foundSession);

    return await this.generateTokens(userId, ip, userAgent);
  }

  async logout(userId: string) {
    const activeSessions = await this.sessionRepository.find({
      where: { user_id: userId, revoked_at: IsNull() }
    });

    for (const session of activeSessions) {
      session.revoked_at = new Date();
    }
    await this.sessionRepository.save(activeSessions);
  }

  async getSessions(userId: string) {
    const sessions = await this.sessionRepository.find({
      where: { user_id: userId, revoked_at: IsNull() }
    });
    return sessions.map(s => ({
      id: s.id,
      deviceLabel: s.device_label,
      ipAddress: s.ip_address,
      createdAt: s.created_at,
      expiresAt: s.expires_at,
    }));
  }

  private async generateTokens(userId: string, ipAddress: string, userAgent: string) {
    const accessToken = this.jwtService.sign({ sub: userId, id: userId, role: 'farmer' });

    const plainRefreshToken = crypto.randomBytes(40).toString('hex');
    const salt = await bcrypt.genSalt(10);
    const hashedRefreshToken = await bcrypt.hash(plainRefreshToken, salt);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const newSession = this.sessionRepository.create({
      user_id: userId,
      refresh_token_hash: hashedRefreshToken,
      ip_address: ipAddress || 'Unknown',
      user_agent: userAgent || 'Unknown',
      expires_at: expiresAt,
    });

    await this.sessionRepository.save(newSession);

    return {
      access_token: accessToken,
      refresh_token: plainRefreshToken,
    };
  }
}
