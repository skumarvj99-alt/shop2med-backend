import { Response } from 'express';
import { ReportsService } from './reports.service';
import { ExportService } from './services/export.service';
import { DateRangeDto } from './dto/date-range.dto';
import { SalesReportDto } from './dto/sales-report.dto';
export declare class ReportsController {
    private readonly reportsService;
    private readonly exportService;
    constructor(reportsService: ReportsService, exportService: ExportService);
    getDashboard(userId: string): Promise<{
        today: {
            sales: any;
            revenue: any;
            growth: string;
        };
        thisMonth: {
            sales: any;
            revenue: any;
            growth: string;
        };
        recentSales: (import("mongoose").Document<unknown, {}, import("../sales/schemas/sale.schema").SaleDocument, {}, {}> & import("../sales/schemas/sale.schema").Sale & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        alerts: {
            lowStock: number;
            outOfStock: number;
            expiringSoon: number;
        };
        topSellingToday: any[];
        lowStockAlerts: (import("../inventory/schemas/inventory.schema").Inventory & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        expiryAlerts: (import("mongoose").Document<unknown, {}, import("../inventory/schemas/inventory.schema").InventoryDocument, {}, {}> & import("../inventory/schemas/inventory.schema").Inventory & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        totalInventory: number;
    }>;
    getSalesReport(userId: string, reportDto: SalesReportDto, res?: Response): Promise<void | Response<any, Record<string, any>>>;
    getDailySalesReport(userId: string, dateRangeDto: DateRangeDto): Promise<any[]>;
    getMonthlySalesReport(userId: string, year: number): Promise<any[]>;
    getYearlySalesReport(userId: string): Promise<any[]>;
    getInventoryReport(userId: string, format?: string, res?: Response): Promise<void | Response<any, Record<string, any>>>;
    getStockMovementReport(userId: string, dateRangeDto: DateRangeDto): Promise<any[]>;
    getPurchaseReport(userId: string, dateRangeDto: DateRangeDto, res?: Response): Promise<void | Response<any, Record<string, any>>>;
    getProfitLossReport(userId: string, dateRangeDto: DateRangeDto, res?: Response): Promise<void | Response<any, Record<string, any>>>;
    getCustomerReport(userId: string, dateRangeDto: DateRangeDto, res?: Response): Promise<void | Response<any, Record<string, any>>>;
    private flattenSalesReport;
    private flattenInventoryReport;
    private flattenPurchaseReport;
}
