export function redirectToLogin(code:number=0):void {
    window.location.href=`/account?r=${window.location.pathname}&c=${code}`
}