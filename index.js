var puppeteer = require('puppeteer');
var reader = require('readline-sync');
var log = require('./system/log');
var utils = require('./system/utils');
var { readdirSync } = require('fs');

var Cli = {
    log,
    utils
}

var options = {
    markAsRead: false,
    debugMode: false
}

async function startBrowser() {
    if (!Cli.browser && !Cli.page) {
        const browser = await puppeteer.launch({
            headless: false,
            args: ["--no-sandbox", "--disabled-setupid-sandbox"]
        });

        const page = await browser.newPage();
        
        page.setDefaultTimeout(0);
    
        Cli.browser = browser;
        Cli.page = page;
    }
    
    return Cli.page;
}

async function loginWithCookies(cookies, callback) {
    var page = await startBrowser();

    await page.setCookies(...cookies);

    loginHelper(page, callback);
}

async function loginWithEmailAndPassword(email, password, callback) {
    var page = await startBrowser();

    if (!email || !password) {
        email = email || emailHandle();
        password = password || passwordHandle();
    }
    await page.goto('https://www.facebook.com/');

    var emailSelector = await page.$('#email');

    if (emailSelector) await page.type("#email", email);

    await page.type("#pass", password);
    
    await page.keyboard.press("Enter");

    await page.waitForNavigation({ waitUntil: "domcontentloaded" });

    loginHelper(page, callback);
}

async function loginHelper(page, callback) {
    switch (page.url()) {
        case /checkpoint/g: {
            //Checkpoint Handle
            break;
        }
        case /privacy_mutation_token/g: {
            loginWithEmailAndPassword({ callback: callback });
        }
        default: {
            let cookies = await page.cookies();
            let userID = cookies.find(item => item.name == 'c_user').value
            log(`Your userID: ${userID}`);

            let apiName = readdirSync('./api/'), api = {};
            for (let name of apiName) api[name.replace(/.js/g, '')] = require('./api/' + name) ({ page, Cli, options });

            callback(null, api);
        }
    }
}

function emailHandle() {
    let email = reader.question("Please enter your email or Facebook ID: ");
    if (email.length > 0) return email;
    else return emailHandle();
}

function passwordHandle() {
    let password = reader.question('Please enter your password: ');
    if (password.length > 0) return password;
    else return passwordHandle();
}

function setOptions(_options) {
    if (typeof _option == 'object' && Object.keys(_option).length > 0) for (let i of Object.keys(_options)) options[i] = _options[i];
}

module.exports = {
    setOptions,
    loginWithCookies,
    loginWithEmailAndPassword
}