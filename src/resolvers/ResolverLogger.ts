import {Log} from '../models/log'
import {ILogItem} from '../models/ilog'
import { log } from 'util';
import { addErrorLoggingToSchema } from 'graphql-tools';
const mongoose = require ('mongoose')

module.exports = {

    GetAllLogs: async () => {

        let findlogs:Array<any> = await Log.find({}, {"__v": false})
        return  findlogs.map(logItem => {return {...logItem._doc, dateTime: logItem.dateTime.toUTCString()} } ) //change date Format to UTC String
        
    },
    createLog: async (args:any) => {

        
        const newLogItem = new Log({
            _id: new mongoose.Types.ObjectId(),
            DateTime: new Date(),
            RequestedUrl: args.logInput.requestedUrl,
            RequestedProtocol: args.logInput.requestedProtocol,
            RequestedMethod: args.logInput.requestedMethod

        })

        let result:any= await newLogItem.save()
        let {...properties} = result._doc
        properties.dateTime  = properties.dateTime.toUTCString()
        
        return(properties)

    }
}