const Emails = {
  VERIFIED_EMAIL_SENT: (to, link) => ({
    to,
    subject: 'MOSEND: Email verification =?UTF-8?B?8J+WpA==?=',
    html: `
    Please click on this <strong><a href="${link}" style="color: black;">link</a></strong>
    for email verfication on our site, <br> have a nice day ☀
  `,
  }),
  DELETE_ACCOUNT_EMAIL_SENT: (to, link) => ({
    to,
    subject: 'MOSEND: Deletion of account =?UTF-8?B?8J+YrQ==?=',
    html: `
    Please click on this <strong><a href="${link}" style="color: black;">link</a></strong>
    for deletion of account. This action is irreversible. All your upload files will be deleted permanently.
    <br> have a good life without us ☀
  `,
  }),
  RESET_PASSWORD_EMAIL_SENT: (to, link) => ({
    to,
    subject: 'MOSEND: Reset password =?UTF-8?B?8J+WpA==?=',
    html: `
    Please click on this <strong><a href="${link}" style="color: black;">link</a></strong>
    for password resseting on our site, <br> have a good day ☀
  `,
  }),
};

type EmailResettingResponseTypes = 'VERIFIED_EMAIL_SENT' | 'RESET_PASSWORD_EMAIL_SENT';
const pathOfEmailsForResetting = {
  VERIFIED_EMAIL_SENT: 'VERIFIED_EMAIL_SENT',
  RESET_PASSWORD_EMAIL_SENT: 'RESET_PASSWORD_EMAIL_SENT',
};

export {
  Emails,
  EmailResettingResponseTypes,
  pathOfEmailsForResetting,
};
