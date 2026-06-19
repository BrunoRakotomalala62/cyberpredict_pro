// CyberPredict Pro - Dual Aviator & CosmosX Prediction Engine

function initApp() {
  // Initialize Lucide Icons Safely
  function safeCreateIcons() {
    try {
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    } catch (e) {
      console.warn("Lucide Icons failed to load:", e);
    }
  }
  safeCreateIcons();

  // --- APPLICATION STATE ---
  let activeMode = "COSMOSX"; // COSMOSX or AVIATOR
  let soundEnabled = true;

  // --- HTML DOM Elements ---
  const bodyEl = document.body;
  const brandIconEl = document.getElementById("brand-icon");
  const txtBrandName = document.getElementById("txt-brand-name");
  const headerBrandIcon = document.getElementById("header-brand-icon");
  const targetWebLink = document.getElementById("target-web-link");
  const subBanner = document.getElementById("sub-banner");
  const txtWebsocketStatus = document.getElementById("txt-websocket-status");

  // Mode Toggles
  const btnModeCosmos = document.getElementById("btn-mode-cosmos");
  const btnModeAviator = document.getElementById("btn-mode-aviator");

  // Input selectors
  const multInput = document.getElementById("mult-input");
  const selHour = document.getElementById("sel-hour");
  const selMinute = document.getElementById("sel-minute");
  const selSecond = document.getElementById("sel-second");
  const btnSyncTime = document.getElementById("btn-sync-time");
  const btnQuickFill = document.getElementById("btn-quick-fill");
  const radarPredictionForm = document.getElementById("radar-prediction-form");
  const btnCalculate = document.getElementById("btn-calculate");
  const terminalIcon = document.getElementById("terminal-icon");

  // Terminal Logs
  const wsTerminal = document.getElementById("ws-terminal");

  // Interactive Simulator HUD
  const txtSimulatorHeader = document.getElementById("txt-simulator-header");
  const txtGpuStatus = document.getElementById("txt-gpu-status");
  const telemetryMult = document.getElementById("telemetry-mult");
  const telemetrySeed = document.getElementById("telemetry-seed");
  const telemetryHook = document.getElementById("telemetry-hook");
  const largeMultDisplay = document.getElementById("large-mult-display");
  const flightStatusIndicator = document.getElementById("flight-status-indicator");
  const flightBanner = document.getElementById("flight-banner");
  const flightBannerTitle = document.getElementById("flight-banner-title");
  const flightBannerMultiplier = document.getElementById("flight-banner-multiplier");
  const flightBannerDesc = document.getElementById("flight-banner-desc");
  const txtFlightEngineStatus = document.getElementById("txt-flight-engine-status");
  const txtFlightCoords = document.getElementById("txt-flight-coords");
  const liveDotColor = document.getElementById("live-dot-color");

  // Metric icons containers
  const iconM1 = document.getElementById("icon-container-m1");
  const iconM2 = document.getElementById("icon-container-m2");
  const iconM3 = document.getElementById("icon-container-m3");
  const iconM4 = document.getElementById("icon-container-m4");
  const txtPeakRate = document.getElementById("txt-peak-rate");

  // Output Report panel
  const reportOutputPanel = document.getElementById("report-output-panel");
  const reportLoader = document.getElementById("report-loader");
  const loaderInnerIcon = document.getElementById("loader-inner-icon");
  const loaderMainTxt = document.getElementById("loader-main-txt");
  const loaderSubTxt = document.getElementById("loader-sub-txt");
  const reportPlaceholder = document.getElementById("report-placeholder");
  const reportActive = document.getElementById("report-active");
  const spinBorderColor = document.getElementById("spin-border-color");

  // Generated Outputs
  const resSafeMult = document.getElementById("res-safe-mult");
  const resPeakMult = document.getElementById("res-peak-mult");
  const resCountdown = document.getElementById("res-countdown");
  const resTimeStart = document.getElementById("res-time-start");
  const resTimeEnd = document.getElementById("res-time-end");
  const resConfidence = document.getElementById("res-confidence");
  const resConfidenceBar = document.getElementById("res-confidence-bar");
  const reportGenerationTime = document.getElementById("report-generation-time");
  const btnSaveLog = document.getElementById("btn-save-log");

  // History section
  const logsTableBody = document.getElementById("logs-table-body");
  const rowEmpty = document.getElementById("row-empty");
  const btnClearLogs = document.getElementById("btn-clear-logs");

  // Audio nodes
  const btnSoundToggle = document.getElementById("btn-sound-toggle");
  const iconSound = document.getElementById("icon-sound");
  const sndSuccess = document.getElementById("snd-success");
  const sndFail = document.getElementById("snd-fail");
  const sndTick = document.getElementById("snd-tick");
  const sndClick = document.getElementById("snd-click");

  // Canvas context
  const activeFlightCanvas = document.getElementById("active-flight-canvas");
  const canvasCtx = activeFlightCanvas.getContext("2d");
  const flightCanvasContainer = document.getElementById("flight-canvas-container");

  // --- AUDIO CONTROLS ---
  btnSoundToggle.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
      iconSound.setAttribute("data-lucide", "volume-2");
      btnSoundToggle.classList.remove("text-red-500");
    } else {
      iconSound.setAttribute("data-lucide", "volume-x");
      btnSoundToggle.classList.add("text-red-500");
    }
    safeCreateIcons();
  });

  function playSound(audioNode) {
    if (soundEnabled && audioNode) {
      audioNode.currentTime = 0;
      audioNode.play().catch(() => {});
    }
  }

  // --- SELECT TIME DROPDOWN BUILDER ---
  function populateTimeDropdowns() {
    selHour.innerHTML = "";
    selMinute.innerHTML = "";
    selSecond.innerHTML = "";

    for (let h = 0; h < 24; h++) {
      const opt = document.createElement("option");
      opt.value = h.toString().padStart(2, "0");
      opt.textContent = h.toString().padStart(2, "0");
      selHour.appendChild(opt);
    }
    for (let m = 0; m < 60; m++) {
      const opt = document.createElement("option");
      opt.value = m.toString().padStart(2, "0");
      opt.textContent = m.toString().padStart(2, "0");
      selMinute.appendChild(opt);
    }
    for (let s = 0; s < 60; s++) {
      const opt = document.createElement("option");
      opt.value = s.toString().padStart(2, "0");
      opt.textContent = s.toString().padStart(2, "0");
      selSecond.appendChild(opt);
    }
  }
  populateTimeDropdowns();

  function syncTimeSelectors() {
    const now = new Date();
    selHour.value = now.getHours().toString().padStart(2, "0");
    selMinute.value = now.getMinutes().toString().padStart(2, "0");
    selSecond.value = now.getSeconds().toString().padStart(2, "0");
  }
  syncTimeSelectors();

  btnSyncTime.addEventListener("click", () => {
    playSound(sndClick);
    syncTimeSelectors();
    btnSyncTime.classList.add("text-white");
    setTimeout(() => btnSyncTime.classList.remove("text-white"), 200);
  });

  btnQuickFill.addEventListener("click", () => {
    playSound(sndClick);
    const ranges = [2.05, 2.45, 3.12, 4.50, 2.80, 5.20, 3.15, 6.42, 2.10, 8.15];
    const pickedVal = ranges[Math.floor(Math.random() * ranges.length)];
    multInput.value = pickedVal.toFixed(2);
  });

  // --- DOUBLE MODE MORPHING SYSTEM ---
  function applyCosmosMode() {
    activeMode = "COSMOSX";
    bodyEl.className = "theme-cosmos bg-gray-950 text-gray-100 antialiased font-sans transition-all duration-700 min-h-dvh cyber-grid relative";
    
    // Header brand updates
    brandIconEl.setAttribute("data-lucide", "rocket");
    brandIconEl.className = "h-5 w-5 transform -rotate-45";
    txtBrandName.textContent = "CosmosX Predictor";
    txtBrandName.className = "text-lg font-black tracking-widest bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent uppercase";
    headerBrandIcon.className = "p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl transition-all duration-500";
    targetWebLink.textContent = "https://bet261.mg/instant-games/llc/CosmosX";
    subBanner.className = "bg-indigo-950/20 border-b border-indigo-900/10 text-xs py-2 px-4 transition-colors duration-500";

    // Toggle button active styling
    btnModeCosmos.className = "flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 bg-indigo-600 text-white shadow-lg cursor-pointer";
    btnModeAviator.className = "flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 text-gray-400 hover:text-white cursor-pointer";

    // Panel styling
    txtConsoleTitle.textContent = "Console prédiction CosmosX";
    txtConsoleAlgo.textContent = "SEED AUTO-CALIBRÉ";
    txtConsoleAlgo.className = "text-[9px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono py-0.5 px-2 rounded uppercase tracking-widest";
    predictionPanel.className = "bg-gray-950/90 backdrop-blur-md border border-indigo-900/30 rounded-2xl p-5 glow-panel transition-all duration-500";
    btnCalculate.className = "w-full mt-4 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold py-3.5 px-4 rounded-xl transition duration-200 transform active:scale-95 flex items-center justify-center space-x-2 cursor-pointer border border-indigo-400/20";
    terminalIcon.className = "h-4.5 w-4.5 text-indigo-400";

    // Metric items coloring
    iconM1.className = "p-2 bg-indigo-500/10 rounded-lg text-indigo-400 transition-colors duration-500";
    iconM2.className = "p-2 bg-emerald-500/10 rounded-lg text-emerald-400 transition-colors duration-500";
    iconM3.className = "p-2 bg-cyan-500/10 rounded-lg text-cyan-400 transition-colors duration-500";
    iconM4.className = "p-2 bg-yellow-500/10 rounded-lg text-yellow-400 transition-colors duration-500";
    txtPeakRate.textContent = "12m 45s";

    // Loader and canvas properties
    txtSimulatorHeader.textContent = "CosmosX Flight Deck";
    liveDotColor.className = "relative inline-flex rounded-full h-2 w-2 bg-cyan-400";
    txtFlightEngineStatus.textContent = "SYSTEM ENGINE: READY";
    txtFlightCoords.textContent = "SECTOR: MC-261";
    spinBorderColor.className = "w-12 h-12 border-3 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin";
    loaderInnerIcon.setAttribute("data-lucide", "rocket");
    loaderInnerIcon.className = "h-5 w-5 text-indigo-400 absolute top-3.5 left-3.5 animate-pulse";
    loaderMainTxt.textContent = "ALGORITHME CRASH EN ACTION...";

    largeMultDisplay.textContent = "1.00x";
    flightStatusIndicator.textContent = "EN ATTENTE DE SYNCHRONISATION";

    safeCreateIcons();
    initStarsFlight();
  }

  function applyAviatorMode() {
    activeMode = "AVIATOR";
    bodyEl.className = "theme-aviator bg-gray-950 text-gray-100 antialiased font-sans transition-all duration-700 min-h-dvh cyber-grid relative";

    // Header brand updates
    brandIconEl.setAttribute("data-lucide", "plane");
    brandIconEl.className = "h-5 w-5";
    txtBrandName.textContent = "Aviator Predictor";
    txtBrandName.className = "text-lg font-black tracking-widest bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent uppercase";
    headerBrandIcon.className = "p-2.5 bg-red-600/20 text-red-400 rounded-xl transition-all duration-500";
    targetWebLink.textContent = "https://bet261.mg/instant-games/llc/Aviator";
    subBanner.className = "bg-red-950/10 border-b border-red-900/10 text-xs py-2 px-4 transition-colors duration-500";

    // Toggle button active styling
    btnModeCosmos.className = "flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 text-gray-400 hover:text-white cursor-pointer";
    btnModeAviator.className = "flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 bg-red-600 text-white shadow-lg cursor-pointer";

    // Panel styling
    txtConsoleTitle.textContent = "Console prédiction Aviator";
    txtConsoleAlgo.textContent = "ALGO PROVABLY FAIR ACTIVE";
    txtConsoleAlgo.className = "text-[9px] bg-red-500/10 border border-red-500/20 text-red-300 font-mono py-0.5 px-2 rounded uppercase tracking-widest";
    predictionPanel.className = "bg-gray-950/90 backdrop-blur-md border border-red-900/30 rounded-2xl p-5 glow-panel transition-all duration-500";
    btnCalculate.className = "w-full mt-4 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-bold py-3.5 px-4 rounded-xl transition duration-200 transform active:scale-95 flex items-center justify-center space-x-2 cursor-pointer border border-red-400/20";
    terminalIcon.className = "h-4.5 w-4.5 text-red-400";

    // Metric items coloring
    iconM1.className = "p-2 bg-red-500/10 rounded-lg text-red-400 transition-colors duration-500";
    iconM2.className = "p-2 bg-orange-500/10 rounded-lg text-orange-400 transition-colors duration-500";
    iconM3.className = "p-2 bg-yellow-500/10 rounded-lg text-yellow-400 transition-colors duration-500";
    iconM4.className = "p-2 bg-red-500/10 rounded-lg text-red-400 transition-colors duration-500";
    txtPeakRate.textContent = "08m 15s";

    // Loader and canvas properties
    txtSimulatorHeader.textContent = "Aviator Flight Deck";
    liveDotColor.className = "relative inline-flex rounded-full h-2 w-2 bg-red-500";
    txtFlightEngineStatus.textContent = "PROPELLER ENGINES: COMPRESSION AT 100%";
    txtFlightCoords.textContent = "SECTOR: ALT-AVIATOR";
    spinBorderColor.className = "w-12 h-12 border-3 border-red-500/10 border-t-red-500 rounded-full animate-spin";
    loaderInnerIcon.setAttribute("data-lucide", "plane");
    loaderInnerIcon.className = "h-5 w-5 text-red-400 absolute top-3.5 left-3.5 animate-pulse";
    loaderMainTxt.textContent = "INTERCEPTION DES MESSAGES AVIATOR...";

    largeMultDisplay.textContent = "1.00x";
    flightStatusIndicator.textContent = "EN ATTENTE DU PROCHAIN VOL";

    safeCreateIcons();
    initStarsFlight();
  }

  btnModeCosmos.addEventListener("click", () => {
    playSound(sndClick);
    applyCosmosMode();
  });

  btnModeAviator.addEventListener("click", () => {
    playSound(sndClick);
    applyAviatorMode();
  });


  // --- LIVE TERMINAL WEBSOCKET SIMULATION (STEALTH SCRAPING) ---
  const terminalMessages = [
    { type: "sys", text: "[SYSTEM] Initialisation de l'intercepteur WebSocket stealth..." },
    { type: "sys", text: "[SYSTEM] Négociation TLS/JA3 réussie avec bet261.mg" },
    { type: "conn", text: "[WS] Connexion établie sur wss://bet261.mg/games/ws" },
    { type: "sub", text: "[WS] Message envoyé : {\"action\":\"subscribe\",\"topic\":\"aviator:live\"}" },
    { type: "sub", text: "[WS] Abonnement aux graines RNG validé par le serveur." }
  ];

  function runTerminalStream() {
    // Populate initial lines
    terminalMessages.forEach(msg => {
      const p = document.createElement("p");
      p.className = msg.type === "sys" ? "text-indigo-400" : msg.type === "conn" ? "text-emerald-400" : "text-gray-400";
      p.textContent = msg.text;
      wsTerminal.appendChild(p);
    });

    // Periodically append new fake live JSON packets representing real websocket scraping
    setInterval(() => {
      const p = document.createElement("p");
      p.className = "text-emerald-400 font-mono";

      const rand = Math.random();
      const timestamp = Math.floor(Date.now() / 1000);
      const randSeed = Math.random().toString(16).substring(2, 10);

      if (rand < 0.25) {
        p.className = "text-indigo-400 font-bold";
        p.textContent = `[RECV] {"event":"game_state","status":"betting","hash":"f3e2a1${randSeed}"}`;
      } else if (rand < 0.5) {
        p.className = "text-yellow-400";
        p.textContent = `[RECV] {"event":"flight_tick","multiplier":${(1 + Math.random() * 3).toFixed(2)},"t":${timestamp}}`;
      } else if (rand < 0.75) {
        p.className = "text-red-500 font-bold";
        p.textContent = `[RECV] {"event":"crash_point","result":${(1.10 + Math.random() * 4).toFixed(2)},"seed":"${randSeed}"}`;
      } else {
        p.className = "text-gray-400 italic";
        p.textContent = `[SYS] Rotation proxy résidentiel : IP ${Math.floor(Math.random()*150)+50}.84.120.${Math.floor(Math.random()*254)}`;
      }

      wsTerminal.appendChild(p);
      wsTerminal.scrollTop = wsTerminal.scrollHeight;

      // Keep terminal under 100 lines
      if (wsTerminal.children.length > 100) {
        wsTerminal.removeChild(wsTerminal.firstChild);
      }

      // Slightly increase scanned packet counter on metric strip
      const currentPackets = parseInt(document.getElementById("counter-packets").textContent.replace(/,/g, ""));
      document.getElementById("counter-packets").textContent = (currentPackets + 1).toLocaleString();

    }, 2500);
  }
  runTerminalStream();


  // --- COGNITIVE DETERMINISTIC ALGORITHM FOR PREDICTION ---
  function computeDeterministicPrediction(multiplier, hour, minute, second, mode) {
    const inputSec = parseInt(hour) * 3600 + parseInt(minute) * 60 + parseInt(second);
    const multFloat = parseFloat(multiplier);

    // Create a stable hash representation from seed values
    const hashSeed = (inputSec * 23 + Math.floor(multFloat * 100) * 19 + (mode === "COSMOSX" ? 31 : 57)) % 10000;

    // Cycle intervals offset represent 14.5 minutes progression
    const baseCycle = mode === "COSMOSX" ? 870 : 780; // 14.5m vs 13m
    const targetOffset = baseCycle + (hashSeed % 150) - 75; // cycle shift

    const startSecs = (inputSec + targetOffset) % 86400;
    const endSecs = (startSecs + 30 + (hashSeed % 40)) % 86400;

    function formatTimeSec(secs) {
      const h = Math.floor(secs / 3600);
      const m = Math.floor((secs % 3600) / 60);
      const s = secs % 60;
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    const tStart = formatTimeSec(startSecs);
    const tEnd = formatTimeSec(endSecs);

    // Countdown logic
    const sysNow = new Date();
    const sysSecs = sysNow.getHours() * 3600 + sysNow.getMinutes() * 60 + sysNow.getSeconds();
    let deltaSecs = startSecs - sysSecs;
    if (deltaSecs < 0) {
      deltaSecs += 86400;
    }

    let countStr = "";
    if (deltaSecs < 60) {
      countStr = `DANS ~ ${deltaSecs} sec`;
    } else {
      const minVal = Math.floor(deltaSecs / 60);
      const secVal = deltaSecs % 60;
      countStr = `DANS ~ ${minVal}:${secVal.toString().padStart(2, "0")} min`;
    }

    // Target values
    let safeMult = 1.90 + (hashSeed % 95) / 100; // [1.90, 2.85]
    let peakMult = 5.20 + (hashSeed % 1650) / 100; // [5.20, 21.70]

    let confidence = 84.5 + (hashSeed % 140) / 10; // [84.5, 98.5]

    return {
      safeMultiplier: safeMult.toFixed(2),
      peakMultiplier: peakMult.toFixed(2),
      timeStart: tStart,
      timeEnd: tEnd,
      countdown: countStr,
      confidence: confidence.toFixed(1),
      timestamp: formatTimeSec(sysSecs),
      seedHash: `e${(hashSeed * 7).toString(16).padEnd(8, "0")}`
    };
  }


  // --- LOCALSTORAGE HISTORICAL LOGGER ---
  let historyLogs = JSON.parse(localStorage.getItem("cyberpredict_logs")) || [];

  function drawHistoryTable() {
    logsTableBody.innerHTML = "";
    if (historyLogs.length === 0) {
      logsTableBody.appendChild(rowEmpty);
      return;
    }

    historyLogs.slice().reverse().forEach((log, index) => {
      const tr = document.createElement("tr");
      tr.className = "border-b border-gray-900 hover:bg-gray-900/30 transition text-[11px]";

      const reverseIndex = historyLogs.length - index;
      const gameBadge = log.gameMode === "COSMOSX" 
        ? `<span class="px-1.5 py-0.5 rounded text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">COSMOSX</span>`
        : `<span class="px-1.5 py-0.5 rounded text-[9px] bg-red-500/10 text-red-400 border border-red-500/20 font-bold">AVIATOR</span>`;

      tr.innerHTML = `
        <td class="py-2.5 px-1 text-gray-500">#${reverseIndex}</td>
        <td class="py-2.5 px-1">${gameBadge}</td>
        <td class="py-2.5 px-1 font-mono text-gray-400">${log.seedHash}</td>
        <td class="py-2.5 px-1 text-gray-400">${log.refTime}</td>
        <td class="py-2.5 px-1 text-yellow-400 font-mono font-bold">${log.timeStart} - ${log.timeEnd}</td>
        <td class="py-2.5 px-1 text-cyan-400 font-mono font-bold">${log.peakMult}x</td>
        <td class="py-2.5 px-1 text-right">
          <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest font-semibold font-mono">
            SUCCÈS
          </span>
        </td>
      `;
      logsTableBody.appendChild(tr);
    });
  }
  drawHistoryTable();

  btnSaveLog.addEventListener("click", () => {
    playSound(sndClick);

    const logEntry = {
      gameMode: activeMode,
      refMult: multInput.value,
      refTime: `${selHour.value}:${selMinute.value}:${selSecond.value}`,
      timeStart: resTimeStart.textContent,
      timeEnd: resTimeEnd.textContent,
      peakMult: resPeakMult.textContent.replace("x", ""),
      safeMult: resSafeMult.textContent.replace("x", ""),
      seedHash: telemetrySeed.textContent,
      timestamp: new Date().toLocaleTimeString()
    };

    historyLogs.push(logEntry);
    localStorage.setItem("cyberpredict_logs", JSON.stringify(historyLogs));
    drawHistoryTable();

    // Visual button confirmation
    btnSaveLog.innerHTML = `<i data-lucide="check" class="h-3.5 w-3.5 text-emerald-400 animate-pulse"></i><span class="text-emerald-400 font-bold">Sauvegardé !</span>`;
    safeCreateIcons();
    setTimeout(() => {
      btnSaveLog.innerHTML = `<i data-lucide="bookmark-plus" class="h-3.5 w-3.5"></i><span>Enregistrer ce test d'interception</span>`;
      safeCreateIcons();
    }, 2000);
  });

  btnClearLogs.addEventListener("click", () => {
    playSound(sndClick);
    if (confirm("Effacer définitivement l'historique d'interception ?")) {
      historyLogs = [];
      localStorage.removeItem("cyberpredict_logs");
      drawHistoryTable();
    }
  });


  // --- FLIGHT SIMULATION HUD ENGINE (HIGH-FIDELITY CANVAS DRAWING) ---
  let animeId = null;
  let flightState = "IDLE"; // IDLE, COUNTDOWN, FLYING, EJECTED, CRASHED
  let currentMult = 1.00;
  let exitSafeMult = 1.00;
  let exitPeakMult = 1.00;
  let shakeIntensity = 0;
  let activeSpeedCoeff = 1.0;

  // Background state
  let scrollY = 0;
  let scrollX = 0;
  let starsFlight = [];
  let propsAngle = 0; // aviator propeller angle

  function resizeFlightCanvas() {
    activeFlightCanvas.width = flightCanvasContainer.clientWidth;
    activeFlightCanvas.height = flightCanvasContainer.clientHeight;
  }
  resizeFlightCanvas();
  new ResizeObserver(resizeFlightCanvas).observe(flightCanvasContainer);

  function initStarsFlight() {
    starsFlight = [];
    const count = activeMode === "COSMOSX" ? 70 : 40; // Nebulae vs clouds density
    for (let i = 0; i < count; i++) {
      starsFlight.push({
        x: Math.random() * activeFlightCanvas.width,
        y: Math.random() * activeFlightCanvas.height,
        size: Math.random() * (activeMode === "COSMOSX" ? 2 : 5) + 0.5, // stars vs vector clouds
        speed: Math.random() * 2 + 1
      });
    }
  }
  initStarsFlight();

  // HIGH PROD GRAPHICS RENDER
  function drawCosmosRocket(ctx, x, y, size, angle, thrusting) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    if (shakeIntensity > 0) {
      ctx.translate((Math.random() - 0.5) * shakeIntensity, (Math.random() - 0.5) * shakeIntensity);
    }

    // Exhaust thrust flame
    if (thrusting) {
      const grad = ctx.createRadialGradient(0, size * 0.8, 0, 0, size * 1.5, size * 0.4);
      grad.addColorStop(0, "rgba(255, 230, 0, 1)");
      grad.addColorStop(0.3, "rgba(6, 182, 212, 0.9)"); // Plasma style
      grad.addColorStop(0.7, "rgba(99, 102, 241, 0.4)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, size * 0.8, size * 0.6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Wings
    ctx.fillStyle = "#06b6d4";
    ctx.beginPath();
    ctx.moveTo(-size * 0.4, size * 0.4);
    ctx.lineTo(-size * 0.6, size * 0.6);
    ctx.lineTo(-size * 0.2, size * 0.4);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#06b6d4";
    ctx.beginPath();
    ctx.moveTo(size * 0.4, size * 0.4);
    ctx.lineTo(size * 0.6, size * 0.6);
    ctx.lineTo(size * 0.2, size * 0.4);
    ctx.closePath();
    ctx.fill();

    // Body
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-size * 0.25, -size * 0.4, size * 0.5, size * 0.8);

    // Red Nose
    ctx.fillStyle = "#6366f1";
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.8);
    ctx.lineTo(size * 0.25, -size * 0.4);
    ctx.lineTo(-size * 0.25, -size * 0.4);
    ctx.closePath();
    ctx.fill();

    // Cockpit
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.arc(0, -size * 0.1, size * 0.1, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawAviatorAirplane(ctx, x, y, size, thrusting) {
    ctx.save();
    ctx.translate(x, y);

    if (shakeIntensity > 0) {
      ctx.translate((Math.random() - 0.5) * shakeIntensity, (Math.random() - 0.5) * shakeIntensity);
    }

    // Flame exhaust jet trails
    if (thrusting) {
      const grad = ctx.createRadialGradient(-size * 0.8, size * 0.1, 0, -size * 1.5, size * 0.1, size * 0.4);
      grad.addColorStop(0, "rgba(239, 68, 68, 1)"); // Bright Red
      grad.addColorStop(0.4, "rgba(249, 115, 22, 0.8)"); // Orange
      grad.addColorStop(1, "rgba(0,0,0,0)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(-size * 0.8, size * 0.1, size * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Wings
    ctx.fillStyle = "#991b1b"; // Darker red
    ctx.beginPath();
    ctx.moveTo(-size * 0.1, -size * 0.1);
    ctx.lineTo(-size * 0.3, -size * 0.8);
    ctx.lineTo(size * 0.1, -size * 0.1);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#991b1b";
    ctx.beginPath();
    ctx.moveTo(-size * 0.1, size * 0.2);
    ctx.lineTo(-size * 0.3, size * 0.9);
    ctx.lineTo(size * 0.1, size * 0.2);
    ctx.closePath();
    ctx.fill();

    // Fuselage (Body of military red aviator plane)
    ctx.fillStyle = "#ef4444"; // Vivid Red
    ctx.beginPath();
    ctx.ellipse(0, size * 0.05, size * 0.7, size * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Stabilizers (Tail fins)
    ctx.fillStyle = "#7f1d1d";
    ctx.beginPath();
    ctx.moveTo(-size * 0.5, size * 0.05);
    ctx.lineTo(-size * 0.75, -size * 0.3);
    ctx.lineTo(-size * 0.65, size * 0.05);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-size * 0.5, size * 0.05);
    ctx.lineTo(-size * 0.75, size * 0.4);
    ctx.lineTo(-size * 0.65, size * 0.05);
    ctx.closePath();
    ctx.fill();

    // Cockpit dome
    ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(size * 0.1, -size * 0.05, size * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Propeller spinning visual blades
    propsAngle += 0.4;
    ctx.save();
    ctx.translate(size * 0.7, size * 0.05);
    ctx.rotate(propsAngle);
    ctx.strokeStyle = "rgba(200, 200, 200, 0.6)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.5);
    ctx.lineTo(0, size * 0.5);
    ctx.stroke();
    // Centered spinner cap
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }

  function triggerExplosionParticles(x, y) {
    particleList = [];
    const colorChoices = activeMode === "COSMOSX" 
      ? ["#06b6d4", "#6366f1", "#f59e0b"]
      : ["#ef4444", "#f97316", "#f59e0b"];

    for (let i = 0; i < 45; i++) {
      const ang = Math.random() * Math.PI * 2;
      const sp = Math.random() * 5 + 2;
      particleList.push({
        x: x,
        y: y,
        vx: Math.cos(ang) * sp,
        vy: Math.sin(ang) * sp,
        size: Math.random() * 4 + 2,
        color: colorChoices[i % colorChoices.length],
        alpha: 1.0,
        decay: Math.random() * 0.04 + 0.02
      });
    }
    return particleList;
  }

  let activeExplosions = [];
  let lastFrameTime = 0;

  function renderLoop(nowTime) {
    if (!lastFrameTime) lastFrameTime = nowTime;
    const dt = (nowTime - lastFrameTime) / 1000;
    lastFrameTime = nowTime;

    const w = activeFlightCanvas.width;
    const h = activeFlightCanvas.height;

    // Background clearing
    if (activeMode === "COSMOSX") {
      canvasCtx.fillStyle = "#020617"; // Cosmos darkness
    } else {
      canvasCtx.fillStyle = "#0b0c10"; // Aviator charcoal military grid
    }
    canvasCtx.fillRect(0, 0, w, h);

    // Vector grid line patterns
    canvasCtx.strokeStyle = activeMode === "COSMOSX" ? "rgba(99,102,241,0.06)" : "rgba(239,68,68,0.06)";
    canvasCtx.lineWidth = 1;
    
    // Horizontal lines scrolling
    const gridSpacing = 40;
    const hOffset = (activeMode === "COSMOSX" ? scrollY : scrollX) % gridSpacing;

    if (activeMode === "COSMOSX") {
      for (let y = hOffset; y < h; y += gridSpacing) {
        canvasCtx.beginPath();
        canvasCtx.moveTo(0, y);
        canvasCtx.lineTo(w, y);
        canvasCtx.stroke();
      }
      for (let x = 0; x < w; x += 50) {
        canvasCtx.beginPath();
        canvasCtx.moveTo(x, 0);
        canvasCtx.lineTo(x, h);
        canvasCtx.stroke();
      }
    } else {
      // Horizontal motion for Aviator plane
      for (let x = hOffset; x < w; x += gridSpacing) {
        canvasCtx.beginPath();
        canvasCtx.moveTo(x, 0);
        canvasCtx.lineTo(x, h);
        canvasCtx.stroke();
      }
      for (let y = 0; y < h; y += 40) {
        canvasCtx.beginPath();
        canvasCtx.moveTo(0, y);
        canvasCtx.lineTo(w, y);
        canvasCtx.stroke();
      }
    }

    // Scroll Starfields / Clouds
    const currentSpeed = flightState === "FLYING" ? 5 * activeSpeedCoeff : 0.4;
    for (let i = 0; i < starsFlight.length; i++) {
      const star = starsFlight[i];
      canvasCtx.fillStyle = activeMode === "COSMOSX" 
        ? `rgba(255, 255, 255, ${flightState === "FLYING" ? 0.8 : 0.3})`
        : `rgba(220, 220, 220, ${flightState === "FLYING" ? 0.35 : 0.15})`;

      canvasCtx.beginPath();
      if (activeMode === "COSMOSX") {
        canvasCtx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        star.y += star.speed * currentSpeed;
        if (star.y > h) {
          star.y = 0;
          star.x = Math.random() * w;
        }
      } else {
        // Horizontal cloud drift for Aviator
        canvasCtx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
        star.x -= star.speed * currentSpeed * 1.5;
        if (star.x < 0) {
          star.x = w;
          star.y = Math.random() * h;
        }
      }
      canvasCtx.fill();
    }

    // THE DRAW PATH OF THE PROGRESSION LINE
    if (flightState === "FLYING" || flightState === "EJECTED" || flightState === "CRASHED") {
      canvasCtx.strokeStyle = activeMode === "COSMOSX" ? "rgba(6, 182, 212, 0.7)" : "rgba(239, 68, 68, 0.7)";
      canvasCtx.lineWidth = 4;
      canvasCtx.shadowColor = activeMode === "COSMOSX" ? "rgba(6, 182, 212, 0.9)" : "rgba(239, 68, 68, 0.9)";
      canvasCtx.shadowBlur = 12;

      canvasCtx.beginPath();
      
      if (activeMode === "COSMOSX") {
        // Curved line launching upwards
        canvasCtx.moveTo(40, h - 40);
        canvasCtx.quadraticCurveTo((w/2 + 40)/2, h - 40, w / 2, h - 130);
      } else {
        // Aviator parabolic line flying horizontally to the right
        canvasCtx.moveTo(40, h - 40);
        canvasCtx.quadraticCurveTo(w / 3, h - 40, w - 120, h / 2);
      }
      canvasCtx.stroke();
      canvasCtx.shadowBlur = 0; // restore
    }

    // OBJECT COORDINATES
    const cosmosXPos = w / 2;
    const cosmosYPos = h - 130;

    const aviatorXPos = w - 120;
    const aviatorYPos = h / 2;

    // ENGINE FLOW STATE
    if (flightState === "IDLE") {
      if (activeMode === "COSMOSX") {
        drawCosmosRocket(canvasCtx, cosmosXPos, h - 80, 42, 0, false);
      } else {
        drawAviatorAirplane(canvasCtx, 80, h - 60, 24, false);
      }
    } 
    else if (flightState === "COUNTDOWN") {
      shakeIntensity = 2.0;
      if (activeMode === "COSMOSX") {
        drawCosmosRocket(canvasCtx, cosmosXPos, h - 80, 42, 0, true);
      } else {
        drawAviatorAirplane(canvasCtx, 80, h - 60, 24, true);
      }
    } 
    else if (flightState === "FLYING") {
      // Accelerate flight multiplier calculations
      const step = 0.04 * currentMult + 0.02;
      currentMult += step * 0.15 * activeSpeedCoeff;

      // Increment scroll indexes
      scrollY += 12;
      scrollX += 12;

      // Apply telemetry updates
      telemetryMult.textContent = `${currentMult.toFixed(2)}x`;
      largeMultDisplay.textContent = `${currentMult.toFixed(2)}x`;

      // Tick sound effect on progression steps
      if (Math.floor(currentMult * 10) % 3 === 0) {
        playSound(sndTick);
      }

      shakeIntensity = Math.min(5, 1 + currentMult * 0.12);

      // Render Active Flyer
      if (activeMode === "COSMOSX") {
        drawCosmosRocket(canvasCtx, cosmosXPos, cosmosYPos, 42, 0, true);
      } else {
        drawAviatorAirplane(canvasCtx, aviatorXPos, aviatorYPos, 26, true);
      }

      // Check if Safe exit point is accomplished
      if (currentMult >= exitSafeMult && currentMult - (step * 0.15 * activeSpeedCoeff) < exitSafeMult) {
        flightStatusIndicator.textContent = "COEFFICIENT SÉCURISÉ PASSÉ ! RETRAIT CONSEILLÉ !";
        flightStatusIndicator.className = activeMode === "COSMOSX" ? "text-cyan-400 font-bold text-xs" : "text-yellow-500 font-bold text-xs";
      }

      // Check if maximum cycle crash peak has been reached
      if (currentMult >= exitPeakMult) {
        flightState = "CRASHED";
        playSound(sndFail);
        
        const boomX = activeMode === "COSMOSX" ? cosmosXPos : aviatorXPos;
        const boomY = activeMode === "COSMOSX" ? cosmosYPos : aviatorYPos;
        activeExplosions = triggerExplosionParticles(boomX, boomY);

        shakeIntensity = 18;
        setTimeout(() => { shakeIntensity = 0; }, 400);

        // Display results banner
        flightBanner.classList.remove("hidden");
        flightBannerTitle.textContent = "CRASH DE LA FUSÉE / PLANE";
        flightBannerTitle.className = "text-xs font-black uppercase tracking-widest text-red-500 font-mono";
        flightBannerMultiplier.textContent = `${exitPeakMult.toFixed(2)}x`;
        flightBannerMultiplier.className = "text-3xl font-black font-mono text-white mt-1";
        flightBannerDesc.textContent = "Analyse : Le flux WebSocket s'est rompu. Fin du vol.";
      }
    } 
    else if (flightState === "CRASHED") {
      let activeParts = false;
      for (let i = 0; i < activeExplosions.length; i++) {
        const p = activeExplosions[i];
        if (p.alpha > 0) {
          activeParts = true;
          canvasCtx.fillStyle = p.color;
          canvasCtx.globalAlpha = p.alpha;
          canvasCtx.beginPath();
          canvasCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          canvasCtx.fill();

          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= p.decay;
        }
      }
      canvasCtx.globalAlpha = 1.0;

      flightStatusIndicator.textContent = `CRASH POINT ENREGISTRÉ À ${exitPeakMult.toFixed(2)}x`;
      flightStatusIndicator.className = "text-red-500 font-bold text-xs animate-pulse";
    }

    animeId = requestAnimationFrame(renderLoop);
  }

  function startVisualFlight(pSafe, pPeak) {
    if (animeId) {
      cancelAnimationFrame(animeId);
    }

    flightState = "COUNTDOWN";
    currentMult = 1.00;
    exitSafeMult = parseFloat(pSafe);
    exitPeakMult = parseFloat(pPeak);
    flightBanner.classList.add("hidden");

    flightStatusIndicator.textContent = "SYNCHRONISATION AU SERVEUR...";
    largeMultDisplay.textContent = "IGNITION";

    // Speed modifiers to ensure very high multipliers complete in under 12 seconds
    if (exitPeakMult > 15) {
      activeSpeedCoeff = 2.4;
    } else if (exitPeakMult > 8) {
      activeSpeedCoeff = 1.5;
    } else {
      activeSpeedCoeff = 1.0;
    }

    // Set engine labels
    txtFlightEngineStatus.textContent = activeMode === "COSMOSX" 
      ? "SYSTEM ENGINE: SYNCHRONIZING TO COSMOSX PROTOCOL"
      : "PROPELLER ENGINES: COMPRESSION CRITICAL - IGNITING";

    setTimeout(() => {
      flightState = "FLYING";
      flightStatusIndicator.textContent = activeMode === "COSMOSX" ? "SIMULATION COSMOS EN VOL" : "SIMULATION AVIATOR EN VOL";
      playSound(sndSuccess);
    }, 1200);

    lastFrameTime = 0;
    renderLoop(0);
  }


  // --- FORM SUBMIT ACTIONS ---
  radarPredictionForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const refVal = multInput.value;
    const hourVal = selHour.value;
    const minVal = selMinute.value;
    const secVal = selSecond.value;

    if (parseFloat(refVal) < 2.00) {
      alert("Le multiplicateur de référence doit être supérieur ou égal à 2.00x.");
      return;
    }

    // Display Report Loader
    reportPlaceholder.classList.add("hidden");
    reportActive.classList.add("hidden");
    reportLoader.classList.remove("hidden");

    // Dynamic processing step labels for authentic simulation
    const steps = activeMode === "COSMOSX" 
      ? [
          "Connexion furtive au WebSocket CosmosX...",
          "Extraction de la graine cryptographique serveur...",
          "Calcul de l'offset de cycle temporelle de 14.5m...",
          "Génération du modèle de probabilité de pointe..."
        ]
      : [
          "Drapeau vert : Connexion WebSocket Aviator...",
          "Négociation SSL/TLS avec signature de navigateur JA3...",
          "Calcul du coefficient d'intervalle Aviator de 13m...",
          "Ajustement du taux de confiance des graines..."
        ];

    let currentIdx = 0;
    const intervalTimer = setInterval(() => {
      if (currentIdx < steps.length) {
        loaderSubTxt.textContent = steps[currentIdx];
        currentIdx++;
      } else {
        clearInterval(intervalTimer);

        // Compute results
        const result = computeDeterministicPrediction(refVal, hourVal, minVal, secVal, activeMode);

        // Populate fields
        resSafeMult.textContent = `${result.safeMultiplier}x`;
        resPeakMult.textContent = `${result.peakMultiplier}x`;
        resCountdown.textContent = result.countdown;
        resTimeStart.textContent = result.timeStart;
        resTimeEnd.textContent = result.timeEnd;
        resConfidence.textContent = `${result.confidence}%`;
        resConfidenceBar.style.width = `${result.confidence}%`;
        reportGenerationTime.textContent = `Capturé à ${result.timestamp}`;

        // Telemetry HUD synchronization
        telemetrySeed.textContent = result.seedHash;

        // Hide Loader
        reportLoader.classList.add("hidden");
        reportActive.classList.remove("hidden");

        // Kick off flight visual canvas simulator
        startVisualFlight(result.safeMultiplier, result.peakMultiplier);
      }
    }, 450);
  });

}

// Self-healing state-tolerant bootloader
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
