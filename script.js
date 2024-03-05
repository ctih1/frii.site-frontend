var isLoggedIn = false;
const primaryActionButton = document.getElementById("primary-button");

function main() {
    if(isLoggedIn) {
        primaryActionButton.classList.remove("btn-success");
        primaryActionButton.classList.add("btn-primary");
        primaryActionButton.textContent = "Domain panel";
        primaryActionButton.onclick = goToDomainPanel;
    }
    else {
        primaryActionButton.onclick = goToRegister;
    }
}

function goToDomainPanel() {
}

function goToRegister() {
    window.location.href = "/register/";
}



main();
