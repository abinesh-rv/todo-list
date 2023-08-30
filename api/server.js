const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const Todo = require("./model/Todo")
const bcrypt = require("bcrypt")
const Users = require("./model/users.js")

const app = express()

const PORT = process.env.PORT || 4040

app.use(express.json())
app.use(cors())

mongoose.connect("mongodb+srv://abinesh:qwert12345@cluster0.guajhff.mongodb.net/?retryWrites=true&w=majority");

app.get("/todos/:userid",async(req,res) => {
    const todos = await Todo.find({"user":req.params.userid})
    res.json(todos)
})

app.post("/todo/new/:userid",(req,res)=>{
    const todo = new Todo({
        text:req.body.text,
        user:req.params.userid
    })

    todo.save()

    res.json(todo)
})

app.delete("/todo/delete/:id",async(req,res) => {
    const result = await Todo.findByIdAndDelete(req.params.id)

    res.json(result)

})

app.get("/todo/complete/:id",async (req,res) => {
    
    const todo = await Todo.findById(req.params.id);

    todo.complete=!todo.complete

    todo.save()

    res.json(todo)
})

app.post("/login",async(req,res) => {
    const {email,password} = req.body
    const CheckUser = await Users.findOne({email})
    if(!CheckUser){
      return res.json({status:false,msg:"the email does not found,please create an account"})
    }
    const PassCompare = await bcrypt.compare(password,CheckUser.password)
    if(!PassCompare){
      return res.json({status:false,msg:"the password does not match"})
    }
    return res.json({status:true,user:CheckUser})
})

app.post("/register",async (req,res) => {
    const {username,password,email} = req.body
    const CheckEmail =await Users.findOne({email})
    if(CheckEmail){
        return res.json({status:false,msg:"the email already exists"})
    }
    const hash =await bcrypt.hash(password,10)
    const user = await Users.create({
        username,
        email,
        password:hash
    })
    await user.save()
    return res.json({status:true,user:user})
})

app.listen(PORT)