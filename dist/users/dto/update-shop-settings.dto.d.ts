export declare class UpdateShopSettingsDto {
    openingTime?: string;
    closingTime?: string;
    workingDays?: string;
    invoicePrefix?: string;
    autoInvoiceNumber?: boolean;
    invoiceFooter?: string;
    defaultTaxRate?: number;
    enableGST?: boolean;
    defaultReorderLevel?: number;
    expiryAlertDays?: number;
    enableLowStockAlerts?: boolean;
    enableExpiryAlerts?: boolean;
    enableEmailNotifications?: boolean;
    enableSMSNotifications?: boolean;
    currency?: string;
    locale?: string;
    timezone?: string;
}
