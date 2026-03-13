"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const mongoose_1 = require("@nestjs/mongoose");
const medicine_schema_1 = require("../medicines/schemas/medicine.schema");
async function seedDatabase() {
    console.log('🌱 Seeding database...\n');
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const medicineModel = app.get((0, mongoose_1.getModelToken)(medicine_schema_1.Medicine.name));
    try {
        const sampleMedicines = [
            {
                name: 'Paracetamol',
                genericName: 'Paracetamol',
                type: 'Tablet',
                dosageForm: '500MG',
                strength: '500 mg',
                composition: 'Paracetamol 500mg',
                unit: '1 Tablet',
                packSize: '10 tablets',
                ceilingPrice: 0.91,
                mrp: 2.0,
                purchasePrice: 1.5,
                category: 'Analgesic',
                route: 'Oral',
                manufacturer: 'Cipla',
                hsnCode: '30049099',
                requiresPrescription: false,
                dataSource: 'USER',
                nlemListed: true,
                isActive: true,
                usageCount: 150,
                searchTerms: ['paracetamol', 'para', 'fever', 'pain'],
            },
            {
                name: 'Amoxicillin',
                genericName: 'Amoxicillin',
                type: 'Capsule',
                dosageForm: '500MG',
                strength: '500 mg',
                composition: 'Amoxicillin 500mg',
                unit: '1 Capsule',
                packSize: '10 capsules',
                ceilingPrice: 6.44,
                mrp: 10.0,
                purchasePrice: 8.0,
                category: 'Antibiotic',
                route: 'Oral',
                manufacturer: 'Ranbaxy',
                hsnCode: '30049099',
                requiresPrescription: true,
                dataSource: 'USER',
                nlemListed: true,
                isActive: true,
                usageCount: 85,
                searchTerms: ['amoxicillin', 'amox', 'antibiotic'],
            },
            {
                name: 'Cetirizine',
                genericName: 'Cetirizine',
                type: 'Tablet',
                dosageForm: '10MG',
                strength: '10 mg',
                composition: 'Cetirizine 10mg',
                unit: '1 Tablet',
                packSize: '10 tablets',
                ceilingPrice: 1.65,
                mrp: 3.5,
                purchasePrice: 2.5,
                category: 'Antihistamine',
                route: 'Oral',
                manufacturer: 'Sun Pharma',
                hsnCode: '30049099',
                requiresPrescription: false,
                dataSource: 'USER',
                nlemListed: true,
                isActive: true,
                usageCount: 120,
                searchTerms: ['cetirizine', 'allergy', 'antihistamine'],
            },
        ];
        await medicineModel.insertMany(sampleMedicines);
        console.log('✅ Seeded sample medicines\n');
        const count = await medicineModel.countDocuments();
        console.log(`📊 Total medicines in database: ${count}\n`);
    }
    catch (error) {
        console.error('💥 Seeding failed:', error);
        process.exit(1);
    }
    finally {
        await app.close();
        console.log('✨ Seeding completed!\n');
        process.exit(0);
    }
}
seedDatabase();
//# sourceMappingURL=seed-database.js.map