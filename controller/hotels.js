// Importing Database 

import db from "../Database/db.js";

// Create Hotel
export const createHotel = (req,res,next) => {
    
    try {
        const newObj = Object.assign({}, req.body);
        const JSONData = JSON.parse(newObj.HotelData);
        console.log(JSONData);

        console.log(req.files);
        const sql2 = `CALL CreateHotel("${JSONData.Name}","${JSONData.Description}","${JSONData.Amenities}","${JSONData.Email}", "${JSONData.MobNo}","${JSONData.Region}","${JSONData.Address}","${JSONData.City}","${JSONData.State}","${JSONData.Type}","${req.files[0].path}","${req.files[1].path}","${req.files[2].path}","${req.files[3].path}");`;
        // const sql1 = `INSERT INTO resorts (id, Name, Description, Amenties, Email, Mobno,Address,Region) VALUES ("${id}","${name}","${description}", "${amenties}", "${emailid}", ${mobno},"${address}","${Region}"); INSERT INTO resort_gallery (id, Name, ResortId, URLPath) VALUES ("${id}","${name}","${id}", "${URLPath}");  INSERT INTO Resort_Category (id, ResortId, City, State, Type) VALUES ("${id}","${id}","${city}","${State}" ,"${resortType}");` ;
        // const sql = `INSERT INTO resorts (id ,Name, Description, Amenties, Email, Mobno, City, ResortType, Address) VALUES ("${id}","${name}", "${description}", "${amenties}", "${emailid}", ${mobno}, "${city}", "${resortType}", "${address}");`;
        db.query(sql2, (err,result)=>{
            if(err) throw err;
            res.send("Added Hotel successfully");
        })
    } catch (error) {
        next(error);
    } 
}

// Update Hotel
export const updateHotel = (req, res,next) => {
    try {
        const id = req.params.id;
        
        const newObj = Object.assign({}, req.body);
        const JSONData = JSON.parse(newObj.HotelNewData);
        console.log(JSONData);
        console.log(req.files);
        let sql = "";
        console.log(req.files.length);
        if(req.files.length != 0) {
            
            sql = `CALL UpdateHotel(${id},"${JSONData.Name}","${JSONData.Description}","${JSONData.Amenties}","${JSONData.Email}","${JSONData.MobNo}","${JSONData.Address}","${JSONData.Region}","${req.files[0].path}","${req.files[1].path}","${req.files[2].path}","${req.files[3].path}","${JSONData.City}", "${JSONData.State}", "${JSONData.Type}");`;
        }else if(req.files.length == 0){
            
            sql = `CALL UpdateHotelWithoutImages2(${id},"${JSONData.Name}","${JSONData.Description}","${JSONData.Amenties}","${JSONData.Email}","${JSONData.MobNo}","${JSONData.Address}","${JSONData.Region}","${JSONData.City}", "${JSONData.State}", "${JSONData.Type}");`;
        }
        
        db.query(sql, (err,result)=>{
            
            if(err) throw err;
            res.send("Updated Hotel successfully");
        }) 

        
    } catch (error) {
       next(error);
    }
    
}

export const deleteHotel = (req, res, next) => {
    try {
      const id = req.params.id;
      // Delete associated bookings for the hotel
      const deleteBookingsSql = `DELETE FROM booking WHERE ResortId = ${id};`;
      db.query(deleteBookingsSql, (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("Failed to delete hotel bookings.");
        } else {
          // Bookings deleted successfully, proceed to delete the hotel
          const deleteHotelSql = `DELETE FROM resorts WHERE id = ${id};`;
          db.query(deleteHotelSql, (err, result) => {
            if (err) {
              console.error(err);
              res.status(500).send("Failed to delete hotel.");
            } else {
              res.send("Deleted hotel successfully.");
            }
          });
        }
      });
    } catch (error) {
      next(error);
    }
  };
  

// Get Hotel 
export const getHotel = async (req, res,next) => {
    try {
        const id =  req.params.id;
        const sql1 = `Select resorts.id, resorts.Name, resorts.Description, resorts.Amenties,resorts.Email, resorts.MobNo,resorts.Address, resorts.Region, resort_gallery.Name, resort_gallery.URLPath,resort_gallery.URLPath2,resort_gallery.URLPath3,resort_gallery.URLPath4, Resorts_Category.City, Resorts_Category.State,Resorts_Category.Type  from resorts, resort_gallery, Resorts_Category Where resorts.id = resort_gallery.ResortId and resorts.id = Resorts_Category.ResortId and resorts.id = ${id};`;
        const sql =  `SELECT * FROM resorts WHERE id = ${id};`;
        db.query(sql1, (err,result)=>{
            if(err) throw err;
            res.send(result);
        });   
    } catch (error) {
        next(error);
    }
  
}

// Get All Hotel 
export const getAllHotel = (req, res,next) => {
    try {
        const sql2 = `CALL GetHotels();`
        const sql = `Select resorts.id, resorts.Name,resorts.Email, resorts.MobNo,resorts.Address, resorts.Description, resorts.Amenties, resorts.Region, resort_gallery.Name, resort_gallery.URLPath,resort_gallery.URLPath2,resort_gallery.URLPath3,resort_gallery.URLPath4, Resorts_Category.City, Resorts_Category.State,Resorts_Category.Type  from resorts, resort_gallery, Resorts_Category Where resorts.id = resort_gallery.ResortId and resorts.id = Resorts_Category.ResortId;`;
        db.query(sql, (err,result)=>{
            if(err) throw err;
            res.send(result);
         })  
    } catch (error) {
      next(error);  
    }
}

// Get hotel count by region
export const getHotelByRegion =  (req, res, next) => {
    const Region = req.params.Region;
    console.log(Region);
     try {     
          const sql = `SELECT * FROM resorts WHERE Region = "${Region}"`;
                db.query(sql, (err,result)=>{
                    if(err) throw err;
                   res.send(result);
                 })       
     } catch (error) {
        next(error);
     }
}

export const getHotelGallery = (req,res,next) => {
    const ResortId = req.params.id;
    try {
        const sql = `SElECT URLPath, URLPath2, URLPath3 , URLPath4 FROM resort_gallery where ResortId = ${ResortId}`;
        db.query(sql, (err,result)=>{
            if(err) throw err;
           res.send(result);
         }) 
    } catch (error) {
        next(error)
    }
}



// Select resorts.id, resorts.Name, resorts.Description, resorts.Amenties, resorts.Region, resort_gallery.Name, resort_gallery.URLPath  from resorts, resort_gallery Where resorts.id = resort_gallery.ResortId;