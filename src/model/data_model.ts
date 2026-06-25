export type DataModel = {
    searchData: {
        "id": string;
        "surveyPeriodId": string;
        "mode": string[],
        "assignmentErrorStatusType": number;
        "userIdResponsibility": string;
        "approvedByCreator": boolean;
        "codeIdentity": string;
        "assignmentStatusId": number;
        "assignmentStatusAlias": string;    //"SUBMITTED BY Pencacah"
        "data1"?: string; //"APATUH / INDAR",
        "data2"?: string; //"DESA TOMBANG",
        "data3"?: string; //"4 / "
        "data4"?: string; //""
        "data5"?: string; //""
        "data6"?: string; //"- / KELUARGA"
        "data7"?: string; //"0" //jumlah usaha
        "data8"?: string; //"BOOM"
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
        }
    }[];
    "searchAggregation": [
        {
            "keyAggregation": string,
            "docCount": number
        }
    ]
};

/* EXAMPLE DATA

*/

export type RawDataModel = {
    "success": boolean;     // true,
    "message": string;      // "Berhasil",
    "data": {
        "_id": string;  //"XXXXX",
        "survey_period_id": string;     //"XXXXXX",
        "mode": string[]; //["CAPI", "CAWI", "PAPI"]
        "assignment_error_status_type": number;
        "pre_defined_data": string | null;
        "data": string | null;
        "user_id_responsibility": string;
        "approved_by_creator": boolean;
        "code_master": string | null;
        "code_identity": string;    //"XXXX / RENI SONGE - 67 /  - 0",
        "assignment_status_id": number;     // 3,
        "assignment_status_alias": string;  //   "REJECTED BY Pengawas",
        "survey_file_id": string | null;
        "is_tarik_sample": boolean;
        "data1": string; // "XXXX / RENI SONGE",
        "data2": string; // "",
        "data3": string; // "67 / ",
        "data4": string; // "",
        "data5": string; // "",
        "data6": string; // "",
        "data7": string; // "0",
        "data8": string; // "",
        "data9": string; // "",
        "data10": string; // "",
        "date_created": string; // "Jun 21, 2026, 8:32:34 AM",
        "is_active": boolean; // true,
        "username": string | null; // null,
        "sum_error": number; // 0,
        "sum_remark": number; // 0,
        "sum_clean": number; // 0,
        "comment": "{\"dataKey\":\"\",\"notes\":[]}",
        "done": false,
        "secondary": boolean | null;
        "replace_id": string | null;
        "longitude": number | null;
        "latitude": number | null;
        "copy_from_id": string;
        "strata": string | null;
        "external_done": boolean;
        "current_user_id": string;
        "current_user_username": string;
        "current_user_fullname": string;
        "current_user_survey_role_id": string;
        "current_user_survey_role_name": string;
        "current_user_survey_role_is_pencacah": boolean;
        "current_user_survey_role_can_pull_sample": boolean;
        "email": string | null;
        "land_line_number": string | null;
        "phone_number": string | null;
        "source_from": string;
        "remark":  string | null;
        "listing_data": string | null;
        "date_modified":  string | null; 
        "panel1_data":  string | null;
        "panel2_data":  string | null;
        "pending_upload_assignment_id": string | null;
        "pending_assignment_created_date": string | null;
        "region": {
            "_id": string;  //"520587db-a8e0-45c1-ae11-e39e228c39e9",
            "group_id": string; //"a45adac1-e711-4c15-b3f9-1f30fc151565",
            "version_code": number;     //  1.0,
            "date_created": string; //  "Apr 21, 2026, 12:44:06 PM",
            "is_active": boolean;   //  true,
            "level_1": {
                "_id": string;
                "full_code": string;    //  "73",
                "code": string;     //"73",
                "name": string;     // "SULAWESI SELATAN",
                "level_2": {
                    "_id": string;
                    "full_code": string;    //  "7317",
                    "code": string;     // "17",
                    "name": string;     // "LUWU"
                    "level_3": {
                        "_id": string;
                        "full_code": string;    //  "7317040",
                        "code": string;     // "17",
                        "name": string;     // "KAMANRE"
                        "level_4": {
                            "_id": string;
                            "full_code": string;    //  "7317050050",
                            "code": string;     // "17",
                            "name": string;     // "SALUPAREMANG"   //desa
                            "level_5": {
                                "_id": string;
                                "full_code": string;    //  "7317",
                                "code": string;     // "17",
                                "name": string;     // "KAMANRE"        //sls
                                "level_6": {
                                    "_id": string;
                                    "full_code": string;    //  "7317",
                                    "code": string;     // "17",
                                    "name": string;     // subsls
                                    "level_7": null
                                }
                            }
                        }
                    }
                }
            }
        },
        "listing": boolean;
        "submit_version_code": number;
        "region_metadata": {
            "_id": string;
            "level_count": number;
            "smallest_region_level": string;
            "group_name": string;
            "level": {id: number; name: string;}[];
        };
        "storage_type": string;
        "storage_key": string | null;
        "data_size": number;
    };
    "errorCode": string | number | null
};

export type RawDataJson = {
    assignmentId: string; 
    name: string; 
    jenis: string; 
    predefined_data: string | null; 
    data: string | null; 
    jumlah_usaha: string | null;
}[];

