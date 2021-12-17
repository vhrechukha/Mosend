enum AuthResponse {
  Verified = 'You were successfully verified. Yet, you can login with your email and password.',
  SignedUp = 'You signed up successfully. Please, verify your email at first.',
  Deleted = 'User was successfully deleted.',
  PasswordUpdated = 'Password updated successfully.',
  PasswordReset = 'Password reset successfully.',
  EmailChanged = 'Email successfully changed.',
}

enum EmailResponse {
  ChangeEmail = 'Link for email changing sent. Check your mail.',
  VerificationOfAccount = 'You were successfully verified. Yet, you can login with your email and password.',
  ResetPasswordOfAccount = 'Email with resetting link sent for password. Check your mail.',
  DeletionEmailSent = 'Email with deletion link sent. Check your mail.',
}

enum FileResponse {
  ScheduledForCheck = 'File was successfully scheduled for check.',
}

export { AuthResponse, EmailResponse, FileResponse };
