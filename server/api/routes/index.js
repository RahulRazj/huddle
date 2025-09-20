import authRoutes from './auth_routes.js';

const routes = app => {
	app.get('/', (req, res) => {
		res.send("Whatever you do in this life, it's not legendary, unless your friends are there to see it.");
	});
	app.use('/api/v1/auth', authRoutes);
};

export default routes;
