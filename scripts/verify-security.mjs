// Verifies supabase-security.sql did what it claims.
//
// STRICTLY NON-DESTRUCTIVE: it never updates or deletes an existing row. Write
// permission is probed only by attempting to INSERT a uniquely-named throwaway
// row, which is removed again if it lands.
//
// It also distinguishes a real permission denial (401/403, or Postgres 42501)
// from a malformed request (400) - otherwise a probe with the wrong columns
// looks like a successful lockdown when nothing is locked down at all.
import fs from 'fs';

const env = Object.fromEntries(
    fs.readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
        .split('\n')
        .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
        .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);

const URL_ = env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE = env.SUPABASE_SERVICE_ROLE_KEY;

const anonH = { apikey: ANON, Authorization: `Bearer ${ANON}`, 'Content-Type': 'application/json' };
const svcH = SERVICE
    ? { apikey: SERVICE, Authorization: `Bearer ${SERVICE}`, 'Content-Type': 'application/json' }
    : null;

let pass = 0, fail = 0, skip = 0;
const ok = (n, d = '') => { pass++; console.log(`  PASS  ${n}${d ? '  ' + d : ''}`); };
const no = (n, d = '') => { fail++; console.log(`  FAIL  ${n}${d ? '  ' + d : ''}`); };
const sk = (n, d = '') => { skip++; console.log(`  SKIP  ${n}${d ? '  ' + d : ''}`); };

const PROBE = `zz_lockdown_probe_${Date.now()}`;

// One valid row per table, so a rejection can only be about permission.
const VALID_ROW = {
    coaches: { id: PROBE, name: 'probe', role: 'probe', bio: 'probe' },
    gallery: { id: PROBE, src: 'https://example.invalid/probe.png', category: 'Performance', alt: 'probe' },
    programs: { id: PROBE, title: 'probe', slug: 'probe', ages: '-', description: '-' },
    page_content: { page_id: PROBE, content: {} },
    schedule: { location: 'scarborough', day: 'ProbeDay', time: '00:00', group_name: PROBE },
};
const KEY = { coaches: 'id', gallery: 'id', programs: 'id', page_content: 'page_id', schedule: 'group_name' };
const TABLES = Object.keys(VALID_ROW);

/** Did the write get refused on permission grounds, rather than being malformed? */
function classify(status, bodyText) {
    if (status === 201 || status === 200) return 'ALLOWED';
    if (status === 401 || status === 403) return 'DENIED';
    let code = '';
    try { code = JSON.parse(bodyText)?.code || ''; } catch { /* not json */ }
    if (code === '42501') return 'DENIED';          // insufficient_privilege
    if (code === '23505') return 'ALLOWED';         // unique violation: the write was permitted
    return `INCONCLUSIVE(${status}${code ? ' ' + code : ''})`;
}

async function cleanup(table) {
    const headers = svcH || anonH;
    await fetch(`${URL_}/rest/v1/${table}?${KEY[table]}=eq.${PROBE}`, { method: 'DELETE', headers }).catch(() => {});
}

console.log('\n[1] Public site can still read what it needs (anon SELECT must work)');
for (const t of TABLES) {
    const r = await fetch(`${URL_}/rest/v1/${t}?select=*&limit=1`, { headers: anonH });
    r.status === 200 ? ok(`anon SELECT ${t}`, 'HTTP 200') : no(`anon SELECT ${t}`, `HTTP ${r.status}`);
}

console.log('\n[2] Public anon key must NOT be able to write');
for (const t of TABLES) {
    const r = await fetch(`${URL_}/rest/v1/${t}`, {
        method: 'POST', headers: anonH, body: JSON.stringify(VALID_ROW[t]),
    });
    const verdict = classify(r.status, await r.text());
    if (verdict === 'DENIED') ok(`anon INSERT ${t} denied`, `HTTP ${r.status}`);
    else if (verdict === 'ALLOWED') { no(`anon INSERT ${t} was ALLOWED`, `HTTP ${r.status}`); await cleanup(t); }
    else no(`anon INSERT ${t} unclear`, verdict);
}

