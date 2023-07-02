import express from "express";
import { deleteEmployee, getAllEmployee, getEmployee, updateEmployee } from "../controller/employee.js";

// Importing token verification
import {verifyEmployee, verifyToken, verifyUser} from "../Utils/verifyToken.js";

const router = express.Router();



router.get("/",verifyEmployee,getAllEmployee);
router.delete("/:id",verifyEmployee, deleteEmployee);
router.get("/:id",verifyEmployee,getEmployee);
router.put("/:id",verifyEmployee,updateEmployee);


export default router;