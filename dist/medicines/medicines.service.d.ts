import { Model } from 'mongoose';
import { Medicine, MedicineDocument } from './schemas/medicine.schema';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { SearchMedicineDto } from './dto/search-medicine.dto';
export declare class MedicinesService {
    private medicineModel;
    constructor(medicineModel: Model<MedicineDocument>);
    create(createMedicineDto: CreateMedicineDto, userId?: string): Promise<Medicine>;
    findOrCreate(createMedicineDto: CreateMedicineDto, userId?: string): Promise<{
        medicine: Medicine;
        created: boolean;
    }>;
    search(searchDto: SearchMedicineDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, MedicineDocument, {}, {}> & Medicine & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    autocomplete(query: string, limit?: number): Promise<Medicine[]>;
    findOne(id: string): Promise<Medicine>;
    findAll(page?: number, limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, MedicineDocument, {}, {}> & Medicine & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    update(id: string, updateMedicineDto: UpdateMedicineDto): Promise<Medicine>;
    remove(id: string): Promise<void>;
    recordUsage(id: string): Promise<void>;
    getPopular(limit?: number): Promise<Medicine[]>;
    findByCategory(category: string, limit?: number): Promise<Medicine[]>;
    getCategories(): Promise<{
        category: string;
        count: number;
    }[]>;
    getLowStock(threshold?: number): Promise<any[]>;
    private generateSearchTerms;
}
