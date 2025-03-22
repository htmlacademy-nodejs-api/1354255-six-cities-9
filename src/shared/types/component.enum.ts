const AppComponent = {
  RestApplication: Symbol.for('RestApplication'),
  Logger: Symbol.for('Logger'),
  Config: Symbol.for('Config'),
  DatabaseClient: Symbol.for('DatabaseClient'),
} as const;

const SharedComponent = {
  ExceptionFilter: Symbol.for('ExceptionFilter'),
} as const;

const UserComponent = {
  UserService: Symbol.for('UserService'),
  UserModel: Symbol.for('UserModel'),
  UserController: Symbol.for('UserController'),
} as const;

const OfferComponent = {
  OfferService: Symbol.for('OfferService'),
  OfferModel: Symbol.for('OfferModel'),
  OfferController: Symbol.for('OfferController'),
} as const;

const CommentComponent = {
  CommentService: Symbol.for('CommentService'),
  CommentModel: Symbol.for('CommentModel'),
  CommentController: Symbol.for('CommentController'),
} as const;

const AuthComponent = {
  AuthService: Symbol.for('AuthService'),
  AuthExceptionFilter: Symbol.for('AuthExceptionFilter'),
} as const;

export const Component = {
  ...AppComponent,
  ...SharedComponent,
  ...UserComponent,
  ...OfferComponent,
  ...CommentComponent,
  ...AuthComponent,
} as const;
