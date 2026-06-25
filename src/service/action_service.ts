import { WebDriver } from "selenium-webdriver";
import { StaticHelper } from "../helper/static_helper";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
import axios from "axios";
import { LoginService } from "./login_service";
import { AccountService } from "./account_service";
import { changeGlobalAxios } from "../main";
import { FasihSMService } from "./fasihsm_service";
export class ActionService {
    static async downloadProgress(): Promise<void>{
        try {
            let driver = await LoginService.loginSeleniumReturnBrowser(AccountService.listAccount.at(0)!);
            await driver.get(`${StaticHelper.baseUrl}/survey-collection/general/a0429e96-51a5-477b-a415-485f9c153004`);
            await driver.get(`${StaticHelper.baseUrl}/survey-collection/collect/a0429e96-51a5-477b-a415-485f9c153004`);
                        const cookies = await driver.manage().getCookies();
            let jarCookie = new CookieJar();
            for (const cookie of cookies) {
                await jarCookie.setCookie(`${cookie.name}=${cookie.value}`, StaticHelper.baseUrl);
            }
            let axiosPersist = wrapper(axios.create({
                jar: jarCookie,
                withCredentials: true,
                withXSRFToken: true
            }));
            changeGlobalAxios(axiosPersist);
            await FasihSMService.downloadProgressWilayahAlternatif();
        } catch(err){
        } finally {

        }
    }
}