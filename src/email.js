'use strict';

const Email = require('email-templates');

module.exports = function sendEmail(template, locals) {
  return new Email({
    message: {
      from: process.env.SMTP_USER,
      to: (process.env.SMTP_RECIPIENTS || process.env.SMTP_USER).split(',')
    },
    send: process.env.NODE_ENV === 'production',
    transport: {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: process.env.SMTP_USER,
        clientId: process.env.SMTP_CLIENT_ID,
        clientSecret: process.env.SMTP_CLIENT_SECRET,
        refreshToken: process.env.SMTP_REFRESH_TOKEN
      }
    }
  })
    .send({ template, locals });
};
