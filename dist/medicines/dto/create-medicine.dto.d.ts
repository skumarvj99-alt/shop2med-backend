export declare class CreateMedicineDto {
    name: string;
    genericName?: string;
    dosageForm?: string;
    strength?: string;
    composition?: string;
    unit?: string;
    packSize?: string;
    ceilingPrice?: number;
    mrp?: number;
    purchasePrice?: number;
    category?: string;
    manufacturer?: string;
    hsnCode?: string;
    dataSource?: string;
    isActive?: boolean;
    type?: string;
    substitutes?: string[];
    sideEffects?: string[];
    requiresPrescription?: boolean;
}
