import console from 'node:console';

export default class DAKLogger {

    static console: any = console;

    static isInit = (() => {
        // if (process.env.NODE_ENV !== "product") return;
        const log4js = require('log4js');
        const configuration = require('./ConfigLog').configuration;
        this.console.log("Init DAKLogger");

        log4js.configure(configuration);
        const logger = log4js.getLogger();

        logger.level = "trace";

        this.console.log = (message: any) => {
            logger.log(message);
        };
        this.console.info = (message: any) => {
            logger.info(message);
        };
        this.console.warn = (message: any) => {
            logger.warn(message);
        };
        this.console.debug = (message: any) => {
            logger.debug(message);
        };
        this.console.error = (message: any) => {
            logger.error(message);
        };

        process.on('exit', () => {
            console.log("exit log file");
            log4js.shutdown();
        });

        return true;
    })();
}