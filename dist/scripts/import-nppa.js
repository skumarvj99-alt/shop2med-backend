"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const medicines_service_1 = require("../medicines/medicines.service");
const fs = require("fs");
const path = require("path");
async function importNPPAData() {
    console.log('🚀 Starting NPPA Data Import...\n');
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const medicinesService = app.get(medicines_service_1.MedicinesService);
    try {
        const jsonPath = path.join(__dirname, '../../data/medicines_seed.json');
        if (!fs.existsSync(jsonPath)) {
            throw new Error(`JSON file not found at ${jsonPath}`);
        }
        console.log('📖 Reading JSON file...');
        const jsonData = fs.readFileSync(jsonPath, 'utf-8');
        const medicines = JSON.parse(jsonData);
        console.log(`✅ Found ${medicines.length} medicines to import\n`);
        let imported = 0;
        let updated = 0;
        let failed = 0;
        const batchSize = 100;
        for (let i = 0; i < medicines.length; i += batchSize) {
            const batch = medicines.slice(i, i + batchSize);
            console.log(`⏳ Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(medicines.length / batchSize)}...`);
            for (const med of batch) {
                try {
                    const result = await medicinesService.findOrCreate({
                        name: med.name,
                        genericName: med.genericName,
                        dosageForm: med.dosageForm,
                        strength: med.strength,
                        composition: med.composition,
                        unit: med.unit,
                        packSize: med.packSize,
                        ceilingPrice: med.ceilingPrice,
                        category: med.category,
                    }, null);
                    if (result.created) {
                        imported++;
                    }
                    else {
                        updated++;
                    }
                }
                catch (error) {
                    console.error(`❌ Failed to import ${med.name}:`, error.message);
                    failed++;
                }
            }
        }
        console.log('\n' + '='.repeat(50));
        console.log('📊 IMPORT SUMMARY');
        console.log('='.repeat(50));
        console.log(`✅ New medicines imported: ${imported}`);
        console.log(`🔄 Existing medicines updated: ${updated}`);
        console.log(`❌ Failed imports: ${failed}`);
        console.log(`📈 Total processed: ${medicines.length}`);
        console.log('='.repeat(50) + '\n');
        const categories = await medicinesService.getCategories();
        console.log('📋 Top Categories:');
        categories.slice(0, 10).forEach((cat, idx) => {
            console.log(`   ${idx + 1}. ${cat.category}: ${cat.count} medicines`);
        });
    }
    catch (error) {
        console.error('💥 Import failed:', error);
        process.exit(1);
    }
    finally {
        await app.close();
        console.log('\n✨ Import completed!\n');
        process.exit(0);
    }
}
importNPPAData();
//# sourceMappingURL=import-nppa.js.map