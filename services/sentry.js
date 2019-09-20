const Sentry = require('@sentry/node')

Sentry.init({ dsn: process.env.SENTRY_ENDPOINT })

exports.captureMessage = message => Sentry.captureMessage(message)
exports.captureException = exception => Sentry.captureException(exception)
