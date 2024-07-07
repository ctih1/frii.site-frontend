import { redirectToLogin } from "./helperFuncs";
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
    return await fetch(`https://server.frii.site/vulnerability/report`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(data)
    });
}

export async function resendEmail(token:string|null):Promise<Response> {
    let data = {
        "TOKEN": token
    };
    return await fetch(`https://server.frii.site/resend-email`, {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(data)
    });
}

export class ServerContactor {
    token:string|null;
    serverURL:string;
    constructor(token:string|null) {
        this.serverURL="https://server.frii.site";
        this.token=token;
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
            "TOKEN": this.token,
            "domain":domain,
            "type":type,
            "ip":value,
        };
        return await fetch(`${this.serverURL}/modify-domain`, {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(data)
        });
    }

    async login(username: string, password: string): Promise<number> {
        try {
            const psw = await digestMessage(password);
            const usr = await digestMessage(username);
            const token = `${psw}|${usr}`;
            
            const data = {
                "TOKEN": token
            };
            localStorage.setItem("temp-token",token)
            const response = await fetch(`${this.serverURL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
    
            return response.status;
        } catch (error) {
            // Handle errors here
            console.error("Login error:", error);
            throw error; // Rethrow the error to be handled by the caller
        }
    }
    async getDomains():Promise<Response> {
        let data = {
            "TOKEN": this.token
        };
        return await fetch(`${this.serverURL}/get-domains`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
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
            "TOKEN":this.token,
            "domain":domain,
            "ip":"0.0.0.0",
            "type":type
        };
        if(type==="CNAME") {
            data["type"]="example.com"
        }
        return await fetch(`${this.serverURL}/register-domain`,{
            method:"POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(data)
        });
    }
    async deleteDomain(domain:string):Promise<Response> {
        let data = {
            "TOKEN":this.token,
            "domain":domain
        };
        return await fetch(`${this.serverURL}/delete-domain`,{
            method: "POST",
            headers: {"Content-Type":"application/json"},
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
        let data = {
            "TOKEN":this.token
        }
        return await fetch(`${this.serverURL}/delete-user`, {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(data)
        });
    }
    async getAccountDetails():Promise<Response> {
        let data = {
            "TOKEN":this.token
        }
        return await fetch(`${this.serverURL}/get-user-info`,{
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(data)
        })
    }
    async getGDPR():Promise<Response> {
        let data = {
            "TOKEN":this.token
        }
        return await fetch(`${this.serverURL}/gdpr-get`,{
            method:"POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(data)
        });
    }
}
