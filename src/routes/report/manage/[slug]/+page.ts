import { serverURL } from '../../../../serverContactor';

export async function load({ params }){
    let code=params.slug;
    await fetch(`${serverURL}`).then(response=>{console.log(response.status)});
    const dataRequest = await fetch(`${serverURL}/vulnerability/get`,{
        method:"POST",
        headers:{"Content-type":"application/json"},
        body: JSON.stringify({"id":code})
    });
    const data = await dataRequest.json();
    return data;
}