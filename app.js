/* kredit-maliki: Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Lisensi Nonkomersial Maliki Studio: wajib kredit, dilarang dijual (lihat LICENSE). */
(function () {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Data contoh untuk pratinjau (file:// atau ?demo) — bukan hasil cek sungguhan.
  function dataDemo() {
    const now = Date.now();
    const buat = (nama, base, gagal) => {
      const riwayat = [];
      for (let i = 90 * 24 * 6; i >= 0; i -= 6) { // 1 titik per jam (diringkas)
        const t = new Date(now - i * 600000).toISOString();
        const n = Math.random() < gagal ? 0 : 1;
        riwayat.push({ t, n, ms: n ? Math.round(base + Math.random() * base * 0.8) : 0, k: n ? 200 : 503 });
      }
      const up = riwayat.filter((r) => r.n).length / riwayat.length * 100;
      const l = riwayat[riwayat.length - 1];
      return { nama, riwayat, uptime: +up.toFixed(2), terakhir: { waktu: l.t, naik: !!l.n, kode: l.k, ms: l.ms } };
    };
    const s = {
      'https://toko.contoh.id': buat('Toko online', 220, 0.002),
      'https://api.contoh.id': buat('API', 140, 0.01),
      'https://blog.contoh.id': buat('Blog', 380, 0.03)
    };
    s['https://blog.contoh.id'].terakhir.naik = false; s['https://blog.contoh.id'].terakhir.kode = 503;
    return { diperbarui: new Date(now).toISOString(), situs: s, demo: true };
  }

  async function muat() {
    if (location.protocol === 'file:' || /[?&]demo/.test(location.search)) return dataDemo();
    try {
      const r = await fetch('data/status.json?_=' + Date.now(), { cache: 'no-store' });
      if (!r.ok) throw new Error(r.status);
      const d = await r.json();
      if (!d.situs || !Object.keys(d.situs).length) return dataDemo();
      return d;
    } catch (e) { return dataDemo(); }
  }

  function perHari(riwayat) {
    const peta = new Map();
    for (const r of riwayat) {
      const h = r.t.slice(0, 10);
      const x = peta.get(h) || { naik: 0, total: 0 };
      x.total++; x.naik += r.n; peta.set(h, x);
    }
    const hasil = [];
    for (let i = 89; i >= 0; i--) {
      const h = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10);
      const x = peta.get(h);
      hasil.push({ h, p: x ? x.naik / x.total : null });
    }
    return hasil;
  }

  function grafik(riwayat) {
    const titik = riwayat.slice(-144).filter((r) => r.n); // ±24 jam terakhir
    if (titik.length < 2) return '<svg class="grafik" aria-hidden="true"></svg>';
    const max = Math.max(...titik.map((r) => r.ms)) * 1.1, W = 600, H = 70;
    const pts = titik.map((r, i) => [(i / (titik.length - 1)) * W, H - (r.ms / max) * (H - 6) - 3]);
    const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    return `<svg class="grafik" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="Grafik latensi 24 jam terakhir">
      <path d="${d} L${W} ${H} L0 ${H}Z" fill="rgba(22,163,74,.15)"/><path d="${d}" fill="none" stroke="#4ade80" stroke-width="1.6" vector-effect="non-scaling-stroke"/></svg>`;
  }

  function render(d) {
    const daftar = Object.entries(d.situs);
    const turun = daftar.filter(([, s]) => s.terakhir && !s.terakhir.naik);
    $('#ringkas').innerHTML = turun.length
      ? `<span class="titik turun"></span><span>${turun.length} layanan sedang bermasalah</span>`
      : '<span class="titik"></span><span>Semua layanan berjalan normal</span>';
    $('#diperbarui').textContent = (d.demo ? 'Data contoh · ' : '') + 'Diperbarui ' + new Date(d.diperbarui).toLocaleString('id-ID');
    $('#daftar').innerHTML = daftar.map(([url, s], i) => {
      const naik = s.terakhir && s.terakhir.naik;
      const hari = perHari(s.riwayat || []);
      const rata = (s.riwayat || []).filter((r) => r.n).slice(-144);
      const avg = rata.length ? Math.round(rata.reduce((a, r) => a + r.ms, 0) / rata.length) : '-';
      return `<article class="kartu" style="animation-delay:${i * 60}ms">
        <div class="baris"><div><div class="nama">${esc(s.nama)}</div><div class="url">${esc(url)}</div></div>
        <span class="lencana ${naik ? '' : 'turun'}">${naik ? 'NAIK' : 'TURUN'} · ${s.terakhir ? s.terakhir.kode : '-'}</span></div>
        <div class="angka"><span>Uptime 90 hari <b>${s.uptime ?? '-'}%</b></span><span>Rata-rata 24 jam <b>${avg} ms</b></span></div>
        <div class="bar" role="img" aria-label="Riwayat 90 hari">${hari.map((x) => `<i class="${x.p === null ? 'k' : x.p >= 0.99 ? '' : x.p >= 0.9 ? 's' : 't'}" title="${x.h}: ${x.p === null ? 'tanpa data' : (x.p * 100).toFixed(1) + '%'}"></i>`).join('')}</div>
        <div class="ket"><span>90 hari lalu</span><span>hari ini</span></div>
        ${grafik(s.riwayat || [])}
      </article>`;
    }).join('');
  }

  muat().then(render);
  setInterval(() => muat().then(render), 5 * 60 * 1000);
})();
