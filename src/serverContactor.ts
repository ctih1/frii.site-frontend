export class ServerContactor {
    token:string|null;
    serverURL:string;
    constructor(token:string|null) {
        this.serverURL="server.frii.site";
        this.token=token
        if(this.token===null) {
            window.location.href="/login";
        }

    }

    async registerDomain(domain:string,value:string,type:string):Promise<Response> {
        let data = {
            "domain":domain,
            "type":type,
            "value":value
        }
        return await fetch(`${this.serverURL}/register-domain`,{
            method:"POST",
            headers: {
                "Content-Type":"application/json"   
            },
            body: JSON.stringify(data)
        })
    }
}
