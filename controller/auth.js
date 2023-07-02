// Password Hash Library
import bcryptjs from 'bcryptjs';

// Importing JWT library
import jwt from 'jsonwebtoken';
import db from "../Database/db.js";
// Importing function to create custom errors
import createError from "../Utils/error.js";


export const register = (req,res,next) => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const TodayDate = day + "/" + month + "/" + year;
    //TodayDate

    // declare all characters
const characters ='0123456789';

    try {
   const id = req.body.id;
   const Name = req.body.Name;
   const DOB = req.body.DOB;
   const Email = req.body.Email;
   // Password Encryption
   const Password = req.body.Password;
   const salt = bcryptjs.genSaltSync(10);
   const hash = bcryptjs.hashSync(Password,salt);   // Password
   const MobNo = req.body.MobNo;
   const JoiningDate = TodayDate;
   const Address = req.body.Address;
   const PanNo = req.body.PanNo;
   const LeadType = "Lead";
   console.log(req.body);
   //1st sql to check email if it already exists
   const sql = `SELECT * from user where Email = "${Email}";`;
   db.query(sql, (err,result)=>{
    if(err) throw err;
    if(result[0]==null){
        let sql = "";
        if(req.body.isEmployee == 1){
            sql = `INSERT INTO user (Name, DOB, Email,Password, MobNo, JoiningDate, Address, PanNO,LeadType,isEmployee) VALUES ("${req.body.Name}","${req.body,DOB}" , "${req.body.Email}", "${hash}", "${req.body.MobNo}", "${JoiningDate}", "${req.body.Address}", "${req.body.PanNo}","${LeadType}", ${req.body.isEmployee});`
        }else{
            sql = `INSERT INTO user (Name, DOB, Email,Password, MobNo, JoiningDate, Address, PanNO,LeadType) VALUES ("${req.body.Name}","${req.body,DOB}" , "${req.body.Email}", "${hash}", "${req.body.MobNo}", "${JoiningDate}", "${req.body.Address}", "${req.body.PanNo}","${LeadType}");`
        }
        db.query(sql, (err,result)=>{
            if(err) throw err;
            res.json({Message:"User registered successfully"});
        }) 
    }else{
        res.json({Message:"User already exist"});
    }
   })

  
    } catch (error) {
        next(error);
    }
}

export const login =  (req, res, next) => {
    try {
        console.log(req.body);
        const email = req.body.username;
        const sql = `Select * from user where Email = "${email}";`;
        db.query(sql,async (err,result)=>{
            if(err) throw err;
            if(result[0]==null) return next(createError(404,"User not found!"));
            const isPasswordCorrect = await bcryptjs.compare(req.body.password,result[0].Password );
            if(!isPasswordCorrect)  return next(createError(400, "Wrong password or Username"));
            // Creating Token
            const token = jwt.sign({id:result[0].id,isEmployee:result[0].isEmployee},"umzaFvjKJEGNr6+EgbX1Iramyrw7ZUg0CddezpxppVY=");
            res.cookie("access_token",token,{
                httpOnly:true,
            }).status(200).send(result[0]);
        })  
    } catch (error) {
        next(error);
    }
}

export const forgotPassword = (req, res, next) => {
    try {
        const email = req.body.email;
        const DOB = req.body.DOB;
       
        const NewPassword = email.substring(0,5) + DOB.substring(0,4);
        const salt = bcryptjs.genSaltSync(10);
        const hash = bcryptjs.hashSync(NewPassword,salt);   // Password


        console.log(NewPassword);
        const sql = `Select * from user where Email = "${email}" and DOB = "${DOB}"`;
        db.query(sql,async (err,result)=>{
            if(err) throw err;
            if(result[0]==null) return next(createError(404,"User not found!"));
            else{
                const sql2 = `Update user set Password = "${hash}" where Email = "${email}" and DOB = "${DOB}"`;
                db.query(sql2,async (err,result)=>{
                    if(err) throw err;
                    res.status(200).send("Password updated");
                })
            }
        }) 
    } catch (error) {
        next(error);
    }
}