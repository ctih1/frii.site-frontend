const codeInput = document.getElementById("code");
const codeHint = document.getElementById("code-hint");
const verifyButton = document.getElementById("verify");
const sendButton = document.getElementById("send");
const server_domain = "http://127.0.0.1:5000";
var validLogin;

function isLoggedIn() {
    var TOKEN = localStorage.getItem("TOKEN");
    var statusCode
    var creds = {
        "TOKEN": TOKEN, 
    }
    fetch(`${server_domain}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(creds)
    })
    .then(response=> {
        return response.status===200;
    });
}

async function sendVerification() {
    sendButton.setAttribute("disabled",true)
    console.log("send");
    var TOKEN = localStorage.getItem("TOKEN");
    var creds = {
        "TOKEN": TOKEN,
    }
    await fetch(`${server_domain}/send-verification-code`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(creds)
    }).then(response=>{
        switch(response.status){
            case 409:
                codeHint.innerHTML = "You are already verified, redirecting to the homepage...";
                setTimeout(function() {
                    window.location.href="../index.html";
                },2000)
                break;
            case 401:
                codeHint.innerHTML = "Invalid credentials, please log in again.";
                break;
            case 200:
                codeHint.innerHTML = "Verification code sent. Please check your spam folder";
                break;
        }
    })
}

async function verifyCode() {
    code = codeInput.value;
    var TOKEN = localStorage.getItem("TOKEN");
    var creds = {
        "TOKEN": TOKEN,
        "code": code
    }
    await fetch(`${server_domain}/verify-emailcode`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(creds)
    })
    .then(response=>{
        switch(response.status){
            case 401:
                codeHint.innerHTML = "Invalid credentials, please log in again.";
                break;
            case 403:
                codeHint.innerHTML = "Invalid code, please try again.";
                break;
            case 404:
                codeHint.innerHTML = "This code has expired.";
                break;
            case 200:
                codeHint.innerHTML = "Succesfully verified! Redirecting...";
                setTimeout(function() {
                    window.location.href="../index.html";
                },2000)
                break;
        }
    })
}


window.onload = async function() {
    verifyButton.onclick = verifyCode;
    sendButton.onclick = sendVerification 
}
