const Author = require('../models/Author') 

exports.getMe = async (req, res, next) => { 
   try {
      const author = await Author.find() 
      res.status(200).json({ 
         status: 'success', 
         data: { author: author[0] } 
      }) 
   } 
   catch (error) { 
      next({statusCode: 404, status: 'Fail', message: 'Author not found!'}) 
   } 
} 



exports.updateMe = async (req, res, next) => { 
   try { 
      if(req.body.password || req.body.confirmPassword) { 
         next({statusCode: 400, status: 'Fail', message: 'This route is not for password update'}) 
      } 

      const freshAuthorData = await Author.findByIdAndUpdate( 
         {_id: req.author._id}, 
         req.body, 
         { new: true, runValidators: true } 
      ) 
      
      res.status(200).json({ 
         status: 'success', 
         data: { author: freshAuthorData } 
      }) 
   } 
   catch (error) { 
      next({statusCode: 400, status: 'Fail', message: 'Cannot update'}) 
   } 
} 



exports.updateMyPassword = async (req, res, next) => { 
   try { 
      const { currentPassword, newPassword, confirmPassword } = req.body 
      const author = await Author.findById(req.author._id).select('+password') 
      
      const result = await author.comparePassword(currentPassword, author.password) 
      if(!author || !result) {
         next({statusCode: 400, status: 'Fail', message: 'Wrong Password'})
      } 

      author.password = newPassword 
      author.confirmPassword = confirmPassword 
      const freshAuthorData = await author.save() 

      res.status(200).json({ 
         status: 'success', 
         data: { author: freshAuthorData } 
      }) 
   } 
   catch (error) { 
      next({statusCode: 400, status: 'Fail', message: 'No user found'}) 
   } 
} 


