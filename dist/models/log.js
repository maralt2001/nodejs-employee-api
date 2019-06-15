"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const logSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    DateTime: Date,
    RequestedUrl: String,
    RequestedProtocol: String,
    RequestedMethod: String
});
exports.Log = mongoose.model('Log', logSchema);
