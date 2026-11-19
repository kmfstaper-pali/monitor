# Monitor Subdomain — Status Page Gratis

Halaman status ala Upptime, tapi kodenya buatan sendiri dan kecil: GitHub Actions mengecek daftar URL tiap 10 menit, mencatat status & latensi ke `data/status.json` (riwayat 90 hari), lalu GitHub Pages menampilkannya sebagai halaman hijau/merah lengkap dengan uptime % dan grafik latensi.

> **Prototipe — baca batasannya dulu**
> - Bukan real-time. Cron GitHub Actions "tiap 10 menit" sering telat 5–20 menit saat GitHub ramai, dan bisa dinonaktifkan otomatis bila repo tidak ada aktivitas 60 hari (tinggal aktifkan lagi di tab Actions).
> - **Tidak bisa cek dari browser.** Browser memblok permintaan ke domain lain (CORS), jadi pengecekan HARUS di server/Actions. `index.html` hanya membaca hasilnya.
> - Pengecekan dari server GitHub (AS/Eropa). Situs yang memblok IP luar negeri / Cloudflare challenge bisa terbaca "TURUN" padahal normal bagi pengunjung Indonesia.
> - Belum ada notifikasi (WA/email/Telegram). Bisa ditambah sendiri (lihat "Ubah pakai Claude").
> - Riwayat 90 hari × 144 cek/hari ≈ 0,6 MB per situs di `status.json`; cocok untuk ±1–15 situs.
> - Repo publik = Actions gratis tanpa batas menit; repo privat memakai kuota menit Actions.

## Langkah wajib: aktifkan jadwal cek
File jadwal ada di `salin-ke-github/cek.yml`. Setelah repo ini kamu fork/upload ke GitHub-mu, buat folder `.github/workflows/` lalu pindahkan `cek.yml` ke sana (lewat GitHub: Add file → Create new file → ketik `.github/workflows/cek.yml`, tempel isinya). Tanpa langkah ini pengecekan otomatis tidak jalan.

## Fitur
- Daftar situs cukup di `sites.json` (nama, url, rentang kode status yang dianggap "naik")
- Cek tiap 10 menit lewat GitHub Actions (Node 20, `fetch`, timeout 15 detik)
- Catat status, kode HTTP, latensi; riwayat 90 hari otomatis dipangkas
- Halaman status statis: ringkasan, lencana NAIK/TURUN, uptime 90 hari, bar per hari, grafik latensi 24 jam (SVG)
- Tanpa dependensi, tanpa server, tanpa biaya
- Pratinjau dengan data contoh saat dibuka langsung dari file (`file://`) atau `?demo`

## Cara menjalankan (pemula)
1. Buat repo baru di GitHub (publik), lalu unggah isi folder ini (termasuk folder `.github`).
2. Edit `sites.json`: ganti URL contoh dengan subdomainmu, misal `https://toko.namamu.id`.
3. Buka **Settings › Actions › General › Workflow permissions**, pilih **Read and write permissions**, Simpan (supaya bot boleh commit hasil cek).
4. Buka tab **Actions**, pilih "Cek status situs", klik **Run workflow** untuk percobaan pertama. Setelah hijau, `data/status.json` berisi data.
5. Buka **Settings › Pages**, Source: **Deploy from a branch**, Branch: `main` / `(root)`, Simpan. Tunggu 1–2 menit, buka `https://<username>.github.io/<repo>/`.
6. (Opsional) Domain sendiri, misal `status.namamu.id`: isi Custom domain di Settings › Pages, lalu buat CNAME di DNS ke `<username>.github.io`.

Uji di komputer sendiri (butuh Node 20+): `node cek.mjs` lalu buka `index.html` lewat server lokal (`npx serve` atau `python3 -m http.server`). Dibuka langsung dari file, halaman menampilkan data contoh.

## Struktur folder
```
index.html              halaman status (membaca data/status.json)
app.js                  render ringkasan, bar 90 hari, grafik SVG
cek.mjs                 skrip pengecek (dipanggil Actions)
sites.json              daftar URL yang dipantau
data/status.json        hasil cek + riwayat (ditulis bot)
salin-ke-github/cek.yml  jadwal cron tiap 10 menit (pindahkan ke .github/workflows/)
```

## Ubah brand/warna
Warna ada di blok `:root` di `index.html` (`--utama` hijau, `--merah`, `--latar`, `--panel`). Judul di `<h1>` dan `<title>`. Detail token di `DESIGN.md`.

