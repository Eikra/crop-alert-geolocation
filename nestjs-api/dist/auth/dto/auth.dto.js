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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SigninDto = exports.AuthDto = void 0;
const class_validator_1 = require("class-validator");
const prisma_1 = require("../../../generated/prisma");
class AuthDto {
    email;
    password;
    role;
}
exports.AuthDto = AuthDto;
__decorate([
    (0, class_validator_1.IsDefined)({ message: 'Email is required' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Email must be valid' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email must not be empty' }),
    __metadata("design:type", String)
], AuthDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsDefined)({ message: 'Password is required' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8, { message: 'Password must be at least 8 characters' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Password must not be empty' }),
    __metadata("design:type", String)
], AuthDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsEnum)(prisma_1.UserRole),
    __metadata("design:type", String)
], AuthDto.prototype, "role", void 0);
class SigninDto {
    email;
    password;
}
exports.SigninDto = SigninDto;
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], SigninDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], SigninDto.prototype, "password", void 0);
//# sourceMappingURL=auth.dto.js.map