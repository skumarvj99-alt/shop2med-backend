import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateShopSettingsDto } from './dto/update-shop-settings.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(userId: string): Promise<import("./schemas/user.schema").User>;
    updateProfile(userId: string, updateDto: UpdateProfileDto): Promise<import("./schemas/user.schema").User>;
    uploadProfileImage(userId: string, file: Express.Multer.File): Promise<{
        imageUrl: string;
    }>;
    deleteAccount(userId: string, password: string): Promise<{
        message: string;
    }>;
    getShopSettings(userId: string): Promise<import("./schemas/shop-settings.schema").ShopSettings>;
    updateShopSettings(userId: string, updateDto: UpdateShopSettingsDto): Promise<import("./schemas/shop-settings.schema").ShopSettings>;
    resetShopSettings(userId: string): Promise<import("./schemas/shop-settings.schema").ShopSettings>;
    getActivityLogs(userId: string, page?: number, limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/activity-log.schema").ActivityLogDocument, {}, {}> & import("./schemas/activity-log.schema").ActivityLog & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
        data: (import("mongoose").Document<unknown, {}, import("./schemas/activity-log.schema").ActivityLogDocument, {}, {}> & import("./schemas/activity-log.schema").ActivityLog & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    clearActivityLogs(userId: string, daysToKeep?: number): Promise<{
        message: string;
    }>;
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
    getSubscriptionInfo(userId: string): Promise<{
        plan: string;
        expiresAt: Date;
        isExpired: boolean;
        daysRemaining: number;
        features: any;
    }>;
    upgradeSubscription(userId: string, plan: 'basic' | 'premium', durationDays?: number): Promise<{
        plan: string;
        expiresAt: Date;
    }>;
}
