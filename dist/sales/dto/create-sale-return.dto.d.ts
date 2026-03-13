export declare class ReturnItemDto {
    medicine: string;
    inventory: string;
    quantity: number;
    reason?: string;
}
export declare class CreateSaleReturnDto {
    originalSale: string;
    items: ReturnItemDto[];
    reason?: string;
    notes?: string;
}
