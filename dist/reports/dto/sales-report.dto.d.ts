import { DateRangeDto } from './date-range.dto';
export declare class SalesReportDto extends DateRangeDto {
    groupBy?: string;
    paymentMethod?: string;
    status?: string;
}
