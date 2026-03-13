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
exports.SaleSchema = exports.Sale = exports.SaleItem = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let SaleItem = class SaleItem {
};
exports.SaleItem = SaleItem;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Medicine', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], SaleItem.prototype, "medicine", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Inventory', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], SaleItem.prototype, "inventory", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], SaleItem.prototype, "medicineName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], SaleItem.prototype, "batchNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], SaleItem.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], SaleItem.prototype, "dosageForm", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 1 }),
    __metadata("design:type", Number)
], SaleItem.prototype, "quantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], SaleItem.prototype, "unitPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0 }),
    __metadata("design:type", Number)
], SaleItem.prototype, "mrp", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0, max: 100, default: 0 }),
    __metadata("design:type", Number)
], SaleItem.prototype, "discountPercent", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0, default: 0 }),
    __metadata("design:type", Number)
], SaleItem.prototype, "discountAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0, default: 0 }),
    __metadata("design:type", Number)
], SaleItem.prototype, "taxPercent", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0, default: 0 }),
    __metadata("design:type", Number)
], SaleItem.prototype, "taxAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], SaleItem.prototype, "totalAmount", void 0);
exports.SaleItem = SaleItem = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], SaleItem);
const SaleItemSchema = mongoose_1.SchemaFactory.createForClass(SaleItem);
let Sale = class Sale {
};
exports.Sale = Sale;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, index: true }),
    __metadata("design:type", String)
], Sale.prototype, "billNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Sale.prototype, "user", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Date, index: true }),
    __metadata("design:type", Date)
], Sale.prototype, "saleDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Sale.prototype, "customerName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Sale.prototype, "customerPhone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Sale.prototype, "customerEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Sale.prototype, "customerAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Sale.prototype, "doctorName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Sale.prototype, "prescriptionNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [SaleItemSchema], required: true }),
    __metadata("design:type", Array)
], Sale.prototype, "items", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], Sale.prototype, "subtotal", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0, default: 0 }),
    __metadata("design:type", Number)
], Sale.prototype, "totalDiscount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0, default: 0 }),
    __metadata("design:type", Number)
], Sale.prototype, "totalTax", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0, default: 0 }),
    __metadata("design:type", Number)
], Sale.prototype, "shippingCharges", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0, default: 0 }),
    __metadata("design:type", Number)
], Sale.prototype, "otherCharges", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], Sale.prototype, "totalAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], Sale.prototype, "amountPaid", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0, default: 0 }),
    __metadata("design:type", Number)
], Sale.prototype, "balanceDue", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['cash', 'card', 'upi', 'netbanking', 'cheque', 'mixed'],
        default: 'cash',
    }),
    __metadata("design:type", String)
], Sale.prototype, "paymentMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['completed', 'pending', 'partial', 'cancelled', 'refunded'],
        default: 'completed',
        index: true,
    }),
    __metadata("design:type", String)
], Sale.prototype, "paymentStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Sale.prototype, "transactionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['completed', 'cancelled', 'returned'],
        default: 'completed',
        index: true,
    }),
    __metadata("design:type", String)
], Sale.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Sale.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Sale.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Sale.prototype, "cancellationReason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Sale.prototype, "cancelledAt", void 0);
exports.Sale = Sale = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Sale);
exports.SaleSchema = mongoose_1.SchemaFactory.createForClass(Sale);
exports.SaleSchema.index({ billNumber: 1, user: 1 });
exports.SaleSchema.index({ saleDate: -1, user: 1 });
exports.SaleSchema.index({ customerPhone: 1, user: 1 });
exports.SaleSchema.index({ status: 1, paymentStatus: 1 });
exports.SaleSchema.virtual('itemsCount').get(function () {
    return this.items?.length || 0;
});
exports.SaleSchema.virtual('totalQuantity').get(function () {
    return this.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
});
exports.SaleSchema.virtual('profit').get(function () {
    return 0;
});
exports.SaleSchema.set('toJSON', { virtuals: true });
exports.SaleSchema.set('toObject', { virtuals: true });
//# sourceMappingURL=sale.schema.js.map