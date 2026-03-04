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

    this.elQuizPrompt = document.getElementById("quizPrompt");
    this.elQuizOptions = document.getElementById("quizOptions");
    this.elQuizFeedback = document.getElementById("quizFeedback");

    this.elVocabGrid = document.getElementById("vocabGrid");
    this.elGrammarList = document.getElementById("grammarList");

    this.currentBtn = null;
    this.quizAnswer = null;
    this.quizLocked = false;
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

  LettersUI.prototype.buildVocab = function () {
    var vocabList = window.RuLettersApp.BASIC_VOCAB || [];
    this.elVocabGrid.innerHTML = "";

    for (var i = 0; i < vocabList.length; i++) {
      var vocabItem = vocabList[i];
      var card = document.createElement("button");
      card.className = "vocabCard";
      card.type = "button";
      card.dataset.say = vocabItem.word;

      var word = document.createElement("div");
      word.className = "vocabWord";
      word.textContent = vocabItem.word;

      var translit = document.createElement("div");
      translit.className = "vocabTranslit";
      translit.textContent = vocabItem.translit;

      var meaning = document.createElement("div");
      meaning.className = "vocabMeaning";
      meaning.textContent = vocabItem.meaning;

      card.appendChild(word);
      card.appendChild(translit);
      card.appendChild(meaning);
      card.addEventListener("click", this.playVocab.bind(this, card));

      this.elVocabGrid.appendChild(card);
    }
  };

  LettersUI.prototype.buildGrammar = function () {
    var grammarRules = window.RuLettersApp.GRAMMAR_RULES || [];
    this.elGrammarList.innerHTML = "";

    for (var i = 0; i < grammarRules.length; i++) {
      var grammarRule = grammarRules[i];
      var card = document.createElement("div");
      card.className = "grammarCard";

      var title = document.createElement("h3");
      title.textContent = grammarRule.title;

      var list = document.createElement("ul");

      for (var j = 0; j < grammarRule.points.length; j++) {
        var point = document.createElement("li");
        point.textContent = grammarRule.points[j];
        list.appendChild(point);
      }

      card.appendChild(title);
      card.appendChild(list);
      this.elGrammarList.appendChild(card);
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

  LettersUI.prototype.speakText = function (text, onEnd) {
    this.tts.speak({
      text: text,
      voice: this.getSelectedVoice(),
      rate: this.elRate.value,
      pitch: this.elPitch.value,
      onEnd: onEnd
    });
  };

  LettersUI.prototype.playLetter = function (btn) {
    var text = btn.dataset.say || "";

    this.clearPlaying();
    this.currentBtn = btn;
    this.currentBtn.classList.add("playing");

    this.speakText(text, this.clearPlaying.bind(this));
  };

  LettersUI.prototype.playVocab = function (btn) {
    var text = btn.dataset.say || "";
    this.speakText(text);
  };

  LettersUI.prototype.pickRandomItems = function (source, neededCount, skipItem) {
    var list = [];

    for (var i = 0; i < source.length; i++) {
      if (skipItem && source[i].upper === skipItem.upper) continue;
      list.push(source[i]);
    }

    for (var j = list.length - 1; j > 0; j--) {
      var k = Math.floor(Math.random() * (j + 1));
      var tmp = list[j];
      list[j] = list[k];
      list[k] = tmp;
    }

    return list.slice(0, neededCount);
  };

  LettersUI.prototype.nextQuiz = function () {
    var letters = window.RuLettersApp.LETTERS || [];
    var randomIndex = Math.floor(Math.random() * letters.length);
    var answerLetter = letters[randomIndex];
    var options = this.pickRandomItems(letters, 3, answerLetter);

    options.push(answerLetter);
    options = this.pickRandomItems(options, options.length);

    this.quizAnswer = answerLetter.hint;
    this.quizLocked = false;
    this.elQuizPrompt.textContent = answerLetter.upper;
    this.elQuizOptions.innerHTML = "";
    this.elQuizFeedback.textContent = "請選擇答案。";

    for (var i = 0; i < options.length; i++) {
      var option = options[i];
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quizOption";
      btn.textContent = option.hint;
      btn.dataset.value = option.hint;
      btn.addEventListener("click", this.handleQuizAnswer.bind(this, btn));
      this.elQuizOptions.appendChild(btn);
    }
  };

  LettersUI.prototype.handleQuizAnswer = function (btn) {
    if (this.quizLocked) return;

    var isCorrect = btn.dataset.value === this.quizAnswer;
    if (isCorrect) {
      this.quizLocked = true;
      btn.classList.add("correct");
      this.elQuizFeedback.textContent = "答對了！下一題...";
      setTimeout(this.nextQuiz.bind(this), 1000);
      return;
    }

    btn.classList.add("wrong");
    this.elQuizFeedback.textContent = "再試一次。";
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
      self.speakText("Привет");
    });
  };

  window.RuLettersApp.LettersUI = LettersUI;
})();
