import { StaticHelper } from "./helper/static_helper";
import * as cheerio from "cheerio";
import { UserModel } from "./model/user_model";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
import axios, { Axios, AxiosInstance, AxiosRequestHeaders } from "axios";
import {configDotenv} from "dotenv";
import { FasihSMService } from "./service/fasihsm_service";
import { Sheet, WorkBook } from "xlsx";
import xlsx from "xlsx";
import moment from "moment";
import fs from "fs/promises";
import { LoginService } from "./service/login_service";
import { TaskScheduler } from "./scheduler/task_scheduler";
import { AccountService } from "./service/account_service";
import { AnomaliService } from "./service/anomali_service";
import { ActionService } from "./service/action_service";
import { PuppeteerService } from "./service/puppeteer_service";

configDotenv({
    override: true
});

export let globalAxios: AxiosInstance | null = null;

export function changeGlobalAxios(newObject: AxiosInstance): void {
    globalAxios = newObject;
    globalAxios.interceptors.request.use(async (headerConfig) => {
        console.info(`Method : ${headerConfig.method?.toString().toUpperCase()}\nUrl : ${headerConfig.url}`);
        let cookie: string = await headerConfig.jar?.getCookieString("https://fasih-sm.bps.go.id")??"";
        headerConfig.headers["User-Agent"] = "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36";
        headerConfig.headers["Host"] = "fasih-sm.bps.go.id";
        headerConfig.headers["Origin"] = "https://fasih-sm.bps.go.id";
        headerConfig.headers["accept"] = "application/json";
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
}

// async function downloadRecap(userInfo: UserModel): Promise<void>{
//     try {
//         let cleanedUsername: string = userInfo.username.trim();
//         let cleanedPassword: string = userInfo.password.trim();
//         if((cleanedUsername === "") || (cleanedPassword === "")){
//             console.info(`Empty Username, Password`);
//             return;
//         }
//         userInfo.username = cleanedUsername;
//         userInfo.password = cleanedPassword;

//         //login
//         let persistAxios = await LoginService.login(userInfo);
//         //if success login, go to home page first;
//         await persistAxios.get(StaticHelper.baseUrl);
//         // persistAxios.interceptors.request.clear();

//         /*
//             "User-Agent": StaticHelper.userAgent,
//             "Host": "fasih-sm.bps.go.id",
//             "Origin": "https://fasih-sm.bps.go.id",
//             "accept": "application/json",
//             "accept-language": "en-US,en;q=0.9",
//             "content-type": "application/json",
//             "sec-ch-ua": "\"Microsoft Edge\";v=\"149\", \"Chromium\";v=\"149\", \"Not)A;Brand\";v=\"24\"",
//             "sec-ch-ua-mobile": "?0",
//             "sec-ch-ua-platform": "\"Windows\"",
//             "sec-fetch-dest": "empty",
//             "sec-fetch-mode": "cors",
//             "sec-fetch-site": "same-origin"
//         */
//     //    let xsrfToken: string = "";
//         persistAxios.interceptors.request.use(async (headerConfig) => {
//             let cookie: string = await headerConfig.jar?.getCookieString("https://fasih-sm.bps.go.id")??"";
//             headerConfig.headers["User-Agent"] = "PostmanRuntime/7.51.1";
//             headerConfig.headers["Host"] = "fasih-sm.bps.go.id";
//             headerConfig.headers["Origin"] = "https://fasih-sm.bps.go.id";
//             headerConfig.headers["accept"] = "application/json";
//             headerConfig.headers["accept-language"] = "en-US,en;q=0.9";
//             headerConfig.headers["content-type"] = "application/json";
//             headerConfig.headers["sec-ch-ua"] = "\"Microsoft Edge\";v=\"149\", \"Chromium\";v=\"149\", \"Not)A;Brand\";v=\"24\"";
//             headerConfig.headers["sec-ch-ua-mobile"] = "?0";
//             headerConfig.headers["sec-ch-ua-platform"] = "\"Windows\"";
//             headerConfig.headers["sec-fetch-dest"] = "empty";
//             headerConfig.headers["sec-fetch-mode"] = "cors";
//             headerConfig.headers["sec-fetch-site"] = "same-origin";
//             headerConfig.headers['connection'] = 'keep-alive';
//             if(cookie.includes("XSRF-TOKEN")){
//                 let splittedStr: string[] = cookie.split("XSRF-TOKEN=",2);
//                 let splittedStr1: string[] | undefined = splittedStr.at(1)?.split(";",2);
//                 let stringXXSRF: string | undefined = splittedStr1?.at(0);
//                 if(stringXXSRF){
//                     headerConfig.headers['x-xsrf-token'] = stringXXSRF.trim();
//                 }
//             }
//             return headerConfig;
//         });
        
//         let groupCode: string = process.env.GROUP_ID??"";
//         let result = await FasihSMService.getChildWilayah(persistAxios, "region3",{
//             region2Id: "acef9070-7d80-421f-8d66-cbfcd8219dd0"
//         }, groupCode);
//         let workBook: WorkBook = xlsx.utils.book_new();
//         let excelData: {
//             kecCode: string;
//             desaCode: string;
//             slsCode: string;
//             name: string;
//             [key: string]: string | number;
//         }[] = [];
//         type WilayahData = {
//             region1Id: string;
//             region2Id: string;
//             region3Id: string;
//             region4Id: string;
//             region5Id: string;
//             region6Id: string;
//             region3Code: string;
//             region4Code: string;
//             region5Code: string;
//             region6Code: string;
//             region3Name: string;
//             region4Name: string;
//             region5Name: string;
//             region6Name: string;
//         };
//         let wilayahExcel = xlsx.readFile("./result/wilayah.xlsx");
//         let firstSheet = wilayahExcel.Sheets[wilayahExcel.SheetNames.at(0)!]!;
//         let wilayahData: WilayahData[] = xlsx.utils.sheet_to_json<WilayahData>(firstSheet);
//         let counter: number = 0;
//         for(let wilayahItem of wilayahData){
//         //Get Recap Data For Certain SubSLS
//             counter++;
//             console.info(`Progress ${counter} : ${wilayahItem.region6Id}`);
//             try {
//                 let resultRecap = await FasihSMService.getDataValues(
//                     {
//                         region1Id: wilayahItem.region1Id,
//                         region2Id: wilayahItem.region2Id,
//                         region3Id: wilayahItem.region3Id,
//                         region4Id: wilayahItem.region4Id,
//                         region5Id: wilayahItem.region5Id,
//                         region6Id: wilayahItem.region6Id
//                     }
//                 );
//                 let {searchAggregation, ...rest} = resultRecap;
//                 let rowData: {
//                     kecCode: string;
//                     desaCode: string;
//                     slsCode: string;
//                     name: string;
//                     [key: string]: string | number;
//                 } = {
//                     kecCode: wilayahItem.region3Code,
//                     desaCode: wilayahItem.region4Code,
//                     slsCode: wilayahItem.region6Id,
//                     name: wilayahItem.region5Name
//                 };
//                 for(let itemAgg of searchAggregation){
//                     rowData[itemAgg.keyAggregation] = itemAgg.docCount
//                 }
//                 excelData.push(rowData);
//                 console.info(`✅️ Success Get Data\n${wilayahItem.region6Id}`);
//             } catch(err5){
//                 console.info(`Error Get Data Of ${wilayahItem.region6Id}`);
//             }
//         }
//         let newSheet = xlsx.utils.json_to_sheet(excelData);
//         xlsx.utils.book_append_sheet(workBook, newSheet);
//         //create dir first if not exists
//         let resultDir = await fs.mkdir("./result", {recursive: true});
//         //write to file
//         xlsx.writeFile(workBook,`./result/${moment().format("YYYYMMDD_HHmmss")}_data.xlsx`);
//     } catch(err){
//         console.info(`Error Occurred ${err}`);
//     } finally {
//         console.info(`Done`);
//     }
// }

// //Deprecated
// export async function main(userInfo: UserModel): Promise<void>{
//     try {
//         let cleanedUsername: string = userInfo.username.trim();
//         let cleanedPassword: string = userInfo.password.trim();
//         if((cleanedUsername === "") || (cleanedPassword === "")){
//             console.info(`Empty Username, Password`);
//             return;
//         }
//         userInfo.username = cleanedUsername;
//         userInfo.password = cleanedPassword;

//         let region1Id: string = (process.env.REGION1_ID??"").trim(); //edit prov di sini
//         let region2Id: string = (process.env.REGION2_ID??"").trim(); //edit regionid di sini
//         let groupId: string = (process.env.GROUP_ID??"").trim(); // edit groupid di sini

//         if((!region1Id) || (!region2Id) || (!groupId)) {
//             console.info(`Invalid Region1 ID/ Region2 ID/ Group ID`);
//             return;
//         }

//         //login
//         globalAxios = await LoginService.loginSelenium(userInfo);
//         //if success login, go to home page first;
//         globalAxios.get(StaticHelper.baseUrl);
//         globalAxios.interceptors.request.use(async (headerConfig) => {
//             console.info(`Method : ${headerConfig.method?.toString().toUpperCase()}\nUrl : ${headerConfig.url}`);
//             let cookie: string = await headerConfig.jar?.getCookieString("https://fasih-sm.bps.go.id")??"";
//             headerConfig.headers["User-Agent"] = "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36";
//             headerConfig.headers["Host"] = "fasih-sm.bps.go.id";
//             headerConfig.headers["Origin"] = "https://fasih-sm.bps.go.id";
//             headerConfig.headers["accept"] = "application/json";
//             headerConfig.headers["accept-language"] = "en-US,en;q=0.9";
//             headerConfig.headers["content-type"] = "application/json";
//             headerConfig.headers["sec-ch-ua"] = "\"Microsoft Edge\";v=\"149\", \"Chromium\";v=\"149\", \"Not)A;Brand\";v=\"24\"";
//             headerConfig.headers["sec-ch-ua-mobile"] = "?0";
//             headerConfig.headers["sec-ch-ua-platform"] = "\"Windows\"";
//             headerConfig.headers["sec-fetch-dest"] = "empty";
//             headerConfig.headers["sec-fetch-mode"] = "cors";
//             headerConfig.headers["sec-fetch-site"] = "same-origin";
//             headerConfig.headers['connection'] = 'keep-alive';
//             headerConfig.headers['priority'] = "u=1, i";
//             if(cookie.includes("XSRF-TOKEN")){
//                 let splittedStr: string[] = cookie.split("XSRF-TOKEN=",2);
//                 let splittedStr1: string[] | undefined = splittedStr.at(1)?.split(";",2);
//                 let stringXXSRF: string | undefined = splittedStr1?.at(0);
//                 if(stringXXSRF){
//                     headerConfig.headers['x-xsrf-token'] = stringXXSRF.trim();
//                 }
//             }
//             return headerConfig;
//         });
        
//         // comment or uncomment below method, if this is first time, let download SlsData First
//         // await FasihSMService.downloadSlsData(globalAxios, {
//         //     groupCode: groupId,
//         //     region1Id: region1Id,
//         //     region2Id: region2Id
//         // });

//         // comment or uncomment below method
//         await FasihSMService.downloadProgressWilayah();

//         // await FasihSMService.downloadSubSlsData({
//         //     groupCode: groupId,
//         //     region1Id: region1Id,
//         //     region2Id: region2Id
//         // });
        
//         // becareful use this, you will blocked
//         // await FasihSMService.downloadRawData();


//     } catch(err){
//         console.info(`Error Occurred ${err}`);
//     } finally {
//         console.info(`Done`);
//     }
// }

PuppeteerService.main({
    username: process.env.USERNAME??"",
    password: process.env.PASSWORD??""
});