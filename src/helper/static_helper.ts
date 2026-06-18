export class StaticHelper {
    static baseUrl: string = "https://fasih-sm.bps.go.id";
    static fasihLoginUrl: string = "https://fasih-sm.bps.go.id/oauth2/authorization/ics";
    static userAgent: string = "Tabe Min";
    static fasihSmHeader: {[key: string]: string} = {
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
            "sec-fetch-site": "same-origin",
    };
}