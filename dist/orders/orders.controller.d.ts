import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { SearchOrderDto } from './dto/search-order.dto';
import { UploadOrderImageDto } from './dto/upload-order-image.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: CreateOrderDto, userId: string): Promise<import("./schemas/order.schema").Order>;
    uploadImage(file: Express.Multer.File, uploadDto: UploadOrderImageDto, userId: string): Promise<import("./schemas/order.schema").Order>;
    findAll(userId: string, page?: number, limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/order.schema").OrderDocument, {}, {}> & import("./schemas/order.schema").Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    search(userId: string, searchDto: SearchOrderDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/order.schema").OrderDocument, {}, {}> & import("./schemas/order.schema").Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
        totalOrders: number;
        byStatus: {
            draft: number;
            pending: number;
            received: number;
        };
        pendingOCR: number;
    }>;
    findOne(id: string, userId: string): Promise<import("./schemas/order.schema").Order>;
    update(id: string, userId: string, updateOrderDto: UpdateOrderDto): Promise<import("./schemas/order.schema").Order>;
    updateStatus(id: string, userId: string, status: string): Promise<import("./schemas/order.schema").Order>;
    verifyItem(id: string, itemIndex: number, userId: string, updates: any): Promise<import("./schemas/order.schema").Order>;
    updateWithItems(id: string, userId: string, updateData: any): Promise<import("./schemas/order.schema").Order>;
    remove(id: string, userId: string): Promise<void>;
}
