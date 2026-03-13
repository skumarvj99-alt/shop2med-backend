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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_schema_1 = require("./schemas/order.schema");
const medicine_schema_1 = require("../medicines/schemas/medicine.schema");
const inventory_schema_1 = require("../inventory/schemas/inventory.schema");
const ocr_service_1 = require("./services/ocr.service");
const medicine_type_extractor_util_1 = require("../utils/medicine-type-extractor.util");
const globalFunction_util_1 = require("../utils/globalFunction.util");
let OrdersService = class OrdersService {
    constructor(orderModel, medicineModel, inventoryModel, ocrService) {
        this.orderModel = orderModel;
        this.medicineModel = medicineModel;
        this.inventoryModel = inventoryModel;
        this.ocrService = ocrService;
    }
    async create(createOrderDto, userId) {
        const orderNumber = await this.generateOrderNumber(userId);
        let subtotal = createOrderDto.subtotal;
        if (!subtotal && createOrderDto.items.length > 0) {
            subtotal = createOrderDto.items.reduce((sum, item) => {
                return sum + (item.unitPrice || 0) * item.quantity;
            }, 0);
        }
        const tax = createOrderDto.tax || 0;
        const discount = createOrderDto.discount || 0;
        const shippingCharges = createOrderDto.shippingCharges || 0;
        const totalAmount = (subtotal || 0) - discount + tax + shippingCharges;
        const processedItems = await Promise.all(createOrderDto.items.map(async (item) => {
            let medicineName = null;
            let isMatched = false;
            if (item.medicineName) {
                medicineName = item.medicineName;
                isMatched = true;
            }
            else {
                const foundMedicine = await this.medicineModel.findOne({
                    name: new RegExp(item.medicineName, 'i'),
                    isActive: true,
                });
                if (foundMedicine) {
                    medicineName = foundMedicine.name;
                    isMatched = true;
                }
            }
            return {
                ...item,
                medicineName,
                isMatched,
                isVerified: true,
                totalPrice: item.unitPrice
                    ? item.unitPrice * item.quantity
                    : undefined,
            };
        }));
        const order = new this.orderModel({
            orderNumber,
            user: userId,
            orderDate: createOrderDto.orderDate || new Date(),
            supplierName: createOrderDto.supplierName,
            supplierPhone: createOrderDto.supplierPhone,
            supplierEmail: createOrderDto.supplierEmail,
            supplierAddress: createOrderDto.supplierAddress,
            supplierInvoiceNumber: createOrderDto.supplierInvoiceNumber,
            supplierInvoiceDate: createOrderDto.supplierInvoiceDate,
            items: processedItems,
            subtotal,
            tax,
            discount,
            shippingCharges,
            totalAmount,
            expectedDeliveryDate: createOrderDto.expectedDeliveryDate,
            notes: createOrderDto.notes,
            status: 'draft',
            ocrStatus: 'completed',
        });
        await order.save();
        return order.populate('items.medicineName');
    }
    async createFromImage(imageBuffer, userId, supplierName, notes) {
        const orderNumber = await this.generateOrderNumber(userId);
        const order = new this.orderModel({
            orderNumber,
            user: userId,
            orderDate: new Date(),
            supplierName,
            notes,
            items: [],
            status: 'draft',
            ocrStatus: 'processing',
        });
        await order.save();
        this.processOCR(order._id.toString(), imageBuffer, userId).catch((error) => {
            console.error('OCR processing failed:', error);
        });
        return order;
    }
    async createFromPdf(pdfBuffer, userId, supplierName, notes) {
        const orderNumber = await this.generateOrderNumber(userId);
        const order = new this.orderModel({
            orderNumber,
            user: userId,
            orderDate: new Date(),
            supplierName,
            notes,
            items: [],
            status: 'draft',
            ocrStatus: 'processing',
        });
        await order.save();
        this.processPdfExtraction(order._id.toString(), pdfBuffer, userId).catch((error) => console.error('PDF extraction failed:', error));
        return order;
    }
    async processPdfExtraction(orderId, pdfBuffer, userId) {
        try {
            const pdfResult = await this.ocrService.processPdf(pdfBuffer);
            const matchedItems = await Promise.all(pdfResult.items.map(async (item) => {
                const sanitizedName = item.medicineName
                    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                    .replace(/\s+/g, '\\s+')
                    .trim();
                let medicine = null;
                if (sanitizedName && sanitizedName.length > 2) {
                    try {
                        medicine = await this.medicineModel.findOne({
                            $or: [
                                { name: new RegExp(sanitizedName, 'i') },
                                { genericName: new RegExp(sanitizedName, 'i') },
                            ],
                            isActive: true,
                        });
                    }
                    catch (regexError) {
                        console.warn('Regex match failed for:', item.medicineName);
                    }
                }
                return {
                    medicine: medicine?._id,
                    medicineName: item.medicineName,
                    packing: item.packing,
                    packSize: item.packSize,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    mrp: item.mrp,
                    cgst: item.cgst,
                    sgst: item.sgst,
                    totalPrice: item.totalPrice,
                    isVerified: false,
                    isMatched: !!medicine,
                };
            }));
            const subtotal = matchedItems.reduce((sum, item) => sum + (item.totalPrice || (item.unitPrice || 0) * item.quantity || 0), 0);
            await this.orderModel.findByIdAndUpdate(orderId, {
                items: matchedItems,
                subtotal,
                totalAmount: subtotal,
                ocrStatus: 'completed',
                ocrRawData: pdfResult,
                ocrProcessedAt: new Date(),
                ...(pdfResult.supplierInfo?.name && { supplierName: pdfResult.supplierInfo.name }),
                ...(pdfResult.supplierInfo?.phone && { supplierPhone: pdfResult.supplierInfo.phone }),
                ...(pdfResult.supplierInfo?.invoiceNumber && {
                    supplierInvoiceNumber: pdfResult.supplierInfo.invoiceNumber,
                }),
            });
        }
        catch (error) {
            console.error('PDF extraction failed for order:', orderId, error);
            await this.orderModel.findByIdAndUpdate(orderId, {
                ocrStatus: 'failed',
                ocrError: error.message || 'PDF extraction error',
                ocrProcessedAt: new Date(),
            });
        }
    }
    async processOCR(orderId, imageBuffer, userId) {
        try {
            const ocrResult = await this.ocrService.processImage(imageBuffer);
            const matchedItems = await Promise.all(ocrResult.items.map(async (item) => {
                const sanitizedName = item.medicineName
                    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                    .replace(/\s+/g, '\\s+')
                    .trim();
                let medicine = null;
                if (sanitizedName && sanitizedName.length > 2) {
                    try {
                        medicine = await this.medicineModel.findOne({
                            $or: [
                                { name: new RegExp(sanitizedName, 'i') },
                                { genericName: new RegExp(sanitizedName, 'i') },
                            ],
                            isActive: true,
                        });
                    }
                    catch (regexError) {
                        console.warn('Regex matching failed for medicine:', item.medicineName, regexError.message);
                    }
                }
                return {
                    medicine: medicine?._id,
                    medicineName: item.medicineName,
                    packing: item.packing,
                    packSize: item.packSize,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    mrp: item.mrp,
                    cgst: item.cgst,
                    sgst: item.sgst,
                    totalPrice: item.totalPrice,
                    isVerified: false,
                    isMatched: !!medicine,
                };
            }));
            const subtotal = matchedItems.reduce((sum, item) => {
                return sum + (item.totalPrice || item.unitPrice * item.quantity || 0);
            }, 0);
            await this.orderModel.findByIdAndUpdate(orderId, {
                items: matchedItems,
                subtotal,
                totalAmount: subtotal,
                ocrStatus: 'completed',
                ocrRawData: ocrResult,
                ocrProcessedAt: new Date(),
                supplierName: ocrResult.supplierInfo?.name || undefined,
                supplierPhone: ocrResult.supplierInfo?.phone || undefined,
                supplierInvoiceNumber: ocrResult.supplierInfo?.invoiceNumber || undefined,
            });
        }
        catch (error) {
            console.error('OCR processing failed for order:', orderId, error);
            await this.orderModel.findByIdAndUpdate(orderId, {
                ocrStatus: 'failed',
                ocrError: error.message || 'Unknown OCR processing error',
                ocrProcessedAt: new Date(),
            });
        }
    }
    async findAll(userId, page = 1, limit = 50) {
        const safePage = page || 1;
        const safeLimit = limit || 50;
        const skip = Math.max(0, (safePage - 1) * safeLimit);
        const [orders, total] = await Promise.all([
            this.orderModel
                .find({ user: userId, isActive: true })
                .populate('items.medicine')
                .sort({ orderDate: -1 })
                .skip(skip)
                .limit(safeLimit)
                .exec(),
            this.orderModel.countDocuments({ user: userId, isActive: true }),
        ]);
        return {
            data: orders,
            pagination: {
                page: safePage,
                limit: safeLimit,
                total,
                totalPages: Math.ceil(total / safeLimit),
            },
        };
    }
    async search(userId, searchDto) {
        const { orderNumber, supplierName, status, ocrStatus, dateFrom, dateTo, page = 1, limit = 20, } = searchDto;
        const filter = { user: userId, isActive: true };
        if (orderNumber) {
            filter.orderNumber = new RegExp(orderNumber, 'i');
        }
        if (supplierName) {
            filter.supplierName = new RegExp(supplierName, 'i');
        }
        if (status) {
            filter.status = status;
        }
        if (ocrStatus) {
            filter.ocrStatus = ocrStatus;
        }
        if (dateFrom || dateTo) {
            filter.orderDate = {};
            if (dateFrom)
                filter.orderDate.$gte = dateFrom;
            if (dateTo) {
                const endDate = new Date(dateTo);
                endDate.setHours(23, 59, 59, 999);
                filter.orderDate.$lte = endDate;
            }
        }
        const safePage = page || 1;
        const safeLimit = limit || 20;
        const skip = Math.max(0, (safePage - 1) * safeLimit);
        const [orders, total] = await Promise.all([
            this.orderModel
                .find(filter)
                .populate('items.medicine')
                .sort({ orderDate: -1 })
                .skip(skip)
                .limit(safeLimit)
                .exec(),
            this.orderModel.countDocuments(filter),
        ]);
        return {
            data: orders,
            pagination: {
                page: safePage,
                limit: safeLimit,
                total,
                totalPages: Math.ceil(total / safeLimit),
            },
        };
    }
    async findOne(id, userId) {
        const order = await this.orderModel
            .findOne({ _id: id, user: userId })
            .populate('items.medicine')
            .exec();
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    async update(id, userId, updateDto) {
        const order = await this.orderModel
            .findOneAndUpdate({ _id: id, user: userId }, updateDto, { new: true })
            .populate('items.medicine')
            .exec();
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    async updateStatus(id, userId, status) {
        const validStatuses = [
            'draft',
            'pending',
            'confirmed',
            'partially_received',
            'received',
            'cancelled',
        ];
        if (!validStatuses.includes(status)) {
            throw new common_1.BadRequestException(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
        }
        const order = await this.orderModel
            .findOneAndUpdate({ _id: id, user: userId }, {
            status,
            ...(status === 'received' && { receivedDate: new Date() }),
        }, { new: true })
            .populate('items.medicine')
            .exec();
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (status === 'received') {
            await this.updateInventoryFromOrder(order, userId);
        }
        return order;
    }
    async verifyItem(orderId, itemIndex, userId, updates) {
        const order = await this.orderModel.findOne({ _id: orderId, user: userId });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (itemIndex < 0 || itemIndex >= order.items.length) {
            throw new common_1.BadRequestException('Invalid item index');
        }
        Object.assign(order.items[itemIndex], {
            ...updates,
            isVerified: true,
        });
        await order.save();
        return order.populate('items.medicine');
    }
    async updateWithItems(id, userId, updateData) {
        const order = await this.orderModel.findOne({ _id: id, user: userId });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        const editableStatuses = ['draft', 'pending', 'confirmed'];
        if (!editableStatuses.includes(order.status)) {
            throw new common_1.BadRequestException(`Cannot edit order with status: ${order.status}`);
        }
        const processedItems = await Promise.all(updateData.items.map(async (item) => {
            let medicine = null;
            if (item.medicine) {
                medicine = await this.medicineModel.findById(item.medicine);
            }
            return {
                medicine: medicine?._id,
                medicineName: item.medicineName,
                manufacturer: item.manufacturer,
                dosageForm: item.dosageForm,
                strength: item.strength,
                packing: item.packing,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
                isVerified: true,
                isMatched: !!medicine,
            };
        }));
        order.supplierName = updateData.supplierName || order.supplierName;
        order.supplierPhone = updateData.supplierPhone || order.supplierPhone;
        order.supplierEmail = updateData.supplierEmail || order.supplierEmail;
        order.supplierInvoiceNumber = updateData.supplierInvoiceNumber || order.supplierInvoiceNumber;
        order.items = processedItems;
        order.subtotal = updateData.subtotal;
        order.discount = updateData.discount;
        order.totalAmount = updateData.totalAmount;
        order.notes = updateData.notes || order.notes;
        await order.save();
        return order.populate('items.medicine');
    }
    async remove(id, userId) {
        const result = await this.orderModel
            .findOneAndUpdate({ _id: id, user: userId }, { isActive: false }, { new: true })
            .exec();
        if (!result) {
            throw new common_1.NotFoundException('Order not found');
        }
    }
    async getOrdersSummary(userId) {
        const [totalOrders, draftOrders, pendingOrders, receivedOrders, pendingOCR,] = await Promise.all([
            this.orderModel.countDocuments({ user: userId, isActive: true }),
            this.orderModel.countDocuments({
                user: userId,
                status: 'draft',
                isActive: true,
            }),
            this.orderModel.countDocuments({
                user: userId,
                status: 'pending',
                isActive: true,
            }),
            this.orderModel.countDocuments({
                user: userId,
                status: 'received',
                isActive: true,
            }),
            this.orderModel.countDocuments({
                user: userId,
                ocrStatus: 'processing',
                isActive: true,
            }),
        ]);
        return {
            totalOrders,
            byStatus: {
                draft: draftOrders,
                pending: pendingOrders,
                received: receivedOrders,
            },
            pendingOCR,
        };
    }
    async updateInventoryFromOrder(order, userId) {
        try {
            const updates = [];
            for (const item of order.items) {
                const medicineName = item.medicineName;
                if (!medicineName) {
                    continue;
                }
                let medicineRecord = null;
                let isMatched = item.isMatched || false;
                const extracted = medicine_type_extractor_util_1.MedicineTypeExtractor.extractAndClean(medicineName, item.packing);
                const cleanedName = (0, globalFunction_util_1.capitalizeFirstLetter)(extracted.cleanedName.trim());
                medicineRecord = await this.medicineModel.findOne({
                    name: { $regex: `^${cleanedName}$`, $options: 'i' },
                    isActive: true,
                });
                console.log('medicineRecord', medicineRecord, medicineName);
                if (!medicineRecord) {
                    medicineRecord = await this.medicineModel.create({
                        name: cleanedName,
                        genericName: cleanedName,
                        dosageForm: extracted.dosageForm,
                        manufacturer: 'Unknown',
                        strength: item.strength || '',
                        category: 'General',
                        description: `Auto-created from order: ${order.orderNumber}`,
                        isActive: true,
                    });
                    isMatched = true;
                }
                else {
                    isMatched = true;
                }
                let existingInventory = await this.inventoryModel.findOne({
                    medicineName: medicineRecord.name,
                    user: new mongoose_2.Types.ObjectId(userId),
                    isActive: true,
                });
                if (!existingInventory && medicineRecord) {
                    const duplicateRecords = await this.inventoryModel.find({
                        medicineName: medicineRecord.name,
                        user: new mongoose_2.Types.ObjectId(userId),
                        isActive: true,
                    });
                    if (duplicateRecords.length > 1) {
                        const primaryRecord = duplicateRecords[0];
                        const totalQuantity = duplicateRecords.reduce((sum, record) => sum + record.quantity, 0);
                        await this.inventoryModel.updateOne({ _id: primaryRecord._id }, {
                            $set: {
                                quantity: totalQuantity,
                                updatedAt: new Date(),
                                purchaseDate: new Date(),
                            }
                        });
                        await this.inventoryModel.deleteMany({
                            _id: { $in: duplicateRecords.slice(1).map(r => r._id) }
                        });
                        existingInventory = primaryRecord;
                    }
                }
                if (existingInventory) {
                    updates.push(this.inventoryModel.updateOne({ _id: existingInventory._id, user: new mongoose_2.Types.ObjectId(userId) }, {
                        $inc: { quantity: item.quantity },
                        $set: {
                            updatedAt: new Date(),
                            ...(item.unitPrice && { purchasePrice: item.unitPrice }),
                            purchaseDate: new Date(),
                        }
                    }));
                }
                else {
                    const newInventory = {
                        medicine: medicineRecord._id,
                        medicineName: medicineRecord.name,
                        user: new mongoose_2.Types.ObjectId(userId),
                        batchNumber: `BATCH-${order.orderNumber}-${Date.now()}`,
                        quantity: item.quantity,
                        purchasePrice: item.unitPrice || 0,
                        sellingPrice: item.mrp || item.unitPrice || 0,
                        mrp: item.mrp || 0,
                        manufactureDate: new Date(),
                        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                        reorderLevel: 10,
                        status: 'active',
                        isActive: true,
                        purchaseDate: new Date(),
                        supplier: order.supplierName,
                        supplierInvoiceNumber: order.supplierInvoiceNumber,
                    };
                    updates.push(this.inventoryModel.create(newInventory));
                }
            }
            if (updates.length > 0) {
                await Promise.all(updates);
            }
        }
        catch (error) {
            console.error('Error updating inventory from order:', error);
        }
    }
    async generateOrderNumber(userId) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const lastOrder = await this.orderModel
            .findOne({
            user: userId,
            orderNumber: new RegExp(`^ORD-${year}${month}`),
        })
            .sort({ orderNumber: -1 })
            .exec();
        let sequence = 1;
        if (lastOrder) {
            const lastSequence = parseInt(lastOrder.orderNumber.split('-').pop() || '0');
            sequence = lastSequence + 1;
        }
        return `ORD-${year}${month}-${String(sequence).padStart(4, '0')}`;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __param(1, (0, mongoose_1.InjectModel)(medicine_schema_1.Medicine.name)),
    __param(2, (0, mongoose_1.InjectModel)(inventory_schema_1.Inventory.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        ocr_service_1.OcrService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map