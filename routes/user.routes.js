import { Router } from "express";
import * as usercontroller from "../controllers/user.controller.js";
import { body } from 'express-validator';
import * as authMiddleware from "../middleware/auth.middleware.js"

const router = Router();

// The question arises: Why check validation via express-validator when we already check validation before saving data to the database?
// Answer: To prevent unnecessary calls to the database. If the email is invalid, without express-validator, we would send it to the database,
// and the error would be returned after processing. Using express-validator helps us catch errors before we even make the database call, 
// providing faster feedback to the user.

router.post('/register',  
    // Express validator validates the email and password fields.
    body('email').isEmail().withMessage('Email must be a valid email address hihihi'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters long'),
    // This controller function is executed if the validation passes.
    usercontroller.createUserController
);
// now make same for login

router.post('/login',  
    // Express validator validates the email and password fields.
    body('email').isEmail().withMessage('Email must be a valid email address hihihi'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters long'),
    // This controller function is executed if the validation passes.
    usercontroller.logincontroller
);

router.get('/profile',authMiddleware.authUser,usercontroller.profilecontroller)  // this will work for only logged in user

router.get('/logout',authMiddleware.authUser,usercontroller.logoutcontroller);
router.get('/all', authMiddleware.authUser, usercontroller.getAllUsersController);

export default router;

