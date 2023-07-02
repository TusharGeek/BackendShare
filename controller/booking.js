// Importing Database 
import db from "../Database/db.js";
// Create Booking
export const createBooking = (req,res,next) => {
    const characters ='0123456789';
    function generateString(length) {
        let result = ' ';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    const TodayDate = `${day}-${month}-${year}`;
    try {
        const BookingNo = generateString(4);
        const NoOfAdults = req.body.NoOfAdults;
        const NoOfChildren = req.body.NoOfChildren;
        const NoOfRooms = req.body.NoOfRooms;
        const NoOfDays = req.body.NoOfDays;
        const UserEmail = req.body.UserEmail;
        const ResortName = req.body.ResortName;
        const CheckInDate = req.body.CheckInDate;
        const CheckOutDate = req.body.CheckOutDate;
        

        const sql1 = `Select * from user where Email = '${UserEmail}';`;
        db.query(sql1, (err, result) => {
         if(result[0]==null){
            res.send("User not found");
         }
         else{
            const sql2 = `Select * from resorts where Name = "${ResortName}";`;
            db.query(sql2, (err, result) => {
                if(result[0]==null){
                    res.send("Property not found");
                }else{
                    const sql3 = `INSERT INTO booking ( BookingNo, NoOfAdults, NoOfChildren, NoOfRooms,NoOfDays,BookingDate, UserId,ResortId,BookingStatus,CheckIn,CheckOut) VALUES ("${BookingNo}","${NoOfAdults}","${NoOfChildren}","${NoOfRooms}","${NoOfDays}","${TodayDate}",(Select id from user where Email = "${UserEmail}"), (Select id from resorts where Name = "${ResortName}"),"Requested","${CheckInDate}","${CheckOutDate}");`;
                    db.query(sql3, (err,result)=>{
                        if(err) throw err;
                        console.log(err);
                        console.log("Hotel Booked Successfully");
                        res.send("Hotel Booked Successfully");
                    })
                }
            });

         }
        })
        
    } catch (error) {
        next(error);
    } 
}


// Update Booking
export const updateBooking = (req, res,next) => {
    try {
        const id = req.params.id;
      

        const sql1 = `Select * from resorts where id = ${req.body.ResortId};`;

        db.query(sql1, (err, result) => {
            if(result[0] == null){
                res.send("Property not found");
            }else{
                const sql2 = `UPDATE booking SET NoOfAdults = "${req.body.NoOfAdults}", NoOfChildren = "${req.body.NoOfChildren}", NoOfRooms = "${req.body.NoOfRooms}", NoOfDays = "${req.body.NoOfDays}", ResortId = "${req.body.ResortId}"  WHERE id = ${id};`;
                db.query(sql2, (err,result)=>{
                    if(err) throw err;
                    res.send("Booking Updated");
                }) 
            }
        })

       
    } catch (error) {
       next(error);
    }
}

// Update Booking Status
export const updateBookingStatus = (req, res,next) => {
    try {
        const id = req.params.id;
        const value = req.body.BookingStatus;
        console.log(id);
        console.log(value);
        const sql = `UPDATE booking SET BookingStatus = "${value}" WHERE id = ${id};`;
        db.query(sql, (err,result)=>{
            if(err) throw err;
            if(result && value != "Booked" ){
                const sql2 = `Update user_membership SET NoOfUsedDays = (Select NoOfDays from booking where id = ${id});`;
                db.query(sql2, (err,result)=>{
                    if(err) throw err;
                    res.send(result);
                })
            }
        }) 
    } catch (error) {
       next(error);
    }
}

// Delete Booking
export const deleteBooking = (req, res,next) => {
    try {
        const id = req.params.id;
        const sql = `DELETE FROM booking WHERE id = ${id};`;
        db.query(sql, (err,result)=>{
            if(err) throw err;
            res.send("Deleted Booking successfully");
        })  
    } catch (error) {
        next(error);
    }
}



// Get Booking by UserId

export const getBookingByUserId = async (req,res,next) => {
    try {
       const UserId = req.params.id;
       const sql = `Select  booking.id,booking.BookingStatus, booking.BookingDate, booking.BookingNo,booking.NoOfAdults,booking.NoOfChildren, booking.NoOfDays, user.Name, resorts.Name, resort_gallery.URLPath, Resorts_Category.City, Resorts_Category.State,Resorts_Category.Type  from user, booking,resorts, resort_gallery, Resorts_Category Where resorts.id = resort_gallery.ResortId and resorts.id = Resorts_Category.ResortId and booking.ResortId = resorts.id and user.id = booking.UserId and UserId = ${UserId};`;
       db.query(sql, (err,result)=>{
        if(err) throw err;
        res.send(result);
     })  
    } catch (error) {
    }
}

export const getBookingById = async (req,res,next) =>{
    try {
        const Id = req.params.id;
        const sql = `Select user.name,user.email, booking.id,booking.BookingStatus, booking.BookingDate, booking.BookingNo,booking.NoOfAdults,booking.NoOfChildren, booking.NoOfDays,booking.NoOfRooms,user.id as UserId ,resorts.id as ResortId, user.Name, resorts.Name, resort_gallery.URLPath, Resorts_Category.City, Resorts_Category.State,Resorts_Category.Type  from user, booking,resorts, resort_gallery, Resorts_Category Where resorts.id = resort_gallery.ResortId and resorts.id = Resorts_Category.ResortId and booking.ResortId = resorts.id and user.id = booking.UserId and booking.id = ${Id};`;
        db.query(sql, (err,result)=>{
         if(err) throw err;
         res.send(result);
      })  
     } catch (error) {
     }
}

// Get All Booking 
export const getAllBooking = (req, res,next) => {
    try {
        const sql = `Select user.name ,user.Email, booking.id,booking.BookingStatus, booking.BookingDate, booking.BookingNo,booking.NoOfAdults,booking.NoOfChildren, booking.NoOfDays, user.Name, resorts.Name, resort_gallery.URLPath, Resorts_Category.City, Resorts_Category.State,Resorts_Category.Type  from user, booking,resorts, resort_gallery, Resorts_Category Where resorts.id = resort_gallery.ResortId and resorts.id = Resorts_Category.ResortId and booking.ResortId = resorts.id and user.id = booking.UserId;`;
        db.query(sql, (err,result)=>{
            if(err) throw err;
            res.send(result);
         })  
    } catch (error) {
      next(error);  
    }
}


