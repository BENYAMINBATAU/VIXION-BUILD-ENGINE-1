# 🔧 BENYAMIN BATAU ENGINE BUILD UP

> **Yamaha Vixion 150 Engine Assembly Simulator**  
> Virtual 3D engine building game — rakit mesin dari nol, part by part.

[![GitHub Pages](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-0046C8?style=flat-square&logo=github)](https://benyaminbatau.github.io/batau-engine-buildup/)
[![Version](https://img.shields.io/badge/Version-1.0.0-FF6B00?style=flat-square)](.)
[![License](https://img.shields.io/badge/License-MIT-00FF88?style=flat-square)](LICENSE)
[![Made with](https://img.shields.io/badge/Made%20with-Three.js%20%2B%20Vanilla%20JS-white?style=flat-square)](.)

---

## 🎮 Tentang Game

**BENYAMIN BATAU ENGINE BUILD UP** adalah simulator perakitan mesin virtual berbasis browser. Rakit mesin Yamaha Vixion 150cc SOHC mulai dari klep hingga test running — dengan visualisasi 3D interaktif, spesifikasi teknis akurat, dan gameplay berbasis urutan pemasangan yang benar.

### 🏍️ Spesifikasi Mesin (Yamaha Vixion 150)

| Komponen | Spesifikasi |
|----------|-------------|
| Tipe Mesin | SOHC 4-stroke, Liquid-cooled |
| Displacement | 149.8 cc |
| Bore × Stroke | 57.0 × 58.7 mm |
| Rasio Kompresi | 10.4 : 1 |
| Sistem Katup | SOHC, 2 valve (IN + EX) |
| Celah Klep IN | 0.08 – 0.12 mm |
| Celah Klep EX | 0.13 – 0.17 mm |
| Kopling | Wet multi-plate, 6 friction plate |
| Transmisi | 6-speed constant mesh |
| Generator | AC Generator / Spull |

---

## 🗺️ Alur Permainan

```
[MENU UTAMA]
     ↓
[DAFTAR MEKANIK] → Input nama + pilih level
     ↓
[STAGE 1] 🔩 Cylinder Head
  Valve guide → Valve seat → Klep IN/EX → Per klep
  → Retainer → Camshaft → Timing chain → Tensioner
     ↓
[STAGE 2] 🔧 Cylinder Block
  Ring piston → Piston → Pin piston
  → Connecting rod → Crankshaft
     ↓
[STAGE 3] ⚙️ Clutch & Transmisi
  Clutch boss → Friction plate (×6) → Spring
  → Pressure plate → Gear set 6-speed
     ↓
[STAGE 4] ⚡ Generator / Spull
  Woodruff key → Rotor → Stator/Spull
  → Pickup coil → Side cover kiri & kanan
     ↓
[STAGE 5] 🔥 Test Running
  Isi oli → Isi coolant → Pasang busi
  → Hidupkan mesin → RPM gauge → Score final
```

---

## 🏗️ Struktur Project

```
batau-engine-buildup/
├── index.html                   ← Dashboard utama (3D preview)
├── README.md
├── LICENSE
├── css/
│   └── global.css               ← Design system lengkap
├── js/
│   └── core/
│       └── GameState.js         ← State manager (semua stage pakai ini)
└── stages/
    ├── stage1-head.html         ← Cylinder Head assembly
    ├── stage2-cylinder.html     ← Cylinder Block assembly
    ├── stage3-clutch.html       ← Clutch & Transmisi
    ├── stage4-generator.html    ← Generator / Spull
    └── stage5-testrun.html      ← Final test running
```

---

## 🎨 Teknologi

- **Three.js r128** — 3D engine rendering (procedural, no external 3D files)
- **Vanilla JavaScript** — zero framework dependencies
- **CSS3** — animasi dan design system lengkap
- **localStorage** — save game & leaderboard

> **Total ukuran repo: < 2MB** — pure code, no binary assets

---

## 🚀 Cara Main

### Option 1: GitHub Pages (Langsung Main)
```
https://benyaminbatau.github.io/batau-engine-buildup/
```

### Option 2: Clone & Jalankan Lokal
```bash
git clone https://github.com/BenyaminBatau/batau-engine-buildup.git
cd batau-engine-buildup

# Buka dengan live server (VS Code extension)
# ATAU gunakan Python:
python -m http.server 8080
# Buka: http://localhost:8080
```

> ⚠️ **Jangan buka langsung sebagai file** (`file://`) karena Three.js butuh HTTP server.

---

## 📊 Sistem Skor

| Kondisi | Efek Skor |
|---------|-----------|
| Base score per stage | 1.000 poin |
| Setiap 10 detik | -5 poin |
| Kesalahan urutan | -50 poin |
| Bonus level Mechanic | +200 poin |
| Bonus level Master | +500 poin |

---

## 🎯 Level Kesulitan

| Level | Deskripsi |
|-------|-----------|
| 🟢 Apprentice | Panduan lengkap, nama part ditampilkan, urutan diberi petunjuk |
| 🟡 Mechanic | Panduan minimal, nama part tampil saat hover |
| 🔴 Master | Tanpa panduan, tanpa nama, urutan harus hafal sendiri |

---

## 🔧 Deployment ke GitHub Pages

1. Push repo ke GitHub
2. Buka **Settings → Pages**
3. Source: **Deploy from branch → main → / (root)**
4. Tunggu ~2 menit
5. Game live di: `https://[username].github.io/batau-engine-buildup/`

---

## 📝 Catatan Teknis

- Visualisasi 3D dibuat **procedural** menggunakan Three.js geometry — tidak memerlukan file model 3D (.glb/.obj)
- Semua spesifikasi merujuk pada **Yamaha Vixion 150 manual service book**
- Torque spec akurat sesuai standar pabrik Yamaha
- Game berjalan **100% offline** setelah load pertama (kecuali Google Fonts)

---

## 👤 Developer

**Benyamin Batau**  
Automotive Enthusiast & Developer

---

## 📄 License

MIT License — bebas digunakan, dimodifikasi, dan didistribusikan.

---

*"Merakit mesin bukan sekadar teknik — ini adalah seni."*  
— Benyamin Batau
