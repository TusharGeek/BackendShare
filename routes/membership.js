import express from "express";
import { createMembership, deleteMembership, getAllMembership, getMembershipById, updateMembership } from "../controller/membership.js";
import {verifyEmployee} from "../Utils/verifyToken.js";

const router = express.Router();

// Create Membership
router.post("/",createMembership);



// Update Membership Status
router.put("/update/:id",updateMembership);

// Delete Membership
router.delete("/:id",deleteMembership);


router.get("/:id",getMembershipById);

// Get All Membership
router.get("/",getAllMembership);

export default router;