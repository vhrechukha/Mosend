enum AppError {
  EnvNotSpecified = 'parameter did not specified in .env file',
  TokenIsNotActive = 'Token is not active.',
  InvalidSignature = 'Invalid signature or URL is malformed.',
  UrlExpired = 'URL expired.',
}

enum UserError {
  UserSuspended = 'This user was suspended.',
  PasswordOrEmailIsIncorrect = 'Password or email is incorrect.',
  UserWithEmailNotFound = 'User with this email not found.',
  UserIsAlreadyExists = 'User is already exists.',
}

enum FileError {
  FileWithThisIdNotFound = 'File with this id was not found.',
}

enum EmailError {
  EmailIsNotCorrect = 'Email is not correct, please, try again.',
  EmailIsNotVerified = 'Your email is not verified.',
}

export {
  AppError, FileError, UserError, EmailError,
};
