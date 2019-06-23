import express, {Application, Request, Response, NextFunction} from 'express';
import {ILogItem} from '../models/ilog'
import {Log} from '../models/log'

const mongoose = require ('mongoose')
const EventEmitter = require('events');

class Logger extends EventEmitter{}
export const logger = new Logger();

logger.on('event', () => {
    console.log("One Event occured")
}) 

logger.on('infoRequest', (data:Request) => {
    let url = data.url;
    let dateTime = new Date();
    let protocol = data.protocol;
    let method = data.method;
   
    WriteLogItemToDB(dateTime,url,protocol,method).then(
        resolve => console.log(`[${resolve.dateTime.toLocaleTimeString()}] [Request Url] = ${resolve.requestedUrl} [Request Protocol] = ${resolve.requestedProtocol} [Request Method] = ${resolve.requestedMethod}`),
        reject => console.error(reject)
    )

    async function WriteLogItemToDB(date:Date, content:String, protocol:String, method:String):Promise<ILogItem> {
        let log = new Log({
            _id: new mongoose.Types.ObjectId(),
            dateTime: date,
            requestedUrl: content,
            requestedProtocol: protocol,
            requestedMethod: method            
        });
       
        let p = new Promise<ILogItem>(function(resolve,reject){
            try {
                let z = log.save();
                resolve(z)
            } catch (error) {
                reject(error)
            }
        })
        return p;
    }
   
})