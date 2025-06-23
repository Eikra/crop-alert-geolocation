"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertController = void 0;
const common_1 = require("@nestjs/common");
const decorator_1 = require("../auth/decorator");
const jwt_guard_1 = require("../auth/guard/jwt.guard");
const alert_service_1 = require("./alert.service");
const create_alert_dto_1 = require("./dto/create-alert.dto");
const nearby_alerts_dto_1 = require("./dto/nearby-alerts.dto");
const edit_alert_dto_1 = require("./dto/edit-alert.dto");
let AlertController = class AlertController {
    alertService;
    constructor(alertService) {
        this.alertService = alertService;
    }
    getAlerts(userId) {
        return this.alertService.getAlerts(userId);
    }
    getAlertById(userId, alertId) {
        return this.alertService.getAlertById(userId, alertId);
    }
    createAlert(userId, dto) {
        console.log('Creating alert with data:', dto);
        return this.alertService.createAlert(userId, dto);
    }
    editAlertById(userId, alertId, dto) {
        return this.alertService.editAlertById(userId, alertId, dto);
    }
    deleteAlertById(userId, alertId) {
        return this.alertService.deleteAlertById(userId, alertId);
    }
    findNearby(dto) {
        return this.alertService.findNearby(dto);
    }
};
exports.AlertController = AlertController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AlertController.prototype, "getAlerts", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], AlertController.prototype, "getAlertById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_alert_dto_1.CreateAlertDto]),
    __metadata("design:returntype", void 0)
], AlertController.prototype, "createAlert", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, edit_alert_dto_1.EditAlertDto]),
    __metadata("design:returntype", void 0)
], AlertController.prototype, "editAlertById", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, common_1.Delete)(':id'),
    __param(0, (0, decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], AlertController.prototype, "deleteAlertById", null);
__decorate([
    (0, common_1.Get)('nearby/search'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [nearby_alerts_dto_1.NearbyAlertsDto]),
    __metadata("design:returntype", void 0)
], AlertController.prototype, "findNearby", null);
exports.AlertController = AlertController = __decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Controller)('alerts'),
    __metadata("design:paramtypes", [alert_service_1.AlertService])
], AlertController);
//# sourceMappingURL=alert.controller.js.map