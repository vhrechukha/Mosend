enum AuthResponse {
  Verified = 'You were successfully verified. Yet, you can login with your email and password.',
  SignedUp = 'You signed up successfully. Please, verify your email at first.',
  Deleted = 'User was successfully deleted.',
  PasswordUpdated = 'Password updated successfully.',
  PasswordReset = 'Password reset successfully.',
}

enum EmailResponse {
  VerifiedEmailSent = 'You were successfully verified. Yet, you can login with your email and password.',
  DeletionEmailSent = 'Email with deletion link sent. Check your mail.',
}

enum FileResponse {
  ScheduledForCheck = 'File was successfully scheduled for check.',
}

export { AuthResponse, EmailResponse, FileResponse };
