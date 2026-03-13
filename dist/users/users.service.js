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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./schemas/user.schema");
const shop_settings_schema_1 = require("./schemas/shop-settings.schema");
const activity_log_schema_1 = require("./schemas/activity-log.schema");
let UsersService = class UsersService {
    constructor(userModel, settingsModel, activityLogModel) {
        this.userModel = userModel;
        this.settingsModel = settingsModel;
        this.activityLogModel = activityLogModel;
    }
    async getProfile(userId) {
        const user = await this.userModel
            .findById(userId)
            .select('-password -refreshToken')
            .exec();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async updateProfile(userId, updateDto) {
        if (updateDto['email']) {
            const existingUser = await this.userModel.findOne({
                email: updateDto['email'],
                _id: { $ne: userId },
            });
            if (existingUser) {
                throw new common_1.ConflictException('Email already in use');
            }
        }
        const user = await this.userModel
            .findByIdAndUpdate(userId, updateDto, { new: true })
            .select('-password -refreshToken')
            .exec();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        await this.logActivity(userId, 'profile_update', 'Profile updated', updateDto);
        return user;
    }
    async uploadProfileImage(userId, imageBuffer) {
        const imageUrl = `https://example.com/profiles/${userId}.jpg`;
        await this.userModel.findByIdAndUpdate(userId, {
            profileImage: imageUrl,
        });
        return imageUrl;
    }
    async deleteAccount(userId, password) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new common_1.BadRequestException('Invalid password');
        }
        user.isActive = false;
        await user.save();
        await this.logActivity(userId, 'account_delete', 'Account deleted');
    }
    async getShopSettings(userId) {
        let settings = await this.settingsModel.findOne({ user: userId }).exec();
        if (!settings) {
            settings = new this.settingsModel({ user: userId });
            await settings.save();
        }
        return settings;
    }
    async updateShopSettings(userId, updateDto) {
        let settings = await this.settingsModel.findOne({ user: userId });
        if (!settings) {
            settings = new this.settingsModel({
                user: userId,
                ...updateDto,
            });
        }
        else {
            Object.assign(settings, updateDto);
        }
        await settings.save();
        await this.logActivity(userId, 'settings_update', 'Shop settings updated', updateDto);
        return settings;
    }
    async resetShopSettings(userId) {
        await this.settingsModel.findOneAndDelete({ user: userId });
        const newSettings = new this.settingsModel({ user: userId });
        await newSettings.save();
        return newSettings;
    }
    async logActivity(userId, action, description, metadata, ipAddress, userAgent) {
        const log = new this.activityLogModel({
            user: userId,
            action,
            description,
            metadata,
            ipAddress,
            userAgent,
        });
        await log.save();
    }
    async getActivityLogs(userId, page = 1, limit = 50) {
        const safePage = page || 1;
        const safeLimit = limit || 50;
        const skip = Math.max(0, (safePage - 1) * safeLimit);
        const [logs, total] = await Promise.all([
            this.activityLogModel
                .find({ user: userId })
                .sort({ timestamp: -1 })
                .skip(skip)
                .limit(safeLimit)
                .exec(),
            this.activityLogModel.countDocuments({ user: userId }),
        ]);
        return {
            data: logs,
            pagination: {
                page: safePage,
                limit: safeLimit,
                total,
                totalPages: Math.ceil(total / safeLimit),
            },
        };
    }
    async getActivityLogsByAction(userId, action, page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const [logs, total] = await Promise.all([
            this.activityLogModel
                .find({ user: userId, action })
                .sort({ timestamp: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.activityLogModel.countDocuments({ user: userId, action }),
        ]);
        return {
            data: logs,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async clearActivityLogs(userId, daysToKeep = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
        await this.activityLogModel.deleteMany({
            user: userId,
            timestamp: { $lt: cutoffDate },
        });
    }
    async getUserStatistics(userId) {
        const [accountAge, totalSales, totalRevenue, inventoryValue, totalMedicines, activityCount,] = await Promise.all([
            this.userModel.findById(userId).select('createdAt').exec(),
            this.calculateTotalSales(userId),
            this.calculateTotalRevenue(userId),
            this.calculateInventoryValue(userId),
            this.countTotalMedicines(userId),
            this.activityLogModel.countDocuments({ user: userId }),
        ]);
        const now = new Date();
        const created = new Date(accountAge?.createdAt);
        const daysSinceCreation = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
        return {
            accountAge: {
                days: daysSinceCreation,
                createdAt: created,
            },
            business: {
                totalSales,
                totalRevenue,
                inventoryValue,
                totalMedicines,
            },
            activity: {
                totalActions: activityCount,
                recentLogins: await this.getRecentLogins(userId),
            },
        };
    }
    async calculateTotalSales(userId) {
        return 0;
    }
    async calculateTotalRevenue(userId) {
        return 0;
    }
    async calculateInventoryValue(userId) {
        return 0;
    }
    async countTotalMedicines(userId) {
        return 0;
    }
    async getRecentLogins(userId) {
        const logs = await this.activityLogModel
            .find({ user: userId, action: 'login' })
            .sort({ timestamp: -1 })
            .limit(5)
            .select('timestamp')
            .exec();
        return logs.map(log => log.timestamp);
    }
    async getSubscriptionInfo(userId) {
        const user = await this.userModel.findById(userId).select('subscriptionPlan subscriptionExpiresAt').exec();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const now = new Date();
        const isExpired = user.subscriptionExpiresAt
            ? user.subscriptionExpiresAt < now
            : false;
        const daysRemaining = user.subscriptionExpiresAt
            ? Math.ceil((user.subscriptionExpiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
            : null;
        return {
            plan: user.subscriptionPlan,
            expiresAt: user.subscriptionExpiresAt,
            isExpired,
            daysRemaining,
            features: this.getSubscriptionFeatures(user.subscriptionPlan),
        };
    }
    getSubscriptionFeatures(plan) {
        const features = {
            free: {
                maxSalesPerMonth: 100,
                maxInventoryItems: 500,
                maxUsers: 1,
                enableReports: false,
                enableOCR: false,
                enableBackup: false,
                support: 'email',
            },
            basic: {
                maxSalesPerMonth: 1000,
                maxInventoryItems: 5000,
                maxUsers: 3,
                enableReports: true,
                enableOCR: true,
                enableBackup: true,
                support: 'priority_email',
            },
            premium: {
                maxSalesPerMonth: -1,
                maxInventoryItems: -1,
                maxUsers: 10,
                enableReports: true,
                enableOCR: true,
                enableBackup: true,
                support: 'phone_24x7',
            },
        };
        return features[plan] || features.free;
    }
    async upgradeSubscription(userId, plan, durationDays = 365) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + durationDays);
        const user = await this.userModel.findByIdAndUpdate(userId, {
            subscriptionPlan: plan,
            subscriptionExpiresAt: expiresAt,
        }, { new: true });
        await this.logActivity(userId, 'subscription_upgrade', `Upgraded to ${plan} plan`);
        return {
            plan: user.subscriptionPlan,
            expiresAt: user.subscriptionExpiresAt,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(shop_settings_schema_1.ShopSettings.name)),
    __param(2, (0, mongoose_1.InjectModel)(activity_log_schema_1.ActivityLog.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map