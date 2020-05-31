const express = require('express'); 
const morgan = require('morgan'); 
const helmet = require('helmet'); 
const xss = require('xss-clean');
const hpp = require('hpp'); 
const rateLimit = require('express-rate-limit'); 
const mongoSanitize = require('express-mongo-sanitize');
const authorRouter = require('./routes/authorRoute')

const app = express() 

// Middleware Stack 
app.use(helmet()) 
app.use(express.json())
app.use(mongoSanitize()) 
app.use(xss()) // clean malacious html code 
app.use(hpp({ 
   whitelist: ['name', 'duration'] 
})) 
app.use(morgan('short'))
const rateLimiter = rateLimit({ 
   windowMS: 60 * 60 * 1000, 
   max: 500, 
   message: 'Too many request from this IP. Try again after an hour.'
}) 
app.use('/api', rateLimiter) 


// Routes 
app.use('/api/v1/author', authorRouter) 

// No route match 
app.all('*', (req, res, next) => { 
   next({ 
      statusCode: 404, 
      status: 'Fail', 
      message: `can't find ${req.originalUrl} on this server!` 
   }) 
}) 


// Global Error Handler
app.use((err, req, res, next) => {
   err.statusCode = err.statusCode || 500; 
   err.status = err.status || 'Server Error' 

   res.status(err.statusCode).json({
      status: err.status, 
      message: err.message
   }) 
}) 

module.exports = app; 