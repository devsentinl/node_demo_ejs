const express=require('express')
const app=express()
const expressLayouts=require('express-ejs-layouts')
const passport=require('passport')
const mongoose = require('mongoose')
const flash=require('connect-flash')
const session=require('express-session')

const db=require('./config/keys').MONGO_URL

require('./config/passport')(passport)
// connect to mongo
mongoose.connect(db,{useNewUrlParser:true})
        .then(()=>{
            console.log('db connected')
        })
        .catch((e)=>{
            console.log(e)
        })
//ejs
app.use(expressLayouts)
app.set('view engine','ejs')

app.use(express.urlencoded({urlencoded:false}))

app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true,
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg')
    res.locals.error_msg=req.flash('error_msg')
    res.locals.error=req.flash('error')
    next()
})
//routes
app.use(require('./routes/index'))
app.use('/users',require('./routes/users'))

const PORT=process.env.PORT || 5000
app.listen(PORT,console.log(`server started on port ${PORT}`))