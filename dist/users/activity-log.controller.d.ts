import { ActivityLogService } from './activity-log.service';
export declare class ActivityLogController {
    private readonly activityLogService;
    constructor(activityLogService: ActivityLogService);
    getActivityLogs(userId: string, action?: string, limit?: number, startDate?: string, endDate?: string): Promise<{
        success: boolean;
        data: import("./schemas/activity-log.schema").ActivityLog[];
        message: string;
    }>;
    getStatistics(userId: string, startDate?: string, endDate?: string): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
    getAllActivityLogs(page?: number, limit?: number, action?: string, userId?: string, startDate?: string, endDate?: string): Promise<{
        success: boolean;
        data: {
            logs: import("./schemas/activity-log.schema").ActivityLog[];
            pagination: {
                page: number;
                limit: number;
                total: number;
            };
        };
        message: string;
    }>;
    cleanupOldLogs(days?: number): Promise<{
        success: boolean;
        data: {
            deletedCount: number;
            daysKept: number;
        };
        message: string;
    }>;
}
