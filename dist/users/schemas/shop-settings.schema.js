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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopSettingsSchema = exports.ShopSettings = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let ShopSettings = class ShopSettings {
};
exports.ShopSettings = ShopSettings;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true, unique: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ShopSettings.prototype, "user", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '09:00 AM' }),
    __metadata("design:type", String)
], ShopSettings.prototype, "openingTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '09:00 PM' }),
    __metadata("design:type", String)
], ShopSettings.prototype, "closingTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'Mon-Sat' }),
    __metadata("design:type", String)
], ShopSettings.prototype, "workingDays", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'BILL' }),
    __metadata("design:type", String)
], ShopSettings.prototype, "invoicePrefix", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], ShopSettings.prototype, "autoInvoiceNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'Thank you for your business!' }),
    __metadata("design:type", String)
], ShopSettings.prototype, "invoiceFooter", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], ShopSettings.prototype, "printLogo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], ShopSettings.prototype, "printShopDetails", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 12, min: 0, max: 100 }),
    __metadata("design:type", Number)
], ShopSettings.prototype, "defaultTaxRate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], ShopSettings.prototype, "enableGST", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], ShopSettings.prototype, "includeGSTInPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 10, min: 0 }),
    __metadata("design:type", Number)
], ShopSettings.prototype, "defaultReorderLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 30, min: 1 }),
    __metadata("design:type", Number)
], ShopSettings.prototype, "expiryAlertDays", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], ShopSettings.prototype, "enableLowStockAlerts", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], ShopSettings.prototype, "enableExpiryAlerts", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], ShopSettings.prototype, "enableOutOfStockAlerts", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], ShopSettings.prototype, "enableEmailNotifications", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], ShopSettings.prototype, "enableSMSNotifications", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], ShopSettings.prototype, "enableWhatsAppNotifications", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ShopSettings.prototype, "notificationEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ShopSettings.prototype, "notificationPhone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'INR' }),
    __metadata("design:type", String)
], ShopSettings.prototype, "currency", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'en-IN' }),
    __metadata("design:type", String)
], ShopSettings.prototype, "locale", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'Asia/Kolkata' }),
    __metadata("design:type", String)
], ShopSettings.prototype, "timezone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'DD/MM/YYYY' }),
    __metadata("design:type", String)
], ShopSettings.prototype, "dateFormat", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], ShopSettings.prototype, "autoBackup", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 7 }),
    __metadata("design:type", Number)
], ShopSettings.prototype, "backupFrequencyDays", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], ShopSettings.prototype, "lastBackupDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], ShopSettings.prototype, "enableBarcode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], ShopSettings.prototype, "enableOCR", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], ShopSettings.prototype, "enableReports", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], ShopSettings.prototype, "enableMultiUser", void 0);
exports.ShopSettings = ShopSettings = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ShopSettings);
exports.ShopSettingsSchema = mongoose_1.SchemaFactory.createForClass(ShopSettings);
//# sourceMappingURL=shop-settings.schema.js.map