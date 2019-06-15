"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require('dotenv').config();
const WorkingDBConnectionString = process.env.DB_ConnectionString;
const employee_1 = require("../models/employee");
const mongoose = require('mongoose');
// Connect to database async - return a promise of string
function connectToDBAsync() {
    let p = new Promise(function (resolve, reject) {
        mongoose.connect(WorkingDBConnectionString, { useNewUrlParser: true }, function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve("DB is Connected...");
            }
        });
    });
    return p;
}
exports.connectToDBAsync = connectToDBAsync;
// check a http request body if it is empty - return a boolean
function CheckDBResponseIsEmpty(content) {
    if (content.length > 0) {
        return false;
    }
    else {
        return true;
    }
}
exports.CheckDBResponseIsEmpty = CheckDBResponseIsEmpty;
// save a Employee to database
function SaveEmployeeAsync(content) {
    let p = new Promise((resolve, reject) => {
        try {
            const employee = new employee_1.Employee({
                _id: new mongoose.Types.ObjectId(),
                id: content.id,
                firstname: content.firstname,
                lastname: content.lastname
            });
            let saveUser = employee.save();
            resolve(true);
        }
        catch (error) {
            reject(false);
        }
    });
    return p;
}
exports.SaveEmployeeAsync = SaveEmployeeAsync;
