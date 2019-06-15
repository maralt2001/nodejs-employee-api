"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dbconnector_1 = require("./database/dbconnector");
const employee_1 = require("./models/employee");
const log_1 = require("./models/log");
const eventListener_1 = require("./events/eventListener");
const tools_1 = require("./tools/tools");
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const app = express_1.default();
const port = process.env.App_Port;
const url = `http://localhost:${port}/api/employees`;
app.use(express_1.default.json());
app.get('/api/employees', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        let findUser = yield employee_1.Employee.find({}, { "_id": false, "__v": false });
        let check = dbconnector_1.CheckDBResponseIsEmpty(findUser);
        if (check == true) {
            res.status(204).send({ message: "No Employees in DB" });
            return next();
        }
        else {
            res.status(200).json(findUser);
            eventListener_1.logger.emit('infoRequest', req);
            return next();
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Error" });
        next();
    }
}));
app.get('/api/employees/:id', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let userID = req.params.id;
    try {
        let findUser = yield employee_1.Employee.find({ id: userID }, { "_id": false, "__v": false });
        let response = dbconnector_1.CheckDBResponseIsEmpty(findUser);
        if (response == true) {
            res.status(404).send({ message: "No Employee found with this ID" });
            return next();
        }
        else {
            res.status(200).json(findUser);
            eventListener_1.logger.emit('infoRequest', req);
            return next();
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Error" });
        next();
    }
}));
app.get('/api/logger/', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let query = req.query;
    if (tools_1.isEmptyObject(query)) {
        try {
            let logitems = yield log_1.Log.find({}, { "_id": false, "__v": false });
            res.status(200).json(logitems);
            return next();
        }
        catch (error) {
        }
    }
    else {
        try {
            let startEnde = tools_1.GetStartEndDate(query);
            let start = startEnde.startDate;
            let end = startEnde.endDate;
            if (start != undefined && end != undefined) {
                let result = yield log_1.Log.find({}, { "_id": false, "__v": false }).where('DateTime').gte(start).lte(end).exec();
                res.status(200).json(result);
                next();
            }
            else {
                res.status(400).send({ message: "Bad Request" });
            }
        }
        catch (_a) {
            res.status(400).send({ message: "Bad Request" });
        }
    }
}));
app.post('/api/employees', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let isEmployee = tools_1.ValidateUser(req.body);
    if (isEmployee) {
        let result = yield dbconnector_1.SaveEmployeeAsync(req.body);
        if (result) {
            res.status(200).send({ message: 'Employee is saved into db' });
        }
        else {
            res.status(500).send({ message: 'Internal error' });
        }
    }
    else {
        res.status(500).send({ message: 'Internal error' });
    }
}));
app.delete('/api/logger/delete/', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let query = req.query;
    if ('day' in query && 'month' in query) {
        let today = new Date();
        let day = query.day;
        let month = query.month;
        let year = today.getFullYear();
        let date = new Date(year, month - 1, day, 23, 59);
        try {
            let remove = yield log_1.Log.deleteMany({}).where('DateTime').lte(date).exec();
            console.log(remove);
            let result = Reflect.get(remove, 'deletedCount');
            res.status(200).json({ ItemsSuccessfullyRemoved: result });
            next();
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ message: "Internal Error" });
            next();
        }
    }
    else {
        res.status(400).send({ message: "Bad Request" });
    }
}));
dbconnector_1.connectToDBAsync().then(result => console.log(result)).catch(error => console.error(error));
app.listen(port, () => {
    console.log(`Server running Url: ${url}`);
    console.log(`ProcessID: ${process.pid}`);
    console.log(`Platform ${process.platform}`);
});
