"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const sync_1 = require("csv-parse/sync");
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const medicines_service_1 = require("../medicines/medicines.service");
const common_1 = require("@nestjs/common");
const logger = new common_1.Logger('ImportMedicines');
const DOSAGE_FORMS = [
    'Tablet', 'Tablets', 'TAB', 'Capsule', 'Capsules', 'CAP',
    'Injection', 'Inj', 'Syrup', 'Cream', 'Ointment', 'Drops',
    'Gel', 'Lotion', 'Powder', 'Solution', 'Suppository',
    'Inhaler', 'Spray', 'Suspension', 'Emulsion', 'Sachet'
];
function parseMedicineName(fullName) {
    if (!fullName) {
        return { name: '', dosageForm: 'Unknown', strength: '' };
    }
    let name = fullName.trim();
    let dosageForm = 'Unknown';
    let strength = '';
    const strengthMatch = name.match(/(\d+\.?\d*\s*(?:mg|MG|g|G|ml|ML|%|IU|mcg|MCG))/i);
    if (strengthMatch) {
        strength = strengthMatch[0].toUpperCase();
        name = name.replace(strengthMatch[0], '').trim();
    }
    for (const form of DOSAGE_FORMS) {
        const regex = new RegExp(`\\b${form}\\b`, 'i');
        if (regex.test(name)) {
            dosageForm = form.replace(/s$/i, '');
            name = name.replace(regex, '').trim();
            break;
        }
    }
    name = name.replace(/\s+/g, ' ').trim();
    if (dosageForm === 'Unknown') {
        if (/suspension/i.test(fullName))
            dosageForm = 'Syrup';
        else if (/emulsion/i.test(fullName))
            dosageForm = 'Solution';
        else if (/sachet/i.test(fullName))
            dosageForm = 'Powder';
    }
    return { name, dosageForm, strength };
}
function parsePackSize(packSizeLabel) {
    if (!packSizeLabel)
        return '1';
    const match = packSizeLabel.match(/\d+/);
    return match ? match[0] : '1';
}
function normalizeDosageForm(form) {
    const formMap = {
        'tablet': 'Tablet',
        'tablets': 'Tablet',
        'tab': 'Tablet',
        'capsule': 'Capsule',
        'capsules': 'Capsule',
        'cap': 'Capsule',
        'injection': 'Injection',
        'inj': 'Injection',
        'syrup': 'Syrup',
        'suspension': 'Syrup',
        'cream': 'Cream',
        'ointment': 'Ointment',
        'drops': 'Drops',
        'gel': 'Gel',
        'lotion': 'Lotion',
        'powder': 'Powder',
        'sachet': 'Powder',
        'solution': 'Solution',
        'emulsion': 'Solution',
        'suppository': 'Suppository',
        'inhaler': 'Inhaler',
        'spray': 'Spray',
    };
    return formMap[form.toLowerCase()] || 'Unknown';
}
function readCSV(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    return (0, sync_1.parse)(content, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
    });
}
function mergeMedicineData(medicineData, datasetData) {
    const datasetMap = new Map();
    for (const item of datasetData) {
        if (item.name) {
            datasetMap.set(item.name.trim().toLowerCase(), item);
        }
    }
    const merged = [];
    const seenNames = new Set();
    for (const med of medicineData) {
        if (!med.name)
            continue;
        const normalizedName = med.name.trim().toLowerCase();
        if (seenNames.has(normalizedName)) {
            continue;
        }
        seenNames.add(normalizedName);
        const dataset = datasetMap.get(normalizedName);
        const parsed = parseMedicineName(med.name);
        const compositions = [];
        if (med.short_composition1)
            compositions.push(med.short_composition1);
        if (med.short_composition2)
            compositions.push(med.short_composition2);
        const substitutes = [];
        if (dataset) {
            for (let i = 0; i <= 4; i++) {
                const sub = dataset[`substitute${i}`];
                if (sub && sub.trim()) {
                    substitutes.push(sub.trim());
                }
            }
        }
        const sideEffects = [];
        if (dataset) {
            for (let i = 0; i <= 41; i++) {
                const effect = dataset[`sideEffect${i}`];
                if (effect && effect.trim()) {
                    sideEffects.push(effect.trim());
                }
            }
        }
        merged.push({
            name: parsed.name || med.name,
            manufacturer: med.manufacturer_name || undefined,
            mrp: med['price(₹)'] ? parseFloat(med['price(₹)']) : undefined,
            packSize: parsePackSize(med.pack_size_label),
            composition: compositions.length > 0 ? compositions.join(', ') : undefined,
            dosageForm: normalizeDosageForm(parsed.dosageForm),
            strength: parsed.strength || undefined,
            category: dataset?.Therapeutic_Class || 'General',
            type: 'Allopathy',
            substitutes: substitutes.length > 0 ? substitutes : undefined,
            sideEffects: sideEffects.length > 0 ? sideEffects : undefined,
            therapeuticClass: dataset?.Therapeutic_Class || undefined,
            chemicalClass: dataset?.Chemical_Class || undefined,
            habitForming: dataset?.Habit_Forming || undefined,
            isDiscontinued: med.Is_discontinued?.toLowerCase() === 'true',
            dataSource: 'IMPORT',
        });
    }
    return merged;
}
async function importMedicines() {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/shop2med';
    process.env.MONGODB_URI = mongoUri;
    logger.log('Starting medicine import...');
    const medicinePath = path.join(__dirname, '../../medicine.csv');
    const datasetPath = path.join(__dirname, '../../medicine_dataset.csv');
    logger.log(`Reading ${medicinePath}...`);
    const medicineData = readCSV(medicinePath);
    logger.log(`Loaded ${medicineData.length} medicines from medicine.csv`);
    logger.log(`Reading ${datasetPath}...`);
    const datasetData = readCSV(datasetPath);
    logger.log(`Loaded ${datasetData.length} medicines from medicine_dataset.csv`);
    logger.log('Merging medicine data...');
    const merged = mergeMedicineData(medicineData, datasetData);
    logger.log(`Merged into ${merged.length} unique medicines`);
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const medicinesService = app.get(medicines_service_1.MedicinesService);
    let created = 0;
    let skipped = 0;
    let errors = 0;
    const batchSize = 100;
    for (let i = 0; i < merged.length; i += batchSize) {
        const batch = merged.slice(i, i + batchSize);
        logger.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(merged.length / batchSize)}...`);
        for (const med of batch) {
            try {
                const existing = await medicinesService.search({
                    name: med.name,
                    manufacturer: med.manufacturer
                });
                if (existing.data.length > 0) {
                    const exactMatch = existing.data.find(m => m.name?.toLowerCase() === med.name?.toLowerCase() &&
                        m.manufacturer?.toLowerCase() === med.manufacturer?.toLowerCase());
                    if (exactMatch) {
                        logger.debug(`Skipping duplicate: ${med.name} (${med.manufacturer})`);
                        skipped++;
                        continue;
                    }
                }
                const dto = {
                    name: med.name,
                    manufacturer: med.manufacturer,
                    mrp: med.mrp,
                    packSize: med.packSize,
                    composition: med.composition,
                    dosageForm: med.dosageForm,
                    strength: med.strength,
                    category: med.category,
                    type: med.type,
                    substitutes: med.substitutes,
                    sideEffects: med.sideEffects,
                    dataSource: 'IMPORT',
                    isActive: !med.isDiscontinued,
                };
                await medicinesService.create(dto);
                created++;
                if (created % 100 === 0) {
                    logger.log(`Created ${created} medicines...`);
                }
            }
            catch (error) {
                logger.error(`Error importing ${med.name}:`, error.message);
                errors++;
            }
        }
    }
    logger.log('='.repeat(50));
    logger.log('Import complete!');
    logger.log(`Total processed: ${merged.length}`);
    logger.log(`Created: ${created}`);
    logger.log(`Skipped (duplicates): ${skipped}`);
    logger.log(`Errors: ${errors}`);
    logger.log('='.repeat(50));
    await app.close();
}
importMedicines().catch(error => {
    logger.error('Import failed:', error);
    process.exit(1);
});
//# sourceMappingURL=import-medicines-csv.js.map