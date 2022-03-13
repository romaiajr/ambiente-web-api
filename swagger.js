const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./start/routes.js']

swaggerAutogen(outputFile, endpointsFiles).then(() => {
    require('./start/app')
})