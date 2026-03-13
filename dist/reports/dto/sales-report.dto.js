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
exports.SalesReportDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const date_range_dto_1 = require("./date-range.dto");
class SalesReportDto extends date_range_dto_1.DateRangeDto {
    constructor() {
        super(...arguments);
        this.groupBy = 'daily';
    }
}
exports.SalesReportDto = SalesReportDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'daily',
        enum: ['daily', 'weekly', 'monthly', 'yearly']
    }),
    (0, class_validator_1.IsEnum)(['daily', 'weekly', 'monthly', 'yearly']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SalesReportDto.prototype, "groupBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'cash' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SalesReportDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'completed' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SalesReportDto.prototype, "status", void 0);
//# sourceMappingURL=sales-report.dto.js.map