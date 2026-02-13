(function () {
  window.RuLettersApp = window.RuLettersApp || {};

  function LettersUI(tts) {
    this.tts = tts;

    this.elGrid = document.getElementById("lettersGrid");
    this.elVoiceSelect = document.getElementById("voiceSelect");
    this.elReloadVoicesBtn = document.getElementById("reloadVoicesBtn");
    this.elStopBtn = document.getElementById("stopBtn");
    this.elTestBtn = document.getElementById("testBtn");
    this.elRate = document.getElementById("rate");
    this.elPitch = document.getElementById("pitch");
    this.elStatus = document.getElementById("statusTag");

    this.currentBtn = null;
  }

  LettersUI.prototype.setStatus = function (text) {
    this.elStatus.textContent = text;
  };

  LettersUI.prototype.clearPlaying = function () {
    if (this.currentBtn) this.currentBtn.classList.remove("playing");
    this.currentBtn = null;
  };

  LettersUI.prototype.buildGrid = function () {
    var LETTERS = window.RuLettersApp.LETTERS || [];
    this.elGrid.innerHTML = "";

    for (var i = 0; i < LETTERS.length; i++) {
      var L = LETTERS[i];

      var card = document.createElement("div");
      card.className = "card";

      var btn = document.createElement("button");
      btn.className = "letterBtn";
      btn.type = "button";
      btn.dataset.say = L.nameRu;

      var glyph = document.createElement("div");
      glyph.className = "glyph";
      glyph.textContent = L.upper + " " + L.lower;

      var name = document.createElement("div");
      name.className = "name";
      name.textContent = "讀法：" + L.nameRu;

      var hint = document.createElement("div");
      hint.className = "hint";
      hint.textContent = "提示：" + L.hint;

      btn.appendChild(glyph);
      btn.appendChild(name);
      btn.appendChild(hint);

      btn.addEventListener("click", this.playLetter.bind(this, btn));

      card.appendChild(btn);
      this.elGrid.appendChild(card);
    }
  };

  LettersUI.prototype.populateVoices = function () {
    var list = this.tts.loadVoices();
    this.elVoiceSelect.innerHTML = "";

    if (!list.length) {
      var opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "無可用語音";
      this.elVoiceSelect.appendChild(opt);
      this.setStatus("找不到語音");
      return;
    }

    for (var i = 0; i < list.length; i++) {
      var v = list[i];
      var opt2 = document.createElement("option");
      opt2.value = String(i);
      opt2.textContent = v.name + " (" + v.lang + ")";
      this.elVoiceSelect.appendChild(opt2);
    }

    var hasRu = list.some(function (v) {
      return (v.lang || "").toLowerCase().indexOf("ru") === 0;
    });

    this.elVoiceSelect.selectedIndex = 0;
    this.setStatus(hasRu ? "已選 ru 語音" : "未找到 ru 語音");
  };

  LettersUI.prototype.getSelectedVoice = function () {
    var idx = Number(this.elVoiceSelect.value);
    return this.tts.getVoiceByIndex(idx);
  };

  LettersUI.prototype.playLetter = function (btn) {
    var text = btn.dataset.say || "";
    var voice = this.getSelectedVoice();

    this.clearPlaying();
    this.currentBtn = btn;
    this.currentBtn.classList.add("playing");

    this.tts.speak({
      text: text,
      voice: voice,
      rate: this.elRate.value,
      pitch: this.elPitch.value,
      onEnd: this.clearPlaying.bind(this),
      onError: this.clearPlaying.bind(this)
    });
  };

  LettersUI.prototype.bindControls = function () {
    var self = this;

    this.elReloadVoicesBtn.addEventListener("click", function () {
      self.populateVoices();
      self.setStatus("已重新載入");
    });

    this.elStopBtn.addEventListener("click", function () {
      self.tts.stop();
      self.clearPlaying();
    });

    this.elTestBtn.addEventListener("click", function () {
      self.clearPlaying();
      self.tts.speak({
        text: "Привет",
        voice: self.getSelectedVoice(),
        rate: self.elRate.value,
        pitch: self.elPitch.value
      });
    });
  };

  window.RuLettersApp.LettersUI = LettersUI;
})();
