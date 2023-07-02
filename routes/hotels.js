import express from "express";
import { createHotel, deleteHotel, getAllHotel, getHotel, updateHotel,getHotelGallery } from "../controller/hotels.js";
import {verifyEmployee} from "../Utils/verifyToken.js";
import multer from 'multer';
import path from 'path';
const storage = multer.diskStorage({
  destination:"./images",
  filename:(req,file,cb)=> {
  return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
})
const upload = multer({ 
  storage:storage,
});

const router = express.Router();


// CRUD API for Hotels Data

// Create Hotel
router.post("/",verifyEmployee,upload.array('images',5),createHotel );

// Update Hotel
router.put("/:id",verifyEmployee ,upload.array('images',5),updateHotel);

// Delete Hotel
router.delete("/:id",verifyEmployee,deleteHotel);

// Get Hotel 
router.get("/:id",getHotel);

// Get All Hotel
router.get("/",getAllHotel);

// Get Hotel Gallery
router.get("/gallery/:id",getHotelGallery);




//Testing Route for joins

// router.get("/testing/testJoin" ,getHotelJoin);





// Get hotel count by City

export default router;