import express from 'express';
import dotenv from 'dotenv';
import BootstrapApp from './system/bootstrap.js';
import RoutesConfig from './routes/index.js';
import cors from 'cors';
import { errorHanlderMiddleware, successHandlerMiddleware } from './middlewares/requestHandler.js';

dotenv.config();
const app = express();

new BootstrapApp(app);

app.use(express.json());

app.use(errorHanlderMiddleware);
app.use(successHandlerMiddleware);

const ALLOWED_ORIGINS = process.env['Platform_ALLOWED_ORIGINS'].split(',');

app.use(
	cors({
		origin: function (origin, callback) {
			if (!origin || origin === 'null') return callback(null, true);
			if (ALLOWED_ORIGINS.indexOf(origin) === -1) {
				var msg = 'The CORS policy for this site restricts access from the specified Origin.';
				return callback(new Error(msg), false);
			}
			return callback(null, true);
		}
	})
);

app.use(function (req, res, next) {
	res.setHeader('X-Frame-Options', '*');
	res.setHeader('X-Content-Type-Options', 'nosniff');
	res.setHeader('X-XSS-Protection', '1; mode=block');
	res.setHeader('Access-Control-Allow-Headers', process.env['Platform_ALLOWED_HEADERS']);
	res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
	next();
});

RoutesConfig(app);

export default app;
