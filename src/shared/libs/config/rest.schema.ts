import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

export enum RestSchemaEnum {
  Port = 'PORT',
  Salt = 'SALT',
  DbHost = 'DB_HOST',
  DbUser = 'DB_USER',
  DbPassword = 'DB_PASSWORD',
  DbPort = 'DB_PORT',
  DbName = 'DB_NAME',
  UploadDirectory = 'UPLOAD_DIRECTORY',
  JwtSecret = 'JWT_SECRET',
  JwtAlgorithm = 'JWT_ALGORITHM',
  JwtExpired='JWT_EXPIRED',
}

export type RestSchema = {
  [RestSchemaEnum.Port]: number;
  [RestSchemaEnum.Salt]: string;
  [RestSchemaEnum.DbHost]: string;
  [RestSchemaEnum.DbUser]: string;
  [RestSchemaEnum.DbPassword]: string;
  [RestSchemaEnum.DbPort]: string;
  [RestSchemaEnum.DbName]: string;
  [RestSchemaEnum.UploadDirectory]: string;
  [RestSchemaEnum.JwtSecret]: string;
  [RestSchemaEnum.JwtAlgorithm]: string;
  [RestSchemaEnum.JwtExpired]: string;
}

export const configRestSchema = convict<RestSchema>({
  [RestSchemaEnum.Port]: {
    doc: 'Port for incoming connections',
    format: 'port',
    env: 'PORT',
    default: 4000
  },
  [RestSchemaEnum.Salt]: {
    doc: 'Salt for password hash',
    format: String,
    env: 'SALT',
    default: null
  },
  [RestSchemaEnum.DbHost]: {
    doc: 'IP address of the database server (MongoDB)',
    format: 'ipaddress',
    env: 'DB_HOST',
    default: '127.0.0.1'
  },
  [RestSchemaEnum.DbUser]: {
    doc: 'Username to connect to the database',
    format: String,
    env: 'DB_USER',
    default: null,
  },
  [RestSchemaEnum.DbPassword]: {
    doc: 'Password to connect to the database',
    format: String,
    env: 'DB_PASSWORD',
    default: null,
  },
  [RestSchemaEnum.DbPort]: {
    doc: 'Port to connect to the database (MongoDB)',
    format: 'port',
    env: 'DB_PORT',
    default: '27017',
  },
  [RestSchemaEnum.DbName]: {
    doc: 'Database name (MongoDB)',
    format: String,
    env: 'DB_NAME',
    default: 'six-cities'
  },
  [RestSchemaEnum.UploadDirectory]: {
    doc: 'Directory for upload files',
    format: String,
    env: 'UPLOAD_DIRECTORY',
    default: null,
  },
  [RestSchemaEnum.JwtSecret]: {
    doc: 'Secret for sign JWT',
    format: String,
    env: 'JWT_SECRET',
    default: null,
  },
  [RestSchemaEnum.JwtAlgorithm]: {
    doc: 'Algorithm for JWT',
    format: String,
    env: 'JWT_ALGORITHM',
    default: 'HS256',
  },
  [RestSchemaEnum.JwtExpired]: {
    doc: 'Time of JWT expiration',
    format: String,
    env: 'JWT_EXPIRED',
    default: '2d',
  }
});
