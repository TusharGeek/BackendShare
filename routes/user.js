import express from "express";
import { deleteUser, getAllUser, getUser, updateUser,MembershipCheck } from "../controller/user.js";

// Importing token verification
import {verifyEmployee, verifyToken, verifyUser} from "../Utils/verifyToken.js";

const router = express.Router();



router.get("/",verifyEmployee,getAllUser);
router.delete("/:id",verifyUser, deleteUser);
router.get("/:id",verifyUser,getUser);
router.put("/:id",verifyUser,updateUser);
router.get("/MembershipCheck/:id",verifyUser,MembershipCheck);


export default router;