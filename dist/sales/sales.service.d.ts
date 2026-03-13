import { Model, Types } from 'mongoose';
import { Sale, SaleDocument } from './schemas/sale.schema';
import { SaleReturn, SaleReturnDocument } from './schemas/sale-return.schema';
import { InventoryDocument } from '../inventory/schemas/inventory.schema';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SearchSaleDto } from './dto/search-sale.dto';
import { CreateSaleReturnDto } from './dto/create-sale-return.dto';
import { ActivityLogService } from '../users/activity-log.service';
export declare class SalesService {
    private saleModel;
    private saleReturnModel;
    private inventoryModel;
    private activityLogService;
    constructor(saleModel: Model<SaleDocument>, saleReturnModel: Model<SaleReturnDocument>, inventoryModel: Model<InventoryDocument>, activityLogService: ActivityLogService);
    create(createSaleDto: CreateSaleDto, userId: string): Promise<Sale>;
    findAll(userId: string, page?: number, limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, SaleDocument, {}, {}> & Sale & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    search(userId: string, searchDto: SearchSaleDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, SaleDocument, {}, {}> & Sale & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, userId: string): Promise<Sale>;
    findByBillNumber(billNumber: string, userId: string): Promise<Sale>;
    cancelSale(id: string, userId: string, reason: string): Promise<Sale>;
    createReturn(createReturnDto: CreateSaleReturnDto, userId: string): Promise<SaleReturn>;
    getSalesAnalytics(userId: string, dateFrom: Date, dateTo: Date): Promise<{
        summary: {
            totalSales: number;
            totalRevenue: any;
            averageSaleValue: number;
        };
        paymentMethods: any[];
        topMedicines: any[];
        dailySales: any[];
    }>;
    getSalesSummary(userId: string): Promise<{
        today: {
            sales: any;
            revenue: any;
        };
        thisMonth: {
            sales: any;
            revenue: any;
        };
        thisYear: {
            sales: any;
            revenue: any;
        };
        pendingPayments: {
            count: any;
            amount: any;
        };
    }>;
    private generateBillNumber;
    private generateReturnNumber;
}
