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

fetch("https://fasih-sm.bps.go.id/survey/api/v1/surveys/datatable?surveyType=Pencacahan", {
  "headers": {
    "accept": "application/json",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
    "sec-ch-ua": "\"Microsoft Edge\";v=\"149\", \"Chromium\";v=\"149\", \"Not)A;Brand\";v=\"24\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-xsrf-token": "12a39bf6-3442-4a0c-8abd-faa4dedfaf41",
    "cookie": "f5avraaaaaaaaaaaaaaaa_session_=PANMKFMKNADEPHCJHPKBKJMCFDMHPAIAPPMCIGCCOMIKBEPKKFHOBIGKKGKPADEIIMGDJJCHHPDFOJEBCLOAACINHOPIAOOLBEFOGELGGBILOGMNIAKEBNHGLPFDOPCB; _ga_WQKDWE3S3T=GS2.1.s1773386550$o2$g0$t1773386550$j60$l0$h0; _ga_FMZTHHQN2K=GS2.1.s1777441013$o1$g1$t1777442075$j60$l0$h0; _ga_G604FXJW6E=GS2.1.s1780472640$o1$g0$t1780472654$j46$l0$h0; cf_clearance=fVOUcEYe6wK1n2zZIp.BSgdSKBzYQtWDR8wGRzcjMr8-1780965733-1.2.1.1-zL.Cbz0Uoxzu.05cgS0n4LZBpIyXKFWh3y0AUK8nuFb.4x0bverO88wGQkf9ukJlCyzEGPh.op.zgBzwyQfdN1EZbeG69q_MgGCTquJ60NjFfvsAoJC7BemL1bHVlRF_NLKRXcfEKj2h0BN7zD9e.fQkMP1fa5MS7_cuQ4pyz7owsAr7udghdH.CY_C17SXMTKCbw9umCkqa.y6rtoSpiKZ_J50OaPtVTUp4mgHNorf_VjzSrSp4QIdM6Z4QUzKGjAJ1kacmRHFCnxiM68qg20yWAN3BPXcshEmyNg3nLqslQamletXLIQT6ejiwmd4PLden4ESl_LkGBlYdcV8eig; _ga_QPPE1C18C5=GS2.1.s1781003598$o2$g0$t1781003605$j53$l0$h0; _ga_K98R6MSKRH=GS2.1.s1781056212$o11$g1$t1781056302$j60$l0$h0; _ga=GA1.3.367090062.1773156020; _ga_XXTTVXWHDB=GS2.3.s1781340185$o32$g1$t1781340221$j24$l0$h0; db8ca2b43ed851cc93e71fd5fd72bff7=9659465e252a0faffcb932a11d8b78ba; TS01bafd94=01266d26d0bb63891e075a482a4a5be06f075ef0ca95f2d5a4e7c6bcc812436d3fbdd0e96fa189cd37ce10ba2642ddb6fa3d6d3831; XSRF-TOKEN=12a39bf6-3442-4a0c-8abd-faa4dedfaf41; SESSION=4fa2eacf-239c-41ec-ba73-948c908a9a04; f5avraaaaaaaaaaaaaaaa_session_=PFGELABEDHEHIEFMAGANEJPJLOAOBJIMMNJMJGAFPIFGBKKBADJGLAJJLJAJEEFGCACDABNDDBMLIOBPKPLAHPIHLPEJHOOGOMNFOMDCDCGKOFKECCOCNGNIAAOFLEDE; TS5d9b593f027=0868f8be6fab20000b6caa8a0016db7e2a4931051a579b243db81f66f6dfad86f8b9dced0e4ca78308b3491b9a11300098e33826241b83f232633e0225e628582a5b82d7039950f9aca45f5fa7404d61e261df8e1c48d6fc0b75bea22e0f84df"
  },
  "body": "{\"pageNumber\":0,\"pageSize\":10,\"sortBy\":\"CREATED_AT\",\"sortDirection\":\"DESC\",\"keywordSearch\":\"\"}",
  "method": "POST"
});