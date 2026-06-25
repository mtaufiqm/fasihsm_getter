import { Sheet, WorkBook } from "xlsx";
import xlsx from "xlsx";
import fs from "fs/promises";
import moment from "moment";
import { RawDataJson } from "../model/data_model";
export class AnomaliService {
    static async runAnomaliNIK(): Promise<void> {
        try {
            let resultAnomali: {
                assignmentId: string;
                kecCode: string;
                wilayahName: string;
                sampelName: string;
                jenisSampel: string;
                linkFasihSM: string;
                anomali: string;
            }[] = [];
            let dirToday = await fs.readdir(`./result/rawdata/${moment().format("YYYYMMDD")}`);
            for(let file of dirToday){
                try {
                    console.info(`Try ${file}`);
                    let fileObj = await fs.readFile(`./result/rawdata/${moment().format("YYYYMMDD")}/${file}`);
                    let fileObjStr = fileObj.toString();
                    let fileJson = JSON.parse(fileObjStr) as RawDataJson;
                    for(let itemJson of fileJson){
                        if(!itemJson.data || !itemJson.jenis.includes("UMKM / KELUARGA")){
                            continue;
                        }
                        let dataJson = JSON.parse(itemJson.data);
                        let predefinedJSON = JSON.parse(itemJson.predefined_data??"{}");
                        //
                        let answerPredefined: {dataKey: string; answer: string | number | object;}[] = predefinedJSON.predata as {dataKey: string; answer: object}[];
                        let answers: {dataKey: string; answer: string | number | object;}[] = dataJson.answers as {dataKey: string; answer: object}[];
                        for(let itemAnswer of answers){
                            if(itemAnswer.dataKey !== "nik"){
                                continue;
                            }
                            if((itemAnswer.answer) == "9999"){
                                console.info(`Anomali Found At ${itemJson.name} : ${itemJson.assignmentId}`);
                                let kecCodeAnomaliItem: string = "";
                                let wilayahNameAnomaliItem: string = "";
                                for(let itemPredefined of answerPredefined){
                                    if(itemPredefined.dataKey === "kec"){
                                        kecCodeAnomaliItem = itemPredefined.answer as string;
                                    }
                                    if(itemPredefined.dataKey === "nama_sls"){
                                        wilayahNameAnomaliItem = itemPredefined.answer as string;
                                    }
                                }
                                resultAnomali.push({
                                    assignmentId: itemJson.assignmentId,
                                    sampelName: itemJson.name,
                                    kecCode: kecCodeAnomaliItem,
                                    wilayahName: wilayahNameAnomaliItem,
                                    jenisSampel: itemJson.jenis,
                                    linkFasihSM: `https://fasih-sm.bps.go.id/survey-collection/assignment-detail/${itemJson.assignmentId}/a0429e96-51a5-477b-a415-485f9c153004`,
                                    anomali: "NIK 9999"
                                });
                            }
                        }
                    }
                } catch(err){
                    console.info(`Error ${err}`);
                }
            }
            let workBook: WorkBook = xlsx.utils.book_new();
            let sheet: Sheet = xlsx.utils.json_to_sheet(resultAnomali);
            //add sheet to workbook
            xlsx.utils.book_append_sheet(workBook, sheet, "Anomali NIK");
            xlsx.writeFile(workBook, `./result/${moment().format("YYYYMMDD_HHmmss")}_anomali.xlsx`);
            console.info(`✅️ Success Analyze Anomali`);
        } catch(err){
            console.info(`Error While Analyze Anomali`);
        } finally {
            console.info(`Done`);
        }
    }

