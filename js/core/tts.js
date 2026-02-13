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

    var ut = new SpeechSynthesisUtterance(args.text);
    if (args.voice) {
      ut.voice = args.voice;
      ut.lang = args.voice.lang || "ru-RU";
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
    this.onStatus("播放中：" + args.text);
  };

  window.RuLettersApp.TTS = TTS;
})();
