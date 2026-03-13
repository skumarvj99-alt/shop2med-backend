import { Document, Types } from 'mongoose';
export type ShopSettingsDocument = ShopSettings & Document;
export declare class ShopSettings {
    user: Types.ObjectId;
    openingTime: string;
    closingTime: string;
    workingDays: string;
    invoicePrefix: string;
    autoInvoiceNumber: boolean;
    invoiceFooter: string;
    printLogo: boolean;
    printShopDetails: boolean;
    defaultTaxRate: number;
    enableGST: boolean;
    includeGSTInPrice: boolean;
    defaultReorderLevel: number;
    expiryAlertDays: number;
    enableLowStockAlerts: boolean;
    enableExpiryAlerts: boolean;
    enableOutOfStockAlerts: boolean;
    enableEmailNotifications: boolean;
    enableSMSNotifications: boolean;
    enableWhatsAppNotifications: boolean;
    notificationEmail?: string;
    notificationPhone?: string;
    currency: string;
    locale: string;
    timezone: string;
    dateFormat: string;
    autoBackup: boolean;
    backupFrequencyDays: number;
    lastBackupDate?: Date;
    enableBarcode: boolean;
    enableOCR: boolean;
    enableReports: boolean;
    enableMultiUser: boolean;
}
export declare const ShopSettingsSchema: import("mongoose").Schema<ShopSettings, import("mongoose").Model<ShopSettings, any, any, any, Document<unknown, any, ShopSettings, any, {}> & ShopSettings & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ShopSettings, Document<unknown, {}, import("mongoose").FlatRecord<ShopSettings>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<ShopSettings> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
