declare namespace Express {
  interface Request {
    user: import('../../modules/user/entities/user.entity').User;
  }
}
