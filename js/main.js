(function () {
  window.RuLettersApp = window.RuLettersApp || {};

  var tts = new window.RuLettersApp.TTS({
    onStatus: function (text) {
      var el = document.getElementById("statusTag");
      if (el) el.textContent = text;
    }
  });

  var ui = new window.RuLettersApp.LettersUI(tts);

  function init() {
    ui.buildGrid();
    ui.bindControls();
    ui.populateVoices();

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
