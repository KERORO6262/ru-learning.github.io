(function () {
    window.RuLettersApp = window.RuLettersApp || {};

    function TTS(opts) {
        this.onStatus = (opts && opts.onStatus) ? opts.onStatus : function () { };
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

    function normalizeNameForTTS(text) {
        var t = String(text || "").trim();
        var low = t.toLowerCase();

        // 只針對特例做短映射，避免唸出一大串
        // Й：如果你想更明確聽到 y 滑音，可以把 "й" 改成 "йот"
        if (low === "и краткое") return "й";

        // Ъ：部分語音對 ё 支援不穩，改成 е
        if (low === "твёрдый знак" || low === "твердый знак") return "твердый знак";

        // Ь：保持短而清楚
        if (low === "мягкий знак") return "мягкий знак";

        // 保險：如果未來有人把 nameRu 塞成長句，最多取第一段
        if (t.length > 60) {
            var first = t.split(/[.!?。！？]/)[0].trim();
            return first || t.slice(0, 60);
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
