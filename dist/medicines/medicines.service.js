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
exports.MedicinesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const medicine_schema_1 = require("./schemas/medicine.schema");
let MedicinesService = class MedicinesService {
    constructor(medicineModel) {
        this.medicineModel = medicineModel;
    }
    async create(createMedicineDto, userId) {
        try {
            const searchTerms = this.generateSearchTerms(createMedicineDto);
            const medicine = new this.medicineModel({
                ...createMedicineDto,
                searchTerms,
                createdBy: userId,
                dataSource: 'USER',
            });
            return await medicine.save();
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to create medicine: ' + error.message);
        }
    }
    async findOrCreate(createMedicineDto, userId) {
        const existing = await this.medicineModel.findOne({
            name: createMedicineDto.name,
            strength: createMedicineDto.strength,
            dosageForm: createMedicineDto.dosageForm,
            isActive: true,
        });
        if (existing) {
            if (createMedicineDto.mrp)
                existing.mrp = createMedicineDto.mrp;
            if (createMedicineDto.purchasePrice)
                existing.purchasePrice = createMedicineDto.purchasePrice;
            if (createMedicineDto.manufacturer)
                existing.manufacturer = createMedicineDto.manufacturer;
            await existing.save();
            return { medicine: existing, created: false };
        }
        const medicine = await this.create(createMedicineDto, userId);
        return { medicine, created: true };
    }
    async search(searchDto) {
        const { query, category, dosageForm, manufacturer, page = 1, limit = 20 } = searchDto;
        const filter = { isActive: true };
        if (query) {
            filter.$text = { $search: query };
        }
        if (category)
            filter.category = category;
        if (dosageForm)
            filter.dosageForm = dosageForm;
        if (manufacturer)
            filter.manufacturer = new RegExp(manufacturer, 'i');
        const safePage = page || 1;
        const safeLimit = limit || 20;
        const skip = Math.max(0, (safePage - 1) * safeLimit);
        const [medicines, total] = await Promise.all([
            this.medicineModel
                .find(filter)
                .sort(query ? { score: { $meta: 'textScore' }, usageCount: -1 } : { usageCount: -1 })
                .skip(skip)
                .limit(safeLimit)
                .exec(),
            this.medicineModel.countDocuments(filter),
        ]);
        return {
            data: medicines,
            pagination: {
                page: safePage,
                limit: safeLimit,
                total,
                totalPages: Math.ceil(total / safeLimit),
            },
        };
    }
    async autocomplete(query, limit = 10) {
        if (!query || query.length < 2)
            return [];
        return this.medicineModel
            .find({
            $text: { $search: query },
            isActive: true,
        })
            .sort({ score: { $meta: 'textScore' }, usageCount: -1 })
            .limit(limit)
            .select('name genericName dosageForm strength manufacturer mrp category')
            .exec();
    }
    async findOne(id) {
        const medicine = await this.medicineModel.findById(id).exec();
        if (!medicine) {
            throw new common_1.NotFoundException(`Medicine with ID ${id} not found`);
        }
        return medicine;
    }
    async findAll(page = 1, limit = 50) {
        const safePage = page || 1;
        const safeLimit = limit || 50;
        const skip = Math.max(0, (safePage - 1) * safeLimit);
        const [medicines, total] = await Promise.all([
            this.medicineModel
                .find({ isActive: true })
                .sort({ usageCount: -1, name: 1 })
                .skip(skip)
                .limit(safeLimit)
                .exec(),
            this.medicineModel.countDocuments({ isActive: true }),
        ]);
        return {
            data: medicines,
            pagination: {
                page: safePage,
                limit: safeLimit,
                total,
                totalPages: Math.ceil(total / safeLimit),
            },
        };
    }
    async update(id, updateMedicineDto) {
        if (updateMedicineDto.name || updateMedicineDto.genericName) {
            updateMedicineDto['searchTerms'] = this.generateSearchTerms(updateMedicineDto);
        }
        const medicine = await this.medicineModel
            .findByIdAndUpdate(id, updateMedicineDto, { new: true })
            .exec();
        if (!medicine) {
            throw new common_1.NotFoundException(`Medicine with ID ${id} not found`);
        }
        return medicine;
    }
    async remove(id) {
        const result = await this.medicineModel
            .findByIdAndUpdate(id, { isActive: false })
            .exec();
        if (!result) {
            throw new common_1.NotFoundException(`Medicine with ID ${id} not found`);
        }
    }
    async recordUsage(id) {
        await this.medicineModel
            .findByIdAndUpdate(id, {
            $inc: { usageCount: 1 },
            lastUsed: new Date(),
        })
            .exec();
    }
    async getPopular(limit = 50) {
        return this.medicineModel
            .find({ isActive: true })
            .sort({ usageCount: -1 })
            .limit(limit)
            .exec();
    }
    async findByCategory(category, limit = 50) {
        return this.medicineModel
            .find({ category, isActive: true })
            .sort({ usageCount: -1 })
            .limit(limit)
            .exec();
    }
    async getCategories() {
        return this.medicineModel.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $project: { category: '$_id', count: 1, _id: 0 } },
            { $sort: { count: -1 } },
        ]);
    }
    async getLowStock(threshold = 10) {
        return [];
    }
    generateSearchTerms(dto) {
        const terms = new Set();
        if (dto.name) {
            terms.add(dto.name.toLowerCase());
            dto.name.toLowerCase().split(/\s+/).forEach(word => terms.add(word));
        }
        if (dto.genericName) {
            terms.add(dto.genericName.toLowerCase());
            dto.genericName.toLowerCase().split(/\s+/).forEach(word => terms.add(word));
        }
        if (dto.manufacturer) {
            terms.add(dto.manufacturer.toLowerCase());
        }
        return Array.from(terms);
    }
};
exports.MedicinesService = MedicinesService;
exports.MedicinesService = MedicinesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(medicine_schema_1.Medicine.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], MedicinesService);
//# sourceMappingURL=medicines.service.js.map