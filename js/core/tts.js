(function () {
  window.RuLettersApp = window.RuLettersApp || {};

  function TTS(opts) {
    this.onStatus = (opts && opts.onStatus) ? opts.onStatus : function () {};
    this.voices = [];
    this.sortedVoices = [];
  }

  TTS.prototype.isSupported = function () {
    return "speechSynthesis" in window;
  };

  TTS.prototype.loadVoices = function () {
    if (!this.isSupported()) return [];
    this.voices = window.speechSynthesis.getVoices() || [];
    var ru = this.voices.filter(function (v) {
      return (v.lang || "").toLowerCase().indexOf("ru") === 0;
    });
    this.sortedVoices = ru.concat(this.voices.filter(function (v) { return ru.indexOf(v) < 0; }));
    return this.sortedVoices;
  };

  TTS.prototype.getVoiceByIndex = function (index) {
    if (!this.sortedVoices.length) this.loadVoices();
    return this.sortedVoices[index] || this.sortedVoices[0] || null;
  };

  TTS.prototype.getFirstRuVoice = function () {
    if (!this.sortedVoices.length) this.loadVoices();
    for (var i = 0; i < this.sortedVoices.length; i++) {
      var v = this.sortedVoices[i];
      if ((v.lang || "").toLowerCase().indexOf("ru") === 0) return v;
    }
    return null;
  };

  function hasCyrillic(text) {
    return /[А-Яа-яЁё]/.test(text || "");
  }

  // 把容易被 TTS 唸歪的「字母名稱片語」轉成更穩的說法
  function normalizeNameForTTS(text) {
    var t = String(text || "").trim();
    var low = t.toLowerCase();

    // 1) Й: 讓 TTS 明確吐出 /j/，再說名稱
    if (low === "и краткое") {
      return "й. И краткое. Йод.";
    }

    // 2) Ъ: 避免 ё 造成某些語音誤讀，並用例詞讓學習者聽懂用途
    // 原字串常見是 "твёрдый знак"
    if (low === "твёрдый знак" || low === "твердый знак") {
      return "твердый знак. Объект.";
    }

    // 3) Ь: 例詞帶出軟化感
    if (low === "мягкий знак") {
      return "мягкий знак. День.";
    }

    return t;
  }

  // 若使用者選到非俄語 voice，但內容是西里爾字母，優先切到 ru voice
  TTS.prototype.pickBestVoice = function (requestedVoice, text) {
    var v = requestedVoice || null;
    if (hasCyrillic(text)) {
      var vLang = (v && v.lang) ? v.lang.toLowerCase() : "";
      if (v && vLang.indexOf("ru") !== 0) {
        var ru = this.getFirstRuVoice();
        if (ru) return ru;
      }
      if (!v) {
        var ru2 = this.getFirstRuVoice();
        if (ru2) return ru2;
      }
    }
    return v;
  };

  TTS.prototype.stop = function () {
    if (!this.isSupported()) return;
    window.speechSynthesis.cancel();
    this.onStatus("已停止");
  };

  TTS.prototype.speak = function (args) {
    if (!this.isSupported()) {
      alert("此瀏覽器不支援 SpeechSynthesis，建議改用 Chrome/Edge。");
      return;
    }

    window.speechSynthesis.cancel();

    var rawText = args.text;
    var text = normalizeNameForTTS(rawText);

    var voice = this.pickBestVoice(args.voice, text);

    var ut = new SpeechSynthesisUtterance(text);
    if (voice) {
      ut.voice = voice;
      ut.lang = voice.lang || "ru-RU";
    } else {
      ut.lang = "ru-RU";
    }

    ut.rate = Number(args.rate || 1);
    ut.pitch = Number(args.pitch || 1);

    ut.onend = function () { if (args.onEnd) args.onEnd(); };
    ut.onerror = function () {
      if (args.onError) args.onError();
      this.onStatus("播放失敗");
    }.bind(this);

    window.speechSynthesis.speak(ut);
    this.onStatus("播放中：" + text);
  };

  window.RuLettersApp.TTS = TTS;
})();
