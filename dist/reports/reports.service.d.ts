import { Model, Types } from 'mongoose';
import { Sale, SaleDocument } from '../sales/schemas/sale.schema';
import { Inventory, InventoryDocument } from '../inventory/schemas/inventory.schema';
import { OrderDocument } from '../orders/schemas/order.schema';
import { MedicineDocument } from '../medicines/schemas/medicine.schema';
import { DateRangeDto } from './dto/date-range.dto';
import { SalesReportDto } from './dto/sales-report.dto';
export declare class ReportsService {
    private saleModel;
    private inventoryModel;
    private orderModel;
    private medicineModel;
    constructor(saleModel: Model<SaleDocument>, inventoryModel: Model<InventoryDocument>, orderModel: Model<OrderDocument>, medicineModel: Model<MedicineDocument>);
    private getUserObjectId;
    getSalesReport(userId: string, reportDto: SalesReportDto): Promise<{
        summary: any;
        salesByPeriod: any[];
        topMedicines: any[];
        paymentBreakdown: any[];
        period: {
            from: Date;
            to: Date;
            groupBy: string;
        };
    }>;
    getDailySalesReport(userId: string, dateRangeDto: DateRangeDto): Promise<any[]>;
    getMonthlySalesReport(userId: string, year: number): Promise<any[]>;
    getYearlySalesReport(userId: string): Promise<any[]>;
    getInventoryReport(userId: string): Promise<{
        summary: any;
        categoryBreakdown: any[];
        expiryReport: any[];
        lowStockItems: (import("mongoose").Document<unknown, {}, InventoryDocument, {}, {}> & Inventory & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        topValueItems: any[];
    }>;
    getStockMovementReport(userId: string, dateRangeDto: DateRangeDto): Promise<any[]>;
    getPurchaseReport(userId: string, dateRangeDto: DateRangeDto): Promise<{
        summary: any;
        ordersBySupplier: any[];
        monthlyPurchases: any[];
        statusBreakdown: any[];
        period: {
            from: Date;
            to: Date;
        };
    }>;
    getProfitLossReport(userId: string, dateRangeDto: DateRangeDto): Promise<{
        summary: any;
        detailedSales: any[];
        period: {
            from: Date;
            to: Date;
        };
    }>;
    getCustomerReport(userId: string, dateRangeDto: DateRangeDto): Promise<{
        topCustomers: any[];
        stats: any;
        newCustomers: any[];
        period: {
            from: Date;
            to: Date;
        };
    }>;
    getDashboardAnalytics(userId: string): Promise<{
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
        recentSales: (import("mongoose").Document<unknown, {}, SaleDocument, {}, {}> & Sale & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        alerts: {
            lowStock: number;
            outOfStock: number;
            expiringSoon: number;
        };
        topSellingToday: any[];
        lowStockAlerts: (Inventory & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        expiryAlerts: (import("mongoose").Document<unknown, {}, InventoryDocument, {}, {}> & Inventory & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        totalInventory: number;
    }>;
    private getSalesStats;
}
