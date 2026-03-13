import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { ShopSettings, ShopSettingsDocument } from './schemas/shop-settings.schema';
import { ActivityLog, ActivityLogDocument } from './schemas/activity-log.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateShopSettingsDto } from './dto/update-shop-settings.dto';
export declare class UsersService {
    private userModel;
    private settingsModel;
    private activityLogModel;
    constructor(userModel: Model<UserDocument>, settingsModel: Model<ShopSettingsDocument>, activityLogModel: Model<ActivityLogDocument>);
    getProfile(userId: string): Promise<User>;
    updateProfile(userId: string, updateDto: UpdateProfileDto): Promise<User>;
    uploadProfileImage(userId: string, imageBuffer: Buffer): Promise<string>;
    deleteAccount(userId: string, password: string): Promise<void>;
    getShopSettings(userId: string): Promise<ShopSettings>;
    updateShopSettings(userId: string, updateDto: UpdateShopSettingsDto): Promise<ShopSettings>;
    resetShopSettings(userId: string): Promise<ShopSettings>;
    logActivity(userId: string, action: string, description: string, metadata?: any, ipAddress?: string, userAgent?: string): Promise<void>;
    getActivityLogs(userId: string, page?: number, limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, ActivityLogDocument, {}, {}> & ActivityLog & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getActivityLogsByAction(userId: string, action: string, page?: number, limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, ActivityLogDocument, {}, {}> & ActivityLog & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    clearActivityLogs(userId: string, daysToKeep?: number): Promise<void>;
    getUserStatistics(userId: string): Promise<{
        accountAge: {
            days: number;
            createdAt: Date;
        };
        business: {
            totalSales: number;
            totalRevenue: number;
            inventoryValue: number;
            totalMedicines: number;
        };
        activity: {
            totalActions: number;
            recentLogins: Date[];
        };
    }>;
    private calculateTotalSales;
    private calculateTotalRevenue;
    private calculateInventoryValue;
    private countTotalMedicines;
    private getRecentLogins;
    getSubscriptionInfo(userId: string): Promise<{
        plan: string;
        expiresAt: Date;
        isExpired: boolean;
        daysRemaining: number;
        features: any;
    }>;
    private getSubscriptionFeatures;
    upgradeSubscription(userId: string, plan: 'basic' | 'premium', durationDays?: number): Promise<{
        plan: string;
        expiresAt: Date;
    }>;
}