console.log('\n[3] Snapshot table exists and is server-only');
{
    const a = await fetch(`${URL_}/rest/v1/content_backups?select=id&limit=1`, { headers: anonH });
    if (!svcH) {
        sk('content_backups checks', 'service role key not set, cannot tell "missing" from "protected"');
    } else {
        const s = await fetch(`${URL_}/rest/v1/content_backups?select=id&limit=1`, { headers: svcH });
        if (s.status !== 200) {
            no('content_backups table exists', `service role got HTTP ${s.status} - run supabase-security.sql`);
        } else {
            ok('content_backups table exists', 'service role HTTP 200');
            const rows = a.status === 200 ? await a.json() : null;
            (a.status !== 200 || (Array.isArray(rows) && rows.length === 0))
                ? ok('anon cannot read content_backups', `HTTP ${a.status}`)
                : no('anon CAN read content_backups', `HTTP ${a.status}`);
        }
    }
}

console.log('\n[4] Storage: public reads yes, anon writes no');
{
    const list = await fetch(`${URL_}/rest/v1/gallery?select=src&limit=40`, { headers: anonH });
    const rows = list.status === 200 ? await list.json() : [];
    const remote = rows.map((r) => r.src).find((s) => typeof s === 'string' && s.startsWith('http'));
    if (remote) {
        const r = await fetch(remote, { method: 'HEAD' });
        r.status === 200 ? ok('public can read an uploaded file', 'HTTP 200') : no('public read of uploaded file', `HTTP ${r.status}`);
    } else sk('public storage read', 'no remote-hosted gallery file found');

    const name = `${PROBE}.txt`;
    const up = await fetch(`${URL_}/storage/v1/object/images/${name}`, {
        method: 'POST',
        headers: { apikey: ANON, Authorization: `Bearer ${ANON}`, 'Content-Type': 'text/plain' },
        body: 'probe',
    });
    if (up.status === 200) {
        no('anon direct storage upload was ALLOWED', 'HTTP 200');
        await fetch(`${URL_}/storage/v1/object/images/${name}`, {
            method: 'DELETE', headers: { apikey: SERVICE || ANON, Authorization: `Bearer ${SERVICE || ANON}` },
        }).catch(() => {});
    } else ok('anon direct storage upload denied', `HTTP ${up.status}`);
}

console.log('\n[5] Service role can still write, so the admin keeps working');
if (!svcH) sk('service role writes', 'SUPABASE_SERVICE_ROLE_KEY not set in .env.local');
else {
    const ins = await fetch(`${URL_}/rest/v1/programs`, {
        method: 'POST', headers: { ...svcH, Prefer: 'return=representation' },
        body: JSON.stringify(VALID_ROW.programs),
    });
    ins.status === 201 ? ok('service role INSERT works', 'HTTP 201') : no('service role INSERT', `HTTP ${ins.status} ${await ins.text()}`);
    await cleanup('programs');
    const left = await (await fetch(`${URL_}/rest/v1/programs?select=id&id=eq.${PROBE}`, { headers: svcH })).json();
    (Array.isArray(left) && left.length === 0) ? ok('probe row cleaned up') : no('probe row left behind');
}

console.log('\n[6] No probe rows anywhere');
for (const t of TABLES) {
    const r = await fetch(`${URL_}/rest/v1/${t}?select=${KEY[t]}&${KEY[t]}=like.zz_lockdown_probe*`, { headers: svcH || anonH });
    const rows = r.status === 200 ? await r.json() : [];
    rows.length === 0 ? ok(`${t} clean`) : no(`${t} has ${rows.length} probe row(s)`);
}

console.log(`\n${pass} passed, ${fail} failed, ${skip} skipped\n`);
process.exit(fail === 0 ? 0 : 1);
