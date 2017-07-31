import { Router } from 'express';

import MetaController from './controllers/meta.controller';
import ProductsController from './controllers/products.controller';

import errorHandler from './middleware/error-handler';

const routes = new Router();

routes.get('/', MetaController.index);

//Items
routes.get('/api/items', ProductsController.search);
routes.get('/api/items/:id', ProductsController.searchForId);


routes.use(errorHandler);

export default routes;