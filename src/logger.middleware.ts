import { Logger, NestMiddleware, Injectable} from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
const fs = require('fs');

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private logger = new Logger('HTTP');

    use(request: Request, response: Response, next: NextFunction): void {
        const { ip, method, originalUrl } = request;
        const date = new Date().toLocaleString();
        const userAgent = request.get('user-agent') || '';
        let body = "";
        Object.entries(request.body).forEach(([params, value]) => {
            body += `${params} : ${value} \n`
        });
        response.on('finish', () => {
            const { statusCode } = response;
            this.logger.log(
                `${method} ${originalUrl} ${statusCode} - ${ip}`,
            );
            fs.appendFileSync("logs.txt", `IP : ${ip}\nRoute : ${originalUrl}\nDate : ${date}\nParamètres :\n${body}\n===============================\n\n`, err => console.log(err));
        });
        next();
    }
}