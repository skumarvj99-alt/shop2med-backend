"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInventoryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_inventory_dto_1 = require("./create-inventory.dto");
class UpdateInventoryDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(create_inventory_dto_1.CreateInventoryDto, ['medicineName'])) {
}
exports.UpdateInventoryDto = UpdateInventoryDto;
//# sourceMappingURL=update-inventory.dto.js.map