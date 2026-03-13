import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { MedicineDocument } from '../medicines/schemas/medicine.schema';
import { InventoryDocument } from '../inventory/schemas/inventory.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { SearchOrderDto } from './dto/search-order.dto';
import { OcrService } from './services/ocr.service';
export declare class OrdersService {
    private orderModel;
    private medicineModel;
    private inventoryModel;
    private ocrService;
    constructor(orderModel: Model<OrderDocument>, medicineModel: Model<MedicineDocument>, inventoryModel: Model<InventoryDocument>, ocrService: OcrService);
    create(createOrderDto: CreateOrderDto, userId: string): Promise<Order>;
    createFromImage(imageBuffer: Buffer, userId: string, supplierName?: string, notes?: string): Promise<Order>;
    createFromPdf(pdfBuffer: Buffer, userId: string, supplierName?: string, notes?: string): Promise<Order>;
    private processPdfExtraction;
    private processOCR;
    findAll(userId: string, page?: number, limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, OrderDocument, {}, {}> & Order & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    search(userId: string, searchDto: SearchOrderDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, OrderDocument, {}, {}> & Order & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    findOne(id: string, userId: string): Promise<Order>;
    update(id: string, userId: string, updateDto: UpdateOrderDto): Promise<Order>;
    updateStatus(id: string, userId: string, status: string): Promise<Order>;
    verifyItem(orderId: string, itemIndex: number, userId: string, updates: Partial<any>): Promise<Order>;
    updateWithItems(id: string, userId: string, updateData: any): Promise<Order>;
    remove(id: string, userId: string): Promise<void>;
    getOrdersSummary(userId: string): Promise<{
        totalOrders: number;
        byStatus: {
            draft: number;
            pending: number;
            received: number;
        };
        pendingOCR: number;
    }>;
    private updateInventoryFromOrder;
    private generateOrderNumber;
}
