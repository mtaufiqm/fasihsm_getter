
import { Browser, Page } from "puppeteer";
import axios, { AxiosInstance } from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import { UserModel } from "../model/user_model";
import { StaticHelper } from "../helper/static_helper";
import moment from "moment";
import xlsx, { WorkBook } from "xlsx";
import { FasihSMService } from "./fasihsm_service";
import fs from "fs/promises";
import { AccountService } from "./account_service";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { changeGlobalAxios, globalAxios } from "../main";
import { ChildWilayahModel } from "../model/wilayah_model";

puppeteer.use(StealthPlugin());


export class PuppeteerService {
    static async loginPuppeteer(
        userInfo?: UserModel,
        waitingTime?: number
    ): Promise<Browser> {

        const browser: Browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
        });
        const page: Page = await browser.newPage();
        // await page.setRequestInterception(true);
        // page.on("request", request => {
        //     if (request.url().includes("/TSPD/")) {
        //         request.abort();
        //         return;
        //     }
        //     request.continue();
        // });
        // await page.evaluateOnNewDocument(() => {
        //     Object.defineProperty(navigator, 'webdriver', {
        //     get: () => false,
        //     });
        // });
        try {
            const fp = await page.evaluate(() => ({
                webdriver: navigator.webdriver,
                userAgent: navigator.userAgent,
                languages: navigator.languages,
                platform: navigator.platform,
            }));
            console.log(fp);
            await page.goto(`${StaticHelper.baseUrl}/oauth_login.html`,
                { waitUntil: "domcontentloaded" }
            );
            await new Promise(resolve => setTimeout(resolve, 10000));
            await page.waitForSelector(".login-button");
            await page.click(".login-button");
            console.log("Login Manual terlebih dahulu Guys");

            const loginForm = await page.waitForSelector(
                "#kc-form-login",
                {
                    timeout: waitingTime ?? 300000
                }
            );

            if (
                loginForm &&
                userInfo?.username &&
                userInfo?.password
            ) {
                console.info(
                    "There is Login Form Found, try to fill it"
                );

                await page.locator("#username")
                    .fill(userInfo.username.trim());

                await page.locator("#password")
                    .fill(userInfo.password.trim());

                console.info("Submitting Login Form");

                await page.locator("#kc-login")
                    .click();

                // Optional: give browser a few seconds
                await new Promise(resolve =>
                    setTimeout(resolve, 5000)
                );

                console.info("Login button clicked");
            }

            return browser;

        } catch (err) {
            console.info(`Error Occurred ${err}`);
            await browser.close();
            throw err;
        }
    }

    static async getChildWilayah(authInfo: UserModel, get: "region3" | "region4" | "region5" | "region6", param: {
        region1Id?: string; //prov
        region2Id?: string; //kab
        region3Id?: string; //kec
        region4Id?: string; //desa
        region5Id?: string; //sls
        region6Id?: string; //subsls
    }, groupId: string): Promise<ChildWilayahModel> {
        let success: boolean = false;
        let tryCount: number = 0;
        while(!success){
            tryCount++;
            try {
                let strlUrl: string = "";
                if(get === "region3"){
                    strlUrl = `https://fasih-sm.bps.go.id/region/api/v1/region/level3?groupId=${groupId}&level2Id=${param.region2Id}`
                }
                if(get === "region4"){
                    strlUrl = `https://fasih-sm.bps.go.id/region/api/v1/region/level4?groupId=${groupId}&level3Id=${param.region3Id}`
                }
                if(get === "region5"){
                    strlUrl = `https://fasih-sm.bps.go.id/region/api/v1/region/level5?groupId=${groupId}&level4Id=${param.region4Id}`
                }
                if(get === "region6"){
                    strlUrl = `https://fasih-sm.bps.go.id/region/api/v1/region/level6?groupId=${groupId}&level5Id=${param.region5Id}`
                }
                let result = await globalAxios!.get<ChildWilayahModel>(strlUrl);
                //detect if blocked
                let stringResp = JSON.stringify(result.data);
                if(stringResp.includes("Kami mendeteksi perilaku") || stringResp.includes("kc-form-login")){
                    console.info(`Detected as Bot or Auto Logout Occurred`);
                    console.info(`Try To Login Again`);
                    const browser = await PuppeteerService.loginPuppeteer(authInfo??AccountService.listAccount.at(0)!);
                    let newPage = await browser.newPage();
                    try {
                        await newPage.goto("https://fasih-sm.bps.go.id/survey-collection/collect/a0429e96-51a5-477b-a415-485f9c153004", {
                            waitUntil: "networkidle2"
                        });
                    } catch(err2){
                    }
                    changeGlobalAxios(await PuppeteerService.getAxiosWithCache(browser));
                    browser.close();
                    continue;
                }
                console.info(`✅️ Success Get Child Wilayah`);
                success = true;
                return result.data;
            } catch(err){
                console.info(`Error Occurred ${err}`);
                if(tryCount < 5){
                    console.log(`Try again ${tryCount}`);
                    continue;
                }
                if(tryCount < 10){
                    console.log(`Try again ${tryCount}`);
                    const browser = await PuppeteerService.loginPuppeteer(authInfo??AccountService.listAccount.at(0)!);
                    let newPage = await browser.newPage();
                    try {
                        await newPage.goto("https://fasih-sm.bps.go.id/survey-collection/collect/a0429e96-51a5-477b-a415-485f9c153004", {
                            waitUntil: "networkidle2"
                        });
                    } catch(err2){
                    }
                    changeGlobalAxios(await PuppeteerService.getAxiosWithCache(browser));
                    browser.close();
                    continue;
                }
                throw new Error(`${err}`);
            } finally {
                console.info("Done.");
            }
        }
        throw new Error(`Unexpected`);
    }
    
    static async downloadSlsData(userInfo: UserModel, param: {
        groupCode: string;
        region1Id: string; //prov
        region2Id: string; //kab
    }): Promise<void>{
        try {
            console.info(`⌛ Trying Download SLS Data of ${param.region2Id}`);
            let result = await PuppeteerService.getChildWilayah(userInfo, "region3",{
                region2Id: param.region2Id
            }, param.groupCode);
            let workBook: WorkBook = xlsx.utils.book_new();
            type WilayahData = {
                region1Id: string;
                region2Id: string;
                region3Id: string;
                region4Id: string;
                region5Id: string;
                region3Code: string;
                region4Code: string;
                region5Code: string;
                region3Name: string;
                region4Name: string;
                region5Name: string;
            };
            let wilayahData: WilayahData[] = [];
            for(let region3 of result.data){
                try {
                    let result4 = await PuppeteerService.getChildWilayah(userInfo, "region4",{
                        region3Id: region3.id
                    }, param.groupCode);
                    for(let region4 of result4.data){
                        try {
                            let result5 = await PuppeteerService.getChildWilayah(userInfo, "region5", {
                                region4Id: region4.id
                            }, param.groupCode);
                            for(let region5 of result5.data){
                                // //Get Recap Data For Certain SubSLS
                                // try {
                                //     let resultRecap = await FasihSMService.getDataValues(persistAxios,
                                //         {
                                //             region1Id: region1Id,
                                //             region2Id: region2Id,
                                //             region3Id: region3.id,
                                //             region4Id: region4.id,
                                //             region5Id: region5.id,
                                //             region6Id: region6.id
                                //         }
                                //     );
                                //     let {searchAggregation, ...rest} = resultRecap;
                                //     let rowData: {
                                //         id: string;
                                //         kecCode: string;
                                //         desaCode: string;
                                //         slsCode: string;
                                //         name: string;
                                //         [key: string]: string | number;
                                //     } = {
                                //         id: region6.id,
                                //         kecCode: region3.code,
                                //         desaCode: region4.code,
                                //         slsCode: region6.fullCode,
                                //         name: region6.name
                                //     };
                                //     for(let itemAgg of searchAggregation){
                                //         rowData[itemAgg.keyAggregation] = itemAgg.docCount
                                //     }
                                //     excelData.push(rowData);
                                //     console.info(`✅️ Success Get Data\n${region3.name}, ${region4.name} ${region6.fullCode}: ${region5.name}`);
                                // } catch(err5){
                                //     console.info(`Error Get Data Of ${region6.fullCode}: ${region6.name}`);
                                // }
                                let wilayahDataRow: WilayahData = {
                                    region1Id: param.region1Id,
                                    region2Id: param.region2Id,
                                    region3Id: region3.id,
                                    region4Id: region4.id,
                                    region5Id: region5.id,
                                    region3Code: region3.fullCode,
                                    region4Code: region4.fullCode,
                                    region5Code: region5.fullCode,
                                    region3Name: region3.name,
                                    region4Name: region4.name,
                                    region5Name: region5.name,
                                };
                                wilayahData.push(wilayahDataRow);
                            }
                        } catch(err3) {
                            console.info(`Error Get SLS Of ${region4.fullCode}: ${region4.name}`);
                        }
                    }
                } catch(err2){
                    console.info(`Error Get Desa Of ${region3.fullCode}: ${region3.name}`);
                }
            }
            let wilayahSheet = xlsx.utils.json_to_sheet(wilayahData);
            xlsx.utils.book_append_sheet(workBook, wilayahSheet, "wilayah");
            //create dir first if not exists
            let resultDir = await fs.mkdir("./result", {recursive: true});
            //write to file
            xlsx.writeFile(workBook,`./result/wilayah.xlsx`);
            console.info(`Success Download Wilayah SLS Data`);
        } catch(err){
            throw new Error(`${err}`);
        } finally {
            console.info(`Done Download Wilayah Data`);
        }
    }

    static async downloadProgress(authInfo: UserModel, sourceWilayah: string = './result/wilayah.xlsx', outputLoc: string = `./result/${moment().format('YYYYMMDD_HHmmss')}_progress_wilayah.xlsx`): Promise<void> {
        try {
            console.info(`⌛ Trying Download Progress Wilayah of From File ${sourceWilayah} to ${outputLoc}`);
            let workBook: WorkBook = xlsx.utils.book_new();
            type WilayahData = {
                region1Id: string;
                region2Id: string;
                region3Id: string;
                region4Id: string;
                region5Id: string;
                region3Code: string;
                region4Code: string;
                region5Code: string;
                region3Name: string;
                region4Name: string;
                region5Name: string;
            };
            let wilayahExcel = xlsx.readFile(sourceWilayah);
            let firstSheet = wilayahExcel.Sheets[wilayahExcel.SheetNames.at(0)!]!;
            let wilayahData: WilayahData[] = xlsx.utils.sheet_to_json<WilayahData>(firstSheet);
            if(wilayahData.length === 0){
                console.info(`There is no Wilayah Data in ${sourceWilayah}`);
                throw new Error(`There is no Wilayah Data in ${sourceWilayah}`);
            }
            let resultRow: {label: string; [key: string]: string | number}[] = [];
            let counter: number = 0;
            //another version of call, make it async for more speed
            // let asyncFunctionCall = async (): Promise<boolean> => {
            //     try {
            //         return true;
            //     } catch(errAsyncFunc){
            //         return false;
            //     }
            // }
            for(let wilayahItem of wilayahData){
            //Get Recap Data For Certain SubSLS
                counter++;
                let success: boolean = false;
                let countTry: number = 1;
                while((success === false)){
                    console.info(`Progress ${counter} - On ${countTry} Try: ${wilayahItem.region5Id}`);
                    try {
                        let resultRecap = await FasihSMService.getReportWilayah(globalAxios!, {
                            region1Id: wilayahItem.region1Id,
                            region2Id: wilayahItem.region2Id,
                            region3Id: wilayahItem.region3Id,
                            region4Id: wilayahItem.region4Id,
                            region5Id: wilayahItem.region5Id
                        });
                        //detect if blocked
                        let stringResp = JSON.stringify(resultRecap);
                        if(stringResp.includes("Kami mendeteksi perilaku") || stringResp.includes("kc-form-login")){
                            console.info(`Detected as Bot or Auto Logout Occurred`);
                            console.info(`Try To Login Again`);
                            const browser = await PuppeteerService.loginPuppeteer(authInfo??AccountService.listAccount.at(0)!);
                            let newPage = await browser.newPage();
                            try {
                                await newPage.goto("https://fasih-sm.bps.go.id/survey-collection/collect/a0429e96-51a5-477b-a415-485f9c153004", {
                                    waitUntil: "networkidle2"
                                });
                            } catch(err2){
                            }
                            changeGlobalAxios(await PuppeteerService.getAxiosWithCache(browser));
                            browser.close();
                            continue;
                        }
                        for(let itemResult of resultRecap){
                            let dataRow: {
                                label: string;
                                [key: string]: string | number;
                            } = {
                                label: itemResult.label
                            };
                            for(let itemColumn of itemResult.values){
                                dataRow[itemColumn.label] = itemColumn.value;
                            }
                            resultRow.push(dataRow);
                        }
                        console.info(`✅️ Success Get Progress\n${wilayahItem.region5Id}`);
                        success = true;
                    } catch(err5){
                        countTry++;
                        if(countTry < 5){
                            continue;
                        }
                        if(countTry < 15){
                            const browser = await PuppeteerService.loginPuppeteer(AccountService.listAccount.at(0)!);
                            let newPage = await browser.newPage();
                            try {
                                await newPage.goto("https://fasih-sm.bps.go.id/survey-collection/collect/a0429e96-51a5-477b-a415-485f9c153004", {
                                    waitUntil: "networkidle2"
                                });
                            } catch(err2){
                            }
                            changeGlobalAxios(await PuppeteerService.getAxiosWithCache(browser));
                            browser.close();
                            continue;
                        }
                        success = true;
                        console.info(`Error Get Progress Of ${wilayahItem.region5Id}, Try Again ${countTry}`);
                    }
                }
            }
            let newSheet = xlsx.utils.json_to_sheet(resultRow);
            xlsx.utils.book_append_sheet(workBook, newSheet);
            //create dir first if not exists
            let resultDir = await fs.mkdir("./result", {recursive: true});
            //write to file
            xlsx.writeFile(workBook,outputLoc);
            console.info(`✅️ Success Download Progress Data to ${outputLoc}`);
        } catch(err){
            console.info(`Error While Download Progress Wilayah ${err}`);
            throw new Error(`Error While Download Progress Wilayah ${err}`);
        }
    }

    static async getAxiosWithCache(browser: Browser): Promise<AxiosInstance> {
        const cookies = await browser.cookies();
        const jarCookie = new CookieJar();
        for (const cookie of cookies) {
            await jarCookie.setCookie(
                `${cookie.name}=${cookie.value}`,
                StaticHelper.baseUrl
            );
            console.info(`${cookie.name}=${cookie.value}`);
        }
        const axiosPersist = wrapper(
            axios.create({
                jar: jarCookie,
                withCredentials: true,
                withXSRFToken: true,
            })
        );
        axiosPersist.interceptors.request.use(
            async (headerConfig) => {
                console.info(
                    `Method : ${headerConfig.method?.toUpperCase()}\nUrl : ${headerConfig.url}`
                );
                const cookie =
                    await headerConfig.jar?.getCookieString(
                        "https://fasih-sm.bps.go.id"
                    ) ?? "";
                headerConfig.headers["User-Agent"] =
                    "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36";

                headerConfig.headers["Host"] =
                    "fasih-sm.bps.go.id";

                headerConfig.headers["Origin"] =
                    "https://fasih-sm.bps.go.id";

                headerConfig.headers["accept-language"] =
                    "en-US,en;q=0.9";

                headerConfig.headers["content-type"] =
                    "application/json";

                headerConfig.headers["sec-ch-ua"] =
                    "\"Microsoft Edge\";v=\"149\", \"Chromium\";v=\"149\", \"Not)A;Brand\";v=\"24\"";

                headerConfig.headers["sec-ch-ua-mobile"] =
                    "?0";

                headerConfig.headers["sec-ch-ua-platform"] =
                    "\"Windows\"";

                headerConfig.headers["sec-fetch-dest"] =
                    "empty";

                headerConfig.headers["sec-fetch-mode"] =
                    "cors";

                headerConfig.headers["sec-fetch-site"] =
                    "same-origin";

                headerConfig.headers["connection"] =
                    "keep-alive";

                headerConfig.headers["priority"] =
                    "u=1, i";

                const xsrfCookie = cookie
                    .split(";")
                    .find(c =>
                        c.trim().startsWith(
                            "XSRF-TOKEN="
                        )
                    );
                if (xsrfCookie) {
                    const token = xsrfCookie.split("=")[1];
                    if (token) {
                        headerConfig.headers["x-xsrf-token"] =
                            decodeURIComponent(token);
                    }
                }
                return headerConfig;
            }
        );
        return axiosPersist;
    } 

    static async main(userInfo?: UserModel): Promise<void> {
        if(!userInfo){
            console.info(`Empty User Info`);
            return;
        }

        let cleanedUsername: string = userInfo.username.trim();
        let cleanedPassword: string = userInfo.password.trim();
        if((cleanedUsername === "") || (cleanedPassword === "")){
            console.info(`Empty Username, Password`);
            return;
        }
        userInfo.username = cleanedUsername;
        userInfo.password = cleanedPassword;

        let region1Id: string = (process.env.REGION1_ID??"").trim(); //edit prov di sini
        let region2Id: string = (process.env.REGION2_ID??"").trim(); //edit regionid di sini
        let groupId: string = (process.env.GROUP_ID??"").trim(); // edit groupid di sini

        if((!region1Id) || (!region2Id) || (!groupId)) {
            console.info(`Invalid Region1 ID/ Region2 ID/ Group ID`);
            return;
        }

        const browser = await PuppeteerService.loginPuppeteer(userInfo??AccountService.listAccount.at(0)!);
        let newPage = await browser.newPage();
        try {
            await newPage.goto("https://fasih-sm.bps.go.id/survey-collection/collect/a0429e96-51a5-477b-a415-485f9c153004", {
                waitUntil: "networkidle2"
            });
        } catch(err2){
        }
        changeGlobalAxios(await PuppeteerService.getAxiosWithCache(browser));
        browser.close();

        //download sls data with puppeteer
        await PuppeteerService.downloadSlsData(userInfo!, {
            groupCode: groupId,
            region1Id: region1Id,
            region2Id: region2Id
        });

        //download progress with puppeteer
        await PuppeteerService.downloadProgress(userInfo!);
        console.info(`Done`);
    }
}
