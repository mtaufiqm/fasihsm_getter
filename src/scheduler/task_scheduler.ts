import { CronJob } from "cron";
import moment from "moment";
import { PuppeteerService } from "../service/puppeteer_service";

export class TaskScheduler {
    static async runScheduler(): Promise<void> {
        try {
            let cronJobExecutor = new CronJob("0 */3 * * *", async (): Promise<void> => {
                try {
                    await PuppeteerService.main({
                        username: process.env.USERNAME??"",
                        password: process.env.PASSWORD??""
                    });
                } catch(err) {
                    console.info(`Error While Execute Task in ${moment().format(`YYYY-MM-DD Pukul HH:mm:ss`)}`);
                }
                console.info(`${moment().format(`YYYY-MM-DD Pukul HH:mm:ss`)}, Waiting For Next Schedule`);
            });
            cronJobExecutor.start();
        } catch(err) {
            console.info(`Error Occurred ${err}`);
        }     
    }
}
