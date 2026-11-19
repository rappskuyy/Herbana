# Herbana - Website Edukasi Herbal & Perilaku Hemat Energi (Arsitektur MVC & 3D WebGL)

Projek **Herbana** menggabungkan kearifan tanaman obat keluarga (TOGA) Nusantara dengan kesadaran budaya hemat energi di lingkungan sekolah. Website ini dibangun menggunakan arsitektur **Model-View-Controller (MVC)** dengan pemisahan berkas **HTML, CSS, dan JavaScript**, visualisasi **Asset 3D Asli (Three.js WebGL PBR)**, serta kampanye terstruktur dari **Fase 1 (Edukasi), Fase 2 (Data & Fakta), hingga Fase 3 (Rekomendasi & Ajakan Aksi Berbasis Data)**.

---

## 🎯 Detail Fase 3 — Rekomendasi & Ajakan Aksi Terukur

Rekomendasi tindakan nyata pada Fase 3 **berpijak 100% pada temuan data empiris kuesioner 636 responden siswa kelas XI** dan observasi ruang kelas/lab:

| Temuan Data Kuesioner | Tantangan Nyata di Sekolah | Rekomendasi Tindakan Nyata (Fase 3) | Target & Tolok Ukur |
| :--- | :--- | :--- | :--- |
| **Butir P04 (Skor 3.22)**<br>Jurusan PPLG hanya 3.05.<br>13.7% siswa jarang batasi gawai. | Monitor lab & laptop siswa menyala tanpa henti saat jam istirahat. | **Kebijakan 5-Minute Auto Sleep & Jeda Minum Herbal:**<br>Setting *Power Saver* wajib di lab. Siswa diajak istirahat mata dengan seduhan teh Daun Mint pekarangan sekolah. | Hemat 50-70 Watt per unit PC selama jam istirahat. |
| **Butir P09 (Skor 3.22)**<br>84 siswa (13.2%) jarang/sungkan menegur teman. | Sadar secara pribadi, tapi canggung menegur teman yang meninggalkan listrik menyala. | **Piket Eco-Peer Patrol & Stiker Pengingat Ramah:**<br>Menunjuk penanggung jawab saklar harian per kelas dan memasang stiker persuasif di sebelah stopkontak. | 100% ruang kelas memiliki PIC saklar resmi tanpa rasa canggung. |
| **Butir P08 & P03**<br>Skor 3.31 & 3.37.<br>60 siswa jarang matikan AC/kipas kosong. | Suhu remote AC disetel terlalu dingin (16-18°C) dan kipas menyala di kelas kosong. | **SOP Suhu AC 24°C & Koridor Hijau TOGA:**<br>Kunci suhu AC di 24-25°C. Tempatkan pot tanaman herbal (Sirih Gading, Lidah Buaya) di jendela untuk turunkan suhu mikro 1-2°C. | Efisiensi beban listrik pendingin ruangan 15-20%. |
| **Butir P06 & P10**<br>Skor 3.45 & 3.41.<br>51 siswa membiarkan colokan charger. | Kabel charger laptop/HP tetap menancap di terminal tanpa gawai (*phantom load*). | **Gerakan "Cabut Colokan Vampir Pukul 15.00":**<br>Ritual 3 menit sebelum bel pulang sekolah untuk serentak mencabut steker charger dan stopkontak terminal. | Zero Phantom Load di seluruh meja siswa dan lab. |

---

## 🏛️ Arsitektur MVC & Struktur Berkas

```
Herbana/
├── index.html                           # [VIEW] Landing Page Utama (Fase 1, 2 & 3)
├── data-fakta.html                      # [VIEW] Halaman Lengkap Data & Fakta + Matriks Fase 3
│
├── assets/                              # ASSET: Model 3D GLB & Tekstur
│   ├── plant-1.glb                      # Asset 3D Realistik Varian 01
│   ├── plant-2.glb                      # Asset 3D Realistik Varian 02
│   ├── plant-3.glb                      # Asset 3D Realistik Varian 03
│   └── herbal-plant.png                 # Fallback tekstur realistik
│
├── css/
│   └── style.css                        # [STYLE] Khusus 3D Scene, Scrollbar, Shadows & Mode Cetak
│
├── js/
│   ├── models/                          # [MODEL] Pengelola Data & Logika Bisnis
│   │   ├── EnergyModel.js               # Validasi data JSON, kalkulasi agregasi, getters
│   │   └── HerbalModel.js               # Entitas tanaman obat, zat aktif bioaktif & dampak energi
│   │
│   ├── views/                           # [VIEW] Komponen Antarmuka & Presentasi Visual
│   │   ├── Plant3DView.js               # Three.js WebGL Engine, Natural PBR Lighting & Idle Spin
│   │   ├── HerbalView.js                # Render kartu herbal secara aman & filter kategori UI
│   │   └── ChartView.js                 # Render Chart.js (Donut, Bar, Grouped) & tabel 10 butir
│   │
│   └── controllers/                     # [CONTROLLER] Penghubung Interaksi & Event Orchestrator
│       ├── LandingController.js         # Mengatur alur kerja pada index.html
│       └── DataFaktaController.js       # Mengatur visualisasi grafik & KPI pada data-fakta.html
│
├── data-perilaku-energi.json            # Sumber data hasil survei 636 siswa kelas XI
├── data-perilaku-energi.js              # Fallback dataset untuk fleksibilitas protokol file://
└── README.md                            # Dokumentasi lengkap projek
```

---

## 🚀 Cara Menjalankan

Jalankan menggunakan web server lokal:
```bash
python -m http.server 8000
# Akses melalui browser: http://localhost:8000
```
