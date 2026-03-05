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
    this.elQuizHelp = document.getElementById("quizHelp");
    this.elQuizMode = document.getElementById("quizMode");
    this.elNextQuizBtn = document.getElementById("nextQuizBtn");
    this.elQuizTimedScoreBtn = document.getElementById("quizTimedScoreBtn");
    this.elQuizResetScoreBtn = document.getElementById("quizResetScoreBtn");
    this.elQuizPlayPromptBtn = document.getElementById("quizPlayPromptBtn");
    this.elQuizScore = document.getElementById("quizScore");
    this.elQuizStreak = document.getElementById("quizStreak");
    this.elQuizTimedStatus = document.getElementById("quizTimedStatus");

    this.elQuizHistoryBtn = document.getElementById("quizHistoryBtn");
    this.elQuizHistoryDialog = document.getElementById("quizHistoryDialog");
    this.elQuizHistoryLimit = document.getElementById("quizHistoryLimit");
    this.elQuizHistoryApplyBtn = document.getElementById("quizHistoryApplyBtn");
    this.elQuizHistoryClearBtn = document.getElementById("quizHistoryClearBtn");
    this.elQuizHistoryList = document.getElementById("quizHistoryList");

    this.elVocabGrid = document.getElementById("vocabGrid");
    this.elGrammarList = document.getElementById("grammarList");

    this.elQuickNav = document.querySelector(".quickNav");
    this.elTabLinks = document.querySelectorAll(".quickNav a");
    this.elTabPanels = document.querySelectorAll(".tab-content");

    this.currentBtn = null;
    this.quizAnswer = null;
    this.quizLocked = false;
    this.quizCurrentLetter = null;
    this.quizScore = 0;
    this.quizStreak = 0;
    this.quizHistoryLimit = 20;
    this.quizHistory = [];
    this.quizOptionTapStats = {};
    this.quizTimedDurationMs = 90 * 1000;
    this.quizTimedModeActive = false;
    this.quizTimedCorrectCount = 0;
    this.quizTimedEndAt = 0;
    this.quizTimedTimerId = null;
  }

  LettersUI.prototype.setStatus = function (text) {
    this.elStatus.textContent = text;
  };

  LettersUI.prototype.clearPlaying = function () {
    if (this.currentBtn) this.currentBtn.classList.remove("playing");
    this.currentBtn = null;
  };

  LettersUI.prototype.buildGrid = function () {
    var letters = window.RuLettersApp.LETTERS || [];
    this.elGrid.innerHTML = "";

    for (var i = 0; i < letters.length; i++) {
      var letter = letters[i];
      var card = document.createElement("div");
      card.className = "card";

      var btn = document.createElement("button");
      btn.className = "letterBtn";
      btn.type = "button";
      btn.dataset.say = letter.soundRu || letter.lower;

      var glyph = document.createElement("div");
      glyph.className = "glyph";
      glyph.textContent = letter.upper + " " + letter.lower;

      var name = document.createElement("div");
      name.className = "name";
      name.textContent = "讀法：" + letter.nameRu;

      var hint = document.createElement("div");
      hint.className = "hint";
      hint.textContent = "提示：" + letter.hint;

      btn.appendChild(glyph);
      btn.appendChild(name);
      btn.appendChild(hint);
      btn.addEventListener("click", this.playLetter.bind(this, btn));

      card.appendChild(btn);
      this.elGrid.appendChild(card);
    }
  };

  LettersUI.prototype.groupVocabByCategory = function (vocabList) {
    var grouped = {};

    for (var i = 0; i < vocabList.length; i++) {
      var vocabItem = vocabList[i];
      var categoryName = vocabItem.category || "未分類";
      if (!grouped[categoryName]) grouped[categoryName] = [];
      grouped[categoryName].push(vocabItem);
    }

    return grouped;
  };

  LettersUI.prototype.buildVocab = function () {
    var vocabList = window.RuLettersApp.BASIC_VOCAB || [];
    var groupedVocab = this.groupVocabByCategory(vocabList);
    var categories = Object.keys(groupedVocab);

    this.elVocabGrid.innerHTML = "";

    for (var i = 0; i < categories.length; i++) {
      var categoryName = categories[i];
      var categorySection = document.createElement("section");
      categorySection.className = "vocabCategory";

      var categoryTitle = document.createElement("h3");
      categoryTitle.className = "vocabCategoryTitle";
      categoryTitle.textContent = categoryName;
      categorySection.appendChild(categoryTitle);

      var categoryGrid = document.createElement("div");
      categoryGrid.className = "vocabCategoryGrid";

      var categoryItems = groupedVocab[categoryName];
      for (var j = 0; j < categoryItems.length; j++) {
        var vocabItem = categoryItems[j];
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

        categoryGrid.appendChild(card);
      }

      categorySection.appendChild(categoryGrid);
      this.elVocabGrid.appendChild(categorySection);
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
      card.appendChild(title);

      if (grammarRule.overview) {
        var overview = document.createElement("p");
        overview.className = "grammarOverview";
        overview.textContent = grammarRule.overview;
        card.appendChild(overview);
      }

      var list = document.createElement("ul");
      var points = grammarRule.points || [];

      for (var j = 0; j < points.length; j++) {
        var point = points[j];
        var item = document.createElement("li");

        if (typeof point === "string") {
          item.textContent = point;
        } else {
          var rule = document.createElement("strong");
          rule.textContent = point.rule || "";

          item.appendChild(rule);

          if (point.example) {
            var example = document.createElement("div");
            example.className = "grammarExample";
            example.textContent = point.example;
            item.appendChild(example);
          }
        }

        list.appendChild(item);
      }

      card.appendChild(list);
      this.elGrammarList.appendChild(card);
    }
  };

  LettersUI.prototype.switchTab = function (targetId) {
    if (!targetId) return;

    for (var i = 0; i < this.elTabPanels.length; i++) {
      var panel = this.elTabPanels[i];
      var active = panel.id === targetId;
      panel.classList.toggle("active", active);
      panel.classList.toggle("hidden", !active);
    }

    for (var j = 0; j < this.elTabLinks.length; j++) {
      var link = this.elTabLinks[j];
      var href = (link.getAttribute("href") || "").replace("#", "");
      link.classList.toggle("active", href === targetId);
    }
  };

  LettersUI.prototype.bindTabs = function () {
    var self = this;
    if (!this.elQuickNav) return;

    this.elQuickNav.addEventListener("click", function (event) {
      var target = event.target;
      if (!target || target.tagName !== "A") return;

      var targetId = (target.getAttribute("href") || "").replace("#", "");
      if (!targetId) return;

      event.preventDefault();
      self.switchTab(targetId);
    });

    this.switchTab("lettersSection");
  };

  LettersUI.prototype.populateVoices = function () {
    var voiceList = this.tts.loadVoices();
    this.elVoiceSelect.innerHTML = "";

    if (!voiceList.length) {
      var emptyOption = document.createElement("option");
      emptyOption.value = "";
      emptyOption.textContent = "無可用語音";
      this.elVoiceSelect.appendChild(emptyOption);
      this.setStatus("找不到語音");
      return;
    }

    for (var i = 0; i < voiceList.length; i++) {
      var voice = voiceList[i];
      var voiceOption = document.createElement("option");
      voiceOption.value = String(i);
      voiceOption.textContent = voice.name + " (" + voice.lang + ")";
      this.elVoiceSelect.appendChild(voiceOption);
    }

    var hasRu = voiceList.some(function (voiceItem) {
      return (voiceItem.lang || "").toLowerCase().indexOf("ru") === 0;
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

  LettersUI.prototype.playQuizPromptAudio = function () {
    if (!this.quizCurrentLetter) return;
    var promptPronunciation = this.quizCurrentLetter.soundRu || this.quizCurrentLetter.lower || "";
    if (promptPronunciation) this.speakText(promptPronunciation);
  };

  LettersUI.prototype.pickRandomItems = function (source, neededCount, skipItem) {
    var pool = [];
    for (var i = 0; i < source.length; i++) {
      if (skipItem && source[i].upper === skipItem.upper) continue;
      pool.push(source[i]);
    }

    for (var j = pool.length - 1; j > 0; j--) {
      var randomIndex = Math.floor(Math.random() * (j + 1));
      var current = pool[j];
      pool[j] = pool[randomIndex];
      pool[randomIndex] = current;
    }

    return pool.slice(0, neededCount);
  };

  LettersUI.prototype.getQuizConfig = function (mode) {
    if (mode === "hint_to_letter") {
      return {
        prompt: function (letter) { return letter.nameRu; },
        answer: function (letter) { return letter.upper; },
        helpText: "看到英文讀音後，選出正確字母。"
      };
    }

    return {
      prompt: function (letter) { return letter.upper; },
      answer: function (letter) { return letter.nameRu; },
      helpText: "看到字母後，選出正確英文讀音。"
    };
  };

  LettersUI.prototype.updateQuizStats = function () {
    if (this.elQuizScore) this.elQuizScore.textContent = String(this.quizScore);
    if (this.elQuizStreak) this.elQuizStreak.textContent = String(this.quizStreak);
  };

  LettersUI.prototype.updateTimedScoreUi = function () {
    if (!this.elQuizTimedStatus || !this.elQuizTimedScoreBtn) return;

    if (!this.quizTimedModeActive) {
      this.elQuizTimedStatus.textContent = "限時計分：未開始";
      this.elQuizTimedStatus.classList.remove("active");
      this.elQuizTimedScoreBtn.textContent = "開始 1分30秒計分";
      return;
    }

    var remainingMs = Math.max(0, this.quizTimedEndAt - Date.now());
    var seconds = Math.ceil(remainingMs / 1000);
    this.elQuizTimedStatus.textContent = "限時計分：剩 " + seconds + " 秒，答對 " + this.quizTimedCorrectCount + " 題";
    this.elQuizTimedStatus.classList.add("active");
    this.elQuizTimedScoreBtn.textContent = "停止計分";
  };

  LettersUI.prototype.stopTimedScore = function (isAutoFinished) {
    if (this.quizTimedTimerId) {
      clearInterval(this.quizTimedTimerId);
      this.quizTimedTimerId = null;
    }

    var finalCorrectCount = this.quizTimedCorrectCount;
    this.quizTimedModeActive = false;
    this.quizTimedCorrectCount = 0;
    this.quizTimedEndAt = 0;
    this.updateTimedScoreUi();

    if (isAutoFinished) {
      this.elQuizFeedback.textContent = "限時計分結束：90 秒內答對 " + finalCorrectCount + " 題。";
    }
  };

  LettersUI.prototype.startTimedScore = function () {
    if (this.quizTimedModeActive) {
      this.stopTimedScore(false);
      return;
    }

    this.quizTimedModeActive = true;
    this.quizTimedCorrectCount = 0;
    this.quizTimedEndAt = Date.now() + this.quizTimedDurationMs;
    this.updateTimedScoreUi();

    var self = this;
    this.quizTimedTimerId = setInterval(function () {
      if (Date.now() >= self.quizTimedEndAt) {
        self.stopTimedScore(true);
        return;
      }

      self.updateTimedScoreUi();
    }, 250);
  };

  LettersUI.prototype.resetQuizScore = function () {
    this.quizScore = 0;
    this.updateQuizStats();
    this.elQuizFeedback.textContent = "分數已重置。";
  };

  LettersUI.prototype.renderQuizHistory = function () {
    if (!this.elQuizHistoryList) return;

    this.elQuizHistoryList.innerHTML = "";
    var renderCount = Math.min(this.quizHistoryLimit, this.quizHistory.length);
    if (!renderCount) {
      this.elQuizHistoryList.textContent = "目前沒有作答紀錄。";
      return;
    }

    for (var i = 0; i < renderCount; i++) {
      var historyItem = this.quizHistory[i];
      var card = document.createElement("div");
      card.className = "historyItem";

      var head = document.createElement("div");
      head.className = "historyItemHead";

      var promptBtn = document.createElement("button");
      promptBtn.type = "button";
      promptBtn.className = "historyPromptBtn";
      promptBtn.textContent = historyItem.promptLabel;
      promptBtn.addEventListener("click", this.speakText.bind(this, historyItem.promptAudio));

      var result = document.createElement("span");
      result.className = "tag";
      result.textContent = "正解：" + historyItem.correctAnswer;

      head.appendChild(promptBtn);
      head.appendChild(result);
      card.appendChild(head);

      var choices = document.createElement("div");
      choices.className = "historyChoices";
      var optionStatsMap = historyItem.optionStats;
      var optionNames = Object.keys(optionStatsMap);

      for (var j = 0; j < optionNames.length; j++) {
        var optionName = optionNames[j];
        var optionStat = optionStatsMap[optionName];
        var optionTag = document.createElement("span");
        optionTag.className = "historyChoiceTag " + (optionStat.isCorrect ? "correct" : "wrong");
        optionTag.textContent = optionName + " × " + optionStat.count;
        choices.appendChild(optionTag);
      }

      card.appendChild(choices);
      this.elQuizHistoryList.appendChild(card);
    }
  };

  LettersUI.prototype.recordQuizHistory = function () {
    if (!this.quizCurrentLetter) return;

    var optionStats = {};
    var optionNames = Object.keys(this.quizOptionTapStats);
    for (var i = 0; i < optionNames.length; i++) {
      var optionName = optionNames[i];
      optionStats[optionName] = {
        count: this.quizOptionTapStats[optionName],
        isCorrect: optionName === this.quizAnswer
      };
    }

    if (!optionStats[this.quizAnswer]) {
      optionStats[this.quizAnswer] = { count: 0, isCorrect: true };
    }

    this.quizHistory.unshift({
      promptLabel: this.quizCurrentLetter.upper + " " + this.quizCurrentLetter.lower,
      promptAudio: this.quizCurrentLetter.soundRu || this.quizCurrentLetter.lower || "",
      correctAnswer: this.quizAnswer,
      optionStats: optionStats
    });

    if (this.quizHistory.length > 200) this.quizHistory.length = 200;
  };

  LettersUI.prototype.nextQuiz = function () {
    var letters = window.RuLettersApp.LETTERS || [];
    if (!letters.length) return;

    var mode = this.elQuizMode ? this.elQuizMode.value : "letter_to_hint";
    var config = this.getQuizConfig(mode);

    var answerLetter = letters[Math.floor(Math.random() * letters.length)];
    var options = this.pickRandomItems(letters, 3, answerLetter);
    options.push(answerLetter);
    options = this.pickRandomItems(options, options.length);

    this.quizCurrentLetter = answerLetter;
    this.quizAnswer = config.answer(answerLetter);
    this.quizLocked = false;
    this.quizOptionTapStats = {};
    this.elQuizPrompt.textContent = config.prompt(answerLetter);
    this.elQuizOptions.innerHTML = "";
    this.elQuizFeedback.textContent = "請選擇答案。";
    this.elQuizHelp.textContent = config.helpText;

    for (var i = 0; i < options.length; i++) {
      var optionLetter = options[i];
      var optionBtn = document.createElement("button");
      var optionValue = config.answer(optionLetter);

      optionBtn.type = "button";
      optionBtn.className = "quizOption";
      optionBtn.textContent = optionValue;
      optionBtn.dataset.value = optionValue;

      optionBtn.addEventListener("click", this.handleQuizAnswer.bind(this, optionBtn));
      this.elQuizOptions.appendChild(optionBtn);
    }
  };

  LettersUI.prototype.handleQuizAnswer = function (btn) {
    if (this.quizLocked) return;

    var selectedValue = btn.dataset.value || "";
    if (!this.quizOptionTapStats[selectedValue]) this.quizOptionTapStats[selectedValue] = 0;
    this.quizOptionTapStats[selectedValue] += 1;

    var isCorrect = selectedValue === this.quizAnswer;
    if (isCorrect) {
      this.quizLocked = true;
      this.quizScore += 1;
      this.quizStreak += 1;
      if (this.quizTimedModeActive) this.quizTimedCorrectCount += 1;
      this.updateQuizStats();
      this.updateTimedScoreUi();
      btn.classList.add("correct");
      this.recordQuizHistory();
      this.renderQuizHistory();
      this.elQuizFeedback.textContent = "答對了！0.8 秒後切換下一題。";
      setTimeout(this.nextQuiz.bind(this), 800);
      return;
    }

    this.quizStreak = 0;
    this.updateQuizStats();
    btn.classList.add("wrong");
    this.playQuizPromptAudio();
    this.elQuizFeedback.textContent = "答錯了，再試一次。";

  };

  LettersUI.prototype.openQuizHistoryDialog = function () {
    if (!this.elQuizHistoryDialog) return;
    this.renderQuizHistory();
    if (this.elQuizHistoryDialog.showModal) {
      this.elQuizHistoryDialog.showModal();
      return;
    }
    this.elQuizHistoryDialog.setAttribute("open", "open");
  };

  LettersUI.prototype.bindQuizHistoryControls = function () {
    var self = this;
    if (!this.elQuizHistoryDialog) return;

    if (this.elQuizHistoryBtn) {
      this.elQuizHistoryBtn.addEventListener("click", function () {
        self.openQuizHistoryDialog();
      });
    }

    if (this.elQuizHistoryApplyBtn) {
      this.elQuizHistoryApplyBtn.addEventListener("click", function () {
        var limitInput = Number(self.elQuizHistoryLimit.value);
        self.quizHistoryLimit = Math.max(1, Math.min(200, limitInput || 20));
        self.elQuizHistoryLimit.value = String(self.quizHistoryLimit);
        self.renderQuizHistory();
      });
    }

    if (this.elQuizHistoryClearBtn) {
      this.elQuizHistoryClearBtn.addEventListener("click", function () {
        self.quizHistory = [];
        self.renderQuizHistory();
      });
    }
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

    if (this.elQuizMode) {
      this.elQuizMode.addEventListener("change", function () {
        self.nextQuiz();
      });
    }

    if (this.elNextQuizBtn) {
      this.elNextQuizBtn.addEventListener("click", function () {
        self.nextQuiz();
      });
    }

    if (this.elQuizTimedScoreBtn) {
      this.elQuizTimedScoreBtn.addEventListener("click", function () {
        self.startTimedScore();
      });
    }

    if (this.elQuizResetScoreBtn) {
      this.elQuizResetScoreBtn.addEventListener("click", function () {
        self.resetQuizScore();
      });
    }

    if (this.elQuizPlayPromptBtn) {
      this.elQuizPlayPromptBtn.addEventListener("click", function () {
        self.playQuizPromptAudio();
      });
    }

    this.bindQuizHistoryControls();
    this.updateQuizStats();
    this.updateTimedScoreUi();
    this.bindTabs();
  };

  window.RuLettersApp.LettersUI = LettersUI;
})();
