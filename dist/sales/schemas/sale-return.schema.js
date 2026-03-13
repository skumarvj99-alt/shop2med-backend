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
exports.SaleReturnSchema = exports.SaleReturn = exports.ReturnItem = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let ReturnItem = class ReturnItem {
};
exports.ReturnItem = ReturnItem;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Medicine', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ReturnItem.prototype, "medicine", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Inventory', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ReturnItem.prototype, "inventory", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], ReturnItem.prototype, "quantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], ReturnItem.prototype, "unitPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], ReturnItem.prototype, "totalAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], ReturnItem.prototype, "reason", void 0);
exports.ReturnItem = ReturnItem = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], ReturnItem);
const ReturnItemSchema = mongoose_1.SchemaFactory.createForClass(ReturnItem);
let SaleReturn = class SaleReturn {
};
exports.SaleReturn = SaleReturn;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], SaleReturn.prototype, "returnNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Sale', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], SaleReturn.prototype, "originalSale", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], SaleReturn.prototype, "user", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Date }),
    __metadata("design:type", Date)
], SaleReturn.prototype, "returnDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [ReturnItemSchema], required: true }),
    __metadata("design:type", Array)
], SaleReturn.prototype, "items", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], SaleReturn.prototype, "totalAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['full', 'partial'],
        default: 'full'
    }),
    __metadata("design:type", String)
], SaleReturn.prototype, "returnType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], SaleReturn.prototype, "reason", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['pending', 'completed', 'rejected'],
        default: 'completed'
    }),
    __metadata("design:type", String)
], SaleReturn.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], SaleReturn.prototype, "notes", void 0);
exports.SaleReturn = SaleReturn = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], SaleReturn);
exports.SaleReturnSchema = mongoose_1.SchemaFactory.createForClass(SaleReturn);
exports.SaleReturnSchema.index({ returnNumber: 1, user: 1 });
//# sourceMappingURL=sale-return.schema.js.map