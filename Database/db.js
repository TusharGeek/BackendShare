// Importing Database 
import mysql from "mysql";
const db = mysql.createConnection({
    host: 'hotelbookdb.cnte7pqdqsvd.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password:'hotel123',
    database: 'resorts',
    connectionLimit: 10
})


db.connect((err)=> {
    if(err){
        console.log(err);
    }else{
        console.log("Mysql connected");
    }
})


export default db;