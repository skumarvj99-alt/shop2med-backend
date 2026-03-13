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
exports.MedicineSchema = exports.Medicine = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Medicine = class Medicine {
};
exports.Medicine = Medicine;
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true, index: true }),
    __metadata("design:type", String)
], Medicine.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true, index: true }),
    __metadata("design:type", String)
], Medicine.prototype, "genericName", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['Tablet', 'Capsule', 'Injection', 'Syrup', 'Cream', 'Ointment',
            'Drops', 'Gel', 'Lotion', 'Powder', 'Solution', 'Suppository',
            'Inhaler', 'Spray', 'Unknown'],
        default: 'Unknown'
    }),
    __metadata("design:type", String)
], Medicine.prototype, "dosageForm", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Medicine.prototype, "strength", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Medicine.prototype, "composition", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '1 unit' }),
    __metadata("design:type", String)
], Medicine.prototype, "unit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '1 unit' }),
    __metadata("design:type", String)
], Medicine.prototype, "packSize", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, min: 0 }),
    __metadata("design:type", Number)
], Medicine.prototype, "ceilingPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, min: 0 }),
    __metadata("design:type", Number)
], Medicine.prototype, "mrp", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, min: 0 }),
    __metadata("design:type", Number)
], Medicine.prototype, "purchasePrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'General', index: true }),
    __metadata("design:type", String)
], Medicine.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['Allopathy', 'Homeopathy', 'Ayurveda', 'Unani', 'Generic', 'Other'],
        default: 'Allopathy'
    }),
    __metadata("design:type", String)
], Medicine.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['Oral', 'Injectable', 'Topical', 'Ophthalmic', 'Inhalation', 'Other'],
        default: 'Oral'
    }),
    __metadata("design:type", String)
], Medicine.prototype, "route", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Medicine.prototype, "manufacturer", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Medicine.prototype, "schedule", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Medicine.prototype, "substitutes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Medicine.prototype, "sideEffects", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '30049099' }),
    __metadata("design:type", String)
], Medicine.prototype, "hsnCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Medicine.prototype, "requiresPrescription", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], lowercase: true }),
    __metadata("design:type", Array)
], Medicine.prototype, "searchTerms", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['NPPA', 'USER', 'IMPORT'],
        default: 'USER'
    }),
    __metadata("design:type", String)
], Medicine.prototype, "dataSource", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Medicine.prototype, "nlemListed", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true, index: true }),
    __metadata("design:type", Boolean)
], Medicine.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Medicine.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Medicine.prototype, "usageCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Medicine.prototype, "lastUsed", void 0);
exports.Medicine = Medicine = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Medicine);
exports.MedicineSchema = mongoose_1.SchemaFactory.createForClass(Medicine);
exports.MedicineSchema.index({
    name: 'text',
    genericName: 'text',
    searchTerms: 'text'
}, {
    weights: { name: 10, genericName: 5, searchTerms: 3 }
});
exports.MedicineSchema.index({ category: 1, isActive: 1 });
exports.MedicineSchema.index({ dosageForm: 1, isActive: 1 });
exports.MedicineSchema.index({ usageCount: -1 });
//# sourceMappingURL=medicine.schema.js.map