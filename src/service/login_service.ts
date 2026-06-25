import { AxiosInstance } from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import { UserModel } from "../model/user_model";
import axios from "axios";
import * as cheerio from "cheerio";
import { StaticHelper } from "../helper/static_helper";
import { Browser, Builder, By, WebDriver } from "selenium-webdriver";

export class LoginService {
    static async login(userInfo: UserModel): Promise<AxiosInstance> {
        let cookieJar = new CookieJar();
        let client = wrapper(axios.create({
            jar: cookieJar,
            withXSRFToken: true,
            withCredentials: true,
        }));
        //go to baseUrl first;
        console.info(`⌛ Go to https://fasih-sm.bps.go.id`);
        let baseUrlResult = await client.get(StaticHelper.baseUrl);
        console.info(`⌛ Go to SSO Page`);
        let result = await client.get(StaticHelper.fasihLoginUrl, {
            headers: {
                "Host": "fasih-sm.bps.go.id",
                "Origin": "https://fasih-sm.bps.go.id",
                "User-Agent": "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36",
                "Content-Type": "application/x-www-form-urlencoded",
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "accept-language": "en-US,en;q=0.9",
                "sec-ch-ua": "\"Microsoft Edge\";v=\"149\", \"Chromium\";v=\"149\", \"Not)A;Brand\";v=\"24\"",
                "sec-ch-ua-mobile": "?1",
                "sec-ch-ua-platform": "\"Android\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "same-origin",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1"
            }
        });

        const loginPageUrl =
        result.request?.res?.responseUrl ??
        result.request?.responseURL;

        let htmlObj = cheerio.load(result.data);
        let action = htmlObj("#kc-form-login").attr("action");
        if(!action){
            console.info(`Response ${htmlObj.html()}`);
            throw new Error("Invalid HTML! There is no Form Login Found");
        }
        let cookiesString: string = "";
        try {
            //Continue to Login SSO
            let loginSSOForm = new URLSearchParams();
            loginSSOForm.append("username", userInfo.username);
            loginSSOForm.append("password", userInfo.password);
            console.info(`⌛ Trying to Login SSO`);
            console.info(`⌛ Wait 3 Seconds`);
            await new Promise(resolve => setTimeout(resolve, 3000));
            console.info(`Post Credentials`);
            let postLogin = await client.post(action, loginSSOForm, {
                headers: {
                    "Host": "sso.bps.go.id",
                    "Origin": "https://sso.bps.go.id",
                    "Content-Type": "application/x-www-form-urlencoded",                
                    'user-agent': 'PostmanRuntime/7.51.1',
                    'postman-token': '3db8037a-ccfa-4e1b-89f1-4c2b9ad31723',
                    'connection': 'keep-alive',
                    'accept': 'application/json', 
                    'accept-language': 'en-US,en;q=0.9', 
                    'sec-ch-ua': '"Microsoft Edge";v="149", "Chromium";v="149", "Not)A;Brand";v="24"', 
                    'sec-ch-ua-mobile': '?0', 
                    'sec-ch-ua-platform': '"Windows"', 
                    'sec-fetch-dest': 'empty', 
                    'sec-fetch-mode': 'cors', 
                    'sec-fetch-site': 'same-origin', 
                    "referer": loginPageUrl
                }
            });
            if((postLogin.data as string).includes("Kami mendeteksi perilaku")){
                console.info(`Detected as Bot`);
                throw new Error(`Detected as Bot`);
            }
            if((postLogin.data as string).includes("Invalid username or password.")){
                console.info(`Failed Login, Invalid Username/Password`);
                throw new Error(`Failed Login, Invalid Username/Password`);
            }
        } catch(errLogin){
            console.info(`Failed Login, ${errLogin}`);
            throw new Error(`Failed Login, ${errLogin}`);
        }
        console.info(`✅️ Success Login`);
        return client;
    }   

    static async loginSeleniumReturnBrowser(userInfo?: UserModel, waitingTime?: number): Promise<WebDriver> {
        const driver = await new Builder()
            .forBrowser(Browser.CHROME)
            .build();
        let isLogin: boolean = false;
        try {
            await driver.get(StaticHelper.fasihLoginUrl);
            console.log("Login Manual terlebih dahulu Guys");
            let loginFormFound: boolean = false;
            await driver.wait(async () => {
                const url = await driver.getCurrentUrl();
                if(url.includes("sso.bps.go.id")){
                    let formLoginElements = await driver.findElements(By.id("kc-form-login"));
                    if(formLoginElements.length === 0){
                        return !url.includes("login");
                    }
                    if(!loginFormFound){
                        console.info(`There is Login Form Found, try to fill it`);
                        loginFormFound = true;
                    }
                    console.info(`Wait 2 Seconds in Login Process`);
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    let formLoginElement = await driver.findElement(By.id("kc-form-login"));
                    let usernameInput = await formLoginElement.findElement(By.id("username"));
                    let passwordInput = await formLoginElement.findElement(By.id("password"));
                    let loginButton = await formLoginElement.findElement(By.id("kc-login"));
                    if(userInfo?.username && userInfo?.password){
                        await usernameInput.sendKeys(userInfo.username.trim());
                        await passwordInput.sendKeys(userInfo.password.trim());
                        await loginButton.click();
                    }
                }
                return !url.includes("login");
            }, waitingTime??300000);
            await driver.get(StaticHelper.baseUrl);
            return driver;
        } catch(err){
            console.info(`Error While Login With Selenium ${err}`);
            throw new Error(`${err}`);
        } finally {
            // driver.manage().window().minimize();
            // await driver.quit();
        }
    }

