const {createLogger, transports, format } = require('winston')

const logger = createLogger({
    transports:[
        new transports.Console({
            level:'info'
        })
    ]
})

module.exports = logger;