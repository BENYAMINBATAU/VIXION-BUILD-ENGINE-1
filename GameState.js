/**
 * BENYAMIN BATAU ENGINE BUILD UP
 * GameState.js — Core State Manager
 * Yamaha Vixion 150 Assembly Simulator
 * 
 * Handles: save/load, stage navigation, score, progress
 * Used by: ALL stage files
 */

const GAME_VERSION = "1.0.0";
const SAVE_KEY = "batauEngine_v1";

const GameState = {

  // ─── DEFAULT STATE ──────────────────────────────────────────────
  defaultState: {
    version: GAME_VERSION,
    playerName: "",
    level: "apprentice", // apprentice | mechanic | master
    currentStage: 1,
    completedStages: [],
    totalScore: 0,
    totalTime: 0,
    totalErrors: 0,
    createdAt: null,
    lastPlayed: null,

    stages: {
      1: { name: "Cylinder Head",    completed: false, score: 0, time: 0, errors: 0, partsInstalled: [] },
      2: { name: "Cylinder Block",   completed: false, score: 0, time: 0, errors: 0, partsInstalled: [] },
      3: { name: "Clutch & Trans",   completed: false, score: 0, time: 0, errors: 0, partsInstalled: [] },
      4: { name: "Generator",        completed: false, score: 0, time: 0, errors: 0, partsInstalled: [] },
      5: { name: "Test Running",     completed: false, score: 0, time: 0, errors: 0, partsInstalled: [] },
    }
  },

  // ─── YAMAHA VIXION 150 SPECS ────────────────────────────────────
  vixionSpecs: {
    engineType:         "SOHC 4-stroke, Liquid-cooled",
    displacement:       "149.8 cc",
    boreStroke:         "57.0 × 58.7 mm",
    compressionRatio:   "10.4 : 1",
    valveSystem:        "SOHC, 2 valve (IN + EX)",
    valveClearanceIN:   "0.08 – 0.12 mm",
    valveClearanceEX:   "0.13 – 0.17 mm",
    pistonType:         "Flat-top, forged aluminum",
    conrodLength:       "± 98 mm",
    clutchType:         "Wet multi-plate",
    clutchPlates:       "6 friction plates",
    transmission:       "6-speed constant mesh",
    generator:          "AC Generator / Spull",
    torqueHead:         "42 Nm",
    torquePistonPin:    "20 Nm",
    torqueConrod:       "35 Nm",
    torqueCamCap:       "10 Nm",
    oilCapacity:        "1.0 L (with filter change)",
    coolantType:        "Ethylene glycol based",
    sparkPlug:          "NGK CR8E",
    idleRPM:            "1.400 ± 100 rpm",
    redlineRPM:         "10.000 rpm",
  },

  // ─── STAGE PARTS DATA ───────────────────────────────────────────
  stageParts: {
    1: [ // Cylinder Head
      { id: "valve_guide_in",   name: "Valve Guide IN",      torque: null,   desc: "Panduan batang klep masuk, press-fit ke head" },
      { id: "valve_guide_ex",   name: "Valve Guide EX",      torque: null,   desc: "Panduan batang klep buang, press-fit ke head" },
      { id: "valve_seat_in",    name: "Valve Seat IN",       torque: null,   desc: "Dudukan klep masuk, material hardened steel" },
      { id: "valve_seat_ex",    name: "Valve Seat EX",       torque: null,   desc: "Dudukan klep buang, tahan suhu tinggi" },
      { id: "valve_in",         name: "Klep IN (Intake)",    torque: null,   desc: "Diameter 27mm, buka saat langkah hisap" },
      { id: "valve_ex",         name: "Klep EX (Exhaust)",   torque: null,   desc: "Diameter 24mm, buka saat langkah buang" },
      { id: "valve_spring_in",  name: "Per Klep IN",         torque: null,   desc: "Pegas klep masuk, dual spring design" },
      { id: "valve_spring_ex",  name: "Per Klep EX",         torque: null,   desc: "Pegas klep buang, dual spring design" },
      { id: "valve_retainer",   name: "Valve Retainer",      torque: null,   desc: "Penahan per klep, 4 pcs (2 IN + 2 EX)" },
      { id: "valve_cotter",     name: "Valve Cotter/Keeper", torque: null,   desc: "Kunci retainer, 2 belah per klep = 8 pcs total" },
      { id: "head_gasket",      name: "Head Gasket",         torque: null,   desc: "Paking kepala silinder, MLS (Multi-Layer Steel)" },
      { id: "camshaft",         name: "Camshaft / Noken As", torque: "10 Nm",desc: "Poros cam SOHC, durasi cam IN/EX berbeda" },
      { id: "cam_cap",          name: "Cam Cap",             torque: "10 Nm",desc: "Tutup bantalan camshaft, 2 baut per cap" },
      { id: "timing_chain",     name: "Timing Chain",        torque: null,   desc: "Rantai keteng, menghubungkan crank ke cam" },
      { id: "chain_tensioner",  name: "Chain Tensioner",     torque: "8 Nm", desc: "Penegang rantai keteng otomatis" },
      { id: "chain_guide",      name: "Chain Guide",         torque: null,   desc: "Pemandu rantai keteng, plastic guide" },
    ],
    2: [ // Cylinder Block
      { id: "ring_oil",         name: "Ring Oli",            torque: null,   desc: "Ring paling bawah, kontrol oli ke dinding silinder" },
      { id: "ring_comp2",       name: "Ring Kompresi 2",     torque: null,   desc: "Ring tengah, bantu seal kompresi" },
      { id: "ring_comp1",       name: "Ring Kompresi 1",     torque: null,   desc: "Ring atas, seal kompresi utama" },
      { id: "piston",           name: "Piston",              torque: null,   desc: "Diameter 57mm, flat-top, forged aluminum" },
      { id: "piston_pin",       name: "Pin Piston / Gudgeon",torque: null,   desc: "Penghubung piston ke con-rod, full floating" },
      { id: "circlip",          name: "Circlip Piston",      torque: null,   desc: "Pengunci pin piston, 2 pcs, snap ring" },
      { id: "conrod",           name: "Connecting Rod",      torque: "35 Nm",desc: "Batang piston ±98mm, small end + big end" },
      { id: "conrod_cap",       name: "Con-rod Cap",         torque: "35 Nm",desc: "Tutup big end con-rod, baut torque-to-yield" },
      { id: "crankshaft",       name: "Crankshaft",          torque: null,   desc: "Poros engkol, ubah gerak linear jadi rotasi" },
      { id: "main_bearing",     name: "Main Bearing",        torque: null,   desc: "Bantalan utama crankshaft, 2 sisi" },
      { id: "oil_seal_crank",   name: "Oil Seal Crankshaft", torque: null,   desc: "Seal oli crankshaft kiri & kanan" },
      { id: "cylinder_gasket",  name: "Cylinder Gasket",     torque: null,   desc: "Paking silinder, antara block & crankcase" },
    ],
    3: [ // Clutch & Transmission
      { id: "primary_gear",     name: "Primary Drive Gear",  torque: null,   desc: "Gigi primer, meneruskan putaran crank ke kopling" },
      { id: "clutch_boss",      name: "Clutch Boss / Hub",   torque: "65 Nm",desc: "Rumah kopling dalam, tempat plate baja" },
      { id: "clutch_housing",   name: "Clutch Housing / Outer",torque: null, desc: "Rumah kopling luar, tempat friction plate" },
      { id: "friction_plate",   name: "Friction Plate (×6)", torque: null,   desc: "Plate gesek kopling, 6 buah, material kevlar" },
      { id: "clutch_plate",     name: "Clutch Plate Baja (×5)",torque:null,  desc: "Plate baja kopling, 5 buah, pasang selang-seling" },
      { id: "clutch_spring",    name: "Per Kopling (×4)",    torque: "8 Nm", desc: "Pegas penekan kopling, 4 buah, panjang sama" },
      { id: "pressure_plate",   name: "Pressure Plate",      torque: "8 Nm", desc: "Piringan penekan kopling, dioperasikan tuas" },
      { id: "transmission",     name: "Gigi Transmisi 6-Speed",torque: null, desc: "Set gear 6 percepatan, constant mesh" },
      { id: "shift_drum",       name: "Shift Drum",          torque: null,   desc: "Drum pemindah gigi, digerakkan shift fork" },
      { id: "shift_fork",       name: "Shift Fork (×3)",     torque: null,   desc: "Garpu pemindah gigi, 3 pcs untuk 6 speed" },
    ],
    4: [ // Generator / Spull
      { id: "woodruff_key",     name: "Woodruff Key",        torque: null,   desc: "Pasak/pin setengah lingkaran, kunci rotor ke crank" },
      { id: "rotor",            name: "Rotor / Flywheel",    torque: "65 Nm",desc: "Rotor magnet permanen, juga berfungsi sebagai flywheel" },
      { id: "stator",           name: "Stator / Spull",      torque: "10 Nm",desc: "Kumparan stator, menghasilkan listrik AC" },
      { id: "pickup_coil",      name: "Pickup Coil / Pulser", torque: "5 Nm",desc: "Sensor sinyal pengapian untuk CDI/ECU" },
      { id: "cover_gasket_l",   name: "Gasket Cover Kiri",   torque: null,   desc: "Paking tutup mesin kiri, paper gasket" },
      { id: "side_cover_left",  name: "Side Cover Kiri",     torque: "10 Nm",desc: "Tutup mesin sisi kiri, lindungi generator" },
      { id: "cover_gasket_r",   name: "Gasket Cover Kanan",  torque: null,   desc: "Paking tutup mesin kanan, paper gasket" },
      { id: "side_cover_right", name: "Side Cover Kanan",    torque: "10 Nm",desc: "Tutup mesin sisi kanan, lindungi kopling" },
    ],
    5: [ // Test Running — no parts to install, just validation
      { id: "oil_fill",         name: "Isi Oli 1.0L",        torque: null,   desc: "Shell Advance AX7 10W-40 JASO MA2" },
      { id: "coolant_fill",     name: "Isi Coolant",         torque: null,   desc: "Yamaha Coolant Blue, campuran 50:50 air" },
      { id: "spark_plug",       name: "Busi NGK CR8E",       torque: "12 Nm",desc: "Gap busi 0.7-0.8mm, ganti tiap 12.000 km" },
    ],
  },

  // ─── SAVE / LOAD ────────────────────────────────────────────────
  save(state) {
    try {
      state.lastPlayed = new Date().toISOString();
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
      return true;
    } catch (e) {
      console.error("GameState: Save failed", e);
      return false;
    }
  },

  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const state = JSON.parse(raw);
      if (state.version !== GAME_VERSION) return null; // version mismatch
      return state;
    } catch (e) {
      console.error("GameState: Load failed", e);
      return null;
    }
  },

  newGame(playerName, level = "apprentice") {
    const state = JSON.parse(JSON.stringify(this.defaultState));
    state.playerName = playerName || "Mekanik";
    state.level = level;
    state.createdAt = new Date().toISOString();
    this.save(state);
    return state;
  },

  exists() {
    return localStorage.getItem(SAVE_KEY) !== null;
  },

  delete() {
    localStorage.removeItem(SAVE_KEY);
  },

  // ─── STAGE MANAGEMENT ───────────────────────────────────────────
  completeStage(stageNum, score, time, errors) {
    const state = this.load();
    if (!state) return false;

    state.stages[stageNum].completed = true;
    state.stages[stageNum].score = score;
    state.stages[stageNum].time = time;
    state.stages[stageNum].errors = errors;

    if (!state.completedStages.includes(stageNum)) {
      state.completedStages.push(stageNum);
    }

    state.totalScore += score;
    state.totalTime += time;
    state.totalErrors += errors;
    state.currentStage = Math.min(stageNum + 1, 5);

    this.save(state);
    return true;
  },

  isStageUnlocked(stageNum) {
    if (stageNum === 1) return true;
    const state = this.load();
    if (!state) return false;
    return state.completedStages.includes(stageNum - 1);
  },

  installPart(stageNum, partId) {
    const state = this.load();
    if (!state) return false;
    if (!state.stages[stageNum].partsInstalled.includes(partId)) {
      state.stages[stageNum].partsInstalled.push(partId);
      this.save(state);
    }
    return true;
  },

  // ─── NAVIGATION ─────────────────────────────────────────────────
  goToStage(num) {
    const paths = {
      1: "../stages/stage1-head.html",
      2: "../stages/stage2-cylinder.html",
      3: "../stages/stage3-clutch.html",
      4: "../stages/stage4-generator.html",
      5: "../stages/stage5-testrun.html",
    };
    if (paths[num]) window.location.href = paths[num];
  },

  goToIndex() {
    // detect if we're in stages/ subfolder
    const inSubfolder = window.location.pathname.includes("/stages/");
    window.location.href = inSubfolder ? "../index.html" : "index.html";
  },

  // ─── SCORE CALCULATION ──────────────────────────────────────────
  calcScore(timeSeconds, errors, level) {
    const baseScore = 1000;
    const timePenalty = Math.floor(timeSeconds / 10) * 5;
    const errorPenalty = errors * 50;
    const levelBonus = { apprentice: 0, mechanic: 200, master: 500 }[level] || 0;
    return Math.max(0, baseScore - timePenalty - errorPenalty + levelBonus);
  },

  formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  },

  // ─── LEADERBOARD ────────────────────────────────────────────────
  getLeaderboard() {
    try {
      return JSON.parse(localStorage.getItem("batauLeaderboard") || "[]");
    } catch { return []; }
  },

  addToLeaderboard(entry) {
    const lb = this.getLeaderboard();
    lb.push({ ...entry, date: new Date().toLocaleDateString("id-ID") });
    lb.sort((a, b) => b.score - a.score);
    lb.splice(5); // top 5 only
    localStorage.setItem("batauLeaderboard", JSON.stringify(lb));
  },
};

// Export for module use OR global window access
if (typeof module !== "undefined") {
  module.exports = GameState;
} else {
  window.GameState = GameState;
}
