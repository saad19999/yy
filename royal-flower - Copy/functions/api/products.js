const list = async (e) => JSON.parse((await e.STORE.get('products')) || '[]');
const save = (e, l) => e.STORE.put('products', JSON.stringify(l));

export async function onRequestGet({ env }) {
  return new Response(JSON.stringify(await list(env)), {
    headers: { 'content-type': 'application/json', 'cache-control': 'no-cache' },
  });
}

export async function onRequestPut() {
  return Response.json({ ok: 1 });
}

export async function onRequestPost({ request, env }) {
  const b = await request.json(),
    id = Date.now().toString(36);
  await env.STORE.put('img:' + id, b.image);
  const l = await list(env);
  l.unshift({
    id,
    ar: b.ar,
    en: b.en || '',
    cat: b.cat,
    price: +b.price,
    old: b.old ? +b.old : undefined,
    img: '/api/img/' + id,
  });
  await save(env, l);
  return Response.json({ ok: 1 });
}

export async function onRequestDelete({ request, env }) {
  const id = new URL(request.url).searchParams.get('id');
  await env.STORE.delete('img:' + id);
  await save(
    env,
    (await list(env)).filter((p) => p.id !== id)
  );
  return Response.json({ ok: 1 });
}