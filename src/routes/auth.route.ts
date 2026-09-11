import {Router} from 'express';
import { getAllUsers, Login, Logout, profile, Register } from '../controllers/auth.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';


const router = Router();

router.post("/register", Register);
router.post("/login", Login);
router.post("/logout", AuthMiddleware, Logout);
router.get("/users", getAllUsers);
router.get("/profile", AuthMiddleware, profile);


export default router;