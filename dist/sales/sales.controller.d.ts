import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SearchSaleDto } from './dto/search-sale.dto';
import { CreateSaleReturnDto } from './dto/create-sale-return.dto';
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    create(createSaleDto: CreateSaleDto, userId: string): Promise<import("./schemas/sale.schema").Sale>;
    findAll(userId: string, page?: number, limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/sale.schema").SaleDocument, {}, {}> & import("./schemas/sale.schema").Sale & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
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
        data: (import("mongoose").Document<unknown, {}, import("./schemas/sale.schema").SaleDocument, {}, {}> & import("./schemas/sale.schema").Sale & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
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
    getSummary(userId: string): Promise<{
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
    getAnalytics(userId: string, dateFrom: Date, dateTo: Date): Promise<{
        summary: {
            totalSales: number;
            totalRevenue: any;
            averageSaleValue: number;
        };
        paymentMethods: any[];
        topMedicines: any[];
        dailySales: any[];
    }>;
    findByBillNumber(billNumber: string, userId: string): Promise<import("./schemas/sale.schema").Sale>;
    findOne(id: string, userId: string): Promise<import("./schemas/sale.schema").Sale>;
    cancelSale(id: string, userId: string, reason: string): Promise<import("./schemas/sale.schema").Sale>;
    createReturn(createReturnDto: CreateSaleReturnDto, userId: string): Promise<import("./schemas/sale-return.schema").SaleReturn>;
}
