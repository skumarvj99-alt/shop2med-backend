export declare class CreateInventoryDto {
    medicineName: string;
    batchNumber: string;
    expiryDate: Date;
    manufactureDate: Date;
    quantity: number;
    purchasePrice: number;
    sellingPrice: number;
    mrp?: number;
    supplier?: string;
    supplierInvoiceNumber?: string;
    purchaseDate?: Date;
    rackNumber?: string;
    shelfNumber?: string;
    reorderLevel?: number;
    expiryAlertDays?: number;
    notes?: string;
}
