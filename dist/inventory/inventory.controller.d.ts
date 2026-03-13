import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { SearchInventoryDto } from './dto/search-inventory.dto';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    create(createInventoryDto: CreateInventoryDto, userId: string): Promise<import("./schemas/inventory.schema").Inventory>;
    findAll(userId: string, page?: number, limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/inventory.schema").InventoryDocument, {}, {}> & import("./schemas/inventory.schema").Inventory & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    search(userId: string, searchDto: SearchInventoryDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/inventory.schema").InventoryDocument, {}, {}> & import("./schemas/inventory.schema").Inventory & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    getLowStockAlerts(userId: string): Promise<any[]>;
    getExpiryAlerts(userId: string, days?: number): Promise<any[]>;
    getExpiredItems(userId: string): Promise<any[]>;
    getOutOfStockItems(userId: string): Promise<any[]>;
    getStockSummary(userId: string): Promise<{
        totalItems: number;
        alerts: {
            lowStock: number;
            nearExpiry: number;
            expired: number;
            outOfStock: number;
        };
        totalInventoryValue: any;
    }>;
    findByMedicine(medicineId: string, userId: string): Promise<import("./schemas/inventory.schema").Inventory[]>;
    findOne(id: string, userId: string): Promise<import("./schemas/inventory.schema").Inventory>;
    getTransactionHistory(id: string, userId: string, page?: number, limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/stock-transaction.schema").StockTransactionDocument, {}, {}> & import("./schemas/stock-transaction.schema").StockTransaction & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    update(id: string, userId: string, updateInventoryDto: UpdateInventoryDto): Promise<import("./schemas/inventory.schema").Inventory>;
    adjustStock(id: string, userId: string, adjustStockDto: AdjustStockDto): Promise<import("./schemas/inventory.schema").Inventory>;
    remove(id: string, userId: string): Promise<void>;
}
