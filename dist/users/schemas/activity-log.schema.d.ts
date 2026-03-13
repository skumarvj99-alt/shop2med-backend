import { Document, Types } from 'mongoose';
export type ActivityLogDocument = ActivityLog & Document;
export declare class ActivityLog {
    user: Types.ObjectId;
    action: string;
    description: string;
    metadata?: any;
    ipAddress?: string;
    userAgent?: string;
    timestamp: Date;
}
export declare const ActivityLogSchema: import("mongoose").Schema<ActivityLog, import("mongoose").Model<ActivityLog, any, any, any, Document<unknown, any, ActivityLog, any, {}> & ActivityLog & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ActivityLog, Document<unknown, {}, import("mongoose").FlatRecord<ActivityLog>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<ActivityLog> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
