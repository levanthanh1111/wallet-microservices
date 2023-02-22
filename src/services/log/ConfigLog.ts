require('dotenv').config();

const LOG_DIR = process.env.LOG_DIR;
const LOG_LEVEL = process.env.LOG_LEVEL;

module.exports.configuration = {
    appenders: {
        'console': {
            type: 'console',
            layout: {
                pattern: '%[[%p]%] %m',
                type: 'pattern'
            }
        },
        'console-trace': {
            type: 'console',
            layout: {
                pattern: '%[[%p]%] %m%n%s',
                type: 'pattern'
            }
        },
        'main': {
            type: 'dateFile',
            filename: `${LOG_DIR}/main/wallet.log`,
            layout: {
                type: 'pattern',
                pattern: '%d{dd/MM/yyyy-hh:mm:ss} [%p] %m'
            },
            pattern: '.dd-MM-yyyy',
            keepFileExt: true,
            compress: false,
            numBackups: 30
        },
        'error': {
            type: 'dateF' +
                'ile',
            filename: `${LOG_DIR}/error/wallet_error.log`,
            layout: {
                type: 'pattern',
                pattern: '%d{dd/MM/yyyy-hh:mm:ss} [%p] %m%n%s'
            },
            pattern: '.dd-MM-yyyy',
            keepFileExt: true,
            compress: false,
            numBackups: 30
        },
        ConsoleFilter_default: { type: 'logLevelFilter', appender: 'console', level: 'TRACE', maxLevel: 'WARN' },
        ConsoleFilter_error: { type: 'logLevelFilter', appender: 'console-trace', level: 'ERROR' },

        FileFilter_main: { type: 'logLevelFilter', appender: 'main', level: 'TRACE' },
        FileFilter_error: { type: 'logLevelFilter', appender: 'error', level: 'ERROR' }
    },
    categories: {
        default: {
            appenders: ['ConsoleFilter_default', 'ConsoleFilter_error', 'FileFilter_main', 'FileFilter_error'],
            enableCallStack: true,
            level: LOG_LEVEL ? LOG_LEVEL : 'info'
        }
    }
};