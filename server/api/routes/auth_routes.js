import express from 'express';
import {loginWithPhoneNumber} from '../controllers/auth_controller.js';

const router = express.Router();

// This route expects a POST request with a JSON body: { "idToken": "..." }
router.post('/login', loginWithPhoneNumber);

export default router;
