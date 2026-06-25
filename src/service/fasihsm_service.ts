import { AxiosError, AxiosInstance, AxiosResponse, isAxiosError } from "axios";
import { DataModel, RawDataModel } from "../model/data_model";
import { ChildWilayahModel } from "../model/wilayah_model";
import { RecapSlsModel } from "../model/recap_model";
import { WorkBook, writeFileAsync } from "xlsx";
import xlsx from "xlsx";
import moment from "moment";
import fs from "fs/promises";
import { LoginService } from "./login_service";
import { changeGlobalAxios, globalAxios } from "../main";
import { StaticHelper } from "../helper/static_helper";
import { AccountService } from "./account_service";

export class FasihSMService {
    static async getChildWilayah(client: AxiosInstance, get: "region3" | "region4" | "region5" | "region6", param: {
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
                    changeGlobalAxios(await LoginService.loginSelenium({
                        username: process.env.USERNAME??"",
                        password: process.env.PASSWORD??""
                    }));
                    continue;
                }
                console.info(`✅️ Success Get Child Wilayah`);
                success = true;
                return result.data;
            } catch(err){
                console.info(`Error Occurred ${err}`);
                if(tryCount < 3){
                    console.log(`Try again ${tryCount}`);
                    continue;
                }
                throw new Error(`${err}`);
            } finally {
                console.info("Done.");
            }
        }
        throw new Error(`Unexpected`);
    }

    static async getDataValues(param: {
        region1Id?: string; //prov
        region2Id?: string; //kab
        region3Id?: string; //kec
        region4Id?: string; //desa
        region5Id?: string; //sls
        region6Id?: string; //subsls
    }): Promise<DataModel> {
        let success: boolean = false;
        let counter: number = 0;
        while(success === false){
            counter++;
        try {
            let postData: object = {
                "draw": 2,
                "columns": [
                    {
                    "data": "id",
                    "name": "",
                    "searchable": true,
                    "orderable": false,
                    "search": {
                        "value": "",
                        "regex": false
                    }
                    },
                    {
                    "data": "codeIdentity",
                    "name": "",
                    "searchable": true,
                    "orderable": false,
                    "search": {
                        "value": "",
                        "regex": false
                    }
                    },
                    {
                    "data": "data1",
                    "name": "",
                    "searchable": true,
                    "orderable": true,
                    "search": {
                        "value": "",
                        "regex": false
                    }
                    },
                    {
                    "data": "data2",
                    "name": "",
                    "searchable": true,
                    "orderable": true,
                    "search": {
                        "value": "",
                        "regex": false
                    }
                    },
                    {
                    "data": "data3",
                    "name": "",
                    "searchable": true,
                    "orderable": true,
                    "search": {
                        "value": "",
                        "regex": false
                    }
                    },
                    {
                    "data": "data4",
                    "name": "",
                    "searchable": true,
                    "orderable": true,
                    "search": {
                        "value": "",
                        "regex": false
                    }
                    },
                    {
                    "data": "data5",
                    "name": "",
                    "searchable": true,
                    "orderable": true,
                    "search": {
                        "value": "",
                        "regex": false
                    }
                    },
                    {
                    "data": "data6",
                    "name": "",
                    "searchable": true,
                    "orderable": true,
                    "search": {
                        "value": "",
                        "regex": false
                    }
                    },
                    {
                    "data": "data7",
                    "name": "",
                    "searchable": true,
                    "orderable": true,
                    "search": {
                        "value": "",
                        "regex": false
                    }
                    },
                    {
                    "data": "data8",
                    "name": "",
                    "searchable": true,
                    "orderable": true,
                    "search": {
                        "value": "",
                        "regex": false
                    }
                    },
                    {
                    "data": "data9",
                    "name": "",
                    "searchable": true,
                    "orderable": true,
                    "search": {
                        "value": "",
                        "regex": false
                    }
                    }
                ],
                "order": [
                    {
                    "column": 0,
                    "dir": "asc"
                    }
                ],
                "start": 0,
                "length": 0,
                "search": {
                    "value": "",
                    "regex": false
                },
                "assignmentExtraParam": {
                    "region1Id": param.region1Id??null,
                    "region2Id": param.region2Id??null,
                    "region3Id": param.region3Id??null,
                    "region4Id": param.region4Id??null,
                    "region5Id": param.region5Id??null,
                    "region6Id": param.region6Id??null,
                    "region7Id": null,
                    "region8Id": null,
                    "region9Id": null,
                    "region10Id": null,
                    "surveyPeriodId": "fd68e454-ba45-4b85-8205-f3bf777ded24",
                    "assignmentErrorStatusType": -1,
                    "assignmentStatusAlias": null,
                    "data1": null,
                    "data2": null,
                    "data3": null,
                    "data4": null,
                    "data5": null,
                    "data6": null,
                    "data7": null,
                    "data8": null,
                    "data9": null,
                    "data10": null,
                    "userIdResponsibility": null,
                    "currentUserId": null,
                    "regionId": null,
                    "filterTargetType": "TARGET_ONLY"
                }
                };
                let result = await globalAxios!.post<DataModel, AxiosResponse<DataModel>>("https://fasih-sm.bps.go.id/analytic/api/v2/assignment/datatable-all-user-survey-periode", postData);
                let stringResp: string = await JSON.stringify(result.data);
                if(stringResp.includes("Kami mendeteksi perilaku") || stringResp.includes("kc-form-login")){
                    console.info(`Detected as Bot or Auto Logout Occurred`);
                    console.info(`Try To Login Again`);
                    changeGlobalAxios(await LoginService.loginSelenium({
                        username: process.env.USERNAME??"",
                        password: process.env.PASSWORD??""
                    }));
                    continue;
                }
                console.info(`✅️ Success Get Data Values`);
                return result.data;
            } catch(err) {
                if(counter < 10){
                    console.info(`Try Again ${counter + 1}`);
                    continue;
                }
                if(counter < 500){
                    console.info(`⌛ Wait 3 Seconds, Try Again ${counter + 1}`);
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    continue;
                }
                console.info(`Error Occurred ${err}`);
                if(err instanceof AxiosError){
                    console.info(`${err.message}`);
                    throw new Error(`Error Occurred ${err.message}`);
                }
                throw new Error(`Error Occurred ${err}`);
            } 
        }
        throw new Error(`Unexpected`);
    }

    static async getRawData(param: {
        assignmentId: string;
    }): Promise<RawDataModel>{
        let success: boolean = false;
        let counter: number = 0;
        while(success === false){
            try {
                counter++;
                let url: string = `https://fasih-sm.bps.go.id/assignment-general/api/assignment/get-by-id-with-data-for-scm?id=${param.assignmentId}`;
                let homePage = await globalAxios!.get(StaticHelper.baseUrl);
                let result = await globalAxios!.get<RawDataModel>(url);                
                //detect if blocked
                let homePageResp = JSON.stringify(homePage.data);
                let stringResp = JSON.stringify(result.data);
                if((stringResp.includes("Kami mendeteksi perilaku") || stringResp.includes("kc-form-login")) || (homePageResp.includes("Kami mendeteksi perilaku") || homePageResp.includes("kc-form-login"))){
                    console.info(`Detected as Bot or Auto Logout Occurred`);
                    console.info(`Try To Login Again`);
                    changeGlobalAxios(await LoginService.loginSelenium(AccountService.listAccount.at(0)!));
                    continue;
                }
                success = true;
                return result.data;
            } catch(err){
                console.info(`Error ${err}`);
                if(isAxiosError(err)){
                    console.error("Status Code:", err.response?.status);
                    console.error("Server Message:", err.response?.data);
                    if(err.response?.status === 429){
                        console.info(`Try To Login Again`);
                        changeGlobalAxios(await LoginService.loginSelenium(AccountService.listAccount.at(0)!));
                        continue;
                    }
                }
                if(counter < 10){
                    console.info(`Try Again Get Raw Data At ${counter} Try`);
                    continue;
                }
                if(counter < 100){
                    console.info(`Try Again Get Raw Data At ${counter} Try. Wait For 4 Seconds`);
                    await new Promise(resolve => setTimeout(resolve, 4000));
                    continue;
                }
                console.info(`Error Report Wilayah ${err}`);
                throw new Error(`${err}`);
            }
        }
        throw new Error(`Unexpected`);
    }

    static async downloadRawData(sourceWilayah: string = './result/wilayah_subsls.xlsx', outputLoc: string = `./result/${moment().format('YYYYMMDD_HHmmss')}_raw_data.xlsx`): Promise<void> {
        try {
            let foldername: string = `${moment().format("YYYYMMDD_HHmmss")}`;
            console.info(`⌛ Trying Download Raw Data From Wilayah ${sourceWilayah} to ${outputLoc}`);
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
            let wilayahExcel = xlsx.readFile(sourceWilayah);
            let firstSheet = wilayahExcel.Sheets[wilayahExcel.SheetNames.at(0)!]!;
            let wilayahData: WilayahData[] = xlsx.utils.sheet_to_json<WilayahData>(firstSheet);
            if(wilayahData.length === 0){
                console.info(`There is no Wilayah Sub SLS Data in ${sourceWilayah}`);
                throw new Error(`There is no Wilayah Sub SLS Data in ${sourceWilayah}`);
            }
            let counter: number = 0;

            //for start from what row?
            let start: boolean = false;
            for(let wilayahItem of wilayahData){
                if(wilayahItem.region6Code === "7317070008001000"){
                    start = true;
                }
                if(!start){
                    console.info(`Skip ${wilayahItem.region6Name}, Already Exists`);
                    continue;
                }
                let resultRawData: {assignmentId: string; name: string; jenis: string; predefined_data: string | null; data: string | null; jumlah_usaha: string | null;}[] = [];
                counter++;
                let success: boolean = false;
                let countTry: number = 0;
                while((success === false)){
                    countTry++;
                    console.info(`Get Data Table ${counter} - On ${countTry} Try: ${wilayahItem.region6Id}`);
                    try {
                        let resultTable = await FasihSMService.getDataValues({
                            region1Id: wilayahItem.region1Id,
                            region2Id: wilayahItem.region2Id,
                            region3Id: wilayahItem.region3Id,
                            region4Id: wilayahItem.region4Id,
                            region5Id: wilayahItem.region5Id,
                            region6Id: wilayahItem.region6Id
                        });
                        //detect if blocked
                        let stringResp = JSON.stringify(resultTable);
                        if(stringResp.includes("Kami mendeteksi perilaku") || stringResp.includes("kc-form-login")){
                            console.info(`Detected as Bot or Auto Logout Occurred`);
                            console.info(`Try To Login Again`);
                            changeGlobalAxios(await LoginService.loginSelenium(AccountService.listAccount.at(0)!));
                            continue;
                        }
                        let submit_approve_reject: number = 0;
                        let success_get: number = 0;
                        for(let itemResult of resultTable.searchData){
                            try {
                                if((itemResult.assignmentStatusAlias === "APPROVED BY Pengawas") || itemResult.assignmentStatusAlias === "REJECTED BY Pengawas" || itemResult.assignmentStatusAlias === "SUBMITTED BY Pencacah"){
                                    submit_approve_reject++;
                                    //wait for 5 seconds
                                    console.info(`Wait 5 Seconds`);
                                    await new Promise(resolve => setTimeout(resolve, 5000));
                                    let resultRawItem = await FasihSMService.getRawData({assignmentId: itemResult.id});
                                    console.info(`✅️ Success Download Raw Data ${itemResult.data1} - ${itemResult.data7}`);
                                    success_get++;
                                    resultRawData.push({
                                        assignmentId: itemResult.id??"",
                                        name: itemResult.data1??"",
                                        jenis: itemResult.data6??"",
                                        jumlah_usaha: itemResult.data7??"",
                                        predefined_data: resultRawItem.data.pre_defined_data??"{}",
                                        data: resultRawItem.data.data??"{}"
                                    });
                                } else {
                                    continue;
                                }
                            } catch(err2){
                            }
                        }
                        console.info(`✅️ Success ${success_get}/${submit_approve_reject} Download \n${wilayahItem.region6Id} : ${wilayahItem.region6Name} `);
                        success = true;
                    } catch(err5){
                        if(countTry < 10){
                            continue;
                        }
                        if(countTry < 100){
                            await new Promise(resolve => setTimeout(resolve, 4000));
                        }
                        success = true;
                        console.info(`Error Get Progress Of ${wilayahItem.region5Id}, Try Again ${countTry}`);
                    }
                }
                // let workBookSubSLS = xlsx.utils.book_new();
                // let newSheetSubSls = xlsx.utils.json_to_sheet(resultRawData);
                // xlsx.utils.book_append_sheet(workBookSubSLS, newSheetSubSls);
                //create dir first if not exists
                let resultDir = await fs.mkdir(`./result/rawdata/${foldername}`, {recursive: true});
                //write to file
                await fs.writeFile(`./result/rawdata/${foldername}/${wilayahItem.region6Code}.json`, JSON.stringify(resultRawData, undefined, 4), "utf-8");
                // xlsx.writeFile(workBookSubSLS, `./result/rawdata/${wilayahItem.region6Code}.xlsx`);
                console.info(`✅️ Success Download Raw Data ${wilayahItem.region6Code}:${wilayahItem.region6Name}`);
            }
            console.info(`✅️ Success Download All Raw Data to ./result/rawdata`);
        } catch(err){

        } finally {

        }
    }

    static async getReportWilayah(client: AxiosInstance, param: {
        region1Id?: string; //prov
        region2Id?: string; //kab
        region3Id?: string; //kec
        region4Id?: string; //desa
        region5Id?: string; //sls
    }): Promise<RecapSlsModel[]>  {
        let success: boolean = false;
        try {
            let url: string = "https://fasih-sm.bps.go.id/app/api/analytic/api/v2/assignment/report-progress-assignment";
            let postJson = {
                "surveyPeriodId": "fd68e454-ba45-4b85-8205-f3bf777ded24",
                "assignmentStatusAlias": null,
                "assignmentErrorStatusType": -1,
                "data1": null,
                "data2": null,
                "data3": null,
                "data4": null,
                "data5": null,
                "data6": null,
                "data7": null,
                "data8": null,
                "data9": null,
                "data10": null,
                "regionId": null,
                "region1Id": param.region1Id??null,
                "region2Id":  param.region2Id??null,
                "region3Id":  param.region3Id??null,
                "region4Id":  param.region4Id??null,
                "region5Id":  param.region5Id??null,

                "currentUserId": null,
                "userIdResponsibility": null
                }; 
            let result = await globalAxios!.post<RecapSlsModel[]>(url, postJson);
            return result.data;
        } catch(err){
            console.info(`Error Report Wilayah ${err}`);
            throw new Error(`${err}`);
        }
    }

    static async downloadProgressWilayah(sourceWilayah: string = './result/wilayah.xlsx', outputLoc: string = `./result/${moment().format('YYYYMMDD_HHmmss')}_progress_wilayah.xlsx`): Promise<void> {
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
                            changeGlobalAxios(await LoginService.loginSelenium(AccountService.listAccount.at(0)!));
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
                        if(countTry < 10){
                            continue;
                        }
                        if(countTry < 100){
                            await new Promise(resolve => setTimeout(resolve, 4000));
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


    static async downloadProgressWilayahAlternatif(sourceWilayah: string = './result/wilayah_subsls.xlsx', outputLoc: string = `./result/${moment().format('YYYYMMDD_HHmmss')}_progress_wilayah.xlsx`): Promise<void> {
        try {
            console.info(`⌛ Trying Download Progress Wilayah of From File ${sourceWilayah} to ${outputLoc}`);
            let workBook: WorkBook = xlsx.utils.book_new();
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

                        let resultRecap = await FasihSMService.getDataValues({
                            region1Id: wilayahItem.region1Id,
                            region2Id: wilayahItem.region3Id,
                            region3Id: wilayahItem.region3Id,
                            region4Id: wilayahItem.region4Id,
                            region5Id: wilayahItem.region5Id,
                            region6Id: wilayahItem.region6Id,
                        });
                        //detect if blocked
                        let stringResp = JSON.stringify(resultRecap);
                        if(stringResp.includes("Kami mendeteksi perilaku") || stringResp.includes("kc-form-login")){
                            console.info(`Detected as Bot or Auto Logout Occurred`);
                            // console.info(`Try To Login Again`);
                            // changeGlobalAxios(await LoginService.loginSelenium(AccountService.listAccount.at(0)!));
                            throw new Error(`Error Bot Detected`);
                            continue;
                        }
                        let {searchAggregation, ...restData} = resultRecap;
                        let dataRow: {
                            label: string;
                            [key: string]: string | number;
                        } = {
                            label: wilayahItem.region6Code
                        };
                        for(let itemResult of searchAggregation){
                            dataRow[itemResult.keyAggregation] = itemResult.docCount;
                            resultRow.push(dataRow);
                        }
                        console.info(`✅️ Success Get Progress\n${wilayahItem.region5Id}`);
                        success = true;
                    } catch(err5){
                        console.info(`Error ${err5}`);
                        countTry++;
                        if(countTry < 10){
                            continue;
                        }
                        if(countTry < 100){
                            await new Promise(resolve => setTimeout(resolve, 4000));
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


    static async downloadSubSlsData(param: {
        groupCode: string;
        region1Id: string; //prov
        region2Id: string; //kab
    }): Promise<void>{
        try {
            console.info(`⌛ Trying Download SUBSLS Data of ${param.region2Id}`);
            let result = await FasihSMService.getChildWilayah(globalAxios!, "region3",{
                region2Id: param.region2Id
            }, param.groupCode);
            let workBook: WorkBook = xlsx.utils.book_new();
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
            let wilayahData: WilayahData[] = [];
            for(let region3 of result.data){
                try {
                    let result4 = await FasihSMService.getChildWilayah(globalAxios!, "region4",{
                        region3Id: region3.id
                    }, param.groupCode);
                    for(let region4 of result4.data){
                        try {
                            let result5 = await FasihSMService.getChildWilayah(globalAxios!, "region5", {
                                region4Id: region4.id
                            }, param.groupCode);
                            for(let region5 of result5.data){
                                try {
                                    let result6 = await FasihSMService.getChildWilayah(globalAxios!, "region6", {
                                        region5Id: region5.id
                                    }, param.groupCode);
                                    for(let region6 of result6.data){
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
                                            region6Id: region6.id,
                                            region3Code: region3.fullCode,
                                            region4Code: region4.fullCode,
                                            region5Code: region5.fullCode,
                                            region6Code: region6.fullCode,
                                            region3Name: region3.name,
                                            region4Name: region4.name,
                                            region5Name: region5.name,
                                            region6Name: region6.name,
                                        };
                                        wilayahData.push(wilayahDataRow);
                                    }
                                } catch(err4){
                                    console.info(`Error Get Data Of ${region5.fullCode}: ${region5.name}`);
                                }
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
            xlsx.writeFile(workBook,`./result/wilayah_subsls.xlsx`);
            console.info(`Success Download Wilayah SubSLS Data`);
        } catch(err){
            throw new Error(`${err}`);
        } finally {
            console.info(`Done Download Wilayah Data`);
        }
    }
    static async downloadSlsData(client: AxiosInstance, param: {
        groupCode: string;
        region1Id: string; //prov
        region2Id: string; //kab
    }): Promise<void>{
        try {
            console.info(`⌛ Trying Download SLS Data of ${param.region2Id}`);
            let result = await FasihSMService.getChildWilayah(globalAxios!, "region3",{
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
                    let result4 = await FasihSMService.getChildWilayah(globalAxios!, "region4",{
                        region3Id: region3.id
                    }, param.groupCode);
                    for(let region4 of result4.data){
                        try {
                            let result5 = await FasihSMService.getChildWilayah(globalAxios!, "region5", {
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
}
