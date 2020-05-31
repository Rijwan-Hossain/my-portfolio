const jwt = require('jsonwebtoken') 
const util = require('util') 
const Author = require('../models/Author') 

exports.signup = async (req, res, next) => { 
   try { 
      const author = await Author.create({ 
         name: req.body.name, 
         email: req.body.email, 
         password: req.body.password, 
         confirmPassword: req.body.confirmPassword, 
         contact: req.body.contact
      }) 
      
      res.status(201).json({ 
         status: 'Success', 
         data: { author } 
      }) 
   } 
   catch (error) { 
      return next({ statusCode: 400, status: 'Fail', message: error.message }) 
   } 
} 



exports.login = async (req, res, next) => { 
   try { 
      // 1) Check if email & password exist
      // 2) Check whether user exists & password is correct 
      // 3) If all OK, create & send token

      const {email, password} = req.body; 
      if(!email || !password) { 
         return next({statusCode: 400, status: 'Fail', message: 'Email & Password Required'})
      } 

      const author = await Author.findOne({email}).select('+password') 
      if(!author) { 
         return next({ statusCode: 401, status: 'Fail', message: 'Wrong email. Please signup' }) 
      } 
      
      const result = await author.comparePassword(password, author.password) 
      if(!result) { 
         return next({ statusCode: 401, status: 'Fail', message: 'Wrong email or password' }) 
      } 

      const token = jwt.sign( 
         {id: author._id}, 
         process.env.JWT_SECRET, 
         {expiresIn: process.env.JWT_EXPIRES_IN} 
      ) 
      return res.status(200).json({ 
         status: 'success', 
         token 
      }) 
   } 
   catch (error) { 
      return next({ statusCode: 400, status: 'Fail', message: error.message }) 
   } 
} 



exports.protect = async (req, res, next) => { 
   try { 
      let token; 
      if(req.headers.authorization) { 
         if(req.headers.authorization.startsWith('Bearer')) { 
            token = req.headers.authorization.split(' ')[1] 
         } 
      } 
      if(!token) { 
         return next({ statusCode: 401, status: 'Fail', message: 'Signin to access' }) 
      } 

      let decoded; 
      try { 
         decoded = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET)
      } 
      catch (error) {
         return next({ statusCode: 401, status: 'Fail', message: 'Signin again' }) 
      } 

      const author = await Author.findById(decoded.id) 
      if(!author) { 
         return next({ statusCode: 404, status: 'Fail', message: 'No author found' }) 
      } 
      req.author = author; 

      next(); 
   } 
   catch (error) { 
      return next({ statusCode: 401, status: 'Fail', message: 'Signin again' }) 
   } 
} 



exports.restrictTo = (...roles) => { 
   return (req, res, next) => { 
      if(!roles.includes(req.author.role)) { 
         return next({ 
            statusCode: 403, 
            status: 'Fail', 
            message: 'You do not have permission to perform this action' 
         }) 
      } 

      next(); 
   } 
} 


