import { Model, Types } from 'mongoose';
import { Inventory, InventoryDocument } from './schemas/inventory.schema';
import { StockTransaction, StockTransactionDocument } from './schemas/stock-transaction.schema';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { SearchInventoryDto } from './dto/search-inventory.dto';
export declare class InventoryService {
    private inventoryModel;
    private transactionModel;
    constructor(inventoryModel: Model<InventoryDocument>, transactionModel: Model<StockTransactionDocument>);
    create(createInventoryDto: CreateInventoryDto, userId: string): Promise<Inventory>;
    findAll(userId: string, page?: number, limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, InventoryDocument, {}, {}> & Inventory & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    search(userId: string, searchDto: SearchInventoryDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, InventoryDocument, {}, {}> & Inventory & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    findOne(id: string, userId: string): Promise<Inventory>;
    findByMedicine(medicineId: string, userId: string): Promise<Inventory[]>;
    update(id: string, userId: string, updateDto: UpdateInventoryDto): Promise<Inventory>;
    adjustStock(id: string, userId: string, adjustDto: AdjustStockDto): Promise<Inventory>;
    remove(id: string, userId: string): Promise<void>;
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
    getTransactionHistory(inventoryId: string, userId: string, page?: number, limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, StockTransactionDocument, {}, {}> & StockTransaction & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    private recordTransaction;
}
