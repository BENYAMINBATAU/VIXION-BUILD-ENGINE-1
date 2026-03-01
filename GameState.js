/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║     BENYAMIN BATAU ENGINE BUILD UP  ·  v2.0.0               ║
 * ║     GameState.js — POWERCORE State Engine                   ║
 * ║     Yamaha Vixion 150 Assembly Simulator                    ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * ENHANCED FEATURES:
 * ─ Achievements & Badge System
 * ─ Detailed Performance Analytics
 * ─ Combo Streak Tracking
 * ─ Session History (last 10 runs)
 * ─ Stage Time Benchmarks
 * ─ Part Installation Accuracy Metrics
 * ─ Sound FX Manager (Web Audio API)
 * ─ Particle Event Bus
 * ─ Auto-save with debounce
 * ─ Version Migration
 * ─ Anti-cheat checksum
 */

"use strict";

const GAME_VERSION   = "2.0.0";
const SAVE_KEY       = "batauEngine_v2";
const LB_KEY         = "batauLeaderboard_v2";
const SESSION_KEY    = "batauSessions";
const CHECKSUM_SALT  = "VIXION150_BATAU";

// ════════════════════════════════════════════════════════════════
//  ACHIEVEMENT DEFINITIONS
// ════════════════════════════════════════════════════════════════
const ACHIEVEMENTS = {
  // Speed achievements
  speed_demon:    { id:"speed_demon",   name:"Speed Demon",     icon:"⚡", desc:"Selesaikan stage dalam 60 detik", xp: 200 },
  sub_minute:     { id:"sub_minute",    name:"Under The Gun",   icon:"⏱", desc:"Selesaikan game total < 10 menit", xp: 500 },
  no_break:       { id:"no_break",      name:"No Breaks",       icon:"🏎", desc:"Rakit semua stage tanpa pause", xp: 300 },

  // Accuracy achievements
  perfect_stage:  { id:"perfect_stage", name:"Perfect Stage",   icon:"💯", desc:"Selesaikan stage tanpa error", xp: 150 },
  flawless:       { id:"flawless",      name:"FLAWLESS",        icon:"💎", desc:"Selesaikan semua stage tanpa satu pun error", xp: 1000 },
  first_try:      { id:"first_try",     name:"First Try!",      icon:"🎯", desc:"Pasang 10 part berturut tanpa salah", xp: 250 },

  // Torque master
  torque_king:    { id:"torque_king",   name:"Torque King",     icon:"🔩", desc:"Torque semua baut dengan benar", xp: 300 },

  // Completion
  stage1_done:    { id:"stage1_done",   name:"Head Master",     icon:"🔩", desc:"Selesaikan Cylinder Head", xp: 100 },
  stage2_done:    { id:"stage2_done",   name:"Block Buster",    icon:"🔧", desc:"Selesaikan Cylinder Block", xp: 100 },
  stage3_done:    { id:"stage3_done",   name:"Gear Head",       icon:"⚙️", desc:"Selesaikan Clutch & Transmisi", xp: 100 },
  stage4_done:    { id:"stage4_done",   name:"Power Plant",     icon:"⚡", desc:"Selesaikan Generator", xp: 100 },
  stage5_done:    { id:"stage5_done",   name:"VIXION LIVES!",   icon:"🏍", desc:"Engine pertama kamu hidup!", xp: 500 },
  full_build:     { id:"full_build",    name:"Vixion Builder",  icon:"🏆", desc:"Rakit mesin secara lengkap", xp: 1000 },

  // Streak
  combo_5:        { id:"combo_5",       name:"On A Roll",       icon:"🔥", desc:"5 part benar berturut-turut", xp: 50 },
  combo_10:       { id:"combo_10",      name:"Unstoppable",     icon:"💥", desc:"10 part benar berturut-turut", xp: 150 },

  // Difficulty
  master_clear:   { id:"master_clear",  name:"Iron Mechanic",   icon:"🥇", desc:"Selesaikan semua stage di level Master", xp: 2000 },
  mechanic_clear: { id:"mechanic_clear",name:"Pro Mechanic",    icon:"🥈", desc:"Selesaikan semua stage di level Mechanic", xp: 800 },
  apprentice_clear:{ id:"apprentice_clear",name:"Certified",   icon:"📜", desc:"Selesaikan semua stage di Apprentice", xp: 400 },

  // Easter eggs
  night_shift:    { id:"night_shift",   name:"Night Shift",     icon:"🌙", desc:"Main antara 00:00–05:00 WIB", xp: 100 },
  comeback:       { id:"comeback",      name:"Never Give Up",   icon:"💪", desc:"Lanjutkan game setelah 7+ hari", xp: 200 },
};

