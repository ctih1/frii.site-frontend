import { redirectToLogin } from "./helperFuncs";
export const serverURL="https://api.frii.site";

async function digestMessage(message:string) {
    const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(""); // convert bytes to hex string
    return hashHex;
}

export async function createToken(username:string,password:string):Promise<string> {
    const psw = await digestMessage(password);
    const usr = await digestMessage(username);
    const token = `${psw}|${usr}`;
    return token;
}

export async function getStatus():Promise<Response> {
    return await fetch(`${serverURL}/status`);
}

export async function sendForgotCode(username:string): Promise<Response>  {
    return await fetch(`${serverURL}/reset-password`, {
        method: "PATCH",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({"username":username})
    })
}

export async function confirmPasswordChange(id:string,password:string): Promise<Response> {
    return await fetch(`${serverURL}/account-recovery/${id}`, {
        method: "PATCH",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({"password":password})
    })
}

export function getReportStatus(id:string) {
    fetch(`${serverURL}/vulnerability/get?id=${id}`,{
        method:"GET",
    }).then(response=>response.json()).then(data=>{
        return data
    })
}

export async function reportVulnerability(endpoint:string, expected:string, actual:string, importance:number, description:string, steps:string, impact:string, attacker:string, email:string):Promise<Response> {
    let data = {
        "endpoint":endpoint,
        "contact-email":email,
        "expected":expected,
        "actual":actual,
        "importance":importance,
        "description":description,
        "steps":steps,
        "impact":impact,
        "attacker":attacker
    };
    return await fetch(`${serverURL}/vulnerability/report`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(data)
    });
}

export async function resendEmail(token:string|null):Promise<Response> {
    return await fetch(`${serverURL}/resend-email`, {
        method: "GET",
        headers: {
            "X-Auth-Token":token as string
        }
    });
}

export async function getLanguagePercentages():Promise<Response> {
    return await fetch(`${serverURL}/translation/percentages`, {
       method: "GET" 
    });
}

export async function getTranslationKeys(code:string):Promise<Response> {
    return await fetch(`${serverURL}/translation/${code}/missing`, {
        method: "GET"
    })
}

export class ServerContactor {
    token:string;
    serverURL:string;
    constructor(token:string|null, urlOverride:string|null=null) {
        this.serverURL=serverURL;
        if(urlOverride) {
            this.serverURL=urlOverride;
        }
        this.token=token as string;
        if(this.token===null&&window.location.pathname!=="/account") {
            redirectToLogin(302);
        };
    }

    async domainAvailable(domain:string):Promise<Response> {
        return await fetch(`${this.serverURL}/domain-is-available?domain=${domain}`);
    }
    async modifyDomain(domain:string,value:string,type:string):Promise<Response> {
        // 412: Incorect login
        // 403: User does not own domain
        // 401: Wrong credentials
        // 404: The user does not exist
        let data = {
            "domain":domain,
            "type":type,
            "content":value,
        };
        return await fetch(`${this.serverURL}/modify-domain`, {
            method: "PATCH",
            headers: {
                "Content-Type":"application/json",
                "X-Auth-Token":this.token
            },
            body: JSON.stringify(data)
        });
    }

