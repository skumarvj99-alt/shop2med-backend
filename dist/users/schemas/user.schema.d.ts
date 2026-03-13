import { Document } from 'mongoose';
export type UserDocument = User & Document & {
    comparePassword(candidatePassword: string): Promise<boolean>;
    createdAt: Date;
    updatedAt: Date;
};
export declare class User {
    name: string;
    email: string;
    password: string;
    phone?: string;
    shopName: string;
    shopAddress?: string;
    gstNumber?: string;
    drugLicenseNumber?: string;
    role: string;
    isActive: boolean;
    isEmailVerified: boolean;
    subscriptionPlan: string;
    subscriptionExpiresAt?: Date;
    refreshToken?: string;
    lastLoginAt?: Date;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any, {}> & User & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
