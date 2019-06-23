export const {buildSchema} = require ('graphql')

module.exports = buildSchema(`
type Employee {
    id: Int!
    firstname: String!
    lastname: String!
}    

type EmployeeQuery {
    GetAllEmployees: [Employee!]!
    GetOneEmployeeById(id: Int): Employee!
    GetRegexFirstnameEmployees(firstnameRegex: String): [Employee!]!
    GetRegexLastnameEmployees(lastnameRegex: String): [Employee!]!
    
}

input EmployeeInput {
    id: Int!
    firstname: String!
    lastname: String!
}

type EmployeeMutation {
    createEmployee(employeeInput: EmployeeInput): Employee
    updateEmployeeId(currentId: Int, newId: Int): Employee
    updateEmployeeFirstname(id: Int, newFirstname: String): Employee
    updateEmployeeLastname(id: Int, newLastname: String): Employee
}

schema {
    query: EmployeeQuery
    mutation: EmployeeMutation
}
`)
