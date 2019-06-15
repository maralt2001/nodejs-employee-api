
const mongoose = require ('mongoose')

const logSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    DateTime: Date,
    RequestedUrl: String,
    RequestedProtocol: String,
    RequestedMethod: String
})

export const Log = mongoose.model('Log', logSchema)