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
const log_1 = require("../models/log");
const mongoose = require('mongoose');
const EventEmitter = require('events');
class Logger extends EventEmitter {
}
exports.logger = new Logger();
exports.logger.on('event', () => {
    console.log("One Event occured");
});
exports.logger.on('infoRequest', (data) => {
    let url = data.url;
    let dateTime = new Date();
    let protocol = data.protocol;
    let method = data.method;
    WriteLogItemToDB(dateTime, url, protocol, method).then(resolve => console.log(`[${resolve.dateTime.toLocaleTimeString()}] [Request Url] = ${resolve.requestedUrl} [Request Protocol] = ${resolve.requestedProtocol} [Request Method] = ${resolve.requestedMethod}`), reject => console.error(reject));
    function WriteLogItemToDB(date, content, protocol, method) {
        return __awaiter(this, void 0, void 0, function* () {
            let log = new log_1.Log({
                _id: new mongoose.Types.ObjectId(),
                dateTime: date,
                requestedUrl: content,
                requestedProtocol: protocol,
                requestedMethod: method
            });
            let p = new Promise(function (resolve, reject) {
                try {
                    let z = log.save();
                    resolve(z);
                }
                catch (error) {
                    reject(error);
                }
            });
            return p;
        });
    }
});
