import Logger from './logger.js'

const Log = Logger(
    'Logger Prefix: ',
    true,
    ['development', 'staging'],
    false
)

Log.log('test', true, 'it out')
Log.warn('test', true, 'it out')
Log.error('Your error message!')