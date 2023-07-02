//Importing Server
import express from "express";
const app = express();
import bodyParser from "body-parser";
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('images'));

// Importing Routes
import authRoute from "./routes/auth.js";
import userRoute from "./routes/user.js";
import employeeRoute from "./routes/employee.js";
import hotelRoute from "./routes/hotels.js";
import roomRoute from "./routes/room.js";
import bookingRoute from "./routes/booking.js";
import membershipRoute from "./routes/membership.js";
import  paymentRoute from "./routes/payment.js";

// Importing Database 
import mysql from "mysql";
import cookieParser from "cookie-parser";
import cors from "cors";
app.use(cors({
    credentials: true,
    origin: "http://localhost:3000",
}))



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

app.get('/showTable',(req,res)=> {
    let sql = 'Show Tables;';
    db.query(sql,(err,result)=> {
        if(err) throw err;
        res.send(result);
    })
});

 // Cookie handling
 app.use(cookieParser());
// Middleware
app.use(express.json());
app.use("/api/auth",authRoute);
app.use("/api/users",userRoute);
app.use("/api/employee",employeeRoute);
app.use("/api/hotels",hotelRoute);
app.use("/api/rooms", roomRoute);
app.use("/api/booking", bookingRoute);
app.use("/api/membership", membershipRoute);
app.use('/api/payment', paymentRoute)


// //////////////////////////////////////////////////////////////////////////
app.post('/getAdminUser', async (req, res) => {
    const Email = req.body.Email;
    console.log(Email);
    try {
    const sql1 = `Select * from user where Email = "${Email}";`;
    db.query(sql1, async (err, result) => {
        if(result[0]==null){
            res.send(["User Not Found"]);
        }
        else{
            const sql2 = `Select * from user where Email = "${Email}" and LeadType = "Joined";`;
            db.query(sql2,async (err, result) => {
             if(result[0] == null)   {
                const sql3 = `SELECT * from user where Email = "${Email}";`;
                db.query(sql3,async (err, result) => {
                    res.send(result);
                }) 
             }else if(result[0] != null){
                res.send(["User is already a Member"]);
             }
            })
        }
    })
    } catch (error) {
        
    }
    
})
//////  








// Error Handling Middleware
app.use((err,req,res,next)=> {
const errorStatus = err.status || 500;
const errorMessage = err.message || "Something went Wrong";
return res.status(errorStatus).json({
    sucess:false,
    status:errorStatus,
    message:errorMessage,
    stack: err.stack,
});
});


app.listen(8800,()=> {console.log("Connected to Backend");})