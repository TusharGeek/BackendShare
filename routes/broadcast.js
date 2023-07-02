import express from "express";
import { createBooking, deleteBooking, getAllBooking, getBookingById, getBookingByUserId, updateBooking, updateBookingStatus } from "../controller/booking.js";
import {verifyEmployee} from "../Utils/verifyToken.js";

const router = express.Router();

// Create Booking
router.post("/",createBooking);

// Update Booking Status
router.put("/:id",updateBookingStatus);

// Update Booking Status
router.put("/update/:id",updateBooking);

// Delete Booking
router.delete("/:id",deleteBooking);

// Get Booking 
router.get("/user/:id",getBookingByUserId);

router.get("/:id",getBookingById);

// Get All Booking
router.get("/",getAllBooking);

export default router;