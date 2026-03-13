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
exports.ActivityLogService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const activity_log_schema_1 = require("./schemas/activity-log.schema");
let ActivityLogService = class ActivityLogService {
    constructor(activityLogModel) {
        this.activityLogModel = activityLogModel;
    }
    async create(createDto, request) {
        const activityLog = new this.activityLogModel({
            ...createDto,
            ipAddress: request?.ip,
            userAgent: request?.get('User-Agent'),
        });
        return await activityLog.save();
    }
    async findByUser(userId, limit = 100) {
        return await this.activityLogModel
            .find({ user: userId })
            .sort({ timestamp: -1 })
            .limit(limit)
            .populate('user', 'name email')
            .exec();
    }
    async findByAction(action, limit = 100) {
        return await this.activityLogModel
            .find({ action })
            .sort({ timestamp: -1 })
            .limit(limit)
            .populate('user', 'name email')
            .exec();
    }
    async findByUserAndAction(userId, action, limit = 50) {
        return await this.activityLogModel
            .find({ user: userId, action })
            .sort({ timestamp: -1 })
            .limit(limit)
            .populate('user', 'name email')
            .exec();
    }
    async findByDateRange(startDate, endDate, limit = 200) {
        return await this.activityLogModel
            .find({
            timestamp: {
                $gte: startDate,
                $lte: endDate,
            },
        })
            .sort({ timestamp: -1 })
            .limit(limit)
            .populate('user', 'name email')
            .exec();
    }
    async getStatistics(userId, startDate, endDate) {
        const matchQuery = {};
        if (userId) {
            matchQuery.user = userId;
        }
        if (startDate || endDate) {
            matchQuery.timestamp = {};
            if (startDate)
                matchQuery.timestamp.$gte = startDate;
            if (endDate)
                matchQuery.timestamp.$lte = endDate;
        }
        const stats = await this.activityLogModel.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: '$action',
                    count: { $sum: 1 },
                    lastOccurrence: { $max: '$timestamp' },
                },
            },
            { $sort: { count: -1 } },
        ]);
        return stats;
    }
    async deleteOldLogs(daysToKeep = 90) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
        const result = await this.activityLogModel.deleteMany({
            timestamp: { $lt: cutoffDate },
        });
        return { deletedCount: result.deletedCount || 0 };
    }
    async logActivity(userId, action, description, metadata, request) {
        return this.create({
            user: userId,
            action,
            description,
            metadata,
            ipAddress: request?.ip,
            userAgent: request?.get('User-Agent'),
        }, request);
    }
};
exports.ActivityLogService = ActivityLogService;
exports.ActivityLogService = ActivityLogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(activity_log_schema_1.ActivityLog.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ActivityLogService);
//# sourceMappingURL=activity-log.service.js.map