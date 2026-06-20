export type DataModel = {
    "id": string;
    "surveyPeriodId": string;
    "mode": string[],
    "assignmentErrorStatusType": number;
    "userIdResponsibility": string;
    "approvedByCreator": boolean;
    "codeIdentity": string;
    "assignmentStatusId": number;
    "assignmentStatusAlias": string;
    "data1"?: string; //"ABD.HAMID IRONE / INDAR",
    "data2"?: string; //"DESA TOMBANG",
    "data3"?: string; //"4 / "
    "data4"?: string; //""
    "data5"?: string; //""
    "data6"?: string; //"- / KELUARGA"
    "data7"?: string; //"0"
    "data8"?: string; //"91951"
    "data9"?: string; //"2. Tidak"
    "data10"?: string; // ""
    "dateCreated": string;
    "isActive": boolean;
    "done": boolean;
    "secondary": boolean;
    "longitude": number | null;
    "latitude": number | null;
    "copyFromId": string;
    "externalDone": boolean;
    "currentUserId": string;
    "currentUserUsername": string;
    "currentUserFullname": string;
    "currentUserSurveyRoleId": string;
    "currentUserSurveyRoleName": string;
    "currentUserSurveyRoleIsPencacah": boolean;
    "currentUserSurveyRoleCanPullSample": boolean;
    "sourceFrom": string;
    "listing": boolean;
    "dateModified": string | null;
    "sampleType": number;
    "isTarget": boolean;
    "region": {
        "id": string;
        "groupId": string;
        "versionCode": number;
        "dateCreated": string;
        "isActive": boolean;
        "level1": {
            "id": string;
            "fullCode": string;
            "code": string;
            "name": string;
            "level2": {
                "id": string;
                "fullCode": string; //"7317",
                "code": string; //"17",
                "name": string; //"LUWU",
                "level3": {
                    "id": string;
                    "fullCode": string; 
                    "code": string; // "080",
                    "name": string; // "WALENRANG",
                    "level4": {
                        "id": string;
                        "fullCode": string; // "7317080002",
                        "code": string; // "002",
                        "name": string; // "TOMBANG",
                        "level5": {
                            "id": string; 
                            "fullCode": string; // "73170800020001",
                            "code": string; // "0001",
                            "name": string; // "RT 001 DUSUN TOMBANG",
                            "level6": {
                                "id": string;
                                "fullCode": string; // "7317080002000101",
                                "code": string; // "01",
                                "name": string; // "RT 001 DUSUN TOMBANG"
                            }
                        }
                    }
                }
            }
        }
    },
    "searchAggregation": [
        {
            "keyAggregation": string,
            "docCount": number
        }
    ]
};

export type PostDataModel = {
    
};