// ════════════════════════════════════════════════════════════════
//  STAGE TIME BENCHMARKS (seconds)
// ════════════════════════════════════════════════════════════════
const BENCHMARKS = {
  1: { gold: 90,  silver: 150, bronze: 240 },
  2: { gold: 75,  silver: 120, bronze: 200 },
  3: { gold: 80,  silver: 130, bronze: 210 },
  4: { gold: 60,  silver: 100, bronze: 160 },
  5: { gold: 45,  silver: 75,  bronze: 120 },
};

// ════════════════════════════════════════════════════════════════
//  MAIN GAMESTATE OBJECT
// ════════════════════════════════════════════════════════════════
const GameState = {

  // ── SCHEMA: Default State ────────────────────────────────────
  defaultState: {
    version:         GAME_VERSION,
    playerName:      "",
    level:           "apprentice",
    currentStage:    1,
    completedStages: [],
    totalScore:      0,
    totalTime:       0,
    totalErrors:     0,
    totalXP:         0,
    rank:            "Magang",
    currentStreak:   0,
    maxStreak:       0,
    achievements:    [],
    sessionCount:    0,
    createdAt:       null,
    lastPlayed:      null,
    checksum:        null,

    analytics: {
      totalPartsInstalled: 0,
      totalPartsAttempted: 0,
      accuracy:            100,
      avgTimePerStage:     0,
      fastestStage:        null,
      favoriteLevel:       null,
    },

    stages: {
      1: { name:"Cylinder Head",   completed:false, score:0, time:0, errors:0, accuracy:100, medal:"",  partsInstalled:[], attempts:0 },
      2: { name:"Cylinder Block",  completed:false, score:0, time:0, errors:0, accuracy:100, medal:"",  partsInstalled:[], attempts:0 },
      3: { name:"Clutch & Trans",  completed:false, score:0, time:0, errors:0, accuracy:100, medal:"",  partsInstalled:[], attempts:0 },
      4: { name:"Generator",       completed:false, score:0, time:0, errors:0, accuracy:100, medal:"",  partsInstalled:[], attempts:0 },
      5: { name:"Test Running",    completed:false, score:0, time:0, errors:0, accuracy:100, medal:"",  partsInstalled:[], attempts:0 },
    },
  },

  // ── YAMAHA VIXION 150 SPECS ──────────────────────────────────
  vixionSpecs: {
    engineType:       "SOHC 4-stroke, Liquid-cooled",
    displacement:     "149.8 cc",
    boreStroke:       "57.0 × 58.7 mm",
    compressionRatio: "10.4 : 1",
    valveSystem:      "SOHC, 2 valve (IN + EX)",
    valveClearanceIN: "0.08 – 0.12 mm",
    valveClearanceEX: "0.13 – 0.17 mm",
    pistonType:       "Flat-top, forged aluminum",
    conrodLength:     "± 98 mm",
    clutchType:       "Wet multi-plate",
    clutchPlates:     "6 friction plates",
    transmission:     "6-speed constant mesh",
    generator:        "AC Generator / Spull",
    torqueHead:       "42 Nm",
    torquePistonPin:  "20 Nm",
    torqueConrod:     "35 Nm",
    torqueCamCap:     "10 Nm",
    oilCapacity:      "1.0 L (with filter change)",
    coolantType:      "Ethylene glycol based",
    sparkPlug:        "NGK CR8E",
    idleRPM:          "1.400 ± 100 rpm",
    redlineRPM:       "10.000 rpm",
    maxPower:         "11.1 kW / 8.500 rpm",
    maxTorque:        "13.8 Nm / 7.000 rpm",
    fuelSystem:       "Fuel Injection (YMJet-FI)",
    ignitionSystem:   "TCI (Transistor Controlled Ignition)",
    oilType:          "SAE 10W-40 JASO MA2",
    engineWeight:     "±38 kg",
  },

  // ── STAGE PARTS DATA ─────────────────────────────────────────
  stageParts: {
    1: [
      { id:"valve_guide_in",  name:"Valve Guide IN",      torque:null,    desc:"Panduan batang klep masuk, press-fit ke head",            order:1,  category:"valve" },
      { id:"valve_guide_ex",  name:"Valve Guide EX",      torque:null,    desc:"Panduan batang klep buang, press-fit ke head",            order:2,  category:"valve" },
      { id:"valve_seat_in",   name:"Valve Seat IN",       torque:null,    desc:"Dudukan klep masuk, material hardened steel",            order:3,  category:"valve" },
      { id:"valve_seat_ex",   name:"Valve Seat EX",       torque:null,    desc:"Dudukan klep buang, tahan suhu tinggi",                  order:4,  category:"valve" },
      { id:"valve_in",        name:"Klep IN (Intake)",    torque:null,    desc:"Diameter 27mm, buka saat langkah hisap",                 order:5,  category:"valve" },
      { id:"valve_ex",        name:"Klep EX (Exhaust)",   torque:null,    desc:"Diameter 24mm, buka saat langkah buang",                 order:6,  category:"valve" },
      { id:"valve_spring_in", name:"Per Klep IN",         torque:null,    desc:"Pegas klep masuk, dual spring design",                   order:7,  category:"spring" },
      { id:"valve_spring_ex", name:"Per Klep EX",         torque:null,    desc:"Pegas klep buang, dual spring design",                   order:8,  category:"spring" },
      { id:"valve_retainer",  name:"Valve Retainer",      torque:null,    desc:"Penahan per klep, 4 pcs (2 IN + 2 EX)",                  order:9,  category:"spring" },
      { id:"valve_cotter",    name:"Valve Cotter/Keeper", torque:null,    desc:"Kunci retainer, 2 belah per klep = 8 pcs total",         order:10, category:"spring" },
      { id:"head_gasket",     name:"Head Gasket",         torque:null,    desc:"Paking kepala silinder, MLS (Multi-Layer Steel)",        order:11, category:"gasket" },
      { id:"camshaft",        name:"Camshaft / Noken As", torque:"10 Nm", desc:"Poros cam SOHC, durasi cam IN/EX berbeda",               order:12, category:"cam" },
      { id:"cam_cap",         name:"Cam Cap",             torque:"10 Nm", desc:"Tutup bantalan camshaft, 2 baut per cap",                order:13, category:"cam" },
      { id:"timing_chain",    name:"Timing Chain",        torque:null,    desc:"Rantai keteng, menghubungkan crank ke cam",              order:14, category:"timing" },
      { id:"chain_tensioner", name:"Chain Tensioner",     torque:"8 Nm",  desc:"Penegang rantai keteng otomatis",                       order:15, category:"timing" },
      { id:"chain_guide",     name:"Chain Guide",         torque:null,    desc:"Pemandu rantai keteng, plastic guide",                  order:16, category:"timing" },
    ],
    2: [
      { id:"ring_oil",        name:"Ring Oli",            torque:null,    desc:"Ring paling bawah, kontrol oli ke dinding silinder",    order:1,  category:"piston" },
      { id:"ring_comp2",      name:"Ring Kompresi 2",     torque:null,    desc:"Ring tengah, bantu seal kompresi",                      order:2,  category:"piston" },
      { id:"ring_comp1",      name:"Ring Kompresi 1",     torque:null,    desc:"Ring atas, seal kompresi utama",                        order:3,  category:"piston" },
      { id:"piston",          name:"Piston",              torque:null,    desc:"Diameter 57mm, flat-top, forged aluminum",              order:4,  category:"piston" },
      { id:"piston_pin",      name:"Pin Piston / Gudgeon",torque:null,    desc:"Penghubung piston ke con-rod, full floating",           order:5,  category:"piston" },
      { id:"circlip",         name:"Circlip Piston",      torque:null,    desc:"Pengunci pin piston, 2 pcs, snap ring",                 order:6,  category:"piston" },
      { id:"conrod",          name:"Connecting Rod",      torque:"35 Nm", desc:"Batang piston ±98mm, small end + big end",              order:7,  category:"crank" },
      { id:"conrod_cap",      name:"Con-rod Cap",         torque:"35 Nm", desc:"Tutup big end con-rod, baut torque-to-yield",           order:8,  category:"crank" },
      { id:"crankshaft",      name:"Crankshaft",          torque:null,    desc:"Poros engkol, ubah gerak linear jadi rotasi",           order:9,  category:"crank" },
      { id:"main_bearing",    name:"Main Bearing",        torque:null,    desc:"Bantalan utama crankshaft, 2 sisi",                     order:10, category:"crank" },
      { id:"oil_seal_crank",  name:"Oil Seal Crankshaft", torque:null,    desc:"Seal oli crankshaft kiri & kanan",                      order:11, category:"seal" },
      { id:"cylinder_gasket", name:"Cylinder Gasket",     torque:null,    desc:"Paking silinder, antara block & crankcase",             order:12, category:"gasket" },
    ],
    3: [
      { id:"primary_gear",    name:"Primary Drive Gear",  torque:null,    desc:"Gigi primer, meneruskan putaran crank ke kopling",     order:1,  category:"clutch" },
      { id:"clutch_boss",     name:"Clutch Boss / Hub",   torque:"65 Nm", desc:"Rumah kopling dalam, tempat plate baja",               order:2,  category:"clutch" },
      { id:"clutch_housing",  name:"Clutch Housing",      torque:null,    desc:"Rumah kopling luar, tempat friction plate",            order:3,  category:"clutch" },
      { id:"friction_plate",  name:"Friction Plate (×6)", torque:null,    desc:"Plate gesek kopling, 6 buah, material kevlar",         order:4,  category:"clutch" },
      { id:"clutch_plate",    name:"Clutch Plate Baja",   torque:null,    desc:"Plate baja kopling, 5 buah, pasang selang-seling",     order:5,  category:"clutch" },
      { id:"clutch_spring",   name:"Per Kopling (×4)",    torque:"8 Nm",  desc:"Pegas penekan kopling, 4 buah, panjang sama",          order:6,  category:"clutch" },
      { id:"pressure_plate",  name:"Pressure Plate",      torque:"8 Nm",  desc:"Piringan penekan kopling, dioperasikan tuas",          order:7,  category:"clutch" },
      { id:"transmission",    name:"Gigi Transmisi 6-Speed",torque:null,  desc:"Set gear 6 percepatan, constant mesh",                 order:8,  category:"trans" },
      { id:"shift_drum",      name:"Shift Drum",          torque:null,    desc:"Drum pemindah gigi, digerakkan shift fork",            order:9,  category:"trans" },
      { id:"shift_fork",      name:"Shift Fork (×3)",     torque:null,    desc:"Garpu pemindah gigi, 3 pcs untuk 6 speed",             order:10, category:"trans" },
    ],
    4: [
      { id:"woodruff_key",    name:"Woodruff Key",        torque:null,    desc:"Pasak setengah lingkaran, kunci rotor ke crank",       order:1, category:"gen" },
      { id:"rotor",           name:"Rotor / Flywheel",    torque:"65 Nm", desc:"Rotor magnet permanen, juga sebagai flywheel",         order:2, category:"gen" },
      { id:"stator",          name:"Stator / Spull",      torque:"10 Nm", desc:"Kumparan stator, menghasilkan listrik AC",             order:3, category:"gen" },
      { id:"pickup_coil",     name:"Pickup Coil / Pulser",torque:"5 Nm",  desc:"Sensor sinyal pengapian untuk CDI/ECU",                order:4, category:"gen" },
      { id:"cover_gasket_l",  name:"Gasket Cover Kiri",   torque:null,    desc:"Paking tutup mesin kiri, paper gasket",                order:5, category:"cover" },
      { id:"side_cover_left", name:"Side Cover Kiri",     torque:"10 Nm", desc:"Tutup mesin sisi kiri, lindungi generator",            order:6, category:"cover" },
      { id:"cover_gasket_r",  name:"Gasket Cover Kanan",  torque:null,    desc:"Paking tutup mesin kanan, paper gasket",               order:7, category:"cover" },
      { id:"side_cover_right",name:"Side Cover Kanan",    torque:"10 Nm", desc:"Tutup mesin sisi kanan, lindungi kopling",             order:8, category:"cover" },
    ],
    5: [
      { id:"oil_fill",        name:"Isi Oli 1.0L",        torque:null,    desc:"Shell Advance AX7 10W-40 JASO MA2",                    order:1, category:"fluid" },
      { id:"coolant_fill",    name:"Isi Coolant",         torque:null,    desc:"Yamaha Coolant Blue, campuran 50:50 air",              order:2, category:"fluid" },
      { id:"spark_plug",      name:"Busi NGK CR8E",       torque:"12 Nm", desc:"Gap busi 0.7-0.8mm, ganti tiap 12.000 km",            order:3, category:"ignition" },
    ],
  },

  // ════════════════════════════════════════════════════════════
  //  SAVE / LOAD / MIGRATION
  // ════════════════════════════════════════════════════════════
  _generateChecksum(state) {
    const data = `${state.playerName}|${state.totalScore}|${state.completedStages.length}|${CHECKSUM_SALT}`;
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      hash = ((hash << 5) - hash) + data.charCodeAt(i);
      hash |= 0;
    }
    return hash.toString(16);
  },

  _verifyChecksum(state) {
    if (!state.checksum) return true; // legacy, allow
    return state.checksum === this._generateChecksum(state);
  },

  save(state) {
    try {
      state.lastPlayed = new Date().toISOString();
      state.checksum   = this._generateChecksum(state);
      this._updateAnalytics(state);
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
      this._emit("saved", state);
      return true;
    } catch (e) {
      console.error("GameState.save:", e);
      return false;
    }
  },

  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const state = JSON.parse(raw);
      // Version migration
      if (!state.version || state.version !== GAME_VERSION) {
        return this._migrate(state);
      }
      if (!this._verifyChecksum(state)) {
        console.warn("GameState: checksum mismatch");
      }
      return state;
    } catch (e) {
      console.error("GameState.load:", e);
      return null;
    }
  },

  _migrate(oldState) {
    // Migrate from v1.0.0 to v2.0.0
    if (oldState && oldState.version === "1.0.0") {
      const ns = JSON.parse(JSON.stringify(this.defaultState));
      ns.playerName      = oldState.playerName      || "";
      ns.level           = oldState.level           || "apprentice";
      ns.currentStage    = oldState.currentStage    || 1;
      ns.completedStages = oldState.completedStages || [];
      ns.totalScore      = oldState.totalScore      || 0;
      ns.totalTime       = oldState.totalTime       || 0;
      ns.totalErrors     = oldState.totalErrors     || 0;
      ns.createdAt       = oldState.createdAt       || new Date().toISOString();
      // migrate stage data
      for (let s = 1; s <= 5; s++) {
        if (oldState.stages && oldState.stages[s]) {
          ns.stages[s] = { ...ns.stages[s], ...oldState.stages[s] };
        }
      }
      this.save(ns);
      return ns;
    }
    // Unknown version – start fresh
    return null;
  },

  newGame(playerName, level = "apprentice") {
    const state         = JSON.parse(JSON.stringify(this.defaultState));
    state.playerName    = playerName || "Mekanik";
    state.level         = level;
    state.createdAt     = new Date().toISOString();
    state.sessionCount  = 1;

    // Easter egg: night shift
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5) {
      state.achievements.push("night_shift");
    }

    this.save(state);
    this._emit("newGame", state);
    return state;
  },

  exists()  { return localStorage.getItem(SAVE_KEY) !== null; },
  delete()  {
    localStorage.removeItem(SAVE_KEY);
    this._emit("deleted");
  },

  // ════════════════════════════════════════════════════════════
  //  ANALYTICS UPDATE
  // ════════════════════════════════════════════════════════════
  _updateAnalytics(state) {
    const completedCount = state.completedStages.length;
    if (completedCount > 0) {
      state.analytics.avgTimePerStage = Math.round(state.totalTime / completedCount);
    }
    const attempted = state.analytics.totalPartsAttempted;
    const installed = state.analytics.totalPartsInstalled;
    state.analytics.accuracy = attempted > 0 ? Math.round((installed / attempted) * 100) : 100;

    // Find fastest completed stage
    let minTime = Infinity, fastestStage = null;
    for (let i = 1; i <= 5; i++) {
      if (state.stages[i].completed && state.stages[i].time < minTime) {
        minTime = state.stages[i].time;
        fastestStage = i;
      }
    }
    state.analytics.fastestStage = fastestStage;

    // Rank calculation based on XP
    const xp = state.totalXP;
    if (xp >= 5000)      state.rank = "Master Mechanic";
    else if (xp >= 3000) state.rank = "Senior Mechanic";
    else if (xp >= 1500) state.rank = "Mechanic";
    else if (xp >= 500)  state.rank = "Junior Mechanic";
    else                 state.rank = "Magang";
  },

  // ════════════════════════════════════════════════════════════
  //  STAGE MANAGEMENT
  // ════════════════════════════════════════════════════════════
  completeStage(stageNum, score, time, errors) {
    const state = this.load();
    if (!state) return { success: false };

    const stage = state.stages[stageNum];
    stage.attempts++;
    stage.completed = true;
    stage.time      = time;
    stage.errors    = errors;
    stage.accuracy  = errors === 0 ? 100 : Math.max(0, Math.round(100 - (errors / (errors + 10)) * 100));

    // Medal calculation
    const bench = BENCHMARKS[stageNum];
    if (bench) {
      if (time <= bench.gold)        stage.medal = "gold";
      else if (time <= bench.silver) stage.medal = "silver";
      else if (time <= bench.bronze) stage.medal = "bronze";
      else                           stage.medal = "";
    }

    // Score with bonus
    const stageScore = this.calcScore(time, errors, state.level);
    const xpEarned   = this._calcXP(stageNum, stage.medal, errors);
    stage.score      = stageScore;

    if (!state.completedStages.includes(stageNum)) {
      state.completedStages.push(stageNum);
    }

    state.totalScore  += stageScore;
    state.totalTime   += time;
    state.totalErrors += errors;
    state.totalXP     += xpEarned;
    state.currentStage = Math.min(stageNum + 1, 5);
    state.sessionCount = (state.sessionCount || 0) + 1;

    // Check achievements
    const newAchievements = this._checkAchievements(state, stageNum, time, errors);

    this.save(state);
    this._emit("stageComplete", { stageNum, score: stageScore, medal: stage.medal, xp: xpEarned, newAchievements });

    // Record session history
    this._recordSession({
      stage:     stageNum,
      name:      state.playerName,
      score:     stageScore,
      time,
      errors,
      medal:     stage.medal,
      accuracy:  stage.accuracy,
      level:     state.level,
      timestamp: new Date().toISOString(),
    });

    return { success: true, score: stageScore, medal: stage.medal, xp: xpEarned, newAchievements };
  },

  _calcXP(stageNum, medal, errors) {
    const base   = stageNum * 100;
    const medals = { gold: 100, silver: 50, bronze: 20, "": 0 };
    const errorPenalty = errors * 10;
    return Math.max(base + (medals[medal] || 0) - errorPenalty, base * 0.5);
  },

  isStageUnlocked(stageNum) {
    if (stageNum === 1) return true;
    const state = this.load();
    if (!state) return false;
    return state.completedStages.includes(stageNum - 1);
  },

  installPart(stageNum, partId, isCorrect = true) {
    const state = this.load();
    if (!state) return false;

    state.analytics.totalPartsAttempted++;
    if (isCorrect) {
      state.analytics.totalPartsInstalled++;
      if (!state.stages[stageNum].partsInstalled.includes(partId)) {
        state.stages[stageNum].partsInstalled.push(partId);
      }
      state.currentStreak = (state.currentStreak || 0) + 1;
      state.maxStreak = Math.max(state.maxStreak || 0, state.currentStreak);
    } else {
      state.currentStreak = 0;
    }

    this.save(state);
    this._emit("partInstalled", { stageNum, partId, isCorrect, streak: state.currentStreak });
    return true;
  },

  // ════════════════════════════════════════════════════════════
  //  ACHIEVEMENT SYSTEM
  // ════════════════════════════════════════════════════════════
  _checkAchievements(state, stageNum, time, errors) {
    const newUnlocks = [];
    const earned = (id) => state.achievements.includes(id);
    const unlock = (id) => {
      if (!earned(id)) {
        state.achievements.push(id);
        newUnlocks.push(ACHIEVEMENTS[id]);
        state.totalXP += (ACHIEVEMENTS[id]?.xp || 0);
      }
    };

    // Stage completions
    unlock(`stage${stageNum}_done`);

    // Perfect stage
    if (errors === 0) unlock("perfect_stage");

    // Speed demon
    if (time <= 60) unlock("speed_demon");

    // Full build
    if (state.completedStages.length === 5) {
      unlock("full_build");
      if (state.level === "master")     unlock("master_clear");
      if (state.level === "mechanic")   unlock("mechanic_clear");
      if (state.level === "apprentice") unlock("apprentice_clear");

      // Flawless: all stages 0 errors
      const flawless = Object.values(state.stages).every(s => s.completed && s.errors === 0);
      if (flawless) unlock("flawless");

      // Sub-10min total
      if (state.totalTime < 600) unlock("sub_minute");
    }

    // Streak achievements
    if ((state.maxStreak || 0) >= 5)  unlock("combo_5");
    if ((state.maxStreak || 0) >= 10) unlock("combo_10");

    // Night shift
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5) unlock("night_shift");

    return newUnlocks;
  },

  getAchievements(unlocked = false) {
    const state = this.load();
    const all   = Object.values(ACHIEVEMENTS);
    if (!unlocked) return all;
    const earned = state ? state.achievements : [];
    return all.map(a => ({ ...a, unlocked: earned.includes(a.id) }));
  },

  // ════════════════════════════════════════════════════════════
  //  NAVIGATION
  // ════════════════════════════════════════════════════════════
  goToStage(num) {
    const paths = {
      1: "stages/stage1-head.html",
      2: "stages/stage2-cylinder.html",
      3: "stages/stage3-clutch.html",
      4: "stages/stage4-generator.html",
      5: "stages/stage5-testrun.html",
    };
    // Handle both root and stages/ subfolder
    const inStages = window.location.pathname.includes("/stages/");
    const prefix   = inStages ? "../" : "";
    if (paths[num]) window.location.href = prefix + paths[num];
  },

  goToIndex() {
    const inSubfolder = window.location.pathname.includes("/stages/");
    window.location.href = inSubfolder ? "../index.html" : "index.html";
  },

  // ════════════════════════════════════════════════════════════
  //  SCORE & TIME
  // ════════════════════════════════════════════════════════════
  calcScore(timeSeconds, errors, level) {
    const base        = 1000;
    const timePenalty = Math.floor(timeSeconds / 10) * 5;
    const errPenalty  = errors * 50;
    const levelBonus  = { apprentice: 0, mechanic: 200, master: 500 }[level] || 0;
    return Math.max(0, base - timePenalty - errPenalty + levelBonus);
  },

  formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  },

  getMedalIcon(medal) {
    return { gold: "🥇", silver: "🥈", bronze: "🥉", "": "—" }[medal] || "—";
  },

  getBenchmark(stageNum) {
    return BENCHMARKS[stageNum] || null;
  },

  // ════════════════════════════════════════════════════════════
  //  LEADERBOARD
  // ════════════════════════════════════════════════════════════
  getLeaderboard() {
    try {
      return JSON.parse(localStorage.getItem(LB_KEY) || "[]");
    } catch { return []; }
  },

  addToLeaderboard(entry) {
    const lb = this.getLeaderboard();
    lb.push({
      ...entry,
      date: new Date().toLocaleDateString("id-ID"),
      timestamp: Date.now(),
    });
    lb.sort((a, b) => b.score - a.score);
    lb.splice(10); // top 10
    localStorage.setItem(LB_KEY, JSON.stringify(lb));
  },

  clearLeaderboard() {
    localStorage.removeItem(LB_KEY);
  },

  // ════════════════════════════════════════════════════════════
  //  SESSION HISTORY
  // ════════════════════════════════════════════════════════════
  _recordSession(data) {
    try {
      const sessions = JSON.parse(localStorage.getItem(SESSION_KEY) || "[]");
      sessions.unshift(data);
      sessions.splice(20); // keep last 20
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessions));
    } catch (e) { /* ignore */ }
  },

  getSessions() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || "[]");
    } catch { return []; }
  },

  // ════════════════════════════════════════════════════════════
  //  EVENT BUS (lightweight pub/sub)
  // ════════════════════════════════════════════════════════════
  _listeners: {},

  on(event, cb) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(cb);
    return () => this.off(event, cb);
  },

  off(event, cb) {
    if (!this._listeners[event]) return;
    this._listeners[event] = this._listeners[event].filter(l => l !== cb);
  },

  _emit(event, data) {
    (this._listeners[event] || []).forEach(cb => {
      try { cb(data); } catch(e) { console.warn("GameState event error:", e); }
    });
  },

  // ════════════════════════════════════════════════════════════
  //  SOUND FX ENGINE (Web Audio API)
  // ════════════════════════════════════════════════════════════
  _audioCtx: null,

  _getAudioCtx() {
    if (!this._audioCtx) {
      try {
        this._audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch(e) { return null; }
    }
    return this._audioCtx;
  },

  playSound(type) {
    const ctx = this._getAudioCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const sounds = {
      snap:    { freq:[440, 880],       dur:0.08, wave:"square",   vol:0.15 },
      error:   { freq:[200, 150],       dur:0.20, wave:"sawtooth", vol:0.20 },
      success: { freq:[523,659,784],    dur:0.35, wave:"sine",     vol:0.20 },
      medal:   { freq:[659,784,1047],   dur:0.60, wave:"sine",     vol:0.25 },
      engine:  { freq:[80,100,80],      dur:1.20, wave:"sawtooth", vol:0.10 },
      click:   { freq:[800],            dur:0.03, wave:"square",   vol:0.10 },
    };

    const s = sounds[type] || sounds.click;
    osc.type = s.wave;
    gain.gain.setValueAtTime(s.vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + s.dur);

    const freqs = s.freq;
    const step  = s.dur / freqs.length;
    freqs.forEach((f, i) => osc.frequency.setValueAtTime(f, now + i * step));

    osc.start(now);
    osc.stop(now + s.dur + 0.05);
  },

  // ════════════════════════════════════════════════════════════
  //  UTILITY EXPORTS
  // ════════════════════════════════════════════════════════════
  ACHIEVEMENTS,
  BENCHMARKS,

  getPartById(stageNum, partId) {
    return (this.stageParts[stageNum] || []).find(p => p.id === partId) || null;
  },

  getPartsForStage(stageNum) {
    return this.stageParts[stageNum] || [];
  },

  getTotalParts() {
    return Object.values(this.stageParts).reduce((sum, arr) => sum + arr.length, 0);
  },

  getStageProgress(stageNum) {
    const state = this.load();
    if (!state) return 0;
    const total     = (this.stageParts[stageNum] || []).length;
    const installed = (state.stages[stageNum]?.partsInstalled || []).length;
    return total > 0 ? Math.round((installed / total) * 100) : 0;
  },

  getOverallProgress() {
    const state = this.load();
    if (!state) return 0;
    return Math.round((state.completedStages.length / 5) * 100);
  },

  // Export for CommonJS or Browser global
  ...(typeof module !== "undefined"
    ? {}
    : {}),
};

// Export
if (typeof module !== "undefined") {
  module.exports = GameState;
} else {
  window.GameState = GameState;
  window.ACHIEVEMENTS = ACHIEVEMENTS;
  window.BENCHMARKS   = BENCHMARKS;
}
