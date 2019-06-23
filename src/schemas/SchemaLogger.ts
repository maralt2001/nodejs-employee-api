const {buildSchema} = require ('graphql')

module.exports = buildSchema(`
type Logger {
    _id: ID!
    dateTime: String!
    requestedUrl: String
    requestedProtocol: String
    requestedMethod: String!
}    

type LoggerQuery {
    GetAllLogs: [Logger!]!
    
}

input LoggerInput {
    requestedUrl: String!
    requestedProtocol: String!
    requestedMethod: String!
}

type LoggerMutation {
    createLog(logInput: LoggerInput): Logger!
    
}

schema {
    query: LoggerQuery
    mutation: LoggerMutation
}
`)