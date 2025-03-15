import express, { Express } from 'express';
import { inject, injectable } from 'inversify';

import { getMongoURI } from '../shared/helpers/index.js';
import { Config, RestSchema, RestSchemaEnum } from '../shared/libs/config/index.js';
import { DatabaseClient } from '../shared/libs/database-client/index.js';
import { Logger } from '../shared/libs/logger/index.js';
import {
  Controller,
  ExceptionFilter,
  ParseTokenMiddleware
} from '../shared/libs/rest/index.js';
import { Component } from '../shared/types/index.js';

@injectable()
export class RestApplication {
  private readonly server: Express;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
    @inject(Component.ExceptionFilter)
    private readonly appExceptionFilter: ExceptionFilter,
    @inject(Component.UserController)
    private readonly userController: Controller,
    @inject(Component.OfferController)
    private readonly offerController: Controller,
    @inject(Component.AuthExceptionFilter)
    private readonly authExceptionFilter: ExceptionFilter,
  ) {
    this.server = express();
  }

  private async initDb() {
    this.logger.info('Init database…');

    const mongoUri = getMongoURI(
      this.config.get(RestSchemaEnum.DbUser),
      this.config.get(RestSchemaEnum.DbPassword),
      this.config.get(RestSchemaEnum.DbHost),
      this.config.get(RestSchemaEnum.DbPort),
      this.config.get(RestSchemaEnum.DbName),
    );

    return this.databaseClient.connect(mongoUri);
  }

  private async initServer() {
    this.logger.info('Try to init server…');

    const port = this.config.get(RestSchemaEnum.Port);
    this.server.listen(port);
  }

  private initControllers() {
    this.logger.info('Init controllers');

    this.server.use('/users', this.userController.router);
    this.server.use('/offers', this.offerController.router);

    this.logger.info('Controller initialization completed');
  }

  private initMiddleware() {
    this.logger.info('Init app-level middleware');

    const authenticateMiddleware = new ParseTokenMiddleware(
      this.config.get(RestSchemaEnum.JwtSecret),
    );

    this.server.use(express.json());
    this.server.use(
      '/upload',
      express.static(this.config.get(RestSchemaEnum.UploadDirectory)),
    );
    this.server.use(
      authenticateMiddleware.execute.bind(authenticateMiddleware),
    );

    this.logger.info('App-level middleware initialization completed');
  }

  private initExceptionFilters() {
    this.logger.info('Init exception filters');

    this.server.use(
      this.appExceptionFilter.catch.bind(this.appExceptionFilter),
    );
    this.server.use(
      this.authExceptionFilter.catch.bind(this.authExceptionFilter),
    );

    this.logger.info('Exception filters initialization completed');
  }

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info(`Get value from env $PORT: ${this.config.get(RestSchemaEnum.Port)}`);

    await this.initDb();
    this.logger.info('Init database completed');

    this.initMiddleware();
    this.initControllers();
    this.initExceptionFilters();

    await this.initServer();
    this.logger.info(
      `🚀 Server started on http://localhost:${this.config.get(RestSchemaEnum.Port)}`
    );
  }
}
