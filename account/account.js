var server_domain = "https://server.frii.site";

async function digestMessage(message) {
    const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(""); // convert bytes to hex string
    return hashHex;
}

async function removeInvalid(user,pass,cpass,email,uh,ph,eh) {
    user.classList.remove("invalid");
    pass.classList.remove("invalid");
    cpass.classList.remove("invalid");
    email.classList.remove("invalid");
    uh.innerHTML = "";
    ph.innerHTML = "";
    eh.innerHTML = "";
}

function logOut() {
    localStorage.removeItem("TOKEN");
}
  
  
async function SignUp(element) {
    let uh = document.getElementById("username-hint");
    let ph = document.getElementById("password-hint");
    let ph2 = document.getElementById("password2-hint");
    let eh = document.getElementById("email-hint");
    let username = document.getElementById("username").value;
    let username_ = document.getElementById("username");
    let password = document.getElementById("password").value;
    let password_ = document.getElementById("password");
    let confirm_password = document.getElementById("confirm-password").value;
    let confirm_password_ = document.getElementById("confirm-password");
    let email = document.getElementById("email").value;
    let email_ = document.getElementById("email");
    let warning = document.getElementById("warning");
    removeInvalid(username_,password_,confirm_password_,email_,uh,ph,eh);

    let language = navigator.language || navigator.userLanguage; 
    if(!(username.length>3&&
        password.length>=8&&
        confirm_password===password&&
        email.indexOf("@") > -1)) {
        
        if(username.length<3) {
            username_.classList.add("invalid");
            uh.innerHTML = "Username must be atleast 3 characters long.";
        }
        if(password.length<=8) {
            password_.classList.add("invalid");
            ph.innerHTML = "Password must be atleast 8 characters long.";
        }
        if(!(confirm_password===password)) {
            confirm_password_.classList.add("Invalid");
            ph2.innerHTML = "Passwords must match!";
        }
        if(!(email.indexOf("@") > -1)) {
            eh.innerHTML = 'Email must include "@"';
            email_.classList.add("invalid");
        }
        return;
    }
    element.setAttribute("disabled","disabled");
    const creds = {
        "username": username,
        "password": password,
        "email":email,
        "lang":language
    };
    await fetch(`${server_domain}/sign-up`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(creds)
    })
    .then(data => {
        switch(data.status) {
            case 409:
                warning.innerHTML="Username taken!";
                break;
            case 200:
                window.location.href = "login.html"
                break;
        }
        element.disabled = false;
    });
}

async function Login(element) {
    let username = document.getElementById("username").value;
    let username_ = document.getElementById("username");
    let password = document.getElementById("password").value;
    let warning = document.getElementById("warning");
    let password_ = document.getElementById("password");
    digestMessage(password).then(_password => {
        
    digestMessage(username).then(_username => {
        TOKEN = `${_password}|${_username}`;
    element.setAttribute("disabled","disabled");

    let creds = {
        "TOKEN": TOKEN,
    }
    fetch(`${server_domain}/login`, {
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(creds)
    })
    .then(data => {
        element.disabled = false;
        if(data.status===401) {
            warning.innerHTML = "Invalid login.";
        }
        if(data.status===200) {
            digestMessage(password).then(_password => {
                TOKEN = `${_password}|${_username}`;
                localStorage.setItem("TOKEN",TOKEN);
            })
            window.location.href = "verify.html";
        }
            })
        })
    })
    TOKEN = "";
}

async function GetToken() {
    return localStorage.getItem("TOKEN");
}
async function RetrieveData() {
    var TOKEN = localStorage.getItem("TOKEN");

    let creds = {
        "TOKEN": TOKEN,
    }

    await fetch(`${server_domain}/retrieve-data`, {
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(creds)
    })
    
    .then(response => response.json()).then(data => {
        if(data.length < 5) {
            return;	
        }
        if(data.status!==200) {
            window.location.href="login.html"
        }
        var date = new Date(0);
        date.setSeconds(data["created"])
        document.getElementById("name").innerHTML = `Username: @${data["username"]}`;
        document.getElementById("email").innerHTML = `Email: ${data["email"]}`;
        document.getElementById("lang").innerHTML = `Language: ${data["lang"]}`;
        document.getElementById("country").innerHTML = `Country: ${data["country"]}`;
        document.getElementById("created").innerHTML = `Created on: ${date}`;
    });
    TOKEN = "";
}

