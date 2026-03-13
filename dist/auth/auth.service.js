"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const crypto = require("crypto");
const user_schema_1 = require("../users/schemas/user.schema");
const activity_log_service_1 = require("../users/activity-log.service");
const common_2 = require("@nestjs/common");
let AuthService = class AuthService {
    constructor(userModel, jwtService, configService, activityLogService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
        this.configService = configService;
        this.activityLogService = activityLogService;
    }
    async register(registerDto, request) {
        const existingUser = await this.userModel.findOne({
            email: registerDto.email,
        });
        if (existingUser) {
            throw new common_2.ConflictException('User with this email already exists');
        }
        const user = new this.userModel({
            ...registerDto,
        });
        const savedUser = await user.save();
        await this.activityLogService.logActivity(savedUser._id.toString(), 'profile_update', `New user registered: ${registerDto.email}`, { email: registerDto.email }, request);
        const tokens = await this.generateTokens(savedUser);
        savedUser.refreshToken = tokens.refreshToken;
        await savedUser.save();
        return {
            user: this.sanitizeUser(savedUser),
            ...tokens,
        };
    }
    async login(loginDto, request) {
        const user = await this.userModel.findOne({ email: loginDto.email });
        if (!user) {
            await this.activityLogService.logActivity('anonymous', 'login', `Failed login attempt for email: ${loginDto.email}`, { email: loginDto.email, reason: 'User not found' }, request);
            throw new common_2.UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive) {
            await this.activityLogService.logActivity(user._id.toString(), 'login', `Failed login attempt: Account deactivated for ${loginDto.email}`, { email: loginDto.email, reason: 'Account deactivated' }, request);
            throw new common_2.UnauthorizedException('Account is deactivated');
        }
        const isPasswordValid = await user.comparePassword(loginDto.password);
        if (!isPasswordValid) {
            await this.activityLogService.logActivity(user._id.toString(), 'login', `Failed login attempt: Invalid password for ${loginDto.email}`, { email: loginDto.email, reason: 'Invalid password' }, request);
            throw new common_2.UnauthorizedException('Invalid credentials');
        }
        const tokens = await this.generateTokens(user);
        user.refreshToken = tokens.refreshToken;
        user.lastLoginAt = new Date();
        await user.save();
        await this.activityLogService.logActivity(user._id.toString(), 'login', `Successful login for ${loginDto.email}`, { email: loginDto.email }, request);
        return {
            user: this.sanitizeUser(user),
            ...tokens,
        };
    }
    async refreshToken(userId, refreshToken) {
        const user = await this.userModel.findById(userId);
        if (!user || !user.refreshToken) {
            throw new common_2.UnauthorizedException('Invalid refresh token');
        }
        const isTokenValid = user.refreshToken === refreshToken;
        if (!isTokenValid) {
            throw new common_2.UnauthorizedException('Invalid refresh token');
        }
        const tokens = await this.generateTokens(user);
        user.refreshToken = tokens.refreshToken;
        await user.save();
        return tokens;
    }
    async logout(userId) {
        await this.userModel.findByIdAndUpdate(userId, {
            refreshToken: null,
        });
        return { message: 'Logged out successfully' };
    }
    async getProfile(userId) {
        const user = await this.userModel
            .findById(userId)
            .select('-password -refreshToken')
            .exec();
        if (!user) {
            throw new common_2.NotFoundException('User not found');
        }
        return this.sanitizeUser(user);
    }
    async updateProfile(userId, updateData) {
        delete updateData.password;
        delete updateData.refreshToken;
        const user = await this.userModel
            .findByIdAndUpdate(userId, updateData, { new: true })
            .select('-password -refreshToken')
            .exec();
        if (!user) {
            throw new common_2.NotFoundException('User not found');
        }
        return this.sanitizeUser(user);
    }
    async changePassword(userId, changePasswordDto) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_2.NotFoundException('User not found');
        }
        const isPasswordValid = await user.comparePassword(changePasswordDto.currentPassword);
        if (!isPasswordValid) {
            throw new common_2.BadRequestException('Current password is incorrect');
        }
        user.password = changePasswordDto.newPassword;
        await user.save();
        return { message: 'Password changed successfully' };
    }
    async forgotPassword(email) {
        const user = await this.userModel.findOne({ email });
        if (!user) {
            return { message: 'If email exists, reset link will be sent' };
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        user.passwordResetToken = hashedToken;
        user.passwordResetExpires = new Date(Date.now() + 3600000);
        await user.save();
        return {
            message: 'Password reset link sent to email',
            resetToken,
        };
    }
    async resetPassword(token, newPassword) {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await this.userModel.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        });
        if (!user) {
            throw new common_2.BadRequestException('Invalid or expired reset token');
        }
        user.password = newPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        return { message: 'Password reset successfully' };
    }
    async generateTokens(user) {
        const payload = {
            sub: user._id.toString(),
            email: user.email,
            role: user.role,
        };
        const jwtSecret = this.configService.get('JWT_SECRET');
        const refreshSecret = this.configService.get('JWT_REFRESH_SECRET');
        const accessToken = this.jwtService.sign(payload, {
            secret: jwtSecret,
            expiresIn: '15m',
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: refreshSecret,
            expiresIn: '7d',
        });
        return {
            accessToken,
            refreshToken,
        };
    }
    sanitizeUser(user) {
        const userObj = user.toObject();
        delete userObj.password;
        delete userObj.refreshToken;
        delete userObj.passwordResetToken;
        delete userObj.passwordResetExpires;
        return userObj;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService,
        config_1.ConfigService,
        activity_log_service_1.ActivityLogService])
], AuthService);
//# sourceMappingURL=auth.service.js.map