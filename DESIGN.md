# DESIGN — Monitor Subdomain

Arah: dasbor status gelap ala terminal, tenang; warna hanya untuk arti (hijau naik, kuning sebagian, merah turun).

## Token (`:root` di index.html)
| Token | Nilai | Dipakai |
|---|---|---|
| `--utama` | `#16a34a` | titik status, bar hari normal, lencana NAIK |
| `--merah` | `#dc2626` | turun |
| `--kuning` | `#d97706` | hari dengan uptime 90–99% |
| `--latar` / `--panel` / `--garis` | `#0b1210` / `#121c19` / `#1f2d29` | latar, kartu, garis |
| `--teks` / `--redup` | `#e6efe9` / `#8aa39a` | teks |
| `--r` | `14px` | sudut kartu |

## Tipografi
Space Grotesk (judul 30px/700, nama situs 17px/700), JetBrains Mono untuk URL, angka, lencana.

## Komponen
Banner prototipe kuning redup; kartu ringkasan dengan titik berdenyut; kartu situs: nama+URL, lencana, angka uptime/latensi, bar 90 hari (90 sel), grafik area SVG 24 jam.

## Motion
Kartu naik 8px bertahap 60ms; titik status berdenyut. Mati di `prefers-reduced-motion`.

## Aksesibilitas
Status tidak hanya warna (teks NAIK/TURUN), bar & grafik punya `role="img"` + `aria-label`, kontras AA di latar gelap.

<!-- kredit-maliki -->
## Kredit (jangan dihapus)
Jangan menghapus kredit `kredit-maliki`.
