import { ConfigService } from '@nestjs/config';
interface OCRResult {
    text: string;
    confidence: number;
    items: Array<{
        medicineName: string;
        quantity: number;
        unitPrice?: number;
        totalPrice?: number;
        mrp?: number;
        packing?: string;
        packSize?: number;
        cgst?: number;
        sgst?: number;
    }>;
    supplierInfo?: {
        name?: string;
        phone?: string;
        address?: string;
        invoiceNumber?: string;
        invoiceDate?: string;
    };
}
export declare class OcrService {
    private configService;
    constructor(configService: ConfigService);
    processImage(imageBuffer: Buffer): Promise<OCRResult>;
    processPdf(pdfBuffer: Buffer): Promise<OCRResult>;
    private extractTextWithAutoRotation;
    private scoreMedText;
    private extractJpegFromPdf;
    private preprocessImage;
    private parseIndianMedicalInvoice;
    private parseAfterPacking;
    private cleanName;
}
export {};
