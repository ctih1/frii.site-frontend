export function redirectToLogin(code:number=0):void {
    localStorage.removeItem("logged-in");
    window.location.href=`/account?r=${window.location.pathname}&c=${code}`
}
export function createFile(filename:string,content:string):boolean {
    let a:HTMLElement=document.createElement("a");
    a.setAttribute("href","data:text/plain;charset=utf-8,"+encodeURIComponent(content));
    a.setAttribute("download",filename);
    a.click();
    return true;
}
export function getFlagEmoji (countryCode:String):string {
    if(countryCode=="en") {countryCode="gb"};
    if (countryCode === "ar") {
        return "🇦🇪";
    }
    if (countryCode === "lc") {
        return "🐈"
    }
    if (countryCode === "uwu") {
        return "🐈‍⬛"
    }
	let codePoints = countryCode.toUpperCase().split('').map(char =>  127397 + char.charCodeAt());
	return String.fromCodePoint(...codePoints);
}
