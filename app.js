import 'dotenv/config';
import express from 'express';
import connectLiveReload from 'connect-livereload';
import { createServer } from 'node:http';
import ErrorService from './server/services/errorService';
import createLiveReloadServer from './livereload';

class App {
  constructor() {
    this.defaultPort = process.env.PORT;
  }

  init() {
    // Création du server de liveReload pour recharger la page lors du travail sur le front
    if (process.env.NODE_ENV === 'development') {
      createLiveReloadServer(['public', 'views']);
    }

    // Création de l'application principale
    const app = express();
    const httpServer = createServer(app);
    this.app = app;
    this.httpServer = httpServer;

    // Middleware pour activer le LiveReload
    if (process.env.NODE_ENV === 'development') {
      this.app.use(connectLiveReload());
    }

    return { app, httpServer };
  }

  normalizePort(portRaw = null) {
    const port = parseInt(portRaw || this.defaultPort, 10);

    if (Number.isNaN(port) || port < 0) {
      ErrorService.record(
        {
          message: `le port '${portRaw}' est invalide`,
        },
        null,
        500,
      );
    }

    return port;
  }

  listen(port = null) {
    try {
      const normalizedPort = this.normalizePort(port);
      this.httpServer.listen(normalizedPort, (err) => {
        if (err) throw new Error(err);
        console.warn(
          `Server accessible sur http://localhost:${normalizedPort}`,
        );
      });
    } catch (error) {
      ErrorService.record(error, null, 500);
    }
  }
}

export default new App();
