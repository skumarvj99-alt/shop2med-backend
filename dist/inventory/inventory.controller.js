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
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const inventory_service_1 = require("./inventory.service");
const create_inventory_dto_1 = require("./dto/create-inventory.dto");
const update_inventory_dto_1 = require("./dto/update-inventory.dto");
const adjust_stock_dto_1 = require("./dto/adjust-stock.dto");
const search_inventory_dto_1 = require("./dto/search-inventory.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let InventoryController = class InventoryController {
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    async create(createInventoryDto, userId) {
        return this.inventoryService.create(createInventoryDto, userId);
    }
    async findAll(userId, page, limit) {
        return this.inventoryService.findAll(userId, page, limit);
    }
    async search(userId, searchDto) {
        return this.inventoryService.search(userId, searchDto);
    }
    async getLowStockAlerts(userId) {
        return this.inventoryService.getLowStockAlerts(userId);
    }
    async getExpiryAlerts(userId, days) {
        return this.inventoryService.getExpiryAlerts(userId, days);
    }
    async getExpiredItems(userId) {
        return this.inventoryService.getExpiredItems(userId);
    }
    async getOutOfStockItems(userId) {
        return this.inventoryService.getOutOfStockItems(userId);
    }
    async getStockSummary(userId) {
        return this.inventoryService.getStockSummary(userId);
    }
    async findByMedicine(medicineId, userId) {
        return this.inventoryService.findByMedicine(medicineId, userId);
    }
    async findOne(id, userId) {
        return this.inventoryService.findOne(id, userId);
    }
    async getTransactionHistory(id, userId, page, limit) {
        return this.inventoryService.getTransactionHistory(id, userId, page, limit);
    }
    async update(id, userId, updateInventoryDto) {
        return this.inventoryService.update(id, userId, updateInventoryDto);
    }
    async adjustStock(id, userId, adjustStockDto) {
        return this.inventoryService.adjustStock(id, userId, adjustStockDto);
    }
    async remove(id, userId) {
        return this.inventoryService.remove(id, userId);
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add new inventory batch' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Inventory created successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_inventory_dto_1.CreateInventoryDto, String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all inventory items' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search inventory with filters' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, search_inventory_dto_1.SearchInventoryDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('alerts/low-stock'),
    (0, swagger_1.ApiOperation)({ summary: 'Get low stock alerts' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getLowStockAlerts", null);
__decorate([
    (0, common_1.Get)('alerts/expiry'),
    (0, swagger_1.ApiOperation)({ summary: 'Get expiry alerts' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getExpiryAlerts", null);
__decorate([
    (0, common_1.Get)('alerts/expired'),
    (0, swagger_1.ApiOperation)({ summary: 'Get expired items' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getExpiredItems", null);
__decorate([
    (0, common_1.Get)('alerts/out-of-stock'),
    (0, swagger_1.ApiOperation)({ summary: 'Get out of stock items' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getOutOfStockItems", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get stock summary' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getStockSummary", null);
__decorate([
    (0, common_1.Get)('medicine/:medicineId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all batches for a medicine' }),
    __param(0, (0, common_1.Param)('medicineId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "findByMedicine", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get inventory by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/transactions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get transaction history for inventory item' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getTransactionHistory", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update inventory item' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_inventory_dto_1.UpdateInventoryDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/adjust'),
    (0, swagger_1.ApiOperation)({ summary: 'Adjust stock quantity' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, adjust_stock_dto_1.AdjustStockDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "adjustStock", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete inventory item (soft delete)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "remove", null);
exports.InventoryController = InventoryController = __decorate([
    (0, swagger_1.ApiTags)('Inventory'),
    (0, common_1.Controller)('inventory'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map