    static async runAnomaliAc(): Promise<void> {
        try {
            let resultAnomali: {
                assignmentId: string;
                kecCode: string;
                wilayahName: string;
                sampelName: string;
                jenisSampel: string;
                linkFasihSM: string;
                anomali: string;
            }[] = [];
            let dirToday = await fs.readdir(`./result/rawdata/${moment().format("YYYYMMDD")}`);
            for(let file of dirToday){
                try {
                    console.info(`Try ${file}`);
                    let fileObj = await fs.readFile(`./result/rawdata/${moment().format("YYYYMMDD")}/${file}`);
                    let fileObjStr = fileObj.toString();
                    let fileJson = JSON.parse(fileObjStr) as RawDataJson;
                    for(let itemJson of fileJson){
                        if(!itemJson.data || !itemJson.jenis.includes("UMKM / KELUARGA")){
                            continue;
                        }
                        let dataJson = JSON.parse(itemJson.data);
                        let predefinedJSON = JSON.parse(itemJson.predefined_data??"{}");
                        //
                        let answerPredefined: {dataKey: string; answer: string | number | object;}[] = predefinedJSON.predata as {dataKey: string; answer: object}[];
                        let answers: {dataKey: string; answer: string | number | object;}[] = dataJson.answers as {dataKey: string; answer: object}[];
                        for(let itemAnswer of answers){
                            if(!((itemAnswer.dataKey.startsWith("jumlah_ac")) || (itemAnswer.dataKey.startsWith("jumlah_ac_new")))){
                                continue;
                            }
                            if((itemAnswer.answer as number) > 5){
                                console.info(`Anomali Found At ${itemJson.name} : ${itemJson.assignmentId}`);
                                let kecCodeAnomaliItem: string = "";
                                let wilayahNameAnomaliItem: string = "";
                                for(let itemPredefined of answerPredefined){
                                    if(itemPredefined.dataKey === "kec"){
                                        kecCodeAnomaliItem = itemPredefined.answer as string;
                                    }
                                    if(itemPredefined.dataKey === "nama_sls"){
                                        wilayahNameAnomaliItem = itemPredefined.answer as string;
                                    }
                                }
                                resultAnomali.push({
                                    assignmentId: itemJson.assignmentId,
                                    sampelName: itemJson.name,
                                    kecCode: kecCodeAnomaliItem,
                                    wilayahName: wilayahNameAnomaliItem,
                                    jenisSampel: itemJson.jenis,
                                    linkFasihSM: `https://fasih-sm.bps.go.id/survey-collection/assignment-detail/${itemJson.assignmentId}/a0429e96-51a5-477b-a415-485f9c153004`,
                                    anomali: "Ac > 5"
                                });
                            }
                        }
                    }
                } catch(err){
                    console.info(`Error ${err}`);
                }
            }
            let workBook: WorkBook = xlsx.utils.book_new();
            let sheet: Sheet = xlsx.utils.json_to_sheet(resultAnomali);
            //add sheet to workbook
            xlsx.utils.book_append_sheet(workBook, sheet, "Anomali");
            xlsx.writeFile(workBook, `./result/${moment().format("YYYYMMDD_HHmmss")}_anomali.xlsx`);
            console.info(`✅️ Success Analyze Anomali`);
        } catch(err){
            console.info(`Error While Analyze Anomali`);
        } finally {
            console.info(`Done`);
        }
    }

