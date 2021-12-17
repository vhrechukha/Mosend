const Emails = {
  VerificationOfAccount: (to, link) => ({
    to,
    subject: 'MOSEND: Email verification =?UTF-8?B?8J+WpA==?=',
    html: `
    Please click on this <strong><a href="${link}" style="color: black;">link</a></strong>
    for email verfication on our site, <br> have a nice day ☀
  `,
  }),
  DeletionOfAccount: (to, link) => ({
    to,
    subject: 'MOSEND: Deletion of account =?UTF-8?B?8J+YrQ==?=',
    html: `
    Please click on this <strong><a href="${link}" style="color: black;">link</a></strong>
    for deletion of account. This action is irreversible. All your upload files will be deleted permanently.
    <br> have a good life without us ☀
  `,
  }),
  ResetPasswordOfAccount: (to, link) => ({
    to,
    subject: 'MOSEND: Reset password =?UTF-8?B?8J+WpA==?=',
    html: `
    Please click on this <strong><a href="${link}" style="color: black;">link</a></strong>
    for password resseting on our site, <br> have a good day ☀
  `,
  }),
  ChangingEmailOfAccount: (to, link) => ({
    to,
    subject: 'MOSEND: Change email =?UTF-8?B?8J+WpA==?=',
    html: `
    Please click on this <strong><a href="${link}" style="color: black;">link</a></strong>
    for email changing on our site, <br> have a good day ☀
  `,
  }),
};

type EmailsForResetting = 'VerificationOfAccount' | 'ResetPasswordOfAccount';
const pathOfEmailsForResetting = {
  VerificationOfAccount: 'verifyEmail',
  ResetPasswordOfAccount: 'resetPassword',
};

export {
  Emails,
  EmailsForResetting,
  pathOfEmailsForResetting,
};
