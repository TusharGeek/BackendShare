import jwt from "jsonwebtoken";
import createError from "../Utils/error.js";

// To Verify is the user is logged in
export const verifyToken = (req,res,next) => {
    
    const token = req.cookies.access_token;
  

    if(!token) {
        return next(createError(401, "You are not authenticated"));
    }

    jwt.verify(token, "umzaFvjKJEGNr6+EgbX1Iramyrw7ZUg0CddezpxppVY=", (err, data) => {
        if(err) return next(createError(403, "Token is invalid"));
        req.user = data;
        next();
    })
}

// To verify the user 
export const verifyUser = (req, res, next) => {
    verifyToken(req, res, ()=>{
      
        if(req.user.id.toString() === req.params.id || req.user.isEmployee === 1){
        
            next();
        }else{
            if(err) return next(createError(403, "You are not authorized"));
        }
    });
}

// To verify is the user is employee
export const verifyEmployee = (req, res, next) => {
    verifyToken(req, res, ()=>{

        if(req.user.isEmployee === 1){
            next();
        }else{
            if(err) return next(createError(403, "You are not authorized"));
        }
    });
}