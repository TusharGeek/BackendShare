// Importing Database 
import db from "../Database/db.js";

//Create Membership
export const createMembership = (req,res,next) => {
    try {
        console.log(req.body);
        const sql = `INSERT INTO Membership (Name, NoOfAdults, NoOfChildren, NoOfYears,HolidayPerYear,MembershipType ,MembershipPrice) VALUES ("${req.body.Name}","${req.body.NoOfAdults}","${req.body.NoOfChildren}","${req.body.NoOfYears}","${req.body.HolidayPerYear}","${req.body.MembershipType}","${req.body.MembershipPrice}")`;
        db.query(sql, (err,result)=>{
            if(err) throw err;
            res.send("Membership Added Successfully");
        })
    } catch (error) {
        next(error);
    } 
}


//Update Membership
export const updateMembership = (req, res,next) => {
    try {
        const id = req.params.id;
        const value = req.body;
        console.log(id);
        console.log(value);
        const sql = `UPDATE Membership SET Name = "${req.body.Name}", NoOfAdults = "${req.body.NoOfAdults}", NoOfChildren = "${req.body.NoOfChildren}", NoOfYears = "${req.body.NoOfYears}", HolidayPerYear = "${req.body.HolidayPerYear}", MembershipType = "${req.body.MembershipType}", MembershipPrice = "${req.body.MembershipPrice}" WHERE id = ${id};`;
        db.query(sql, (err,result)=>{
            if(err) throw err;
            res.send("Membership Updated  Successfully");
        }) 
    } catch (error) {
       next(error);
    }
}

// Delete Membership
export const deleteMembership = (req, res, next) => {
    const id = req.params.id;
    const sql = `DELETE FROM Membership WHERE id = ${id};`;
    
    db.query(sql, (err, result) => {
      if (err) {
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
          // Handle the foreign key violation error
          res.send('You cannot delete this membership. Some users have this membership.');
        } else {
          // Handle other types of errors
          res.status(500).json({ error: 'Internal server error' });
        }
      } else {
        res.send('Deleted Membership successfully');
      }
    });
  };
  

// Get Membership 
// export const getMembership = async (req, res,next) => {
//     try {
//         const id =  req.params.id;
//         const sql1 = `Select resorts.id, resorts.Name, resorts.Description, resorts.Amenties, resorts.Region, resort_gallery.Name, resort_gallery.URLPath, Resorts_Category.City, Resorts_Category.State,Resorts_Category.Type  from resorts, resort_gallery, Resorts_Category Where resorts.id = resort_gallery.ResortId and resorts.id = Resorts_Category.ResortId and resorts.id = ${id};`;
//         const sql =  `SELECT * FROM resorts WHERE id = ${id};`;
//         db.query(sql1, (err,result)=>{
//             if(err) throw err;
//             res.send(result);
//         });   
//     } catch (error) {
//         next(error);
//     }
// }



export const getMembershipById = async (req,res,next) =>{
    try {
        const sql = `Select * from membership where id = ${req.params.id}`;
        db.query(sql, (err,result)=>{
         if(err) throw err;
         res.send(result);
      })  
     } catch (error) {
     }
}

// Get All Membership 
export const getAllMembership = (req, res,next) => {
    try {
        const sql = `Select * from membership;`;
        db.query(sql, (err,result)=>{
            if(err) throw err;
            res.send(result);
         })  
    } catch (error) {
      next(error);  
    }
}



// export const getMembershipJoin = (req,res,next) => {
//     try {
//         const sql = "Select resorts.id, resorts.Name, resorts.Description, resorts.Amenties, resorts.Region, resort_gallery.Name, resort_gallery.URLPath, Resorts_Category.City, Resorts_Category.State,Resorts_Category.Type  from resorts, resort_gallery, Resorts_Category Where resorts.id = resort_gallery.ResortId and resorts.id = Resorts_Category.ResortId;"
//         db.query(sql, (err,result)=>{
//             if(err) throw err;
//            res.send(result);
//          }) 
//     } catch (error) {
//         next(error);
//     }
// }

// Select resorts.id, resorts.Name, resorts.Description, resorts.Amenties, resorts.Region, resort_gallery.Name, resort_gallery.URLPath  from resorts, resort_gallery Where resorts.id = resort_gallery.ResortId;