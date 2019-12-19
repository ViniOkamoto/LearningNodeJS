/**
 * Sucrase - Sucrase is a developer dependencie which will help us to do the
 * Import and export modules.
 * Nodemon - Is a livereload which will help to restart the server when we change something
 */
import express from 'express';
import routes from './routes';

import './database';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
