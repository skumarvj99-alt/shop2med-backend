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
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const sale_schema_1 = require("./schemas/sale.schema");
const sale_return_schema_1 = require("./schemas/sale-return.schema");
const inventory_schema_1 = require("../inventory/schemas/inventory.schema");
const activity_log_service_1 = require("../users/activity-log.service");
let SalesService = class SalesService {
    constructor(saleModel, saleReturnModel, inventoryModel, activityLogService) {
        this.saleModel = saleModel;
        this.saleReturnModel = saleReturnModel;
        this.inventoryModel = inventoryModel;
        this.activityLogService = activityLogService;
    }
    async create(createSaleDto, userId) {
        const billNumber = await this.generateBillNumber(userId);
        const processedItems = [];
        let subtotal = 0;
        let totalDiscount = 0;
        let totalTax = 0;
        for (const item of createSaleDto.items) {
            const inventoryObjectId = new mongoose_2.Types.ObjectId(item.inventory);
            const userObjectId = new mongoose_2.Types.ObjectId(userId);
            const inventory = await this.inventoryModel.findOne({
                _id: inventoryObjectId,
                user: userObjectId,
                isActive: true,
            }).populate('medicine');
            if (!inventory) {
                throw new common_1.NotFoundException(`Inventory item ${item.inventory} not found`);
            }
            const availableQty = inventory.quantity - inventory.soldQuantity - inventory.damagedQuantity;
            if (availableQty < item.quantity) {
                throw new common_1.BadRequestException(`Insufficient stock for ${inventory.medicine['name']}. Available: ${availableQty}`);
            }
            if (inventory.get('isExpired')) {
                throw new common_1.BadRequestException(`Cannot sell expired medicine: ${inventory.medicine['name']}`);
            }
            const itemSubtotal = item.unitPrice * item.quantity;
            const discountPercent = item.discountPercent || 0;
            const discountAmount = (itemSubtotal * discountPercent) / 100;
            const amountAfterDiscount = itemSubtotal - discountAmount;
            const taxPercent = item.taxPercent || 0;
            const taxAmount = (amountAfterDiscount * taxPercent) / 100;
            const itemTotal = amountAfterDiscount + taxAmount;
            processedItems.push({
                medicine: item.medicine,
                inventory: item.inventory,
                medicineName: inventory.medicine['name'],
                batchNumber: inventory.batchNumber,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                mrp: inventory.mrp,
                discountPercent,
                discountAmount,
                taxPercent,
                taxAmount,
                totalAmount: itemTotal,
            });
            subtotal += itemSubtotal;
            totalDiscount += discountAmount;
            totalTax += taxAmount;
            inventory.soldQuantity += item.quantity;
            await inventory.save();
        }
        const shippingCharges = createSaleDto.shippingCharges || 0;
        const otherCharges = createSaleDto.otherCharges || 0;
        const totalAmount = subtotal - totalDiscount + totalTax + shippingCharges + otherCharges;
        const balanceDue = totalAmount - createSaleDto.amountPaid;
        let paymentStatus = 'completed';
        if (balanceDue > 0) {
            paymentStatus = createSaleDto.amountPaid > 0 ? 'partial' : 'pending';
        }
        const sale = new this.saleModel({
            billNumber,
            user: new mongoose_2.Types.ObjectId(userId),
            saleDate: createSaleDto.saleDate || new Date(),
            customerName: createSaleDto.customerName,
            customerPhone: createSaleDto.customerPhone,
            customerEmail: createSaleDto.customerEmail,
            customerAddress: createSaleDto.customerAddress,
            doctorName: createSaleDto.doctorName,
            prescriptionNumber: createSaleDto.prescriptionNumber,
            items: processedItems,
            subtotal,
            totalDiscount,
            totalTax,
            shippingCharges,
            otherCharges,
            totalAmount,
            amountPaid: createSaleDto.amountPaid,
            balanceDue,
            paymentMethod: createSaleDto.paymentMethod,
            paymentStatus,
            transactionId: createSaleDto.transactionId,
            notes: createSaleDto.notes,
            status: 'completed',
        });
        const savedSale = await sale.save();
        await this.activityLogService.logActivity(userId, 'sale_create', `Sale created: ${billNumber} for ${createSaleDto.customerName}`, {
            billNumber,
            customerName: createSaleDto.customerName,
            totalAmount,
            paymentMethod: createSaleDto.paymentMethod,
            itemCount: processedItems.length,
        });
        return savedSale.populate('items.medicine');
    }
    async findAll(userId, page = 1, limit = 50) {
        const safePage = page || 1;
        const safeLimit = limit || 50;
        const skip = Math.max(0, (safePage - 1) * safeLimit);
        const userObjectId = new mongoose_2.Types.ObjectId(userId);
        const [sales, total] = await Promise.all([
            this.saleModel
                .find({ user: userObjectId, isActive: true })
                .populate('items.medicine')
                .sort({ saleDate: -1 })
                .skip(skip)
                .limit(safeLimit)
                .exec(),
            this.saleModel.countDocuments({ user: userObjectId, isActive: true }),
        ]);
        return {
            data: sales,
            pagination: {
                page: safePage,
                limit: safeLimit,
                total,
                totalPages: Math.ceil(total / safeLimit),
            },
        };
    }
    async search(userId, searchDto) {
        const { billNumber, customerName, customerPhone, status, paymentStatus, paymentMethod, dateFrom, dateTo, page = 1, limit = 20, } = searchDto;
        const filter = { user: new mongoose_2.Types.ObjectId(userId), isActive: true };
        if (billNumber) {
            filter.billNumber = new RegExp(billNumber, 'i');
        }
        if (customerName) {
            filter.customerName = new RegExp(customerName, 'i');
        }
        if (customerPhone) {
            filter.customerPhone = new RegExp(customerPhone, 'i');
        }
        if (status) {
            filter.status = status;
        }
        if (paymentStatus) {
            filter.paymentStatus = paymentStatus;
        }
        if (paymentMethod) {
            filter.paymentMethod = paymentMethod;
        }
        if (dateFrom || dateTo) {
            filter.saleDate = {};
            if (dateFrom)
                filter.saleDate.$gte = dateFrom;
            if (dateTo) {
                const endDate = new Date(dateTo);
                endDate.setHours(23, 59, 59, 999);
                filter.saleDate.$lte = endDate;
            }
        }
        const safePage = page || 1;
        const safeLimit = limit || 20;
        const skip = Math.max(0, (safePage - 1) * safeLimit);
        const [sales, total] = await Promise.all([
            this.saleModel
                .find(filter)
                .populate('items.medicine')
                .sort({ saleDate: -1 })
                .skip(skip)
                .limit(safeLimit)
                .exec(),
            this.saleModel.countDocuments(filter),
        ]);
        return {
            data: sales,
            pagination: {
                page: safePage,
                limit: safeLimit,
                total,
                totalPages: Math.ceil(total / safeLimit),
            },
        };
    }
    async findOne(id, userId) {
        const sale = await this.saleModel
            .findOne({ _id: id, user: new mongoose_2.Types.ObjectId(userId) })
            .populate('items.medicine')
            .exec();
        if (!sale) {
            throw new common_1.NotFoundException('Sale not found');
        }
        return sale;
    }
    async findByBillNumber(billNumber, userId) {
        const sale = await this.saleModel
            .findOne({ billNumber, user: new mongoose_2.Types.ObjectId(userId) })
            .populate('items.medicine')
            .exec();
        if (!sale) {
            throw new common_1.NotFoundException('Sale not found');
        }
        return sale;
    }
    async cancelSale(id, userId, reason) {
        const sale = await this.saleModel.findOne({ _id: id, user: new mongoose_2.Types.ObjectId(userId) });
        if (!sale) {
            throw new common_1.NotFoundException('Sale not found');
        }
        if (sale.status === 'cancelled') {
            throw new common_1.BadRequestException('Sale is already cancelled');
        }
        for (const item of sale.items) {
            await this.inventoryModel.findByIdAndUpdate(item.inventory, {
                $inc: { soldQuantity: -item.quantity },
            });
        }
        sale.status = 'cancelled';
        sale.paymentStatus = 'cancelled';
        sale.cancellationReason = reason;
        sale.cancelledAt = new Date();
        await sale.save();
        return sale.populate('items.medicine');
    }
    async createReturn(createReturnDto, userId) {
        const originalSale = await this.saleModel.findOne({
            _id: createReturnDto.originalSale,
            user: new mongoose_2.Types.ObjectId(userId),
        });
        if (!originalSale) {
            throw new common_1.NotFoundException('Original sale not found');
        }
        if (originalSale.status === 'cancelled') {
            throw new common_1.BadRequestException('Cannot return items from cancelled sale');
        }
        const returnNumber = await this.generateReturnNumber(userId);
        const processedItems = [];
        let totalAmount = 0;
        for (const item of createReturnDto.items) {
            const saleItem = originalSale.items.find(si => si.medicine.toString() === item.medicine &&
                si.inventory.toString() === item.inventory);
            if (!saleItem) {
                throw new common_1.BadRequestException(`Item not found in original sale`);
            }
            if (item.quantity > saleItem.quantity) {
                throw new common_1.BadRequestException(`Return quantity exceeds sold quantity for medicine`);
            }
            const inventory = await this.inventoryModel.findById(item.inventory);
            if (inventory) {
                inventory.soldQuantity -= item.quantity;
                await inventory.save();
            }
            const itemTotal = saleItem.unitPrice * item.quantity;
            processedItems.push({
                medicine: item.medicine,
                inventory: item.inventory,
                quantity: item.quantity,
                unitPrice: saleItem.unitPrice,
                totalAmount: itemTotal,
                reason: item.reason,
            });
            totalAmount += itemTotal;
        }
        const returnType = processedItems.length === originalSale.items.length ? 'full' : 'partial';
        const saleReturn = new this.saleReturnModel({
            returnNumber,
            originalSale: createReturnDto.originalSale,
            user: new mongoose_2.Types.ObjectId(userId),
            returnDate: new Date(),
            items: processedItems,
            totalAmount,
            returnType,
            reason: createReturnDto.reason,
            notes: createReturnDto.notes,
            status: 'completed',
        });
        await saleReturn.save();
        if (returnType === 'full') {
            originalSale.status = 'returned';
            originalSale.paymentStatus = 'refunded';
        }
        await originalSale.save();
        return saleReturn.populate('items.medicine');
    }
    async getSalesAnalytics(userId, dateFrom, dateTo) {
        const filter = {
            user: new mongoose_2.Types.ObjectId(userId),
            isActive: true,
            status: 'completed',
            saleDate: { $gte: dateFrom, $lte: dateTo },
        };
        const [totalSales, totalRevenue, paymentMethods, topMedicines, dailySales,] = await Promise.all([
            this.saleModel.countDocuments(filter),
            this.saleModel.aggregate([
                { $match: filter },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } },
            ]),
            this.saleModel.aggregate([
                { $match: filter },
                { $group: { _id: '$paymentMethod', count: { $sum: 1 }, amount: { $sum: '$totalAmount' } } },
            ]),
            this.saleModel.aggregate([
                { $match: filter },
                { $unwind: '$items' },
                {
                    $group: {
                        _id: '$items.medicineName',
                        quantity: { $sum: '$items.quantity' },
                        revenue: { $sum: '$items.totalAmount' },
                    },
                },
                { $sort: { quantity: -1 } },
                { $limit: 10 },
            ]),
            this.saleModel.aggregate([
                { $match: filter },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$saleDate' } },
                        sales: { $sum: 1 },
                        revenue: { $sum: '$totalAmount' },
                    },
                },
                { $sort: { _id: 1 } },
            ]),
        ]);
        return {
            summary: {
                totalSales,
                totalRevenue: totalRevenue[0]?.total || 0,
                averageSaleValue: totalSales > 0 ? (totalRevenue[0]?.total || 0) / totalSales : 0,
            },
            paymentMethods,
            topMedicines,
            dailySales,
        };
    }
    async getSalesSummary(userId) {
        const today = new Date();
        const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const thisYear = new Date(today.getFullYear(), 0, 1);
        const [todaySales, topSellingToday, monthSales, yearSales, pendingPayments] = await Promise.all([
            this.saleModel.aggregate([
                {
                    $match: {
                        user: new mongoose_2.Types.ObjectId(userId),
                        isActive: true,
                        status: 'completed',
                        saleDate: { $gte: today },
                    },
                },
                { $group: { _id: null, count: { $sum: 1 }, total: { $sum: '$totalAmount' } } },
            ]),
            this.saleModel.aggregate([
                {
                    $match: {
                        user: new mongoose_2.Types.ObjectId(userId),
                        isActive: true,
                        status: 'completed',
                        saleDate: { $gte: today },
                    },
                },
                { $unwind: '$items' },
                { $group: { _id: '$items.medicine', count: { $sum: '$items.quantity' } } },
                { $sort: { count: -1 } },
                { $limit: 5 },
                { $lookup: { from: 'medicines', localField: '_id', foreignField: '_id', as: 'medicine' } },
            ]),
            this.saleModel.aggregate([
                {
                    $match: {
                        user: new mongoose_2.Types.ObjectId(userId),
                        isActive: true,
                        status: 'completed',
                        saleDate: { $gte: thisMonth },
                    },
                },
                { $group: { _id: null, count: { $sum: 1 }, total: { $sum: '$totalAmount' } } },
            ]),
            this.saleModel.aggregate([
                {
                    $match: {
                        user: new mongoose_2.Types.ObjectId(userId),
                        isActive: true,
                        status: 'completed',
                        saleDate: { $gte: thisYear },
                    },
                },
                { $group: { _id: null, count: { $sum: 1 }, total: { $sum: '$totalAmount' } } },
            ]),
            this.saleModel.aggregate([
                {
                    $match: {
                        user: new mongoose_2.Types.ObjectId(userId),
                        isActive: true,
                        paymentStatus: { $in: ['pending', 'partial'] },
                    },
                },
                { $group: { _id: null, count: { $sum: 1 }, total: { $sum: '$balanceDue' } } },
            ]),
        ]);
        return {
            today: {
                sales: todaySales[0]?.count || 0,
                revenue: todaySales[0]?.total || 0,
            },
            thisMonth: {
                sales: monthSales[0]?.count || 0,
                revenue: monthSales[0]?.total || 0,
            },
            thisYear: {
                sales: yearSales[0]?.count || 0,
                revenue: yearSales[0]?.total || 0,
            },
            pendingPayments: {
                count: pendingPayments[0]?.count || 0,
                amount: pendingPayments[0]?.total || 0,
            },
        };
    }
    async generateBillNumber(userId) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const existingBills = await this.saleModel
            .find({
            user: new mongoose_2.Types.ObjectId(userId),
            billNumber: new RegExp(`^BILL-${year}${month}-`),
        })
            .sort({ billNumber: -1 })
            .limit(10)
            .exec();
        const existingSequences = new Set();
        existingBills.forEach(bill => {
            const parts = bill.billNumber.split('-');
            if (parts.length === 3) {
                const sequence = parseInt(parts[2]);
                if (!isNaN(sequence)) {
                    existingSequences.add(sequence);
                }
            }
        });
        let sequence = 1;
        while (existingSequences.has(sequence)) {
            sequence++;
        }
        const newBillNumber = `BILL-${year}${month}-${String(sequence).padStart(4, '0')}`;
        const finalCheck = await this.saleModel.findOne({
            user: new mongoose_2.Types.ObjectId(userId),
            billNumber: newBillNumber
        }).exec();
        if (finalCheck) {
            const timestamp = Date.now();
            return `BILL-${year}${month}-${String(timestamp).slice(-4)}`;
        }
        return newBillNumber;
    }
    async generateReturnNumber(userId) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const lastReturn = await this.saleReturnModel
            .findOne({
            user: new mongoose_2.Types.ObjectId(userId),
            returnNumber: new RegExp(`^RET-${year}${month}`),
        })
            .sort({ returnNumber: -1 })
            .exec();
        let sequence = 1;
        if (lastReturn) {
            const lastSequence = parseInt(lastReturn.returnNumber.split('-').pop() || '0');
            sequence = lastSequence + 1;
        }
        return `RET-${year}${month}-${String(sequence).padStart(4, '0')}`;
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(sale_schema_1.Sale.name)),
    __param(1, (0, mongoose_1.InjectModel)(sale_return_schema_1.SaleReturn.name)),
    __param(2, (0, mongoose_1.InjectModel)(inventory_schema_1.Inventory.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        activity_log_service_1.ActivityLogService])
], SalesService);
//# sourceMappingURL=sales.service.js.map