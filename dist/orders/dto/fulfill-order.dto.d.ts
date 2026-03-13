export declare class FulfillOrderItemDto {
    orderItemIndex: number;
    batchNumber: string;
    expiryDate: Date;
    manufactureDate: Date;
    reorderLevel?: number;
    rackNumber?: string;
    shelfNumber?: string;
    notes?: string;
}
export declare class FulfillOrderDto {
    items: FulfillOrderItemDto[];
    overridePurchasePrice?: number;
    overrideSellingPrice?: number;
    notes?: string;
}
