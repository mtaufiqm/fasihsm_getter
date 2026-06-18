"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const static_helper_1 = require("./helper/static_helper");
const cheerio_1 = __importDefault(require("cheerio"));
const tough_cookie_1 = require("tough-cookie");
const axios_cookiejar_support_1 = require("axios-cookiejar-support");
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)({
    override: true
});
async function login(userInfo) {
    let cookieJar = new tough_cookie_1.CookieJar();
    let client = (0, axios_cookiejar_support_1.wrapper)(axios_1.default.create({
        jar: cookieJar
    }));
    console.info(`⌛ Go to SSO Page`);
    let result = await client.get(static_helper_1.StaticHelper.fasihLoginUrl, {
        headers: {
            "Host": "fasih-sm.bps.go.id",
            "Origin": "https://fasih-sm.bps.go.id",
            "User-Agent": static_helper_1.StaticHelper.userAgent,
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });
    let htmlObj = cheerio_1.default.load(result.data);
    let action = htmlObj("#kc-form-login").attr("action");
    if (!action) {
        throw new Error("Invalid HTML! There is no Form Login Found");
    }
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
                "User-Agent": static_helper_1.StaticHelper.userAgent,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        if (postLogin.data.includes("Invalid username or password.")) {
            console.info(`Failed Login, Invalid Username/Password`);
            throw new Error(`Failed Login, Invalid Username/Password`);
        }
    }
    catch (errLogin) {
        console.info(`Failed Login, ${errLogin}`);
        throw new Error(`Failed Login, ${errLogin}`);
    }
    console.info(`✅️ Success Login`);
    return client;
}
//# sourceMappingURL=main.js.map