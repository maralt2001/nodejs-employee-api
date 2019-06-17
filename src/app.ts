
import express, {Application, Request, Response, NextFunction} from 'express';
import {connectToDBAsync, CheckDBResponseIsEmpty, SaveEmployeeAsync} from "./database/dbconnector"
import {Employee} from './models/employee'
import {Log} from './models/log'
import {ILogItem} from './models/ilog'
import {logger} from "./events/eventListener"
import {isEmptyObject, IQueryLogBody, GetStartEndDate, IObjectStartEndDate, GetQuery, ValidateUser} from "./tools/tools"

const dotenv = require('dotenv').config()
const mongoose = require ('mongoose')

// set init params of the app
const app: Application = express();
const port = process.env.App_Port
const url:string = `http://localhost:${port}/api/employees`

app.use(express.json())

// Get all Employees from Collection employees (mongodb://localhost/WebDB)
app.get('/api/employees', async (req: Request, res: Response, next: NextFunction) => {
    
        let props = req.query
        let counter = Object.keys(props).length
        // if query in request do this
        if(counter != 0) {
            
            let firstname = props.firstname
            let lastname = props.lastname

            if('firstname' in props && 'lastname' in props && counter == 2) {
                
                let findUser:Array<JSON> = await Employee.find({firstname: {$regex: "^"+firstname}, lastname:{$regex: "^"+lastname}}, {"_id": false, "__v": false});
                let check = CheckDBResponseIsEmpty(findUser)
                check == false ? res.status(200).json(findUser) : res.status(500).json({message: 'user not found'})
                logger.emit('infoRequest', req);
                return next()
                
            }
            if('firstname' in props && counter == 1) {
                
                let findUser:Array<JSON> = await Employee.find({firstname: {$regex: "^"+firstname}}, {"_id": false, "__v": false});
                let check = CheckDBResponseIsEmpty(findUser)
                check == false ? res.status(200).json(findUser) : res.status(500).json({message: 'user not found'})
                logger.emit('infoRequest', req);
                return next()
            }
            if('lastname' in props && counter == 1) {
                
                let findUser:Array<JSON> = await Employee.find({lastname: {$regex: "^"+lastname}}, {"_id": false, "__v": false});
                let check = CheckDBResponseIsEmpty(findUser)
                check == false ? res.status(200).json(findUser) : res.status(500).json({message: 'user not found'})
                logger.emit('infoRequest', req);
                return next()
                
            }
            // unexpected query do this
            else {
                res.status(500).json({message: 'This is a invalid Parameter'})
                return next()
            }
            
        }
        // else no query in request do this
        else {

            try {
            
                let findUser:Array<JSON> = await Employee.find({}, {"_id": false, "__v": false});
                let check = CheckDBResponseIsEmpty(findUser);

                if (check == true) {
                    res.status(204).send({message: "No Employees in DB"})
                    return next()
                } 
                else {
                    res.status(200).json(findUser)
                    logger.emit('infoRequest', req);
                    return next()
                }
            }

            catch (error) {
                console.log(error);
                res.status(500).send({message: "Internal Error"})
                next();
            }
        }

});

// Get one Employee from Collection employees
app.get('/api/employees/:id', async (req, res, next) => {

    let userID:number = req.params.id;

    try {

        let findUser:Array<JSON> = await Employee.find({id: userID}, {"_id":false, "__v":false});
        let response = CheckDBResponseIsEmpty(findUser);

        if (response == true) {
            res.status(404).send({message: "No Employee found with this ID"})
            return next()
        }
        else {
            res.status(200).json(findUser)
            logger.emit('infoRequest',req)
            return next()
        }


    } catch (error) {
        console.log(error);
        res.status(500).send({message: "Internal Error"})
        next();
    }


})

// Get Logs from Collection logs (mongodb://localhost/WebDB)
app.get('/api/logger/', async (req, res, next) => {

    let query:IQueryLogBody = req.query
    
    if (isEmptyObject(query)) {
        try {
        
            let logitems:Array<ILogItem> = await Log.find({}, {"_id":false, "__v":false});
            res.status(200).json(logitems)
            return next()
    
        } catch (error) {
            
        } 
    }
    else {
        try {
            let startEnde= GetStartEndDate(query) as IObjectStartEndDate;
            let start = startEnde.startDate;
            let end = startEnde.endDate;

            if(start != undefined && end != undefined) {
                let result:Array<ILogItem> = await Log.find({}, {"_id":false, "__v":false}).where('DateTime').gte(start).lte(end).exec()
                res.status(200).json(result)
                next()
            }
            else {
                res.status(400).send({message: "Bad Request"})
            }
        }
        catch {
            res.status(400).send({message: "Bad Request"})
        }
    }

})

// set new Employee to Collection employees
app.post('/api/employees', async (req, res, next) => {
    
    let isEmployee = ValidateUser(req.body)
   
    if(isEmployee) {
       
        let result = await SaveEmployeeAsync(req.body)
        
        if (result) {
            res.status(200).send({message: 'Employee is saved into db'});
            logger.emit('infoRequest', req)
            next()
        }
        else{
            res.status(500).send({message: 'Internal error'})
            next()
        }
    }
    else {
        
        res.status(500).send({message: 'Internal error'})
    }
})

// patch one Employee by id in Collection employees
app.patch('/api/employees/:id', async (req, res, next) => {
  

    
    try {
        let update =  await Employee.findOneAndUpdate({id:req.params.id}, {$set: req.body},{'useFindAndModify': false})

        res.status(200).json({update: `done id = ${update.id}`}) 
        logger.emit('infoRequest', req) 
        return next()

    } 
    catch (error) {
        res.status(500).json({result: error})
        return next()
        
    }
    
    

})

// delete logs in Collection logs
app.delete('/api/logger/delete/', async (req, res, next) => {

    let query:IQueryLogBody = req.query
    

    if('day' in query && 'month' in query) {
        
        let today = new Date()
        let day = query.day
        let month = query.month
        let year = today.getFullYear()
        let date = new Date(year,month -1, day,23,59)

        try {
           
            let remove:Object = await Log.deleteMany({}).where('DateTime').lte(date).exec()
            console.log(remove)
            let result = Reflect.get(remove, 'deletedCount')
        
            res.status(200).json({ItemsSuccessfullyRemoved: result})
            next()
            
        } catch (error) {
            
            console.log(error);
            res.status(500).send({message: "Internal Error"})
            next();

        }

    }
    else {
        res.status(400).send({message: "Bad Request"})
    }

})

// Method to connect the database 
connectToDBAsync().then(
    result => console.log(result)
).catch(
    error => console.error(error)
)

// Create Webserver on Port .env.App_Port - Print aditonal information
app.listen(port, () => {
    console.log(`Server running Url: ${url}`);
    console.log(`ProcessID: ${process.pid}`);
    console.log(`Platform ${process.platform}`)
});

