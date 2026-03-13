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
exports.InventorySchema = exports.Inventory = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Inventory = class Inventory {
};
exports.Inventory = Inventory;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Medicine', index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Inventory.prototype, "medicine", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Inventory.prototype, "medicineName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Inventory.prototype, "user", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true, index: true }),
    __metadata("design:type", String)
], Inventory.prototype, "batchNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Date, index: true }),
    __metadata("design:type", Date)
], Inventory.prototype, "expiryDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Date }),
    __metadata("design:type", Date)
], Inventory.prototype, "manufactureDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], Inventory.prototype, "quantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0, default: 0 }),
    __metadata("design:type", Number)
], Inventory.prototype, "soldQuantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0, default: 0 }),
    __metadata("design:type", Number)
], Inventory.prototype, "damagedQuantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], Inventory.prototype, "purchasePrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], Inventory.prototype, "sellingPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0 }),
    __metadata("design:type", Number)
], Inventory.prototype, "mrp", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Inventory.prototype, "supplier", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Inventory.prototype, "supplierInvoiceNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Inventory.prototype, "purchaseDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Inventory.prototype, "rackNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Inventory.prototype, "shelfNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0, default: 10 }),
    __metadata("design:type", Number)
], Inventory.prototype, "reorderLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 30 }),
    __metadata("design:type", Number)
], Inventory.prototype, "expiryAlertDays", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['active', 'low_stock', 'expired', 'near_expiry', 'out_of_stock'],
        default: 'active',
        index: true
    }),
    __metadata("design:type", String)
], Inventory.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Inventory.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Inventory.prototype, "notes", void 0);
exports.Inventory = Inventory = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Inventory);
exports.InventorySchema = mongoose_1.SchemaFactory.createForClass(Inventory);
exports.InventorySchema.index({ medicineName: 1, user: 1 }, { unique: true });
exports.InventorySchema.index({ expiryDate: 1, isActive: 1 });
exports.InventorySchema.index({ status: 1, user: 1 });
exports.InventorySchema.index({ quantity: 1, reorderLevel: 1 });
exports.InventorySchema.virtual('availableQuantity').get(function () {
    return this.quantity - this.soldQuantity - this.damagedQuantity;
});
exports.InventorySchema.virtual('daysUntilExpiry').get(function () {
    const today = new Date();
    const expiry = new Date(this.expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
});
exports.InventorySchema.virtual('isExpired').get(function () {
    return new Date() > new Date(this.expiryDate);
});
exports.InventorySchema.virtual('isNearExpiry').get(function () {
    const daysUntilExpiry = this.get('daysUntilExpiry');
    return daysUntilExpiry > 0 && daysUntilExpiry <= this.expiryAlertDays;
});
exports.InventorySchema.virtual('profitMargin').get(function () {
    return this.sellingPrice - this.purchasePrice;
});
exports.InventorySchema.virtual('profitPercentage').get(function () {
    if (this.purchasePrice === 0)
        return 0;
    return ((this.sellingPrice - this.purchasePrice) / this.purchasePrice) * 100;
});
exports.InventorySchema.pre('save', function (next) {
    const inventory = this;
    const availableQty = inventory.quantity - inventory.soldQuantity - inventory.damagedQuantity;
    if (availableQty <= 0) {
        inventory.status = 'out_of_stock';
    }
    else if (new Date() > inventory.expiryDate) {
        inventory.status = 'expired';
    }
    else if (inventory.get('isNearExpiry')) {
        inventory.status = 'near_expiry';
    }
    else if (availableQty <= inventory.reorderLevel) {
        inventory.status = 'low_stock';
    }
    else {
        inventory.status = 'active';
    }
    next();
});
exports.InventorySchema.set('toJSON', { virtuals: true });
exports.InventorySchema.set('toObject', { virtuals: true });
//# sourceMappingURL=inventory.schema.js.map