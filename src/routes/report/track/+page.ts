import { serverURL } from '../../../serverContactor';

export async function load({ url }) {
    let code:string|null=url.searchParams.get("code");
    await fetch(`${serverURL}`).then(response=>{console.log(response.status)});
    const dataRequest = await fetch(`${serverURL}/vulnerability/get`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({"id":code})
    });
    const data = await dataRequest.json();
    return data;
}  