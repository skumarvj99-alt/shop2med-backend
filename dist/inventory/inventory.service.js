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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const inventory_schema_1 = require("./schemas/inventory.schema");
const stock_transaction_schema_1 = require("./schemas/stock-transaction.schema");
let InventoryService = class InventoryService {
    constructor(inventoryModel, transactionModel) {
        this.inventoryModel = inventoryModel;
        this.transactionModel = transactionModel;
    }
    async create(createInventoryDto, userId) {
        const existingBatch = await this.inventoryModel.findOne({
            medicineName: createInventoryDto.medicineName,
            user: new mongoose_2.Types.ObjectId(userId),
        });
        if (existingBatch) {
            throw new common_1.ConflictException('Medicine already exists. Use update to add more stock.');
        }
        if (createInventoryDto.expiryDate <= new Date()) {
            throw new common_1.BadRequestException('Expiry date must be in the future');
        }
        if (createInventoryDto.manufactureDate > new Date()) {
            throw new common_1.BadRequestException('Manufacture date cannot be in the future');
        }
        if (createInventoryDto.manufactureDate >= createInventoryDto.expiryDate) {
            throw new common_1.BadRequestException('Manufacture date must be before expiry date');
        }
        const inventory = new this.inventoryModel({
            ...createInventoryDto,
            user: new mongoose_2.Types.ObjectId(userId),
        });
        await inventory.save();
        await this.recordTransaction({
            inventory: inventory._id,
            user: new mongoose_2.Types.ObjectId(userId),
            type: 'purchase',
            quantity: createInventoryDto.quantity,
            previousQuantity: 0,
            newQuantity: createInventoryDto.quantity,
            reason: 'Initial stock purchase',
            referenceNumber: createInventoryDto.supplierInvoiceNumber,
        });
        return inventory.populate('medicine');
    }
    async findAll(userId, page = 1, limit = 50) {
        const safePage = page || 1;
        const safeLimit = limit || 50;
        const skip = Math.max(0, (safePage - 1) * safeLimit);
        const [inventory, total] = await Promise.all([
            this.inventoryModel
                .find({ user: new mongoose_2.Types.ObjectId(userId), isActive: true })
                .populate('medicine')
                .sort({ expiryDate: 1, quantity: 1 })
                .skip(skip)
                .limit(safeLimit)
                .exec(),
            this.inventoryModel.countDocuments({ user: new mongoose_2.Types.ObjectId(userId), isActive: true }),
        ]);
        return {
            data: inventory,
            pagination: {
                page: safePage,
                limit: safeLimit,
                total,
                totalPages: Math.ceil(total / safeLimit),
            },
        };
    }
    async search(userId, searchDto) {
        const { query, status, supplier, expiryFrom, expiryTo, page = 1, limit = 20 } = searchDto;
        const userObjectId = new mongoose_2.Types.ObjectId(userId);
        const filter = { user: userObjectId, isActive: true };
        if (status) {
            filter.status = status;
        }
        if (supplier) {
            filter.supplier = new RegExp(supplier, 'i');
        }
        if (expiryFrom || expiryTo) {
            filter.expiryDate = {};
            if (expiryFrom)
                filter.expiryDate.$gte = expiryFrom;
            if (expiryTo)
                filter.expiryDate.$lte = expiryTo;
        }
        const safePage = page || 1;
        const safeLimit = limit || 20;
        const skip = Math.max(0, (safePage - 1) * safeLimit);
        let inventoryQuery = this.inventoryModel.find(filter);
        if (query) {
            inventoryQuery = inventoryQuery.populate({
                path: 'medicine',
                match: {
                    $or: [
                        { name: new RegExp(query, 'i') },
                        { genericName: new RegExp(query, 'i') },
                    ]
                }
            });
        }
        else {
            inventoryQuery = inventoryQuery.populate('medicine');
        }
        const [inventory, total] = await Promise.all([
            inventoryQuery
                .sort({ expiryDate: 1 })
                .skip(skip)
                .limit(safeLimit)
                .exec(),
            this.inventoryModel.countDocuments(filter),
        ]);
        const filteredInventory = inventory.filter(item => item.medicine !== null);
        return {
            data: filteredInventory,
            pagination: {
                page: safePage,
                limit: safeLimit,
                total: query ? filteredInventory.length : total,
                totalPages: Math.ceil((query ? filteredInventory.length : total) / safeLimit),
            },
        };
    }
    async findOne(id, userId) {
        const inventory = await this.inventoryModel
            .findOne({ _id: new mongoose_2.Types.ObjectId(id), user: new mongoose_2.Types.ObjectId(userId) })
            .populate('medicine')
            .exec();
        if (!inventory) {
            throw new common_1.NotFoundException('Inventory item not found');
        }
        return inventory;
    }
    async findByMedicine(medicineId, userId) {
        try {
            const userObjectId = new mongoose_2.Types.ObjectId(userId);
            const medicineObjectId = new mongoose_2.Types.ObjectId(medicineId);
            let inventory = await this.inventoryModel
                .find({
                medicine: medicineObjectId,
                user: userObjectId,
                isActive: true
            })
                .sort({ expiryDate: 1 })
                .exec();
            if (inventory.length === 0) {
                try {
                    inventory = await this.inventoryModel
                        .find({
                        medicineName: medicineId,
                        user: userObjectId,
                        isActive: true
                    })
                        .sort({ expiryDate: 1 })
                        .exec();
                }
                catch (error) {
                    console.error('Error finding medicine:', error);
                }
            }
            return inventory;
        }
        catch (error) {
            if (error.name === 'BSONTypeError' || error.message.includes('ObjectId')) {
                console.error('Invalid ObjectId provided:', { medicineId, userId, error: error.message });
                return [];
            }
            throw error;
        }
    }
    async update(id, userId, updateDto) {
        const inventory = await this.inventoryModel
            .findOneAndUpdate({ _id: id, user: userId }, updateDto, { new: true })
            .populate('medicine')
            .exec();
        if (!inventory) {
            throw new common_1.NotFoundException('Inventory item not found');
        }
        return inventory;
    }
    async adjustStock(id, userId, adjustDto) {
        const inventory = await this.inventoryModel.findOne({ _id: id, user: userId });
        if (!inventory) {
            throw new common_1.NotFoundException('Inventory item not found');
        }
        const previousQty = inventory.quantity;
        let newQty;
        switch (adjustDto.type) {
            case 'sale':
                if (inventory.soldQuantity + adjustDto.quantity > inventory.quantity) {
                    throw new common_1.BadRequestException('Cannot sell more than available quantity');
                }
                inventory.soldQuantity += adjustDto.quantity;
                newQty = inventory.quantity;
                break;
            case 'damage':
                if (inventory.damagedQuantity + adjustDto.quantity > inventory.quantity) {
                    throw new common_1.BadRequestException('Damaged quantity exceeds total quantity');
                }
                inventory.damagedQuantity += adjustDto.quantity;
                newQty = inventory.quantity;
                break;
            case 'return':
                inventory.soldQuantity -= adjustDto.quantity;
                if (inventory.soldQuantity < 0)
                    inventory.soldQuantity = 0;
                newQty = inventory.quantity;
                break;
            case 'adjustment':
                inventory.quantity += adjustDto.quantity;
                newQty = inventory.quantity;
                if (newQty < 0) {
                    throw new common_1.BadRequestException('Adjustment would result in negative quantity');
                }
                break;
            default:
                throw new common_1.BadRequestException('Invalid adjustment type');
        }
        await inventory.save();
        await this.recordTransaction({
            inventory: inventory._id,
            user: userId,
            type: adjustDto.type,
            quantity: adjustDto.quantity,
            previousQuantity: previousQty,
            newQuantity: newQty,
            reason: adjustDto.reason,
            referenceNumber: adjustDto.referenceNumber,
        });
        return inventory.populate('medicine');
    }
    async remove(id, userId) {
        const result = await this.inventoryModel
            .findOneAndUpdate({ _id: id, user: userId }, { isActive: false }, { new: true })
            .exec();
        if (!result) {
            throw new common_1.NotFoundException('Inventory item not found');
        }
    }
    async getLowStockAlerts(userId) {
        const inventory = await this.inventoryModel
            .find({
            user: userId,
            isActive: true,
            status: 'low_stock'
        })
            .populate('medicine')
            .sort({ quantity: 1 })
            .exec();
        return inventory.map(item => ({
            ...item.toObject(),
            availableQuantity: item.get('availableQuantity'),
            alertMessage: `Only ${item.get('availableQuantity')} units left (Reorder level: ${item.reorderLevel})`
        }));
    }
    async getExpiryAlerts(userId, days = 60) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + days);
        const inventory = await this.inventoryModel
            .find({
            user: userId,
            isActive: true,
            expiryDate: { $lte: futureDate, $gt: new Date() }
        })
            .populate('medicine')
            .sort({ expiryDate: 1 })
            .exec();
        return inventory.map(item => ({
            ...item.toObject(),
            daysUntilExpiry: item.get('daysUntilExpiry'),
            alertMessage: `Expires in ${item.get('daysUntilExpiry')} days`
        }));
    }
    async getExpiredItems(userId) {
        const inventory = await this.inventoryModel
            .find({
            user: userId,
            isActive: true,
            status: 'expired'
        })
            .populate('medicine')
            .sort({ expiryDate: 1 })
            .exec();
        return inventory;
    }
    async getOutOfStockItems(userId) {
        return this.inventoryModel
            .find({
            user: userId,
            isActive: true,
            status: 'out_of_stock'
        })
            .populate('medicine')
            .exec();
    }
    async getStockSummary(userId) {
        const [totalItems, lowStock, nearExpiry, expired, outOfStock, totalValue,] = await Promise.all([
            this.inventoryModel.countDocuments({ user: userId, isActive: true }),
            this.inventoryModel.countDocuments({ user: userId, isActive: true, status: 'low_stock' }),
            this.inventoryModel.countDocuments({ user: userId, isActive: true, status: 'near_expiry' }),
            this.inventoryModel.countDocuments({ user: userId, isActive: true, status: 'expired' }),
            this.inventoryModel.countDocuments({ user: userId, isActive: true, status: 'out_of_stock' }),
            this.inventoryModel.aggregate([
                { $match: { user: userId, isActive: true } },
                {
                    $project: {
                        value: {
                            $multiply: ['$quantity', '$purchasePrice']
                        }
                    }
                },
                { $group: { _id: null, total: { $sum: '$value' } } }
            ])
        ]);
        return {
            totalItems,
            alerts: {
                lowStock,
                nearExpiry,
                expired,
                outOfStock,
            },
            totalInventoryValue: totalValue[0]?.total || 0,
        };
    }
    async getTransactionHistory(inventoryId, userId, page = 1, limit = 50) {
        const inventory = await this.inventoryModel.findOne({
            _id: inventoryId,
            user: userId
        });
        if (!inventory) {
            throw new common_1.NotFoundException('Inventory item not found');
        }
        const safePage = page || 1;
        const safeLimit = limit || 50;
        const skip = Math.max(0, (safePage - 1) * safeLimit);
        const [transactions, total] = await Promise.all([
            this.transactionModel
                .find({ inventory: inventoryId })
                .sort({ transactionDate: -1 })
                .skip(skip)
                .limit(safeLimit)
                .exec(),
            this.transactionModel.countDocuments({ inventory: inventoryId }),
        ]);
        return {
            data: transactions,
            pagination: {
                page: safePage,
                limit: safeLimit,
                total,
                totalPages: Math.ceil(total / safeLimit),
            },
        };
    }
    async recordTransaction(transactionData) {
        const transaction = new this.transactionModel(transactionData);
        return transaction.save();
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(inventory_schema_1.Inventory.name)),
    __param(1, (0, mongoose_1.InjectModel)(stock_transaction_schema_1.StockTransaction.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map