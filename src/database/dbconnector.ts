
const dotenv = require('dotenv').config()
const WorkingDBConnectionString = process.env.DB_ConnectionString 

import {Employee} from '../models/employee'
import {IEmployee} from '../models/iemployee'

const mongoose = require ('mongoose')

// Connect to database async - return a promise of string
export function connectToDBAsync(): Promise<string> {

    let p = new Promise<string>(function(resolve,reject) {

        mongoose.connect(WorkingDBConnectionString, {useNewUrlParser: true}, function(err: any){

        if(err){
            
            reject(err);
        }
        else {

           resolve("DB is Connected...")
        }

    });

    })
    return p;
}

// check a http request body if it is empty - return a boolean
export function CheckDBResponseIsEmpty(content:Array<JSON>): Boolean {

    if (content.length >0) {
        return false;
    }
    else {
        return true;
    }
}

// save a Employee to database
export function SaveEmployeeAsync(content:IEmployee):Promise<boolean> {

    let p = new Promise<boolean>((resolve, reject) => {

        try {

            const employee = new Employee({
                _id: new mongoose.Types.ObjectId(),
                id: content.id,
                firstname:  content.firstname,
                lastname: content.lastname
            })
            let saveUser = employee.save()
            resolve(true)
            
        } catch (error) {
            reject(false)
        }
       


    })
    return p
}
