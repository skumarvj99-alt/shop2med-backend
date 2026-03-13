import { MedicinesService } from './medicines.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { SearchMedicineDto } from './dto/search-medicine.dto';
export declare class MedicinesController {
    private readonly medicinesService;
    constructor(medicinesService: MedicinesService);
    create(createMedicineDto: CreateMedicineDto, userId: string): Promise<import("./schemas/medicine.schema").Medicine>;
    findOrCreate(createMedicineDto: CreateMedicineDto, userId: string): Promise<{
        medicine: import("./schemas/medicine.schema").Medicine;
        created: boolean;
    }>;
    search(searchDto: SearchMedicineDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/medicine.schema").MedicineDocument, {}, {}> & import("./schemas/medicine.schema").Medicine & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    autocomplete(query: string): Promise<import("./schemas/medicine.schema").Medicine[]>;
    getPopular(limit?: number): Promise<import("./schemas/medicine.schema").Medicine[]>;
    getCategories(): Promise<{
        category: string;
        count: number;
    }[]>;
    findByCategory(category: string): Promise<import("./schemas/medicine.schema").Medicine[]>;
    findOne(id: string): Promise<import("./schemas/medicine.schema").Medicine>;
    findAll(page?: number, limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/medicine.schema").MedicineDocument, {}, {}> & import("./schemas/medicine.schema").Medicine & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    update(id: string, updateMedicineDto: UpdateMedicineDto): Promise<import("./schemas/medicine.schema").Medicine>;
    remove(id: string): Promise<void>;
    recordUsage(id: string): Promise<{
        message: string;
    }>;
}
