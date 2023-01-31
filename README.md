<h1 align="center">Meta API</h1>
<p align="center">
    <a href="https://github.com/hoahenry/meta-api/issues">I'm have a Bug</a>
    </p>
</p>
<details open="open">
    <summary>Menu</summary>
    <ol>
        <li><a href="#Install">Install And Use</a></li>
        <li><a href="#Contact">Contact</a></li>
        <li><a href="#Donate">Donate</a></li>
    </ol>
</details>

<!-- Install -->
## Install
### Install
- Unknow
### Use
- Login With Email And Password: `loginWithEmailAndPassword`
```sh
var { loginWithEmailAndPassword } = require('./index');
var { readFileSync } = require('fs');
var configs = JSON.parse(readFileSync('./configs.json')); //You can save email and password and used like this
var { email, password } = configs

loginWithEmailAndPassword(email, password, async function (error, api) {
    //You can use api here
    api.listen(async function(error, event) {
        console.log(event)
    })
});
```
- Login With Cookies: `loginWithCookies`
```sh
var { loginWithCookies } = require('./index');
var { readFileSync } = require('fs');
var cookies = JSON.parse(readFileSync('./cookies.json')); //You can get cookies everywhere and use it

loginWithCookies(cookies, async function(error, api) {
    //You can use api here
    api.listen(async function(error, event) {
        console.log(event)
    })
});
```
- Set Option: `setOptions()`
```sh
var { setOptions, loginWithCookies, loginWithEmailAndPassword } = require('./index');
var newOptions = {
    markAsRead: false, //Default
    debugMode: false, //Default
    headless: true //Default
}
setOptions(newOptions);
//You can login with option above
//You need to use setOptions() before logging in for this to take effect
```

<!-- Contact -->
## Contact
- <a href=https://m.me/j/AbbhSpScpDvsVAgT/>Group Meta API Developers</a>
<!-- Donate -->
## Donate

<li>Momo: 0364694797</li>
<li>Total Income: 0</li>
<li>Thank: ...</li>
