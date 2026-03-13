import { Response } from 'express';
export declare class ExportService {
    exportToExcel(data: any[], filename: string, res: Response): Promise<void>;
    exportToCSV(data: any[], filename: string, res: Response): Promise<void>;
}
