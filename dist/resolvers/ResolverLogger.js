"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = require("../models/log");
const mongoose = require('mongoose');
module.exports = {
    GetAllLogs: () => __awaiter(this, void 0, void 0, function* () {
        let findlogs = yield log_1.Log.find({}, { "__v": false });
        return findlogs.map(logItem => { return Object.assign({}, logItem._doc, { dateTime: logItem.dateTime.toUTCString() }); }); //change date Format to UTC String
    }),
    createLog: (args) => __awaiter(this, void 0, void 0, function* () {
        const newLogItem = new log_1.Log({
            _id: new mongoose.Types.ObjectId(),
            DateTime: new Date(),
            RequestedUrl: args.logInput.requestedUrl,
            RequestedProtocol: args.logInput.requestedProtocol,
            RequestedMethod: args.logInput.requestedMethod
        });
        let result = yield newLogItem.save();
        let properties = __rest(result._doc, []);
        properties.dateTime = properties.dateTime.toUTCString();
        return (properties);
    })
};
