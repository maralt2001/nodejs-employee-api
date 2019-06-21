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
const ResolverEmployee = require('./resolvers/ResolverEmployees');
const SchemaEmployee = require('./schemas/SchemaEmployees');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
// set init params of the app
const app = express_1.default();
const port = process.env.App_Port;
const url = `http://localhost:${port}/api/employees`;
app.use(bodyParser.json());
// GraphQL Endpoint=/graphql
app.use('/graphql', graphqlHttp({
    schema: SchemaEmployee,
    rootValue: ResolverEmployee,
    graphiql: true
}));
// Get all Employees from Collection employees (mongodb://localhost/WebDB)
app.get('/api/employees', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let props = req.query;
    let counter = Object.keys(props).length;
    // if query in request do this
    if (counter != 0) {
        let firstname = props.firstname;
        let lastname = props.lastname;
        if ('firstname' in props && 'lastname' in props && counter == 2) {
            let findUser = yield employee_1.Employee.find({ firstname: { $regex: "^" + firstname }, lastname: { $regex: "^" + lastname } }, { "_id": false, "__v": false });
            let check = dbconnector_1.CheckDBResponseIsEmpty(findUser);
            check == false ? res.status(200).json(findUser) : res.status(500).json({ message: 'user not found' });
            eventListener_1.logger.emit('infoRequest', req);
            return next();
        }
        if ('firstname' in props && counter == 1) {
            let findUser = yield employee_1.Employee.find({ firstname: { $regex: "^" + firstname } }, { "_id": false, "__v": false });
            let check = dbconnector_1.CheckDBResponseIsEmpty(findUser);
            check == false ? res.status(200).json(findUser) : res.status(500).json({ message: 'user not found' });
            eventListener_1.logger.emit('infoRequest', req);
            return next();
        }
        if ('lastname' in props && counter == 1) {
            let findUser = yield employee_1.Employee.find({ lastname: { $regex: "^" + lastname } }, { "_id": false, "__v": false });
            let check = dbconnector_1.CheckDBResponseIsEmpty(findUser);
            check == false ? res.status(200).json(findUser) : res.status(500).json({ message: 'user not found' });
            eventListener_1.logger.emit('infoRequest', req);
            return next();
        }
        // unexpected query do this
        else {
            res.status(500).json({ message: 'This is a invalid Parameter' });
            return next();
        }
    }
    // else no query in request do this
    else {
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
    }
}));
// Get one Employee from Collection employees
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
// Get Logs from Collection logs (mongodb://localhost/WebDB)
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
// set new Employee to Collection employees
app.post('/api/employees', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let isEmployee = tools_1.ValidateUser(req.body);
    if (isEmployee) {
        let result = yield dbconnector_1.SaveEmployeeAsync(req.body);
        if (result) {
            res.status(200).send({ message: 'Employee is saved into db' });
            eventListener_1.logger.emit('infoRequest', req);
            next();
        }
        else {
            res.status(500).send({ message: 'Internal error' });
            next();
        }
    }
    else {
        res.status(500).send({ message: 'Internal error' });
    }
}));
// patch one Employee by id in Collection employees
app.patch('/api/employees/:id', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        let update = yield employee_1.Employee.findOneAndUpdate({ id: req.params.id }, { $set: req.body }, { 'useFindAndModify': false });
        res.status(200).json({ update: `done id = ${update.id}` });
        eventListener_1.logger.emit('infoRequest', req);
        return next();
    }
    catch (error) {
        res.status(500).json({ result: error });
        return next();
    }
}));
// delete logs in Collection logs
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
// Method to connect the database 
dbconnector_1.connectToDBAsync().then(result => console.log(result)).catch(error => console.error(error));
// Create Webserver on Port .env.App_Port - Print aditonal information
app.listen(port, () => {
    console.log(`Server running Url: ${url}`);
    console.log(`ProcessID: ${process.pid}`);
    console.log(`Platform ${process.platform}`);
});
