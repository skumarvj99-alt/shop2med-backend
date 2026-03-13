"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOrderWithItemsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_order_dto_1 = require("./create-order.dto");
class UpdateOrderWithItemsDto extends (0, swagger_1.PartialType)(create_order_dto_1.CreateOrderDto) {
}
exports.UpdateOrderWithItemsDto = UpdateOrderWithItemsDto;
//# sourceMappingURL=update-order-with-items.dto.js.map