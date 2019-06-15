import {IEmployee} from '../models/iemployee'


export function isEmptyObject(check:Object): Boolean {
    for(var prop in check) {
       if (check.hasOwnProperty(prop)) {
          return false;
       }
    }

    return true;
}

function daysInMonth (month:number, year:number) {
   return new Date(year, month, 0).getDate();
}

export interface IQueryLogBody {

   day: number
   month: number
   year: number

}
export interface IObjectStartEndDate {
   startDate: Date
   endDate: Date
}

export function GetStartEndDate (query:IQueryLogBody): Object{

       let startDate:Date
       let endDate:Date

       let result = new Object() as IObjectStartEndDate

       let counter = Object.keys(query).length
      
      if(counter == 3) {

         startDate = new Date(query.year, query.month -1, query.day, 0,0)
         endDate = new Date(query.year, query.month -1, query.day, 23,59)
         result.startDate = startDate
         result.endDate = endDate
      }
      else {

         if(counter == 2) {

            if("day" in query && "month" in query) {
               let today = new Date()
               let year = today.getFullYear()
               startDate = new Date(year,query.month -1,query.day,0,0)
               endDate = new Date(year, query.month -1, query.day, 23,59)
               result.startDate = startDate
               result.endDate = endDate
            }
            if("month" in query && "year" in query) {
               let day = daysInMonth(query.month,query.year)
               startDate = new Date(query.year, query.month -1, 1, 0,0)
               endDate = new Date(query.year, query.month -1, day, 23, 59)
               result.startDate = startDate
               result.endDate = endDate
            }

         }

         if(counter == 1) {
            
            if("day" in query) {
               let today = new Date()
               let year = today.getFullYear()
               let month = today.getMonth()
               startDate = new Date(year,month ,query.day,0,0)
               endDate = new Date(year,month ,query.day,23,59)
               result.startDate = startDate
               result.endDate = endDate
            }
            if("month" in query) {
               let today = new Date()
               let year = today.getFullYear()
               let day = daysInMonth(query.month,year)
               startDate = new Date(year, query.month -1, 1, 0,0)
               endDate = new Date(year, query.month -1, day, 23, 59)
               result.startDate = startDate
               result.endDate = endDate
            }
            if("year" in query) {
               startDate = new Date(query.year,0,1,0,0)
               endDate = new Date(query.year,11,31,23,59)
               result.startDate = startDate
               result.endDate = endDate
            }


         }
      }
      return result

}

export function GetQuery(query:IQueryLogBody):Object {

   //let z = Object.getOwnPropertyDescriptor(query, "year")
   let year = Reflect.has( query, 'year')
   let month = Reflect.has(query, "month")
   let day = Reflect.has(query, "day")
   
   let result = {year: year, month: month, day:day}
   console.log(result)
   return result
}

export function ValidateUser(employee:IEmployee):Boolean {

   let id = Reflect.has(employee, 'id')
   let firstname = Reflect.has(employee, 'firstname')
   let lastname = Reflect.has(employee, 'lastname')
   
   if(id && firstname && lastname) {
      return true
   }
   else {
      return false
   }
}



