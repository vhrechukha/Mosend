enum AppError {
  EnvNotSpecified = 'parameter did not specified in .env file',
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

export {
  AppError, FileError, UserError,
};
