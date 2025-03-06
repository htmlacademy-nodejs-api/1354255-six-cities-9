import express, { Express } from 'express';
import { inject, injectable } from 'inversify';

import { getMongoURI } from '../shared/helpers/index.js';
import { Config, RestSchema } from '../shared/libs/config/index.js';
import { DatabaseClient } from '../shared/libs/database-client/index.js';
import { Logger } from '../shared/libs/logger/index.js';
import { Controller, ExceptionFilter } from '../shared/libs/rest/index.js';
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
  ) {
    this.server = express();
  }

  private async initDb() {
    this.logger.info('Init database…');

    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    return this.databaseClient.connect(mongoUri);
  }

  private async initServer() {
    this.logger.info('Try to init server…');

    const port = this.config.get('PORT');
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

    this.server.use(express.json());

    this.logger.info('App-level middleware initialization completed');
  }

  private initExceptionFilters() {
    this.logger.info('Init exception filters');

    this.server.use(
      this.appExceptionFilter.catch.bind(this.appExceptionFilter),
    );

    this.logger.info('Exception filters initialization completed');
  }

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    await this.initDb();
    this.logger.info('Init database completed');

    this.initMiddleware();
    this.initControllers();
    this.initExceptionFilters();

    await this.initServer();
    this.logger.info(
      `🚀 Server started on http://localhost:${this.config.get('PORT')}`
    );
  }
}
