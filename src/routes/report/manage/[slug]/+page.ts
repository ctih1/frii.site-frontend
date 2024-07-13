import { serverURL } from '../../../../serverContactor';

export async function load({ params }){
    let code=params.slug;

    const dataRequest = await fetch(`${serverURL}/vulnerability/get`,{
        method:"POST",
        headers:{"Content-type":"application/x-www-form-urlencoded"},
        body: JSON.stringify({"id":code})
    });
    const data = await dataRequest.json();
    return data;
}