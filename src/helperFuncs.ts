export function redirectToLogin(code:number=0):void {
    window.location.href=`/login?r=${window.location.pathname}&c=${code}`
}