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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicinesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const medicines_service_1 = require("./medicines.service");
const create_medicine_dto_1 = require("./dto/create-medicine.dto");
const update_medicine_dto_1 = require("./dto/update-medicine.dto");
const search_medicine_dto_1 = require("./dto/search-medicine.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let MedicinesController = class MedicinesController {
    constructor(medicinesService) {
        this.medicinesService = medicinesService;
    }
    async create(createMedicineDto, userId) {
        return this.medicinesService.create(createMedicineDto, userId);
    }
    async findOrCreate(createMedicineDto, userId) {
        return this.medicinesService.findOrCreate(createMedicineDto, userId);
    }
    async search(searchDto) {
        return this.medicinesService.search(searchDto);
    }
    async autocomplete(query) {
        return this.medicinesService.autocomplete(query);
    }
    async getPopular(limit) {
        return this.medicinesService.getPopular(limit);
    }
    async getCategories() {
        return this.medicinesService.getCategories();
    }
    async findByCategory(category) {
        return this.medicinesService.findByCategory(category);
    }
    async findOne(id) {
        return this.medicinesService.findOne(id);
    }
    async findAll(page, limit) {
        return this.medicinesService.findAll(page, limit);
    }
    async update(id, updateMedicineDto) {
        return this.medicinesService.update(id, updateMedicineDto);
    }
    async remove(id) {
        return this.medicinesService.remove(id);
    }
    async recordUsage(id) {
        await this.medicinesService.recordUsage(id);
        return { message: 'Usage recorded successfully' };
    }
};
exports.MedicinesController = MedicinesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new medicine' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Medicine created successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_medicine_dto_1.CreateMedicineDto, String]),
    __metadata("design:returntype", Promise)
], MedicinesController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('find-or-create'),
    (0, swagger_1.ApiOperation)({ summary: 'Find existing medicine or create new one (Smart Entry)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_medicine_dto_1.CreateMedicineDto, String]),
    __metadata("design:returntype", Promise)
], MedicinesController.prototype, "findOrCreate", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search medicines with filters' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_medicine_dto_1.SearchMedicineDto]),
    __metadata("design:returntype", Promise)
], MedicinesController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('autocomplete'),
    (0, swagger_1.ApiOperation)({ summary: 'Autocomplete for medicine name' }),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MedicinesController.prototype, "autocomplete", null);
__decorate([
    (0, common_1.Get)('popular'),
    (0, swagger_1.ApiOperation)({ summary: 'Get popular medicines' }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MedicinesController.prototype, "getPopular", null);
__decorate([
    (0, common_1.Get)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all medicine categories' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MedicinesController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)('category/:category'),
    (0, swagger_1.ApiOperation)({ summary: 'Get medicines by category' }),
    __param(0, (0, common_1.Param)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MedicinesController.prototype, "findByCategory", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get medicine by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MedicinesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all medicines' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], MedicinesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update medicine' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_medicine_dto_1.UpdateMedicineDto]),
    __metadata("design:returntype", Promise)
], MedicinesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete medicine (soft delete)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MedicinesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/record-usage'),
    (0, swagger_1.ApiOperation)({ summary: 'Record medicine usage (when sold)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MedicinesController.prototype, "recordUsage", null);
exports.MedicinesController = MedicinesController = __decorate([
    (0, swagger_1.ApiTags)('Medicines'),
    (0, common_1.Controller)('medicines'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [medicines_service_1.MedicinesService])
], MedicinesController);
//# sourceMappingURL=medicines.controller.js.map