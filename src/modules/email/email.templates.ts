const Emails = {
  verificationEmail: (to, link) => ({
    to,
    subject: 'MOSEND: Email verification =?UTF-8?B?8J+WpA==?=',
    html: `
    Please click on this <strong><a href="${link}" style="color: black;">link</a></strong>
    for email verfication on our site, <br> have a nice day ☀
  `,
  }),
  resetPasswordEmail: (to, link) => ({
    to,
    subject: 'MOSEND: Reset password =?UTF-8?B?8J+WpA==?=',
    html: `
    Please click on this <strong><a href="${link}" style="color: black;">link</a></strong>
    for password resseting on our site, <br> have a good day ☀
  `,
  }),
};

type EmailTypes = 'verificationEmail' | 'resetPasswordEmail'; // FEAT: for feature work with emails

export {
  Emails,
  EmailTypes,
};
