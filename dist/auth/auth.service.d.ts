import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from '../users/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ActivityLogService } from '../users/activity-log.service';
import { Request } from 'express';
export declare class AuthService {
    private userModel;
    private jwtService;
    private configService;
    private activityLogService;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService, configService: ConfigService, activityLogService: ActivityLogService);
    register(registerDto: RegisterDto, request?: Request & {
        ip?: string;
        get: (header: string) => string | undefined;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
        user: any;
    }>;
    login(loginDto: LoginDto, request?: Request & {
        ip?: string;
        get: (header: string) => string | undefined;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
        user: any;
    }>;
    refreshToken(userId: string, refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    getProfile(userId: string): Promise<any>;
    updateProfile(userId: string, updateData: Partial<User>): Promise<any>;
    changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
        resetToken?: undefined;
    } | {
        message: string;
        resetToken: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
    private generateTokens;
    private sanitizeUser;
}
