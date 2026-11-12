# Herbana - Website Edukasi Herbal & Perilaku Hemat Energi (Arsitektur MVC & 3D WebGL)

Projek **Herbana** menggabungkan kearifan tanaman obat keluarga (TOGA) Nusantara dengan kesadaran budaya hemat energi di lingkungan sekolah. Website ini telah dibangun menggunakan standar **Model-View-Controller (MVC)** dengan pemisahan berkas **HTML, CSS, dan JavaScript**, serta visualisasi **Asset 3D Asli (Real 3D WebGL via Three.js)** yang terlihat nyata (*photorealistic*).

---

## 🌿 Asset 3D Asli & Photorealistic Rendering (Bukan Animasi/Kartun)

Pada hero section:
1. **Asset 3D Nyata**:
   - Menggunakan model 3D nyata format binary glTF (`assets/plant-1.glb`, `assets/plant-2.glb`, `assets/plant-3.glb`).
   - Dirender secara langsung melalui GPU pengguna menggunakan **Three.js WebGL Renderer**.
2. **Pencahayaan Studio Botani (Studio 3-Point PBR Lighting)**:
   - *Key Light*: Sinar hangat terarah yang menghasilkan kilau pantulan alami pada permukaan daun.
   - *Fill Light*: Menyinari bagian bayangan dengan rona hijau botani segar.
   - *Rim Light*: Memberikan garis kilau tepi (*specular rim highlight*) pada daun.
   - *Tone Mapping*: ACES Filmic Tone Mapping untuk akurasi pencahayaan fotografi profesional.
3. **Perilaku Gerakan Saat Scroll**:
   - **Saat Tidak Di-scroll**: Model 3D **100% diam** di tempatnya.
   - **Saat Di-scroll ke Bawah**: Model 3D **berputar 360 derajat secara 3D** dan **meluncur turun ke bawah** secara mulus (*smooth scrub 1.5*) terintegrasi dengan GSAP ScrollTrigger.
   - **Interaktivitas Varian**: Pengunjung dapat mengklik varian `01` (Mint), `02` (Kunyit), atau `03` (TOGA) untuk melihat asset 3D yang berbeda secara langsung.
4. **Fallback Aman**:
   - Jika browser lokal membatasi *fetch* file lokal (`file://` CORS), sistem otomatis beralih ke rendering foto botani realistik beresolusi tinggi tanpa merusak antarmuka.

---

## 🏛️ Arsitektur MVC & Struktur Berkas

```
Herbana/
├── index.html                           # [VIEW] Landing Page Utama (Semantic HTML)
├── data-fakta.html                      # [VIEW] Halaman Lengkap Data & Fakta (Semantic HTML)
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
│   │   ├── EnergyModel.js               # Validasi data JSON, perhitungan agregasi, getters
│   │   └── HerbalModel.js               # Entitas tanaman obat, zat aktif bioaktif & dampak energi
│   │
│   ├── views/                           # [VIEW] Komponen Antarmuka & Presentasi Visual
│   │   ├── Plant3DView.js               # Three.js WebGL Engine, PBR Studio Lighting & GSAP Scroll
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

1. **Jalankan melalui Local Web Server** (Direkomendasikan untuk pengalaman WebGL 3D maksimal):
   ```bash
   python -m http.server 8000
   # Buka http://localhost:8000 di browser Anda
   ```
2. **Atau Buka Langsung**:
   Klik dua kali berkas `index.html` atau `data-fakta.html` di File Explorer.
