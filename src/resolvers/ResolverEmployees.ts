import {Employee} from '../models/employee'
import { IEmployee } from '../models/iemployee';
const mongoose = require ('mongoose')

module.exports = {
    GetAllEmployees: async () => {
           
        let findUser:Array<JSON> = await Employee.find({}, { "__v": false});
        return findUser
    },
    
    GetOneEmployeeById: async (args:any) => {
        let findUser:Array<JSON> = await Employee.find(args, {"__v": false})
        return findUser[0]
        
    },
    GetRegexFirstnameEmployees: async (args:any) => {
        let findUser:Array<JSON> = await Employee.find({firstname: {$regex: "^"+args.firstnameRegex}}, {"__v": false})
        return findUser
    },
    GetRegexLastnameEmployees: async(args:any) => {
        let findUser:Array<JSON> = await Employee.find({lastname: {$regex: "^"+args.lastnameRegex}}, {"__v": false})
        return findUser
    },

    createEmployee: async (args:any) => {

    const newEmployee = new Employee({
        _id: new mongoose.Types.ObjectId(),
        id: args.employeeInput.id,
        firstname:  args.employeeInput.firstname,
        lastname: args.employeeInput.lastname})
          
       let result:IEmployee = await newEmployee.save() 
       let savedEmployee = {id: result.id, firstname: result.firstname, lastname: result.lastname}
       return savedEmployee;
        
    },

    updateEmployeeId: async(args:any) => {
        
         return await Employee.findOneAndUpdate({id:args.currentId}, {$set: {id:args.newId}},{'useFindAndModify': false})
    },
    updateEmployeeFirstname: async(args:any) => {
        
        return await Employee.findOneAndUpdate({id:args.id}, {$set: {firstname:args.newFirstname}},{'useFindAndModify': false})
    },
    updateEmployeeLastname: async(args:any) => {

        return await Employee.findOneAndUpdate({id:args.id}, {$set: {lastname:args.newLastname}},{'useFindAndModify': false})
    }
}
