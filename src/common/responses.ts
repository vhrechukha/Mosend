enum AuthResponse {
  SuccessfullyVerified = 'You were successfully verified. Yet, you can login with your email and password.',
  SuccessfullySignedUp = 'You signed up successfully. Please, verify your email at first.',
  SuccessfullyDeleted = 'User was successfully deleted.',
  PasswordUpdated = 'Password updated successfully.',
  PasswordReset = 'Password reset successfully.',
}

enum EmailResponse {
  VerifiedEmailSent = 'You were successfully verified. Yet, you can login with your email and password.',
  DeletionEmailSent = 'Email with deletion link sent. Check your mail.',
}

export { AuthResponse, EmailResponse };
