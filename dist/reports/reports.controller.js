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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reports_service_1 = require("./reports.service");
const export_service_1 = require("./services/export.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const date_range_dto_1 = require("./dto/date-range.dto");
const sales_report_dto_1 = require("./dto/sales-report.dto");
let ReportsController = class ReportsController {
    constructor(reportsService, exportService) {
        this.reportsService = reportsService;
        this.exportService = exportService;
    }
    async getDashboard(userId) {
        return this.reportsService.getDashboardAnalytics(userId);
    }
    async getSalesReport(userId, reportDto, res) {
        const report = await this.reportsService.getSalesReport(userId, reportDto);
        if (reportDto.format === 'excel') {
            const flatData = this.flattenSalesReport(report);
            return this.exportService.exportToExcel(flatData, 'sales-report', res);
        }
        else if (reportDto.format === 'csv') {
            const flatData = this.flattenSalesReport(report);
            return this.exportService.exportToCSV(flatData, 'sales-report', res);
        }
        return res.json(report);
    }
    async getDailySalesReport(userId, dateRangeDto) {
        return this.reportsService.getDailySalesReport(userId, dateRangeDto);
    }
    async getMonthlySalesReport(userId, year) {
        return this.reportsService.getMonthlySalesReport(userId, year || new Date().getFullYear());
    }
    async getYearlySalesReport(userId) {
        return this.reportsService.getYearlySalesReport(userId);
    }
    async getInventoryReport(userId, format, res) {
        const report = await this.reportsService.getInventoryReport(userId);
        if (format === 'excel') {
            const flatData = this.flattenInventoryReport(report);
            return this.exportService.exportToExcel(flatData, 'inventory-report', res);
        }
        else if (format === 'csv') {
            const flatData = this.flattenInventoryReport(report);
            return this.exportService.exportToCSV(flatData, 'inventory-report', res);
        }
        return res.json(report);
    }
    async getStockMovementReport(userId, dateRangeDto) {
        return this.reportsService.getStockMovementReport(userId, dateRangeDto);
    }
    async getPurchaseReport(userId, dateRangeDto, res) {
        const report = await this.reportsService.getPurchaseReport(userId, dateRangeDto);
        if (dateRangeDto.format === 'excel') {
            const flatData = this.flattenPurchaseReport(report);
            return this.exportService.exportToExcel(flatData, 'purchase-report', res);
        }
        else if (dateRangeDto.format === 'csv') {
            const flatData = this.flattenPurchaseReport(report);
            return this.exportService.exportToCSV(flatData, 'purchase-report', res);
        }
        return res.json(report);
    }
    async getProfitLossReport(userId, dateRangeDto, res) {
        const report = await this.reportsService.getProfitLossReport(userId, dateRangeDto);
        if (dateRangeDto.format === 'excel') {
            return this.exportService.exportToExcel(report.detailedSales, 'profit-loss-report', res);
        }
        else if (dateRangeDto.format === 'csv') {
            return this.exportService.exportToCSV(report.detailedSales, 'profit-loss-report', res);
        }
        return res.json(report);
    }
    async getCustomerReport(userId, dateRangeDto, res) {
        const report = await this.reportsService.getCustomerReport(userId, dateRangeDto);
        if (dateRangeDto.format === 'excel') {
            return this.exportService.exportToExcel(report.topCustomers, 'customer-report', res);
        }
        else if (dateRangeDto.format === 'csv') {
            return this.exportService.exportToCSV(report.topCustomers, 'customer-report', res);
        }
        return res.json(report);
    }
    flattenSalesReport(report) {
        return report.salesByPeriod.map((item) => ({
            Period: item._id,
            Sales: item.sales,
            Revenue: item.revenue,
            Quantity: item.quantity,
            'Average Sale Value': item.avgSaleValue?.toFixed(2) || 0,
        }));
    }
    flattenInventoryReport(report) {
        return report.categoryBreakdown.map((item) => ({
            Category: item._id,
            'Item Count': item.itemCount,
            'Total Quantity': item.totalQuantity,
            'Total Value': item.totalValue?.toFixed(2) || 0,
        }));
    }
    flattenPurchaseReport(report) {
        return report.ordersBySupplier.map((item) => ({
            Supplier: item._id,
            'Order Count': item.orderCount,
            'Total Amount': item.totalAmount?.toFixed(2) || 0,
            'Average Amount': item.avgAmount?.toFixed(2) || 0,
        }));
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get dashboard analytics' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('sales'),
    (0, swagger_1.ApiOperation)({ summary: 'Get comprehensive sales report' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, sales_report_dto_1.SalesReportDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getSalesReport", null);
__decorate([
    (0, common_1.Get)('sales/daily'),
    (0, swagger_1.ApiOperation)({ summary: 'Get daily sales report' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, date_range_dto_1.DateRangeDto]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getDailySalesReport", null);
__decorate([
    (0, common_1.Get)('sales/monthly'),
    (0, swagger_1.ApiOperation)({ summary: 'Get monthly sales report' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getMonthlySalesReport", null);
__decorate([
    (0, common_1.Get)('sales/yearly'),
    (0, swagger_1.ApiOperation)({ summary: 'Get yearly sales report' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getYearlySalesReport", null);
__decorate([
    (0, common_1.Get)('inventory'),
    (0, swagger_1.ApiOperation)({ summary: 'Get comprehensive inventory report' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)('format')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getInventoryReport", null);
__decorate([
    (0, common_1.Get)('inventory/stock-movement'),
    (0, swagger_1.ApiOperation)({ summary: 'Get stock movement report' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, date_range_dto_1.DateRangeDto]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getStockMovementReport", null);
__decorate([
    (0, common_1.Get)('purchases'),
    (0, swagger_1.ApiOperation)({ summary: 'Get purchase report' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, date_range_dto_1.DateRangeDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getPurchaseReport", null);
__decorate([
    (0, common_1.Get)('profit-loss'),
    (0, swagger_1.ApiOperation)({ summary: 'Get profit & loss report' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, date_range_dto_1.DateRangeDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getProfitLossReport", null);
__decorate([
    (0, common_1.Get)('customers'),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer report' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, date_range_dto_1.DateRangeDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getCustomerReport", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)('Reports'),
    (0, common_1.Controller)('reports'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [reports_service_1.ReportsService,
        export_service_1.ExportService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map