    static async runAnomaliLuasLantai(): Promise<void> {
        try {
            let resultAnomali: {
                assignmentId: string;
                kecCode: string;
                wilayahName: string;
                sampelName: string;
                jenisSampel: string;
                linkFasihSM: string;
                anomali: string;
            }[] = [];
            let dirToday = await fs.readdir(`./result/rawdata/${moment().format("YYYYMMDD")}`);
            for(let file of dirToday){
                try {
                    console.info(`Try ${file}`);
                    let fileObj = await fs.readFile(`./result/rawdata/${moment().format("YYYYMMDD")}/${file}`);
                    let fileObjStr = fileObj.toString();
                    let fileJson = JSON.parse(fileObjStr) as RawDataJson;
                    for(let itemJson of fileJson){
                        if(!itemJson.data || !itemJson.jenis.includes("UMKM / KELUARGA")){
                            continue;
                        }
                        let dataJson = JSON.parse(itemJson.data);
                        let predefinedJSON = JSON.parse(itemJson.predefined_data??"{}");
                        //
                        let answerPredefined: {dataKey: string; answer: string | number | object;}[] = predefinedJSON.predata as {dataKey: string; answer: object}[];
                        let answers: {dataKey: string; answer: string | number | object;}[] = dataJson.answers as {dataKey: string; answer: object}[];
                        for(let itemAnswer of answers){
                            if(!itemAnswer.dataKey.startsWith("luas_lantai")){
                                continue;
                            }
                            if((itemAnswer.answer as number) > 500){
                                console.info(`Anomali Found At ${itemJson.name} : ${itemJson.assignmentId}`);
                                let kecCodeAnomaliItem: string = "";
                                let wilayahNameAnomaliItem: string = "";
                                for(let itemPredefined of answerPredefined){
                                    if(itemPredefined.dataKey === "kec"){
                                        kecCodeAnomaliItem = itemPredefined.answer as string;
                                    }
                                    if(itemPredefined.dataKey === "nama_sls"){
                                        wilayahNameAnomaliItem = itemPredefined.answer as string;
                                    }
                                }
                                resultAnomali.push({
                                    assignmentId: itemJson.assignmentId,
                                    sampelName: itemJson.name,
                                    kecCode: kecCodeAnomaliItem,
                                    wilayahName: wilayahNameAnomaliItem,
                                    jenisSampel: itemJson.jenis,
                                    linkFasihSM: `https://fasih-sm.bps.go.id/survey-collection/assignment-detail/${itemJson.assignmentId}/a0429e96-51a5-477b-a415-485f9c153004`,
                                    anomali: "Luas Lantai > 500"
                                });
                            }
                        }
                    }
                } catch(err){
                    console.info(`Error ${err}`);
                }
            }
            let workBook: WorkBook = xlsx.utils.book_new();
            let sheet: Sheet = xlsx.utils.json_to_sheet(resultAnomali);
            //add sheet to workbook
            xlsx.utils.book_append_sheet(workBook, sheet, "Anomali Luas Lantai");
            xlsx.writeFile(workBook, `./result/${moment().format("YYYYMMDD_HHmmss")}_anomali.xlsx`);
            console.info(`✅️ Success Analyze Anomali`);
        } catch(err){
            console.info(`Error While Analyze Anomali`);
        } finally {
            console.info(`Done`);
        }
    }

    static async runAnomaliLantai(): Promise<void> {
        try {
            let resultAnomali: {
                assignmentId: string;
                kecCode: string;
                wilayahName: string;
                sampelName: string;
                jenisSampel: string;
                linkFasihSM: string;
                anomali: string;
            }[] = [];
            let dirToday = await fs.readdir(`./result/rawdata/${moment().format("YYYYMMDD")}`);
            for(let file of dirToday){
                try {
                    console.info(`Try ${file}`);
                    let fileObj = await fs.readFile(`./result/rawdata/${moment().format("YYYYMMDD")}/${file}`);
                    let fileObjStr = fileObj.toString();
                    let fileJson = JSON.parse(fileObjStr) as RawDataJson;
                    for(let itemJson of fileJson){
                        if(!itemJson.data || !itemJson.jenis.includes("UMKM / KELUARGA")){
                            continue;
                        }
                        let dataJson = JSON.parse(itemJson.data);
                        let predefinedJSON = JSON.parse(itemJson.predefined_data??"{}");
                        //
                        let answerPredefined: {dataKey: string; answer: string | number | object;}[] = predefinedJSON.predata as {dataKey: string; answer: object}[];
                        let answers: {dataKey: string; answer: string | number | object;}[] = dataJson.answers as {dataKey: string; answer: object}[];
                        for(let itemAnswer of answers){
                            if(itemAnswer.dataKey !== "luas_lantai"){
                                continue;
                            }
                            if((itemAnswer.answer as number) > 300){
                                console.info(`Anomali Found At ${itemJson.name} : ${itemJson.assignmentId}`);
                                let kecCodeAnomaliItem: string = "";
                                let wilayahNameAnomaliItem: string = "";
                                for(let itemPredefined of answerPredefined){
                                    if(itemPredefined.dataKey === "kec"){
                                        kecCodeAnomaliItem = itemPredefined.answer as string;
                                    }
                                    if(itemPredefined.dataKey === "nama_sls"){
                                        wilayahNameAnomaliItem = itemPredefined.answer as string;
                                    }
                                }
                                resultAnomali.push({
                                    assignmentId: itemJson.assignmentId,
                                    sampelName: itemJson.name,
                                    kecCode: kecCodeAnomaliItem,
                                    wilayahName: wilayahNameAnomaliItem,
                                    jenisSampel: itemJson.jenis,
                                    linkFasihSM: `https://fasih-sm.bps.go.id/survey-collection/assignment-detail/${itemJson.assignmentId}/a0429e96-51a5-477b-a415-485f9c153004`,
                                    anomali: "Luas Lantai > 300"
                                });
                            }
                        }
                    }
                } catch(err){
                    console.info(`Error ${err}`);
                }
            }
            let workBook: WorkBook = xlsx.utils.book_new();
            let sheet: Sheet = xlsx.utils.json_to_sheet(resultAnomali);
            //add sheet to workbook
            xlsx.utils.book_append_sheet(workBook, sheet, "Anomali");
            xlsx.writeFile(workBook, `./result/${moment().format("YYYYMMDD_HHmmss")}_anomali.xlsx`);
            console.info(`✅️ Success Analyze Anomali`);
        } catch(err){
            console.info(`Error While Analyze Anomali`);
        } finally {
            console.info(`Done`);
        }
    }

