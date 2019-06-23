
const mongoose = require ('mongoose')

const logSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    dateTime: Date,
    requestedUrl: String,
    requestedProtocol: String,
    requestedMethod: String
})

export const Log = mongoose.model('Log', logSchema)