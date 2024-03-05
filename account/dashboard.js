const template = document.getElementById("col-0");
const table = document.getElementById("domain-table");
const info = document.getElementById("result");
const error_messages = document.getElementById("error-messages");
const delete_button = document.getElementById("delete-button");

var record_dd;
const loader = document.getElementById("loader");
var columns = 0;
var server_domain = "https://server.frii.site";
var domain_field;
var ip_addr_field;
var true_domain_field;
var record_type_field;
var changedDomains = new Map();
var current_record;

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

function changed(from) {
    changedDomains.set(from.parentNode.parentNode.children[0].textContent,from.value)
}

function addDomain(domain, ipv4, true_domain, type) {
    columns += 1;
    new_column = template.cloneNode(true);
    new_column.id = `col-${columns}`;

    record_type_field = new_column.children[0]
    domain_field = new_column.children[1];
    ip_addr_field = new_column.children[2];
    true_domain_field = new_column.children[3];
    delete_button_field = new_column.children[4];
    delete_button_field.innerHTML = `<button onclick="deleteDomain(this);" class="btn btn-danger">Delete</button>`;
    record_type_field.innerHTML = type;
    domain_field.innerHTML = `${domain+".frii.site"}`;
    ip_addr_field.innerHTML = `<input onchange="changed(this);" style="color: inherit;" class="form-label bg-transparent text-white btn" value="${ipv4}">`;
    true_domain_field.innerHTML = `${true_domain}`;
    new_column.children = [record_type_field,domain_field,ip_addr_field,true_domain_field, delete_button_field];
    table.appendChild(new_column);
    return;
}

async function saveCustomDomain(element) {
    var values = element.parentNode.parentNode; // the values of each field.
    var type = values.children[0].children[0].children[0].textContent.trim();
    var content = values.children[1].children[0].value;
    var isCompleteDomain = content.indexOf('frii.site')!==-1;
    if(isCompleteDomain) {
        content = content.replace('.frii.site',"");
    }
    var value = values.children[2].children[0].value;
    if(type!==undefined&&content!==undefined&&value!==undefined){
        var creds = {
            "domain": content,
            "ip": value,
            "TOKEN": localStorage.getItem("TOKEN"),
            "type": type,
        }
        await fetch(`${server_domain}/register-domain`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(creds)
        })
        .then(response => {
            switch(response.status) {
                case 200:
                    window.location.reload();
                    break;
                case 400:
                    window.location.href="verify.html?code=400";
                    break;
                case 401:
                    window.location.href="login.html?code=401";
                    break;
                case 404:
                    window.location.href="login.html?code=404";
                    break;
                case 405:
                    error_messages.innerHTML = "You have exceeded your domain limit.";
                    break;
                case 409:
                    error_messages.innerHTML = "The 'content' is not valid.";
                    break;
            }
        });
    }
}

async function deleteDomain(element) {
    var values = element.parentNode.parentNode; // the values of each field.    var type = values.children[0].children[0].children[0].textContent.trim();
    var domain = values.children[1].innerHTML;

    var isCompleteDomain = domain.indexOf('frii.site')!==-1;
    if(isCompleteDomain) {
        domain = domain.replace('.frii.site',"");
    }
    var creds = {
        "domain": domain,
        "TOKEN": localStorage.getItem("TOKEN")
    }
    await fetch(`${server_domain}/delete-domain`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(creds)
    })
    .then(response=>{
        switch(response.status) {
            case 200:
                window.location.reload();
                break;
            case 500:
                error_messages.innerHTML = "Something went wrong.";
                break;
            case 403:
                error_messages.innerHTML = "You do not own this domain.";
                break;
            case 401:
                window.location.href="login.html?code=401";
                break;
            case 404:
                window.location.href="login.html?code=404";
                break;
            case 412:
                window.location.href="login.html?code=412";
                break;
        }
    })
}

function addInput() {
    columns += 1;
    new_column = template.cloneNode(true);
    new_column.id = `col-${columns}`;

    record_type_field = new_column.children[0]
    domain_field = new_column.children[1];
    ip_addr_field = new_column.children[2];
    true_domain_field = new_column.children[3];

    record_type_field.innerHTML = `  
    <div class="dropdown">
        <button id="record-dropdown" type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown">
            A
        </button>
        <ul class="dropdown-menu dropdown-menu-dark">
            <li onclick="changeDropdown(this);"><a class="dropdown-item">A</a></li>
            <li onclick="changeDropdown(this);"><a class="dropdown-item">CNAME</a></li>
            <li onclick="changeDropdown(this);"><a class="dropdown-item">TXT</a></li>
        </ul>
  </div>
  `;
    domain_field.innerHTML = `<input class="form-label bg-transparent text-white btn" placeholder="Name">`;
    ip_addr_field.innerHTML = `<input class="form-label bg-transparent text-white btn" placeholder="Content">`;
    true_domain_field.innerHTML = `<button onclick="saveCustomDomain(this);" class="btn btn-outline-primary">Save</button>`;
    new_column.children = [record_type_field,domain_field,ip_addr_field,true_domain_field];
    table.appendChild(new_column);
    return;
}


async function modifyDomain(domain, ip, token) {
    var creds = {
        "domain": domain,
        "ip": ip,
        "TOKEN": token
    }
    await fetch(`${server_domain}/modify-domain`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(creds)
    })
    .then(response => {
        switch(response.status) {
            case 200:
                window.location.reload();
                break;
            case 401:
                window.location.href="login.html?code=401"; 
                break;
            case 403:
                window.location.href="../register/index.html?code=403";
                break;
            case 404:
                window.location.href="register.html?code=404";
                break;
            case 412:
                window.location.href="login.html?code=412";
                break;
        }
    });
}

function send() {
    result.textContent = "Please wait...";
    for(var [key,value] of changedDomains) {
        modifyDomain(key.replace(".frii.site",""),value,localStorage.getItem("TOKEN")); // fixed it, my bad gang! 4.3.2024@18:43:38
    }
    result.textContent = "Please wait for the page to reload.";
}

domains = {}
getDomains();

async function getDomains() {
    var creds = {
        "TOKEN": localStorage.getItem("TOKEN")
    }
    if(localStorage.getItem("TOKEN")==null||localStorage.getItem("TOKEN")==undefined) {
        window.location.href="../account/login.html";
        return;
    }

    await fetch(`${server_domain}/get-domains`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(creds)
    })
    .then(response => response.json()).then(data => {
        domains = new Map(Object.entries(data));
    })
    if(domains.size===0) {
        window.location.href="../register/index.html";
    } 
    for( var [key,value] of domains ){
        if(value["type"]!==undefined) {
            addDomain(key,value["ip"],value["true-domain"], value["type"]);
        }
        else {
            continue;
        }
    }
    loader.remove();
}


function createNewField() {
    addInput();
}

function changeDropdown(element) {
    record_dd = document.getElementById("record-dropdown");
    record_dd.innerHTML = element.textContent;
}
