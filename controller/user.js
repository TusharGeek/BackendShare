// Password Hash Library
import bcryptjs from 'bcryptjs';

// Importing Database 
import db from "../Database/db.js";


// Update User
export const updateUser = (req, res,next) => {
    try {
   
        const data= req.body;
        console.log(data);
          // Password Encryption
   const Password = data.Password;
   const salt = bcryptjs.genSaltSync(10);
   const hash = bcryptjs.hashSync(Password,salt);   // Password

       const sql1 = `UPDATE user SET Email = "${data.Email}", Address =  "${data.Address}",DOB =  "${data.DOB}",MobNo=  "${data.MobNo}",Name =  "${data.Name}", Password = "${hash}",PanNo = "${data.PanNo}", LeadType = "${data.LeadType}" WHERE id = "${data.id}";`;
        db.query(sql1, (err,result)=>{
            if(err) throw err;
            res.send("Updated User successfully");
        }) 
    } catch (error) {
       next(error);
    }
}
export const deleteUser = (req, res, next) => {
    try {
      const id = req.params.id;
  
      // Delete related rows in the "user_membership" table first
      const deleteMembershipSql = `DELETE FROM user_membership WHERE userId = ${id};`;
      db.query(deleteMembershipSql, (err, result) => {
        if (err) {
          res.status(500).json({ error: 'Internal server error' });
        } else {
          // Proceed with deleting the user
          const deleteUserSql = `DELETE FROM user WHERE id = ${id};`;
          db.query(deleteUserSql, (err, result) => {
            if (err) {
              res.status(500).json({ error: 'Internal server error' });
            } else {
              res.send('Deleted User successfully');
            }
          });
        }
      });
    } catch (error) {
      next(error);
    }
  };
  

// Get User 
export const getUser = (req, res,next) => {
    try {
        const id = req.params.id;
        const sql = `Select * from user where id = ${id};`;
        db.query(sql, (err,result)=>{
            if(err) throw err;
            res.send(result);
        });   
    } catch (error) {
        next(error);
    }
  
}

// Get All User 
export const getAllUser = (req, res,next) => {
    try {
        const sql = `SELECT * FROM user Where isEmployee is NULL;`;
        db.query(sql, (err,result)=>{
            if(err) throw err;
            res.send(result);
         })  
    } catch (error) {
      next(error);  
    }

}


// API to check if Validity of user Membership

export const MembershipCheck = (req, res,next) => {
    const UserId = req.params.id;
   
    try {
        const sql = `SELECT * FROM memberships WHERE userId = ${UserId} AND ExpriyDate < NOW();`;
        db.query(sql, (err,result)=>{
            if(result){
                const sql2 = `UPDATE user SET LeadType = 'Lead' WHERE id = ${UserId};`
                db.query(sql2, (err,result)=>{
                  if(err) throw err;
                  res.send("Membership Expired");
               })  
            }else{
              res.send("Membership Valid");
            }
         })  
    } catch (error) {
      next(error);  
    }
   
}
