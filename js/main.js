(function () {
  window.RuLettersApp = window.RuLettersApp || {};

  var THEME_KEY = "ruletters.theme";
  var SYSTEM_THEME = "system";
  var LIGHT_THEME = "light";
  var DARK_THEME = "dark";

  var tts = new window.RuLettersApp.TTS({
    onStatus: function (text) {
      var el = document.getElementById("statusTag");
      if (el) el.textContent = text;
    }
  });

  var ui = new window.RuLettersApp.LettersUI(tts);
  var themeTimerId = null;
  var batteryManager = null;

  function getThemeSelectElement() {
    return document.getElementById("themeSelect");
  }

  function getSavedThemeMode() {
    var savedMode = localStorage.getItem(THEME_KEY);
    if (savedMode === LIGHT_THEME || savedMode === DARK_THEME || savedMode === SYSTEM_THEME) return savedMode;
    return SYSTEM_THEME;
  }

  function setThemeMode(themeMode) {
    localStorage.setItem(THEME_KEY, themeMode);
    applyTheme(themeMode);
  }

  function setThemeAppearance(themeName) {
    document.documentElement.setAttribute("data-theme", themeName);
  }

  function isNightTime() {
    var hours = new Date().getHours();
    return hours >= 19 || hours < 7;
  }

  function isSystemDarkPreferred() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function isPowerSavingLikely() {
    if (!batteryManager) return false;
    return !batteryManager.charging && batteryManager.level <= 0.2;
  }

  function getSystemThemeAppearance() {
    return (isNightTime() || isSystemDarkPreferred() || isPowerSavingLikely()) ? DARK_THEME : LIGHT_THEME;
  }

  function applyTheme(themeMode) {
    var themeAppearance = themeMode === SYSTEM_THEME ? getSystemThemeAppearance() : themeMode;
    setThemeAppearance(themeAppearance);

    var themeSelect = getThemeSelectElement();
    if (themeSelect && themeSelect.value !== themeMode) themeSelect.value = themeMode;
  }

  function bindThemeControl() {
    var themeSelect = getThemeSelectElement();
    if (!themeSelect) return;

    themeSelect.value = getSavedThemeMode();
    themeSelect.addEventListener("change", function () {
      setThemeMode(themeSelect.value || SYSTEM_THEME);
    });
  }

  function bindSystemThemeWatcher() {
    if (!window.matchMedia) return;
    var darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
    var refreshSystemTheme = function () {
      if (getSavedThemeMode() === SYSTEM_THEME) applyTheme(SYSTEM_THEME);
    };

    if (darkQuery.addEventListener) {
      darkQuery.addEventListener("change", refreshSystemTheme);
    } else if (darkQuery.addListener) {
      darkQuery.addListener(refreshSystemTheme);
    }

    document.addEventListener("visibilitychange", refreshSystemTheme);
    window.addEventListener("focus", refreshSystemTheme);

    if (themeTimerId) clearInterval(themeTimerId);
    themeTimerId = setInterval(refreshSystemTheme, 60 * 1000);
  }

  function bindBatteryWatcher() {
    if (!navigator.getBattery) return;

    navigator.getBattery().then(function (battery) {
      batteryManager = battery;

      var refreshSystemTheme = function () {
        if (getSavedThemeMode() === SYSTEM_THEME) applyTheme(SYSTEM_THEME);
      };

      battery.addEventListener("chargingchange", refreshSystemTheme);
      battery.addEventListener("levelchange", refreshSystemTheme);
      refreshSystemTheme();
    }).catch(function () {
      batteryManager = null;
    });
  }

  function initTheme() {
    bindThemeControl();
    applyTheme(getSavedThemeMode());
    bindSystemThemeWatcher();
    bindBatteryWatcher();
  }

  function init() {
    ui.buildGrid();
    ui.buildVocab();
    ui.buildGrammar();
    ui.nextQuiz();
    ui.bindControls();
    ui.populateVoices();
    initTheme();

    if (tts.isSupported()) {
      window.speechSynthesis.addEventListener("voiceschanged", function () {
        ui.populateVoices();
        ui.setStatus("語音已更新");
      });

      setTimeout(function () { ui.populateVoices(); }, 250);
      setTimeout(function () { ui.populateVoices(); }, 1000);
    } else {
      ui.setStatus("不支援 TTS");
    }
  }

  init();
})();
