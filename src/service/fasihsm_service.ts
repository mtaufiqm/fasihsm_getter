import { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { DataModel } from "../model/data_model";
import { ChildWilayahModel } from "../model/wilayah_model";
import { RecapSlsModel } from "../model/recap_model";
import { WorkBook } from "xlsx";
import xlsx from "xlsx";
import moment from "moment";
import fs from "fs/promises";

export class FasihSMService {

    static async getChildWilayah(client: AxiosInstance, get: "region3" | "region4" | "region5" | "region6", param: {
        region1Id?: string; //prov
        region2Id?: string; //kab
        region3Id?: string; //kec
        region4Id?: string; //desa
        region5Id?: string; //sls
        region6Id?: string; //subsls
    }, groupId: string): Promise<ChildWilayahModel> {
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
            let result = await client.get<ChildWilayahModel>(strlUrl);
            console.info(`Status ${result.status}}`);
            console.info(`✅️ Success Get Child Wilayah Model`);
            return result.data;
        } catch(err){
            console.info(`Error Occurred ${err}`);
            throw new Error(`${err}`);
        } finally {
            console.info("Done.");
        }
    }

    static async getDataValues(client: AxiosInstance, param: {
        region1Id?: string; //prov
        region2Id?: string; //kab
        region3Id?: string; //kec
        region4Id?: string; //desa
        region5Id?: string; //sls
        region6Id?: string; //subsls
    }): Promise<DataModel> {
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
            let result = await client.post<DataModel, AxiosResponse<DataModel>>("https://fasih-sm.bps.go.id/analytic/api/v2/assignment/datatable-all-user-survey-periode", postData);
            console.info(`✅️ Success Get Data Values`);
            return result.data;
        } catch(err) {
            console.info(`Error Occurred ${err}`);
            if(err instanceof AxiosError){
                console.info(`${err.message}`);
                throw new Error(`Error Occurred ${err.message}`);
            }
            throw new Error(`Error Occurred ${err}`);
        } finally {
            console.info(`Done Get Data Values.`);
        }
    }

    static async getReportWilayah(client: AxiosInstance, param: {
        region1Id?: string; //prov
        region2Id?: string; //kab
        region3Id?: string; //kec
        region4Id?: string; //desa
        region5Id?: string; //sls
    }): Promise<RecapSlsModel[]>  {
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
            let result = await client.post<RecapSlsModel[]>(url, postJson);
            return result.data;
        } catch(err){
            console.info(`Error ${err}`);
            throw new Error(`${err}`);
        }
    }

    static async downloadProgressWilayah(client: AxiosInstance ,sourceWilayah: string = './result/wilayah.xlsx', outputLoc: string = `./result/${moment().format('YYYYMMDD_HHmmss')}_progress_wilayah.xlsx`): Promise<void> {
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
            for(let wilayahItem of wilayahData){
            //Get Recap Data For Certain SubSLS
                counter++;
                console.info(`Progress ${counter} : ${wilayahItem.region5Id}`);
                try {
                    let resultRecap = await FasihSMService.getReportWilayah(client, {
                        region1Id: wilayahItem.region1Id,
                        region2Id: wilayahItem.region2Id,
                        region3Id: wilayahItem.region3Id,
                        region4Id: wilayahItem.region4Id,
                        region5Id: wilayahItem.region5Id
                    });
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
                } catch(err5){
                    console.info(`Error Get Progress Of ${wilayahItem.region5Id}`);
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
            throw new Error();
        }
    }

    static async downloadSubSlsData(client: AxiosInstance, param: {
        groupCode: string;
        region1Id: string; //prov
        region2Id: string; //kab
    }): Promise<void>{
        try {
            console.info(`⌛ Trying Download SUBSLS Data of ${param.region2Id}`);
            let result = await FasihSMService.getChildWilayah(client, "region3",{
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
                    let result4 = await FasihSMService.getChildWilayah(client, "region4",{
                        region3Id: region3.id
                    }, param.groupCode);
                    for(let region4 of result4.data){
                        try {
                            let result5 = await FasihSMService.getChildWilayah(client, "region5", {
                                region4Id: region4.id
                            }, param.groupCode);
                            for(let region5 of result5.data){
                                try {
                                    let result6 = await FasihSMService.getChildWilayah(client, "region6", {
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
            xlsx.writeFile(workBook,`./result/wilayah.xlsx`);
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
            let result = await FasihSMService.getChildWilayah(client, "region3",{
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
                    let result4 = await FasihSMService.getChildWilayah(client, "region4",{
                        region3Id: region3.id
                    }, param.groupCode);
                    for(let region4 of result4.data){
                        try {
                            let result5 = await FasihSMService.getChildWilayah(client, "region5", {
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
