"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const platform_express_1 = require("@nestjs/platform-express");
const users_service_1 = require("./users.service");
const users_controller_1 = require("./users.controller");
const activity_log_controller_1 = require("./activity-log.controller");
const activity_log_service_1 = require("./activity-log.service");
const user_schema_1 = require("./schemas/user.schema");
const shop_settings_schema_1 = require("./schemas/shop-settings.schema");
const activity_log_schema_1 = require("./schemas/activity-log.schema");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: shop_settings_schema_1.ShopSettings.name, schema: shop_settings_schema_1.ShopSettingsSchema },
                { name: activity_log_schema_1.ActivityLog.name, schema: activity_log_schema_1.ActivityLogSchema },
            ]),
            platform_express_1.MulterModule.register({
                limits: {
                    fileSize: 5 * 1024 * 1024,
                },
            }),
        ],
        controllers: [users_controller_1.UsersController, activity_log_controller_1.ActivityLogController],
        providers: [users_service_1.UsersService, activity_log_service_1.ActivityLogService],
        exports: [users_service_1.UsersService, activity_log_service_1.ActivityLogService],
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map