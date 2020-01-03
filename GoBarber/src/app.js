/**
 * Sucrase - Sucrase is a developer dependencie which will help us to do the
 * Import and export modules.
 * Nodemon - Is a livereload which will help to restart the server when we change something
 */
import express from 'express';
import path from 'path';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import 'express-async-errors';

import routes from './routes';
import sentryConfig from './config/sentry';
// It's help us with the async errors while we use the sentry

import './database';

class App {
  constructor() {
    this.server = express();
    Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    // This serves for that we can catch the errors by sentry
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
    /**
     * It serves to direct static files such as images, css and html files that
     * can be accessed directly by the browser.
     */

    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
    // This serves to return the error to sentry.
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    // When we put 4 parameters express understands that middleware is an exception handling

    this.server.use(async (err, req, res, next) => {
      // Youch help us with errors.
      const errors = await new Youch(err, req).toJSON();

      return res.status(500).error(errors);
    });
  }
}

export default new App().server;
