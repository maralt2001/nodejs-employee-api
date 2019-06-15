"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isEmptyObject(check) {
    for (var prop in check) {
        if (check.hasOwnProperty(prop)) {
            return false;
        }
    }
    return true;
}
exports.isEmptyObject = isEmptyObject;
function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}
function GetStartEndDate(query) {
    let startDate;
    let endDate;
    let result = new Object();
    let counter = Object.keys(query).length;
    if (counter == 3) {
        startDate = new Date(query.year, query.month - 1, query.day, 0, 0);
        endDate = new Date(query.year, query.month - 1, query.day, 23, 59);
        result.startDate = startDate;
        result.endDate = endDate;
    }
    else {
        if (counter == 2) {
            if ("day" in query && "month" in query) {
                let today = new Date();
                let year = today.getFullYear();
                startDate = new Date(year, query.month - 1, query.day, 0, 0);
                endDate = new Date(year, query.month - 1, query.day, 23, 59);
                result.startDate = startDate;
                result.endDate = endDate;
            }
            if ("month" in query && "year" in query) {
                let day = daysInMonth(query.month, query.year);
                startDate = new Date(query.year, query.month - 1, 1, 0, 0);
                endDate = new Date(query.year, query.month - 1, day, 23, 59);
                result.startDate = startDate;
                result.endDate = endDate;
            }
        }
        if (counter == 1) {
            if ("day" in query) {
                let today = new Date();
                let year = today.getFullYear();
                let month = today.getMonth();
                startDate = new Date(year, month, query.day, 0, 0);
                endDate = new Date(year, month, query.day, 23, 59);
                result.startDate = startDate;
                result.endDate = endDate;
            }
            if ("month" in query) {
                let today = new Date();
                let year = today.getFullYear();
                let day = daysInMonth(query.month, year);
                startDate = new Date(year, query.month - 1, 1, 0, 0);
                endDate = new Date(year, query.month - 1, day, 23, 59);
                result.startDate = startDate;
                result.endDate = endDate;
            }
            if ("year" in query) {
                startDate = new Date(query.year, 0, 1, 0, 0);
                endDate = new Date(query.year, 11, 31, 23, 59);
                result.startDate = startDate;
                result.endDate = endDate;
            }
        }
    }
    return result;
}
exports.GetStartEndDate = GetStartEndDate;
function GetQuery(query) {
    //let z = Object.getOwnPropertyDescriptor(query, "year")
    let year = Reflect.has(query, 'year');
    let month = Reflect.has(query, "month");
    let day = Reflect.has(query, "day");
    let result = { year: year, month: month, day: day };
    console.log(result);
    return result;
}
exports.GetQuery = GetQuery;
function ValidateUser(employee) {
    let id = Reflect.has(employee, 'id');
    let firstname = Reflect.has(employee, 'firstname');
    let lastname = Reflect.has(employee, 'lastname');
    if (id && firstname && lastname) {
        return true;
    }
    else {
        return false;
    }
}
exports.ValidateUser = ValidateUser;
