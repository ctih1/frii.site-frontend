const domainInput = document.getElementById("domain-input");
const logoutButton = document.getElementById("logout");
const registerButton = document.getElementById("register");
const result = document.getElementById("result")
var server_domain = "https://server.frii.site";
var domain;
var isCompleteDomain;
var validLogin
logoutButton.style.display = 'none';
registerButton.style.display = 'none';
async function check() {
    domain = domainInput.value;
    isCompleteDomain = domain.indexOf('frii.site')!==-1;
    if(isCompleteDomain) {
        domain = domain.replace('.frii.site',"");
    }
    console.log("checking "+domain);
    result.style.color = "white";
    result.innerHTML = "Please wait...";
    await fetch(`${server_domain}/domain-is-available?domain=${domain}`)
    .then(data => {
        switch(data.status) {
            case 409:
                result.innerHTML = `${domain+'.frii.site'} is unavailable.`;
                result.style.color = "#DC3545";
                break;
            case 200:
                result.innerHTML = `${domain+'.frii.site'} is available!`;
                result.style.color = "#198754";
                registerButton.style.display = 'block';
                break;
            case 429:
                result.innerHTML = "You sent too many requests, please try again later.";
                result.style.color = "white";
                break
            case 400:
                result.innerHTML = `${domain+'.frii.site'} is not a valid domain.`;
        }
    })
}

async function isLoggedIn() {
    var TOKEN = localStorage.getItem("TOKEN");
    var statusCode
    var creds = {
        "TOKEN": TOKEN,
    }
    await fetch(`${server_domain}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(creds)
    })
    .then(response=>{
        validLogin = response.status===200;
        statusCode = response.status;
    });
    return;
}

function goToSingup() {
    window.location.href = '../account/signup.html'
}

async function registerDomain() {
    TOKEN = localStorage.getItem("TOKEN");
    result.style.color = "white";
    result.innerHTML = "Please wait, this might take several minutes.";
    domain = domainInput.value;
    isCompleteDomain = domain.indexOf('frii.site')!==-1;
    if(isCompleteDomain) {
        domain = domain.replace('.frii.site',"");
    }
    var creds = {
        "TOKEN": TOKEN,
        "domain": domain,
        "ip": "192.168.0.0"
    }
    await fetch(`${server_domain}/register-domain`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(creds)
    })
    .then(response=>{
        switch(response.status) {
            case 200:
                result.innerHTML = "Registered succesfully.";
                result.style.color = "#198754";
                window.location.href = "../account/dashboard.html";
                break;
            case 401:
                result.innerHTML = "Incorrect credentials, try logging in again.";
                result.style.color = "#DC3545"
                break;
            case 404:
                result.innerHTML = "Your account doesn't exist? Try logging in again.";
                result.style.color = "#DC3545"
                break;
            case 409:
                result.innerHTML = "Domain already exists or is invalid.";
                result.style.color = "#DC3545"
                break;
            case 400:
                result.innerHTML = "Please <a href='../account/verify.html'>verify</a> your email first.";
                result.style.color = "#DC3545"
                break;
        }
    })
}

window.onload = async function() {
    await isLoggedIn();
    
    if(!validLogin) {
        registerButton.onclick = goToSingup;
        registerButton.textContent = "Sign in";
    }
    else {
        registerButton.onclick = registerDomain
        logoutButton.style.display = 'block'
    }
}