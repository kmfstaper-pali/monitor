# AGENTS.md — Monitor Subdomain
Panduan lengkap: `.claude/skills/ubah-monitor-subdomain/SKILL.md`. Desain: `DESIGN.md`.

- `sites.json` (daftar URL) → `cek.mjs` (Node 20, fetch, tulis `data/status.json`, riwayat 90 hari) dijalankan `.github/workflows/cek.yml` (di paket ada di `salin-ke-github/cek.yml`, pindahkan dulu) tiap 10 menit, lalu commit.
- `index.html` + `app.js` hanya MEMBACA `data/status.json` (browser tidak bisa cek situs lain karena CORS).
- Tanpa build tool/dependensi. Secret (token notifikasi) hanya via GitHub Secrets.
- Uji: `node --check`, `node cek.mjs`, konsol bersih; jaga kontras, aria, reduced-motion, responsif.

<!-- kredit-maliki -->
## Kredit (jangan dihapus)
Jangan menghapus kredit `kredit-maliki` (footer, komentar kepala berkas, LICENSE). Itu syarat lisensi.
