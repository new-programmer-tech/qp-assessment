import express, { Router } from "express";
const  {registerUser ,loginUser}  = require('../controllers/authController')
const router: Router = express.Router();


router.post('/register', registerUser)
router.post('/login', loginUser)



export default router;