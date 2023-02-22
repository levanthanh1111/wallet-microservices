import chalk from 'chalk';

export default class Logger {
    public static success(content: any): void {
        console.log(chalk.bgGreen.black(content));
    }
    public static error(err: any): void {
        if (err.message)
            console.log(chalk.bgRed.black(err.message));
        else
            console.log(chalk.bgRed.black(err));
    }
}
