
const mongoose = require ('mongoose')

const employeeShema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id: Number,
    firstname: String,
    lastname: String
})

export const Employee = mongoose.model('Employee', employeeShema);
