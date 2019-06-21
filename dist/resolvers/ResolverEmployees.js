"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const employee_1 = require("../models/employee");
const mongoose = require('mongoose');
module.exports = {
    GetAllEmployees: () => __awaiter(this, void 0, void 0, function* () {
        let findUser = yield employee_1.Employee.find({}, { "__v": false });
        return findUser;
    }),
    GetOneEmployeeById: (args) => __awaiter(this, void 0, void 0, function* () {
        let findUser = yield employee_1.Employee.find(args, { "__v": false });
        return findUser[0];
    }),
    GetRegexFirstnameEmployees: (args) => __awaiter(this, void 0, void 0, function* () {
        let findUser = yield employee_1.Employee.find({ firstname: { $regex: "^" + args.firstnameRegex } }, { "__v": false });
        return findUser;
    }),
    GetRegexLastnameEmployees: (args) => __awaiter(this, void 0, void 0, function* () {
        let findUser = yield employee_1.Employee.find({ lastname: { $regex: "^" + args.lastnameRegex } }, { "__v": false });
        return findUser;
    }),
    createEmployee: (args) => __awaiter(this, void 0, void 0, function* () {
        const newEmployee = new employee_1.Employee({
            _id: new mongoose.Types.ObjectId(),
            id: args.employeeInput.id,
            firstname: args.employeeInput.firstname,
            lastname: args.employeeInput.lastname
        });
        let result = yield newEmployee.save();
        let savedEmployee = { id: result.id, firstname: result.firstname, lastname: result.lastname };
        return savedEmployee;
    })
};
