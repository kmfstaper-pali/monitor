// kredit-maliki: Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Lisensi Nonkomersial Maliki Studio: wajib kredit, dilarang dijual (lihat LICENSE).
// Cek semua URL di sites.json, catat ke data/status.json (status terkini + riwayat 90 hari).
// Jalankan: node cek.mjs   (Node 20+, tanpa dependensi)
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const BATAS_HARI = 90;
const TIMEOUT_MS = 15000;
const BERKAS_DATA = new URL('./data/status.json', import.meta.url);
const BERKAS_SITUS = new URL('./sites.json', import.meta.url);

async function bacaJSON(url, cadangan) {
  try { return JSON.parse(await readFile(url, 'utf8')); } catch { return cadangan; }
}

async function cekSatu(situs) {
  const mulai = performance.now();
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(situs.url, { method: 'GET', redirect: 'follow', signal: ctrl.signal,
      headers: { 'user-agent': 'monitor-subdomain/1.0 (+status page)' } });
    const ms = Math.round(performance.now() - mulai);
    const harap = situs.harapStatus || [200, 299];
    const naik = res.status >= harap[0] && res.status <= harap[1];
    return { naik, kode: res.status, ms };
  } catch (e) {
    return { naik: false, kode: 0, ms: Math.round(performance.now() - mulai), galat: String(e.name === 'AbortError' ? 'timeout' : (e.cause?.code || e.message)).slice(0, 80) };
  } finally { clearTimeout(t); }
}

const situs = await bacaJSON(BERKAS_SITUS, []);
if (!Array.isArray(situs) || !situs.length) { console.error('sites.json kosong atau rusak'); process.exit(1); }
const data = await bacaJSON(BERKAS_DATA, { diperbarui: null, situs: {} });
const sekarang = new Date();
const batas = sekarang.getTime() - BATAS_HARI * 864e5;

for (const s of situs) {
  const h = await cekSatu(s);
  const rec = data.situs[s.url] || { nama: s.nama, riwayat: [] };
  rec.nama = s.nama || s.url;
  rec.terakhir = { waktu: sekarang.toISOString(), ...h };
  rec.riwayat.push({ t: sekarang.toISOString(), n: h.naik ? 1 : 0, ms: h.ms, k: h.kode });
  rec.riwayat = rec.riwayat.filter(r => Date.parse(r.t) >= batas);
  const naik = rec.riwayat.filter(r => r.n).length;
  rec.uptime = rec.riwayat.length ? +(naik / rec.riwayat.length * 100).toFixed(2) : null;
  data.situs[s.url] = rec;
  console.log(`${h.naik ? 'NAIK ' : 'TURUN'} ${String(h.kode).padStart(3)} ${String(h.ms).padStart(5)}ms  ${s.url}${h.galat ? '  (' + h.galat + ')' : ''}`);
}
// buang situs yang sudah dihapus dari sites.json
const aktif = new Set(situs.map(s => s.url));
for (const u of Object.keys(data.situs)) if (!aktif.has(u)) delete data.situs[u];
data.diperbarui = sekarang.toISOString();
await mkdir(new URL('./data/', import.meta.url), { recursive: true });
await writeFile(BERKAS_DATA, JSON.stringify(data) + '\n');
