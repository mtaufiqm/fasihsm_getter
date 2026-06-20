import { Builder, Browser, By, until } from "selenium-webdriver";

export async function loginSelenium(): Promise<string> {
    const driver = await new Builder()
        .forBrowser(Browser.CHROME)
        .build();

    try {
        await driver.get("https://fasih-sm.bps.go.id");
        console.log("Login Manual terlebih dahulu...");
        await driver.wait(async () => {
            const url = await driver.getCurrentUrl();
            return !url.includes("login");
        }, 300000);
        const cookies = await driver.manage().getCookies();
        console.log(cookies);
        const cookieObject: Record<string, string> = {};
        for (const cookie of cookies) {
            cookieObject[cookie.name] = cookie.value;
        }
        console.log(cookieObject);
        const cookieMap = new Map<string, string>();
        for (const cookie of cookies) {
            cookieMap.set(cookie.name, cookie.value);
        }
        console.log(cookieMap);
        const cookieHeader = cookies
            .map(cookie => `${cookie.name}=${cookie.value}`)
            .join("; ");
        console.log(cookieHeader);
        return cookieHeader;
    } finally {
        await driver.quit();
    }
}