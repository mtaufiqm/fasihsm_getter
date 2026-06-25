# Fasih-SM Getter Setup Guide

## CHANGE LOGS
1.0.3
- Due to enhanced bot protection (WAF) 💀, the login process has been migrated to Puppeteer to bypass detection mechanisms that check navigator.webdriver and other browser properties wkwk. This version uses puppeteer-extra-plugin-stealth. 

1.0.2
- Auto Login Based Credentials in .env, and Auto Re-login If Blocked

1.0.1
- Due to the SSO bot detector, the login process has been switched to Selenium. Data retrieval will continue to use direct API calls

## Installation

### 1. Clone or Get the Project

Download this project or pull it in your local:

```bash
git clone https://github.com/mtaufiqm/fasihsm_getter.git
```

or

```bash
git remote add origin https://github.com/mtaufiqm/fasihsm_getter.git
git pull origin master
```

or download ZIP

```text
https://github.com/mtaufiqm/fasihsm_getter/archive/refs/heads/master.zip
```

### 2. Install Dependencies

Navigate to the project directory and run:

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root with the following content:

```env
USERNAME="UserSSO"
PASSWORD="PasswordSSO"
REGION1_ID="Region1Id"
REGION2_ID="Region2Id"
GROUP_ID="GROUPID"
```

**Note:**

- `REGION1_ID` is Province ID get from Filter Wilayah FASIH-SM In Your Browser. It Only Needed First Time
- `REGION2_ID` is Kab/Kota ID get from Filter Wilayah FASIH-SM In Your Browser. It Only Needed First Time
- `GROUP_ID` is Group ID get from Filter Wilayah In Your Browser. It Only Needed First Time


### 4. Connect to VPN

Make sure the FortiClient VPN B*S is active and connected before running the application.

### 5. Configure App


If You Only Want Download Region Wilayah ID (ALL REGION1_ID, REGION2_ID, REGION3_ID, REGION4_ID, REGION5_ID), please Uncomment below code in ./src/main.ts:

Line 524-529 (./src/service/puppeteer_service.ts)
```code
        await PuppeteerService.downloadSlsData(userInfo!, {
            groupCode: groupId,
            region1Id: region1Id,
            region2Id: region2Id
        });
```

If You Only Want Download Progress Wilayah, please ensure uncomment below code in:
Line 532 (./src/service/puppeteer_service.ts)

```code
        await PuppeteerService.downloadProgress(userInfo!, browser, newPage);
```

### 6. Run the Application

Use following commands:

```bash
npm start
```

### 7. Monitor the Process

Wait for the process to complete. You can monitor the execution progress through the console logs.

### 8. Retrieve the Results

The generated output file will be saved in the following directory:


```text
./result/wilayah.xlsx (for Wilayah Data)
```

or

```text
./result/{DateTime}_progress_wilayah.xlsx (for Progress Data)
```



### 9. Done

Happy Coding, its so fun

---

# About This Project
- 99% Direct API Calls
- 1% Scraping (used only for SSO purposes)

## Important Notes
- The project will continue to work unless the underlying APIs are changed or updated.

---

## Author

**MTM**  
*Super Junior Developer 😂*