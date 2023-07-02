// Password Hash Library
import bcryptjs from 'bcryptjs';

// Importing Database 
import db from "../Database/db.js";

// Update Employee
export const updateEmployee = (req, res,next) => {
    try {
   
        const data= req.body;
        console.log(data);
          // Password Encryption
//    const Password = data.Password;
//    const salt = bcryptjs.genSaltSync(10);
//    const hash = bcryptjs.hashSync(Password,salt);   // Password

    //    const sql1 = `UPDATE user SET Email = "${data.Email}", Address =  "${data.Address}",DOB =  "${data.DOB}",MobNo=  "${data.MobNo}",Name =  "${data.Name}", Password = "${hash}",PanNo = "${data.PanNo}", LeadType = "${data.LeadType}" WHERE isEmployee = 1 and id = "${data.id}";`;
    //     db.query(sql1, (err,result)=>{
    //         if(err) throw err;
    //         res.send("Updated Employee successfully");
    //     }) 
    } catch (error) {
       next(error);
    }
}

// Delete Employee
export const deleteEmployee = (req, res,next) => {
    try {
        const id = req.params.id;
        console.log(id);
        const sql = `DELETE FROM user WHERE isEmployee = 1 and id = ${id};`;
        db.query(sql, (err,result)=>{
            if(err) throw err;
            res.send("Deleted Employee successfully");
        })  
    } catch (error) {
        next(error);
    }
}

// Get Employee 
export const getEmployee = (req, res,next) => {
    try {
        const id = req.params.id;
        const sql = `Select * from user where isEmployee = 1 and id = ${id};`;
        db.query(sql, (err,result)=>{
            if(err) throw err;
            res.send(result);
        });   
    } catch (error) {
        next(error);
    }
  
}

// Get All Employee 
export const getAllEmployee = (req, res,next) => {
    try {
        const sql = `select * from user where isEmployee = 1;`;
        db.query(sql, (err,result)=>{
            if(err) console.log(err);;
            res.send(result);
         })  
    } catch (error) {
      next(error);  
    }
   
}