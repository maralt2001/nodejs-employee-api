import {Log} from '../models/log'
const mongoose = require ('mongoose')

module.exports = {

    GetAllLogs: async () => {

        let findlogs:Array<any> = await Log.find({}, {"__v": false})
        return  findlogs.map(logItem => {return {...logItem._doc, dateTime: setTimeFormat(logItem.dateTime)} } )
        
    },
    createLog: async (args:any) => {
        
        const newLogItem = new Log({
            _id: new mongoose.Types.ObjectId(),
            dateTime: new Date(),
            requestedUrl: args.logInput.requestedUrl,
            requestedProtocol: args.logInput.requestedProtocol,
            requestedMethod: args.logInput.requestedMethod

        })

        let result:any= await newLogItem.save()
        let {...properties} = result._doc
        properties.dateTime = setTimeFormat(properties.dateTime)
        return(properties)

    }

    
}

function setTimeFormat (timeItem:Date) {
      return timeItem.toLocaleString()  
}