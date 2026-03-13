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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const sale_schema_1 = require("../sales/schemas/sale.schema");
const inventory_schema_1 = require("../inventory/schemas/inventory.schema");
const order_schema_1 = require("../orders/schemas/order.schema");
const medicine_schema_1 = require("../medicines/schemas/medicine.schema");
let ReportsService = class ReportsService {
    constructor(saleModel, inventoryModel, orderModel, medicineModel) {
        this.saleModel = saleModel;
        this.inventoryModel = inventoryModel;
        this.orderModel = orderModel;
        this.medicineModel = medicineModel;
    }
    getUserObjectId(userId) {
        return new mongoose_2.Types.ObjectId(userId);
    }
    async getSalesReport(userId, reportDto) {
        const { dateFrom, dateTo, groupBy, paymentMethod, status } = reportDto;
        const userObjectId = this.getUserObjectId(userId);
        const filter = {
            user: userObjectId,
            isActive: true,
            saleDate: { $gte: dateFrom, $lte: dateTo },
        };
        if (status) {
            filter.status = status;
        }
        else {
            filter.status = 'completed';
        }
        if (paymentMethod) {
            filter.paymentMethod = paymentMethod;
        }
        let dateFormat;
        switch (groupBy) {
            case 'daily':
                dateFormat = '%Y-%m-%d';
                break;
            case 'weekly':
                dateFormat = '%Y-W%V';
                break;
            case 'monthly':
                dateFormat = '%Y-%m';
                break;
            case 'yearly':
                dateFormat = '%Y';
                break;
            default:
                dateFormat = '%Y-%m-%d';
        }
        const [summary, salesByPeriod, topMedicines, paymentBreakdown] = await Promise.all([
            this.saleModel.aggregate([
                { $match: filter },
                {
                    $group: {
                        _id: null,
                        totalSales: { $sum: 1 },
                        totalRevenue: { $sum: '$totalAmount' },
                        totalDiscount: { $sum: '$totalDiscount' },
                        totalTax: { $sum: '$totalTax' },
                        totalQuantity: { $sum: { $sum: '$items.quantity' } },
                    },
                },
            ]),
            this.saleModel.aggregate([
                { $match: filter },
                {
                    $group: {
                        _id: { $dateToString: { format: dateFormat, date: '$saleDate' } },
                        sales: { $sum: 1 },
                        revenue: { $sum: '$totalAmount' },
                        quantity: { $sum: { $sum: '$items.quantity' } },
                        avgSaleValue: { $avg: '$totalAmount' },
                    },
                },
                { $sort: { _id: 1 } },
            ]),
            this.saleModel.aggregate([
                { $match: filter },
                { $unwind: '$items' },
                {
                    $group: {
                        _id: '$items.medicineName',
                        totalQuantity: { $sum: '$items.quantity' },
                        totalRevenue: { $sum: '$items.totalAmount' },
                        salesCount: { $sum: 1 },
                    },
                },
                { $sort: { totalQuantity: -1 } },
                { $limit: 20 },
            ]),
            this.saleModel.aggregate([
                { $match: filter },
                {
                    $group: {
                        _id: '$paymentMethod',
                        count: { $sum: 1 },
                        totalAmount: { $sum: '$totalAmount' },
                    },
                },
                { $sort: { totalAmount: -1 } },
            ]),
        ]);
        return {
            summary: summary[0] || {
                totalSales: 0,
                totalRevenue: 0,
                totalDiscount: 0,
                totalTax: 0,
                totalQuantity: 0,
            },
            salesByPeriod,
            topMedicines,
            paymentBreakdown,
            period: {
                from: dateFrom,
                to: dateTo,
                groupBy,
            },
        };
    }
    async getDailySalesReport(userId, dateRangeDto) {
        const { dateFrom, dateTo } = dateRangeDto;
        return this.saleModel.aggregate([
            {
                $match: {
                    user: userId,
                    isActive: true,
                    status: 'completed',
                    saleDate: { $gte: dateFrom, $lte: dateTo },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$saleDate' } },
                    date: { $first: '$saleDate' },
                    salesCount: { $sum: 1 },
                    revenue: { $sum: '$totalAmount' },
                    discount: { $sum: '$totalDiscount' },
                    tax: { $sum: '$totalTax' },
                    itemsSold: { $sum: { $sum: '$items.quantity' } },
                    avgSaleValue: { $avg: '$totalAmount' },
                },
            },
            { $sort: { _id: 1 } },
        ]);
    }
    async getMonthlySalesReport(userId, year) {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59);
        return this.saleModel.aggregate([
            {
                $match: {
                    user: userId,
                    isActive: true,
                    status: 'completed',
                    saleDate: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: { $month: '$saleDate' },
                    month: { $first: { $dateToString: { format: '%B', date: '$saleDate' } } },
                    salesCount: { $sum: 1 },
                    revenue: { $sum: '$totalAmount' },
                    discount: { $sum: '$totalDiscount' },
                    tax: { $sum: '$totalTax' },
                    profit: { $sum: { $subtract: ['$totalAmount', '$subtotal'] } },
                },
            },
            { $sort: { _id: 1 } },
        ]);
    }
    async getYearlySalesReport(userId) {
        return this.saleModel.aggregate([
            {
                $match: {
                    user: userId,
                    isActive: true,
                    status: 'completed',
                },
            },
            {
                $group: {
                    _id: { $year: '$saleDate' },
                    year: { $first: { $dateToString: { format: '%Y', date: '$saleDate' } } },
                    salesCount: { $sum: 1 },
                    revenue: { $sum: '$totalAmount' },
                    discount: { $sum: '$totalDiscount' },
                    tax: { $sum: '$totalTax' },
                },
            },
            { $sort: { _id: -1 } },
        ]);
    }
    async getInventoryReport(userId) {
        const [stockSummary, categoryBreakdown, expiryReport, lowStockItems, topValueItems] = await Promise.all([
            this.inventoryModel.aggregate([
                { $match: { user: userId, isActive: true } },
                {
                    $project: {
                        availableQty: {
                            $subtract: [
                                '$quantity',
                                { $add: ['$soldQuantity', '$damagedQuantity'] },
                            ],
                        },
                        stockValue: { $multiply: ['$quantity', '$purchasePrice'] },
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalItems: { $sum: 1 },
                        totalQuantity: { $sum: '$availableQty' },
                        totalValue: { $sum: '$stockValue' },
                    },
                },
            ]),
            this.inventoryModel.aggregate([
                { $match: { user: userId, isActive: true } },
                {
                    $lookup: {
                        from: 'medicines',
                        localField: 'medicine',
                        foreignField: '_id',
                        as: 'medicineInfo',
                    },
                },
                { $unwind: '$medicineInfo' },
                {
                    $group: {
                        _id: '$medicineInfo.category',
                        itemCount: { $sum: 1 },
                        totalQuantity: { $sum: '$quantity' },
                        totalValue: { $sum: { $multiply: ['$quantity', '$purchasePrice'] } },
                    },
                },
                { $sort: { totalValue: -1 } },
            ]),
            this.inventoryModel.aggregate([
                { $match: { user: userId, isActive: true } },
                {
                    $project: {
                        medicine: 1,
                        batchNumber: 1,
                        expiryDate: 1,
                        quantity: 1,
                        daysUntilExpiry: {
                            $divide: [
                                { $subtract: ['$expiryDate', new Date()] },
                                1000 * 60 * 60 * 24,
                            ],
                        },
                    },
                },
                {
                    $bucket: {
                        groupBy: '$daysUntilExpiry',
                        boundaries: [-Infinity, 0, 30, 60, 90, Infinity],
                        default: 'Other',
                        output: {
                            count: { $sum: 1 },
                            items: { $push: '$$ROOT' },
                        },
                    },
                },
            ]),
            this.inventoryModel
                .find({
                user: userId,
                isActive: true,
                status: 'low_stock',
            })
                .populate('medicine')
                .limit(20)
                .exec(),
            this.inventoryModel.aggregate([
                { $match: { user: userId, isActive: true } },
                {
                    $project: {
                        medicine: 1,
                        batchNumber: 1,
                        quantity: 1,
                        purchasePrice: 1,
                        stockValue: { $multiply: ['$quantity', '$purchasePrice'] },
                    },
                },
                { $sort: { stockValue: -1 } },
                { $limit: 20 },
                {
                    $lookup: {
                        from: 'medicines',
                        localField: 'medicine',
                        foreignField: '_id',
                        as: 'medicineInfo',
                    },
                },
            ]),
        ]);
        return {
            summary: stockSummary[0] || { totalItems: 0, totalQuantity: 0, totalValue: 0 },
            categoryBreakdown,
            expiryReport,
            lowStockItems,
            topValueItems,
        };
    }
    async getStockMovementReport(userId, dateRangeDto) {
        const { dateFrom, dateTo } = dateRangeDto;
        return this.saleModel.aggregate([
            {
                $match: {
                    user: userId,
                    isActive: true,
                    status: 'completed',
                    saleDate: { $gte: dateFrom, $lte: dateTo },
                },
            },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.medicineName',
                    totalSold: { $sum: '$items.quantity' },
                    revenue: { $sum: '$items.totalAmount' },
                    avgPrice: { $avg: '$items.unitPrice' },
                    salesCount: { $sum: 1 },
                },
            },
            { $sort: { totalSold: -1 } },
        ]);
    }
    async getPurchaseReport(userId, dateRangeDto) {
        const { dateFrom, dateTo } = dateRangeDto;
        const [summary, ordersBySupplier, monthlyPurchases, statusBreakdown] = await Promise.all([
            this.orderModel.aggregate([
                {
                    $match: {
                        user: userId,
                        isActive: true,
                        orderDate: { $gte: dateFrom, $lte: dateTo },
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalOrders: { $sum: 1 },
                        totalAmount: { $sum: '$totalAmount' },
                        avgOrderValue: { $avg: '$totalAmount' },
                        totalItems: { $sum: { $size: '$items' } },
                    },
                },
            ]),
            this.orderModel.aggregate([
                {
                    $match: {
                        user: userId,
                        isActive: true,
                        orderDate: { $gte: dateFrom, $lte: dateTo },
                    },
                },
                {
                    $group: {
                        _id: '$supplierName',
                        orderCount: { $sum: 1 },
                        totalAmount: { $sum: '$totalAmount' },
                        avgAmount: { $avg: '$totalAmount' },
                    },
                },
                { $sort: { totalAmount: -1 } },
            ]),
            this.orderModel.aggregate([
                {
                    $match: {
                        user: userId,
                        isActive: true,
                        orderDate: { $gte: dateFrom, $lte: dateTo },
                    },
                },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m', date: '$orderDate' } },
                        orderCount: { $sum: 1 },
                        totalAmount: { $sum: '$totalAmount' },
                    },
                },
                { $sort: { _id: 1 } },
            ]),
            this.orderModel.aggregate([
                {
                    $match: {
                        user: userId,
                        isActive: true,
                        orderDate: { $gte: dateFrom, $lte: dateTo },
                    },
                },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                        totalAmount: { $sum: '$totalAmount' },
                    },
                },
            ]),
        ]);
        return {
            summary: summary[0] || {
                totalOrders: 0,
                totalAmount: 0,
                avgOrderValue: 0,
                totalItems: 0,
            },
            ordersBySupplier,
            monthlyPurchases,
            statusBreakdown,
            period: {
                from: dateFrom,
                to: dateTo,
            },
        };
    }
    async getProfitLossReport(userId, dateRangeDto) {
        const { dateFrom, dateTo } = dateRangeDto;
        const sales = await this.saleModel.aggregate([
            {
                $match: {
                    user: userId,
                    isActive: true,
                    status: 'completed',
                    saleDate: { $gte: dateFrom, $lte: dateTo },
                },
            },
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'inventories',
                    localField: 'items.inventory',
                    foreignField: '_id',
                    as: 'inventoryInfo',
                },
            },
            { $unwind: '$inventoryInfo' },
            {
                $project: {
                    date: '$saleDate',
                    medicineName: '$items.medicineName',
                    quantity: '$items.quantity',
                    sellingPrice: '$items.unitPrice',
                    purchasePrice: '$inventoryInfo.purchasePrice',
                    revenue: '$items.totalAmount',
                    cost: { $multiply: ['$items.quantity', '$inventoryInfo.purchasePrice'] },
                    profit: {
                        $subtract: [
                            '$items.totalAmount',
                            { $multiply: ['$items.quantity', '$inventoryInfo.purchasePrice'] },
                        ],
                    },
                },
            },
        ]);
        const summary = sales.reduce((acc, sale) => ({
            totalRevenue: acc.totalRevenue + sale.revenue,
            totalCost: acc.totalCost + sale.cost,
            totalProfit: acc.totalProfit + sale.profit,
        }), { totalRevenue: 0, totalCost: 0, totalProfit: 0 });
        const profitMargin = summary.totalRevenue > 0
            ? (summary.totalProfit / summary.totalRevenue) * 100
            : 0;
        return {
            summary: {
                ...summary,
                profitMargin: profitMargin.toFixed(2),
            },
            detailedSales: sales,
            period: {
                from: dateFrom,
                to: dateTo,
            },
        };
    }
    async getCustomerReport(userId, dateRangeDto) {
        const { dateFrom, dateTo } = dateRangeDto;
        const [topCustomers, customerStats, newCustomers] = await Promise.all([
            this.saleModel.aggregate([
                {
                    $match: {
                        user: userId,
                        isActive: true,
                        status: 'completed',
                        customerPhone: { $exists: true, $ne: null },
                        saleDate: { $gte: dateFrom, $lte: dateTo },
                    },
                },
                {
                    $group: {
                        _id: '$customerPhone',
                        customerName: { $first: '$customerName' },
                        totalPurchases: { $sum: 1 },
                        totalSpent: { $sum: '$totalAmount' },
                        avgPurchaseValue: { $avg: '$totalAmount' },
                        lastPurchase: { $max: '$saleDate' },
                    },
                },
                { $sort: { totalSpent: -1 } },
                { $limit: 20 },
            ]),
            this.saleModel.aggregate([
                {
                    $match: {
                        user: userId,
                        isActive: true,
                        status: 'completed',
                        saleDate: { $gte: dateFrom, $lte: dateTo },
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalCustomers: {
                            $addToSet: '$customerPhone',
                        },
                        withoutPhone: {
                            $sum: {
                                $cond: [{ $or: [{ $eq: ['$customerPhone', null] }, { $eq: ['$customerPhone', ''] }] }, 1, 0],
                            },
                        },
                    },
                },
                {
                    $project: {
                        totalCustomers: { $size: '$totalCustomers' },
                        withoutPhone: 1,
                    },
                },
            ]),
            this.saleModel.aggregate([
                {
                    $match: {
                        user: userId,
                        isActive: true,
                        status: 'completed',
                        customerPhone: { $exists: true, $ne: null },
                    },
                },
                {
                    $group: {
                        _id: '$customerPhone',
                        firstPurchase: { $min: '$saleDate' },
                        customerName: { $first: '$customerName' },
                    },
                },
                {
                    $match: {
                        firstPurchase: { $gte: dateFrom, $lte: dateTo },
                    },
                },
                { $sort: { firstPurchase: -1 } },
            ]),
        ]);
        return {
            topCustomers,
            stats: customerStats[0] || { totalCustomers: 0, withoutPhone: 0 },
            newCustomers,
            period: {
                from: dateFrom,
                to: dateTo,
            },
        };
    }
    async getDashboardAnalytics(userId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59);
        const userObjectId = this.getUserObjectId(userId);
        const [todayStats, yesterdayStats, monthStats, lastMonthStats, recentSales, lowStockAlerts, expiryAlerts, topSellingToday, totalInventory,] = await Promise.all([
            this.getSalesStats(userId, today, new Date()),
            this.getSalesStats(userId, yesterday, today),
            this.getSalesStats(userId, thisMonth, new Date()),
            this.getSalesStats(userId, lastMonth, lastMonthEnd),
            (async () => {
                const sales = await this.saleModel
                    .find({
                    user: userObjectId,
                    $or: [
                        { isActive: true },
                        { isActive: { $exists: false } },
                        { isActive: null }
                    ],
                    status: 'completed'
                })
                    .sort({ saleDate: -1 })
                    .limit(10)
                    .select('billNumber customerName totalAmount saleDate paymentMethod')
                    .exec();
                return sales;
            })(),
            this.inventoryModel
                .find({
                user: userObjectId,
                isActive: true,
                status: { $in: ['out_of_stock', 'low_stock'] },
            })
                .populate('medicine')
                .sort({ quantity: 1 })
                .exec(),
            this.inventoryModel
                .find({
                user: userObjectId,
                isActive: true,
                expiryDate: {
                    $gte: today,
                    $lte: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000),
                },
            })
                .populate('medicine')
                .sort({ expiryDate: 1 })
                .limit(5)
                .exec(),
            this.saleModel.aggregate([
                {
                    $match: {
                        user: userObjectId,
                        isActive: true,
                        status: 'completed',
                        saleDate: { $gte: today },
                    },
                },
                { $unwind: '$items' },
                {
                    $group: {
                        _id: '$items.medicineName',
                        quantity: { $sum: '$items.quantity' },
                        revenue: { $sum: '$items.totalAmount' },
                    },
                },
                { $sort: { quantity: -1 } },
                { $limit: 5 },
            ]),
            this.inventoryModel.countDocuments({
                user: userObjectId,
                isActive: true,
            }),
        ]);
        const salesGrowth = yesterdayStats[0]?.revenue
            ? ((todayStats[0]?.revenue - yesterdayStats[0]?.revenue) / yesterdayStats[0]?.revenue) * 100
            : 0;
        const monthGrowth = lastMonthStats[0]?.revenue
            ? ((monthStats[0]?.revenue - lastMonthStats[0]?.revenue) / lastMonthStats[0]?.revenue) * 100
            : 0;
        const mappedLowStockAlerts = lowStockAlerts.map((item) => {
            const obj = item.toObject({ virtuals: true });
            return obj;
        });
        return {
            today: {
                sales: todayStats[0]?.count || 0,
                revenue: todayStats[0]?.revenue || 0,
                growth: salesGrowth.toFixed(2),
            },
            thisMonth: {
                sales: monthStats[0]?.count || 0,
                revenue: monthStats[0]?.revenue || 0,
                growth: monthGrowth.toFixed(2),
            },
            recentSales,
            alerts: {
                lowStock: mappedLowStockAlerts.filter((i) => i.status === 'low_stock').length,
                outOfStock: mappedLowStockAlerts.filter((i) => i.status === 'out_of_stock').length,
                expiringSoon: expiryAlerts.length,
            },
            topSellingToday,
            lowStockAlerts: mappedLowStockAlerts,
            expiryAlerts,
            totalInventory,
        };
    }
    async getSalesStats(userId, dateFrom, dateTo) {
        const userObjectId = this.getUserObjectId(userId);
        const allSales = await this.saleModel
            .find({ user: userObjectId, isActive: true })
            .sort({ saleDate: -1 })
            .limit(10)
            .select('billNumber saleDate status totalAmount')
            .exec();
        allSales.forEach((sale, index) => {
        });
        const allDatabaseSales = await this.saleModel
            .find({})
            .sort({ saleDate: -1 })
            .limit(5)
            .select('billNumber user saleDate status totalAmount')
            .exec();
        allDatabaseSales.forEach((sale, index) => {
        });
        const result = await this.saleModel.aggregate([
            {
                $match: {
                    user: userObjectId,
                    $or: [
                        { isActive: true },
                        { isActive: { $exists: false } },
                        { isActive: null }
                    ],
                    status: 'completed',
                    saleDate: { $gte: dateFrom, $lte: dateTo },
                },
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 },
                    revenue: { $sum: '$totalAmount' },
                },
            },
        ]);
        return result;
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(sale_schema_1.Sale.name)),
    __param(1, (0, mongoose_1.InjectModel)(inventory_schema_1.Inventory.name)),
    __param(2, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __param(3, (0, mongoose_1.InjectModel)(medicine_schema_1.Medicine.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], ReportsService);
//# sourceMappingURL=reports.service.js.map