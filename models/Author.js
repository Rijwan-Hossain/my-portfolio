const mongoose = require('mongoose'); 
const validator = require('validator'); 
const bcrypt = require('bcryptjs'); 

const authorSchema = new mongoose.Schema({ 
   // Authentication related data 
   name: { type: String, trim: true, required: [true, 'Author must have a name'] }, 
   email: { 
      type: String, trim: true, unique: true, lowercase: true, required: [true, 'Author must have a name'], 
      validate: [validator.isEmail, 'Please provide a valid email'] 
   }, 
   password: { type: String, trim: true, select: false, minlength: 6, required: [true, 'Author must have a password'] }, 
   confirmPassword: { 
      type: String, trim: true, required: [true, 'Author must confirm the password'], select: false, minlength: 6, 
      validate: { 
         validator: function(value) { 
            return value === this.password
         }, 
         message: 'Password doesn\'t match'
      } 
   }, 
   role: { type: String, enum: ['author', 'moderator', 'others'], default: 'author' }, 


   // Other Staffs
   i_am_a: [String], 
   about: String, 
   photo: { type: String, trim: true, default: '' }, 
   contact: { email: [String], fbLink: String, linkdinLink: String, phoneNo: [String], address: String }, 
   education: [ { degree: String, institute: String, duration: String } ], 
   skill: { list: [String], technologies: [String] }, 
   achievements: { 
      academic: [{ title: String, description: String }], 
      programming_contest: [{ title: String, description: String }], 
   }, 
   projects: { 
      list: [{ name: String, technology: String, source_code: String, demo_link: String }], 
      description: String 
   }, 
   experience: [ 
      { 
         company_name: String, position: String, 
         time_duration: String, office_location: String 
      } 
   ], 
   sendMessage: [{ name: String, email: String, subject: String, message: String }] 
}, 
{ 
   timestamps: true, 
   toJSON: { virtuals: true }, 
   toObject: { virtuals: true } 
}) 

// Mongoose Middleware - Runs before saving document
authorSchema.pre('save', async function(next) {
   this.password = await bcrypt.hash(this.password, 12)
   this.confirmPassword = undefined
   next(); 
}) 


authorSchema.methods.comparePassword = async (incomingPassword, authorPassword) => {
   const result = await bcrypt.compare(incomingPassword, authorPassword)
   return result;
}


const Author = mongoose.model('Author', authorSchema)
module.exports = Author; 