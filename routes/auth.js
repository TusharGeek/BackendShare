import express from "express";
import { forgotPassword, login, register } from "../controller/auth.js";

const router = express.Router();
// User Register route
router.post("/register", register);

// User Login route
router.post("/login", login);

// User forgot password route
router.post("/forgotPassword", forgotPassword);


export default router;