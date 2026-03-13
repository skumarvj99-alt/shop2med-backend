export declare class MedicineTypeExtractor {
    private static readonly DOSAGE_FORM_PATTERNS;
    private static readonly NAME_CLEANUP_PATTERNS;
    static cleanMedicineName(medicineName: string): string;
    static extractAndClean(medicineName: string, packing?: string): {
        cleanedName: string;
        dosageForm: string;
        confidence: number;
    };
    static extractDosageForm(medicineName: string): string;
    static extractDosageFormWithConfidence(medicineName: string): {
        dosageForm: string;
        confidence: number;
    };
    static extractFromPacking(packing: string): string;
    static extractFromMultipleSources(medicineName: string, packing?: string): string;
    static isValidDosageForm(dosageForm: string): boolean;
    static getAllDosageForms(): string[];
}
