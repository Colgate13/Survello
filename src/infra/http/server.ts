import express, { Request, Response, NextFunction, Router } from 'express';
import cors from 'cors';
import * as http from 'http';
import Debug from 'debug';
import { AppError } from '../../shared/Error/AppError';
import routes from './routes/index';

const debug = Debug('app:server');

export class ServerHttp {
  private app: express.Application;
  private server: http.Server;
  private port: number | string;

  constructor(PORT: number | string) {
    this.app = express();
    this.server = http.createServer(this.app);
    this.port = PORT;
  }

  routes() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(routes);
  }

  public async start() {
    this.processOn();
    this.app.use(cors());
    this.app.use(express.json());
    this.middlewareHandlers();

    this.routes();
    this.server.listen(this.port, () =>
      debug(`Listening on port ${this.port}`),
    );
  }

  middlewareHandlers() {
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      req.debug = (txt: string) => debug(`${req.method} ${req.url} ${txt}`);
      next();
    });

    this.app.use(
      (
        err: Error,
        request: Request,
        response: Response,
        _next: NextFunction,
      ) => {
        debug(err);
        if (err instanceof AppError) {
          return response.status(err.statusCode).json({
            status: 'error',
            message: err.message,
          });
        }
        return response.status(500).json({
          status: 'error',
          message: 'Internal server error',
        });
      },
    );
  }

  close(callback: () => void) {
    this.server.close(callback);
  }

  getServer() {
    return this.server;
  }

  processOn() {
    process.on('SIGTERM', () => {
      debug(
        '> Server ending after close all connections - ',
        new Date().toISOString(),
      );
      this.close(() => process.exit());
    });

    process.on('SIGINT', () => {
      debug('> Server ending now! - ', new Date().toISOString());
      this.close(() => process.exit());
      process.exit();
    });
  }
}

export default ServerHttp;
