export async function onRequestGet({params,env}){
  const v=await env.STORE.get('img:'+params.id);
  if(!v)return new Response('',{status:404});
  return new Response(Uint8Array.from(atob(v),c=>c.charCodeAt(0)),{headers:{'content-type':'image/jpeg','cache-control':'public,max-age=31536000'}});
}
