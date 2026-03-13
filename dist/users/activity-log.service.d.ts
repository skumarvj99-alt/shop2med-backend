import { Model } from 'mongoose';
import { ActivityLog, ActivityLogDocument } from './schemas/activity-log.schema';
import { Request } from 'express';
export interface CreateActivityLogDto {
    user: string;
    action: string;
    description: string;
    metadata?: any;
    ipAddress?: string;
    userAgent?: string;
}
export declare class ActivityLogService {
    private activityLogModel;
    constructor(activityLogModel: Model<ActivityLogDocument>);
    create(createDto: CreateActivityLogDto, request?: Request): Promise<ActivityLog>;
    findByUser(userId: string, limit?: number): Promise<ActivityLog[]>;
    findByAction(action: string, limit?: number): Promise<ActivityLog[]>;
    findByUserAndAction(userId: string, action: string, limit?: number): Promise<ActivityLog[]>;
    findByDateRange(startDate: Date, endDate: Date, limit?: number): Promise<ActivityLog[]>;
    getStatistics(userId?: string, startDate?: Date, endDate?: Date): Promise<any>;
    deleteOldLogs(daysToKeep?: number): Promise<{
        deletedCount: number;
    }>;
    logActivity(userId: string, action: string, description: string, metadata?: any, request?: Request): Promise<ActivityLog>;
}