        static async runAnomaliTkDibayar(): Promise<void> {
        try {
            let resultAnomali: {
                assignmentId: string;
                kecCode: string;
                wilayahName: string;
                sampelName: string;
                jenisSampel: string;
                linkFasihSM: string;
                anomali: string;
            }[] = [];
            let dirToday = await fs.readdir(`./result/rawdata/${moment().format("YYYYMMDD")}`);
            for(let file of dirToday){
                try {
                    console.info(`Try ${file}`);
                    let fileObj = await fs.readFile(`./result/rawdata/${moment().format("YYYYMMDD")}/${file}`);
                    let fileObjStr = fileObj.toString();
                    let fileJson = JSON.parse(fileObjStr) as RawDataJson;
                    for(let itemJson of fileJson){
                        if(!itemJson.data || !itemJson.jenis.includes("UMKM / KELUARGA")){
                            continue;
                        }
                        let dataJson = JSON.parse(itemJson.data);
                        let predefinedJSON = JSON.parse(itemJson.predefined_data??"{}");
                        //
                        let answerPredefined: {dataKey: string; answer: string | number | object;}[] = predefinedJSON.predata as {dataKey: string; answer: object}[];
                        let answers: {dataKey: string; answer: string | number | object;}[] = dataJson.answers as {dataKey: string; answer: object}[];
                        for(let itemAnswer of answers){
                            if(!itemAnswer.dataKey.startsWith("tk_dibayar")){
                                continue;
                            }
                            if((itemAnswer.answer as number) > 50){
                                console.info(`Anomali Found At ${itemJson.name} : ${itemJson.assignmentId}`);
                                let kecCodeAnomaliItem: string = "";
                                let wilayahNameAnomaliItem: string = "";
                                for(let itemPredefined of answerPredefined){
                                    if(itemPredefined.dataKey === "kec"){
                                        kecCodeAnomaliItem = itemPredefined.answer as string;
                                    }
                                    if(itemPredefined.dataKey === "nama_sls"){
                                        wilayahNameAnomaliItem = itemPredefined.answer as string;
                                    }
                                }
                                resultAnomali.push({
                                    assignmentId: itemJson.assignmentId,
                                    sampelName: itemJson.name,
                                    kecCode: kecCodeAnomaliItem,
                                    wilayahName: wilayahNameAnomaliItem,
                                    jenisSampel: itemJson.jenis,
                                    linkFasihSM: `https://fasih-sm.bps.go.id/survey-collection/assignment-detail/${itemJson.assignmentId}/a0429e96-51a5-477b-a415-485f9c153004`,
                                    anomali: "TK Dibayar > 100"
                                });
                            }
                        }
                    }
                } catch(err){
                    console.info(`Error ${err}`);
                }
            }
            let workBook: WorkBook = xlsx.utils.book_new();
            let sheet: Sheet = xlsx.utils.json_to_sheet(resultAnomali);
            //add sheet to workbook
            xlsx.utils.book_append_sheet(workBook, sheet, "Anomali NIK");
            xlsx.writeFile(workBook, `./result/${moment().format("YYYYMMDD_HHmmss")}_anomali.xlsx`);
            console.info(`✅️ Success Analyze Anomali`);
        } catch(err){
            console.info(`Error While Analyze Anomali`);
        } finally {
            console.info(`Done`);
        }
    }
}