## Ubah pakai Claude
- **Claude Code / Claude Desktop:** buka folder paket, skill `.claude/skills/ubah-monitor-subdomain` terbaca otomatis.
- **claude.ai:** unggah ZIP skill (tombol "Unduh Skill" di malikisaputra.biz.id/kode) lewat Customize › Skills › "+" › Create skill › Upload a skill (folder skill sebagai akar ZIP). Syarat: "Code execution and file creation" aktif di Settings › Capabilities (Free/Pro/Max); di Team/Enterprise diatur Owner. Sumber: support.claude.com/en/articles/12512180 (dicek 6 Nov 2026).

## Mau hasil lebih maksimal?
- impeccable — https://github.com/pbakaus/impeccable (Apache-2.0, dicek 6 Nov 2026)
- ui-ux-pro-max — https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (MIT menurut GitHub API, dicek 6 Nov 2026)

## Lisensi
Lisensi Nonkomersial Maliki Studio (kredit wajib, dilarang dijual) (lihat `LICENSE`).

Dibuat oleh Maliki Studio — malikisaputra.biz.id, follow TikTok/IG @malikisaputra

<!-- panduan-ai-maliki -->
## Ubah sendiri sesuai kebutuhanmu pakai AI

Kamu tidak perlu jago coding. Template ini sudah disiapkan supaya mudah diubah AI: ada **AGENTS.md** (aturan proyek untuk AI), **DESIGN.md** (gaya desain), dan skill Claude di folder `.claude/skills/`. Pilih salah satu cara di bawah.

### Cara 1: ChatGPT, Claude, atau Gemini di browser (paling gampang, gratis)
1. Unduh ZIP template ini, lalu ekstrak.
2. Buka chatgpt.com, claude.ai, atau gemini.google.com.
3. Unggah berkas yang mau diubah (biasanya `index.html`, `style.css`, `app.js`, atau berkas data). Unggah juga `AGENTS.md` dan `DESIGN.md` (kalau ada) biar AI paham aturannya. ChatGPT juga bisa menerima ZIP utuh.
4. Tulis permintaanmu (contoh di bawah), lalu minta: "Kirim ulang berkas yang diubah secara utuh."
5. Ganti berkas lama dengan hasil dari AI, lalu buka `index.html` di browser untuk cek.

### Cara 2: Claude Code (paling rapi untuk perubahan besar)
1. Pasang Claude Code (lihat claude.com/claude-code), atau pakai aplikasi Claude Desktop tab Code.
2. Buka folder template ini, lalu jalankan `claude` di terminal folder itu.
3. Tulis permintaanmu. Kalau ada folder `.claude/skills/ubah-…`, Claude Code otomatis memakainya, jadi hasilnya tetap mengikuti desain aslinya.

### Cara 3: Codex (OpenAI)
1. Pasang Codex CLI atau pakai Codex di aplikasi ChatGPT.
2. Buka folder template, jalankan `codex`. Codex otomatis membaca `AGENTS.md`.
3. Tulis permintaanmu, cek perubahannya, lalu setujui.

### Cara 4: Google Antigravity atau Gemini CLI (gratis)
1. Antigravity: buka aplikasinya, pilih **Open Folder** ke folder template ini, lalu tulis permintaan di panel agen.
2. Gemini CLI: jalankan `gemini` di folder template.
3. Di awal, tulis: "Baca AGENTS.md dan DESIGN.md dulu sebelum mengubah apa pun."

### Contoh permintaan yang bisa langsung kamu pakai
- "Ganti nama, logo teks, dan warna utama jadi hijau tua sesuai usahaku: [nama usaha]."
- "Tambahkan kolom [nama kolom] di formulir dan tampilkan di daftar."
- "Ubah semua data contoh jadi data usahaku: [tempel datanya]."
- "Tambahkan halaman/menu baru untuk [kebutuhan], gaya desainnya sama dengan yang sudah ada."
- "Jelaskan dulu cara kerja aplikasi ini dengan bahasa sederhana, baru ubah [bagian]."

### Tips biar hasilnya bagus
- Satu permintaan = satu perubahan. Cek dulu hasilnya, baru minta yang berikutnya.
- Simpan salinan folder asli sebelum mengubah, jadi bisa balik kalau ada yang rusak.
- Kalau ada error, salin pesan errornya (klik kanan > Inspect > Console) lalu tempel ke AI.
- Data aplikasi tersimpan di browser (localStorage). Backup dulu sebelum ganti versi.
- Jangan hapus kredit "Template oleh @malikisaputra", dan template ini **tidak boleh diperjualbelikan** tanpa izin. Mau menjual atau kerja sama? Diskusikan dulu dengan kreatornya (@malikisaputra).

Masih bingung? Komen di TikTok/IG **@malikisaputra**, nanti aku bantu.
