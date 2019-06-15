"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const employeeShema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id: Number,
    firstname: String,
    lastname: String
});
exports.Employee = mongoose.model('Employee', employeeShema);