    async login(username: string, password: string): Promise<number> {
        try {
            const psw = await digestMessage(password);
            const usr = await digestMessage(username);
            const token = `${psw}|${usr}`;
            
            localStorage.setItem("temp-token",token)
            const response = await fetch(`${this.serverURL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json","X-Auth-Token":token },
            });
    
            return response.status;
        } catch (error) {
            // Handle errors here
            console.error("Login error:", error);
            throw error; // Rethrow the error to be handled by the caller
        }
    }
    async getDomains():Promise<Response> {
        return await fetch(`${this.serverURL}/get-domains`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-Auth-Token":this.token
            },
        });
    }
    async registerDomain(domain:string,type:string):Promise<Response> {
        // 412: Incorrect login-ish
        // 404: User not found in db
        // 405: Invalid type (not A CNAME TXT or NS)
        // 400: User is not verified
        // 401: Incorrect creds
        // 409: Not a valid domain
        // 405: Domain limit exceeded
        let data = {
            "domain":domain,
            "content":"0.0.0.0",
            "type":type
        };
        if(type==="CNAME") {
            data["content"]="example.com"
        }
        return await fetch(`${this.serverURL}/register-domain`,{
            method:"POST",
            headers: {"Content-Type":"application/json", "X-Auth-Token":this.token},
            body: JSON.stringify(data)
        });
    }
    async deleteDomain(domain:string):Promise<Response> {
        let data = {
            "domain":domain
        };
        return await fetch(`${this.serverURL}/delete-domain`,{
            method: "DELETE",
            headers: {"Content-Type":"application/json", "X-Auth-Token":this.token},
            body: JSON.stringify(data)
        });
    }
    
    async register(username:string,password:string,email:string):Promise<Response> {
        // 409: User already exists
        let data = {
            "username":username,
            "password":password,
            "email":email,
            "language": navigator.language
        };
        return await fetch(`${this.serverURL}/sign-up`, {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(data)
        });
    }
    async deleteAccoint():Promise<Response> {
        return await fetch(`${this.serverURL}/delete-user`, {
            method: "DELETE",
            headers: {"Content-Type":"application/json", "X-Auth-Token":this.token},
        });
    }
    async getAccountDetails():Promise<Response> {
        return await fetch(`${this.serverURL}/get-user-info`,{
            method: "GET",
            headers: {"Content-Type":"application/json","X-Auth-Token":this.token},
        })
    }
    async getGDPR():Promise<Response> {
        return await fetch(`${this.serverURL}/gdpr-get`,{
            method:"GET",
            headers: {"Content-Type":"application/json","X-Auth-Token":this.token},
        });
    }
    async getVulns():Promise<Response> {
        return await fetch(`${this.serverURL}/vulnerability/all`, {
            method:"GET",
            headers:{"Content-Type":"application/json","X-Auth-Token":this.token},
        });
    }

    async reportProgress(id:string,progress:string):Promise<Response> {
        return await fetch(`${this.serverURL}/vulnerability/progress`, {
            method: "PATCH",
            headers: {"Content-Type":"application/json","X-Auth-Token":this.token},
            body: JSON.stringify({"id":id,"progress":progress, "time":new Date().valueOf()/1000})
        });
    }
    async reportSeen(id:string):Promise<Response> {
        let data = {
            "id":id,
            "status":"seen",
            "mode":true,
            "d-importance": -1
        };
        return await fetch(`${this.serverURL}/vulnerability/status`, {
            method: "PATCH",
            headers:{"Content-Type":"application/json","X-Auth-Token":this.token}, 
            body: JSON.stringify(data)
        });
    }
    async reportReview(importance:number, id:string):Promise<Response> {
        let data = {
            "id":id,
            "status":"reviewed",
            "mode":true,
            "d-importance":importance
        };
        await fetch(`${this.serverURL}/vulnerability/progress`, {
            method: "PATCH",
            headers: {"Content-Type":"application/json","X-Auth-Token":this.token},
            body: JSON.stringify({"id":id,"progress":"Review approved", "time":new Date().valueOf()/1000})
        });
        return await fetch(`${this.serverURL}/vulnerability/status`, {
            method: "PATCH",
            headers:{"Content-Type":"application/json","X-Auth-Token":this.token}, 
            body: JSON.stringify(data)
        });
    }
    async reportFixing(id:string):Promise<Response> {
        let data = {
            "id":id,
            "status":"currently_working",
            "mode":true,
            "d-importance":-1
        };
        await fetch(`${this.serverURL}/vulnerability/progress`, {
            method: "PATCH",
            headers: {"Content-Type":"application/json","X-Auth-Token":this.token},
            body: JSON.stringify({"id":id,"progress":"Finished development", "time":new Date().valueOf()/1000})
        });
        return await fetch(`${this.serverURL}/vulnerability/status`, {
            method: "PATCH",
            headers:{"Content-Type":"application/json","X-Auth-Token":this.token}, 
            body: JSON.stringify(data)
        });
    }
    async reportFinished(id:string):Promise<Response> {
        let data = {
            "id":id,
            "status":"done",
            "mode":true,
            "d-importance":-1
        };
        await fetch(`${this.serverURL}/vulnerability/progress`, {
            method: "PATCH",
            headers: {"Content-Type":"application/json","X-Auth-Token":this.token},
            body: JSON.stringify({"id":id,"progress":"Deployed", "time":new Date().valueOf()/1000})
        });
        return await fetch(`${this.serverURL}/vulnerability/status`, {
            method: "PATCH",
            headers:{"Content-Type":"application/json","X-Auth-Token":this.token}, 
            body: JSON.stringify(data)
        });
    }
    async createApi(domains:string[],perms:string[],comment:string[]):Promise<Response> {
        const data = {
            domains:domains,
            perms:perms,
            comment:comment
        }
        return await fetch(`${this.serverURL}/create-api`,{
            method: "POST",
            headers: {"Content-Type":"application/json","X-Auth-Token":this.token},
            body: JSON.stringify(data)
        })
    }
    async joinBeta() {
        return await fetch(`${this.serverURL}/join/beta`,{
            method: "POST",
            headers: {"Content-Type":"application/json","X-Auth-Token":this.token}
        });
    }
    async leaveBeta() {
        return await fetch(`${this.serverURL}/leave/beta`,{
            method: "POST",
            headers: {"Content-Type":"application/json","X-Auth-Token":this.token}
        });
    }
    async convertCredits() {
        return await fetch(`${this.serverURL}/credits/convert`,{
            method:"POST",
            headers: {"Content-Type":"application/json","X-Auth-Token":this.token}
        })
    };

    async getCredits() {
        return await fetch(`${this.serverURL}/credits/get`,{
            method:"GET",
            headers: {"Content-Type":"application/json","X-Auth-Token":this.token}
        })
    }
    async submitLanguageContribution(language:string, contribution:{key:string,val:string}[]) {
        return await fetch(`${this.serverURL}/translations/${language}/contribute`, {
            method: "POST",
            headers: {"Content-Type":"application/json","X-Auth-Token":this.token},
            body: JSON.stringify({"contributions":contribution})
        }
        )
    }
}