    static async loginSelenium(userInfo?: UserModel, waitingTime?: number): Promise<AxiosInstance> {
        const driver = await new Builder()
            .forBrowser(Browser.CHROME)
            .build();
        let isLogin: boolean = false;
        try {
            await driver.get(StaticHelper.fasihLoginUrl);
            console.log("Login Manual terlebih dahulu Guys");
            let loginFormFound: boolean = false;
            await driver.wait(async () => {
                const url = await driver.getCurrentUrl();
                if(url.includes("sso.bps.go.id")){
                    let formLoginElements = await driver.findElements(By.id("kc-form-login"));
                    if(formLoginElements.length === 0){
                        return !url.includes("login");
                    }
                    if(!loginFormFound){
                        console.info(`There is Login Form Found, try to fill it`);
                        loginFormFound = true;
                    }
                    console.info(`Wait 2 Seconds in Login Process`);
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    let formLoginElement = await driver.findElement(By.id("kc-form-login"));
                    let usernameInput = await formLoginElement.findElement(By.id("username"));
                    let passwordInput = await formLoginElement.findElement(By.id("password"));
                    let loginButton = await formLoginElement.findElement(By.id("kc-login"));
                    if(userInfo?.username && userInfo?.password){
                        await usernameInput.sendKeys(userInfo.username.trim());
                        await passwordInput.sendKeys(userInfo.password.trim());
                        await loginButton.click();
                    }
                }
                return !url.includes("login");
            }, waitingTime??300000);

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
            axiosPersist.interceptors.request.use(async (headerConfig) => {
                console.info(`Method : ${headerConfig.method?.toString().toUpperCase()}\nUrl : ${headerConfig.url}`);
                let cookie: string = await headerConfig.jar?.getCookieString("https://fasih-sm.bps.go.id")??"";
                headerConfig.headers["User-Agent"] = "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36";
                headerConfig.headers["Host"] = "fasih-sm.bps.go.id";
                headerConfig.headers["Origin"] = "https://fasih-sm.bps.go.id";
                headerConfig.headers["accept-language"] = "en-US,en;q=0.9";
                headerConfig.headers["content-type"] = "application/json";
                headerConfig.headers["sec-ch-ua"] = "\"Microsoft Edge\";v=\"149\", \"Chromium\";v=\"149\", \"Not)A;Brand\";v=\"24\"";
                headerConfig.headers["sec-ch-ua-mobile"] = "?0";
                headerConfig.headers["sec-ch-ua-platform"] = "\"Windows\"";
                headerConfig.headers["sec-fetch-dest"] = "empty";
                headerConfig.headers["sec-fetch-mode"] = "cors";
                headerConfig.headers["sec-fetch-site"] = "same-origin";
                headerConfig.headers['connection'] = 'keep-alive';
                headerConfig.headers['priority'] = "u=1, i";
                if(cookie.includes("XSRF-TOKEN")){
                    let splittedStr: string[] = cookie.split("XSRF-TOKEN=",2);
                    let splittedStr1: string[] | undefined = splittedStr.at(1)?.split(";",2);
                    let stringXXSRF: string | undefined = splittedStr1?.at(0);
                    if(stringXXSRF){
                        headerConfig.headers['x-xsrf-token'] = stringXXSRF.trim();
                    }
                }
                return headerConfig;
            });
            // let waf1 = await axiosPersist.get("https://fasih-sm.bps.go.id/TSPD/0868f8be6fab2000d06003b2b310c19cd2ef9513ad9dbf323d54f600a1106d22cc247a5dc82f5208?type=11");
            // await driver.executeScript(waf1.data);
            // let waf2 = await axiosPersist.get("https://fasih-sm.bps.go.id/TSPD/0868f8be6fab2000d06003b2b310c19cd2ef9513ad9dbf323d54f600a1106d22cc247a5dc82f5208?type=12");
            // await driver.executeScript(waf2.data);
            // let waf3 = await axiosPersist.get("https://fasih-sm.bps.go.id/TSPD/0868f8be6fab2800e74d95053a4371fa9fea94da293047e0742054eff39530d9424bfbdf9f3e5c847f638143a59e6b12?type=13");
            // await driver.executeScript(waf3.data);
            let waf4 = await axiosPersist.get("https://fasih-sm.bps.go.id/TSPD/0868f8be6fab2000d06003b2b310c19cd2ef9513ad9dbf323d54f600a1106d22cc247a5dc82f5208?type=17");
            await driver.executeScript(waf4.data);
            // let waf5 = await axiosPersist.get("https://fasih-sm.bps.go.id/TSPD/?type=22");
            // await driver.executeScript(waf5.data);


            const cookiesReturned = await driver.manage().getCookies();
            let jarCookieReturned = new CookieJar();
            for (const cookie of cookiesReturned) {
                await jarCookieReturned.setCookie(`${cookie.name}=${cookie.value}`, StaticHelper.baseUrl);
            }
            let returnedAxios = wrapper(axios.create({
                jar: jarCookieReturned,
                withCredentials: true,
                withXSRFToken: true
            }));
            return returnedAxios;
        } catch(err){
            console.info(`Error While Login With Selenium ${err}`);
            throw new Error(`${err}`);
        } finally {
            driver.manage().window().minimize();
            // await driver.quit();
        }
    }
}