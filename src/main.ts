import { StaticHelper } from "./helper/static_helper";
import * as cheerio from "cheerio";
import { UserModel } from "./model/user_model";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
import axios, { AxiosInstance, AxiosRequestHeaders } from "axios";
import {configDotenv} from "dotenv";
import { FasihSMService } from "./service/fasihsm_service";
import { Sheet, WorkBook } from "xlsx";
import xlsx from "xlsx";
import moment from "moment";
import fs from "fs/promises";

configDotenv({
    override: true
});
async function login(userInfo: UserModel): Promise<AxiosInstance> {
    let cookieJar = new CookieJar();
    let client = wrapper(axios.create({
        jar: cookieJar,
        withXSRFToken: true,
        withCredentials: true
    }));
    console.info(`⌛ Go to SSO Page`);
    let result = await client.get(StaticHelper.fasihLoginUrl, {
        headers: {
            "Host": "fasih-sm.bps.go.id",
            "Origin": "https://fasih-sm.bps.go.id",
            "User-Agent": "PostmanRuntime/7.51.1",
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
    let htmlObj = cheerio.load(result.data);
    let action = htmlObj("#kc-form-login").attr("action");
    if(!action){
        throw new Error("Invalid HTML! There is no Form Login Found");
    }
    let cookiesString: string = "";
    try {
        //Continue to Login SSO
        let loginSSOForm = new URLSearchParams();
        loginSSOForm.append("username", userInfo.username);
        loginSSOForm.append("password", userInfo.password);
        console.info(`⌛ Trying to Login SSO`);
        let postLogin = await client.post(action, loginSSOForm, {
            headers: {
                "Host": "sso.bps.go.id",
                "Origin": "https://sso.bps.go.id",
                "User-Agent": StaticHelper.userAgent,
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
            }
        });
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

async function downloadRecap(userInfo: UserModel): Promise<void>{
    try {
        let cleanedUsername: string = userInfo.username.trim();
        let cleanedPassword: string = userInfo.password.trim();
        if((cleanedUsername === "") || (cleanedPassword === "")){
            console.info(`Empty Username, Password`);
            return;
        }
        userInfo.username = cleanedUsername;
        userInfo.password = cleanedPassword;

        //login
        let persistAxios = await login(userInfo);
        //if success login, go to home page first;
        await persistAxios.get(StaticHelper.baseUrl);
        // persistAxios.interceptors.request.clear();

        /*
            "User-Agent": StaticHelper.userAgent,
            "Host": "fasih-sm.bps.go.id",
            "Origin": "https://fasih-sm.bps.go.id",
            "accept": "application/json",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/json",
            "sec-ch-ua": "\"Microsoft Edge\";v=\"149\", \"Chromium\";v=\"149\", \"Not)A;Brand\";v=\"24\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin"
        */
    //    let xsrfToken: string = "";
        persistAxios.interceptors.request.use(async (headerConfig) => {
            let cookie: string = await headerConfig.jar?.getCookieString("https://fasih-sm.bps.go.id")??"";
            headerConfig.headers["User-Agent"] = "PostmanRuntime/7.51.1";
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
        
        let groupCode: string = process.env.GROUP_ID??"";
        let result = await FasihSMService.getChildWilayah(persistAxios, "region3",{
            region2Id: "acef9070-7d80-421f-8d66-cbfcd8219dd0"
        }, groupCode);
        let workBook: WorkBook = xlsx.utils.book_new();
        let excelData: {
            kecCode: string;
            desaCode: string;
            slsCode: string;
            name: string;
            [key: string]: string | number;
        }[] = [];
        type WilayahData = {
            region1Id: string;
            region2Id: string;
            region3Id: string;
            region4Id: string;
            region5Id: string;
            region6Id: string;
            region3Code: string;
            region4Code: string;
            region5Code: string;
            region6Code: string;
            region3Name: string;
            region4Name: string;
            region5Name: string;
            region6Name: string;
        };
        let wilayahExcel = xlsx.readFile("./result/wilayah.xlsx");
        let firstSheet = wilayahExcel.Sheets[wilayahExcel.SheetNames.at(0)!]!;
        let wilayahData: WilayahData[] = xlsx.utils.sheet_to_json<WilayahData>(firstSheet);
        let counter: number = 0;
        for(let wilayahItem of wilayahData){
        //Get Recap Data For Certain SubSLS
            counter++;
            console.info(`Progress ${counter} : ${wilayahItem.region6Id}`);
            try {
                let resultRecap = await FasihSMService.getDataValues(persistAxios,
                    {
                        region1Id: wilayahItem.region1Id,
                        region2Id: wilayahItem.region2Id,
                        region3Id: wilayahItem.region3Id,
                        region4Id: wilayahItem.region4Id,
                        region5Id: wilayahItem.region5Id,
                        region6Id: wilayahItem.region6Id
                    }
                );
                let {searchAggregation, ...rest} = resultRecap;
                let rowData: {
                    kecCode: string;
                    desaCode: string;
                    slsCode: string;
                    name: string;
                    [key: string]: string | number;
                } = {
                    kecCode: wilayahItem.region3Code,
                    desaCode: wilayahItem.region4Code,
                    slsCode: wilayahItem.region6Id,
                    name: wilayahItem.region5Name
                };
                for(let itemAgg of searchAggregation){
                    rowData[itemAgg.keyAggregation] = itemAgg.docCount
                }
                excelData.push(rowData);
                console.info(`✅️ Success Get Data\n${wilayahItem.region6Id}`);
            } catch(err5){
                console.info(`Error Get Data Of ${wilayahItem.region6Id}`);
            }
        }
        let newSheet = xlsx.utils.json_to_sheet(excelData);
        xlsx.utils.book_append_sheet(workBook, newSheet);
        //create dir first if not exists
        let resultDir = await fs.mkdir("./result", {recursive: true});
        //write to file
        xlsx.writeFile(workBook,`./result/${moment().format("YYYYMMDD_HHmmss")}_data.xlsx`);
    } catch(err){
        console.info(`Error Occurred ${err}`);
    } finally {
        console.info(`Done`);
    }
}

async function main(userInfo: UserModel): Promise<void>{
    try {
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

        //login
        let persistAxios = await login(userInfo);
        //if success login, go to home page first;
        await persistAxios.get(StaticHelper.baseUrl);
        // persistAxios.interceptors.request.clear();

        /*
            "User-Agent": StaticHelper.userAgent,
            "Host": "fasih-sm.bps.go.id",
            "Origin": "https://fasih-sm.bps.go.id",
            "accept": "application/json",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/json",
            "sec-ch-ua": "\"Microsoft Edge\";v=\"149\", \"Chromium\";v=\"149\", \"Not)A;Brand\";v=\"24\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin"
        */
       let xsrfToken: string = "";
        persistAxios.interceptors.request.use(async (headerConfig) => {
            let cookie: string = await headerConfig.jar?.getCookieString("https://fasih-sm.bps.go.id")??"";
            headerConfig.headers["User-Agent"] = "PostmanRuntime/7.51.1";
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
        
        //comment or uncomment below method
        await FasihSMService.downloadSlsData(persistAxios, {
            groupCode: groupId,
            region1Id: region1Id,
            region2Id: region2Id
        });

        //comment or uncomment below method
        await FasihSMService.downloadProgressWilayah(persistAxios);

    } catch(err){
        console.info(`Error Occurred ${err}`);
    } finally {
        console.info(`Done`);
    }
}

main({
    username: process.env.USERNAME??"",
    password: process.env.PASSWORD??""
});