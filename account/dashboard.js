const template = document.getElementById("col-0");
const table = document.getElementById("domain-table");
const info = document.getElementById("result");

var columns = 0;
var server_domain = "https://server.frii.site";
var domain_field;
var ip_addr_field;
var true_domain_field;
var changedDomains = new Map();
function changed(from) {
    changedDomains.set(from.parentNode.parentNode.children[0].textContent,from.value)
    console.log(changedDomains);
}

function addDomain(domain, ipv4, true_domain) {
    columns += 1;
    new_column = template.cloneNode(true);
    new_column.id = `col-${columns}`;

    domain_field = new_column.children[0];
    ip_addr_field = new_column.children[1];
    true_domain_field = new_column.children[2];

    domain_field.innerHTML = `${domain}`;
    ip_addr_field.innerHTML = `<input onchange="changed(this);" style="color: inherit;" class="form-label bg-transparent text-white btn" value="${ipv4}">`;
    true_domain_field.innerHTML = `${true_domain}`;
    new_column.children = [domain_field,ip_addr_field,true_domain_field];
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
        return response.status
    });
}

function send() {
    result.textContent = "Please wait...";
    for(var [key,value] of changedDomains) {
        modifyDomain(key,value,localStorage.getItem("TOKEN"));
    }
    result.textContent = "Please wait for the page to reload.";
}

domains = {}
getDomains();
async function getDomains() {
    var creds = {
        "TOKEN": localStorage.getItem("TOKEN")
    }
    await fetch(`${server_domain}/get-domains`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(creds)
    })
    .then(response => response.json()).then(data => {
        console.log(data);
        domains = new Map(Object.entries(data));
    })
    
    for( var [key,value] of domains ){
        addDomain(key,value["ip"]);
    }
}
