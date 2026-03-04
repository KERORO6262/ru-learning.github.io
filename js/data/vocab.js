(function () {
  window.RuLettersApp = window.RuLettersApp || {};

  window.RuLettersApp.BASIC_VOCAB = [
    { word: "Привет", translit: "Privet", meaning: "你好（非正式）" },
    { word: "Спасибо", translit: "Spasibo", meaning: "謝謝" },
    { word: "Пожалуйста", translit: "Pozhaluysta", meaning: "請／不客氣" },
    { word: "Да", translit: "Da", meaning: "是" },
    { word: "Нет", translit: "Net", meaning: "不" },
    { word: "Дом", translit: "Dom", meaning: "房子" },
    { word: "Книга", translit: "Kniga", meaning: "書" },
    { word: "Вода", translit: "Voda", meaning: "水" },
    { word: "Семья", translit: "Semya", meaning: "家庭" },
    { word: "Друг", translit: "Drug", meaning: "朋友" },
    { word: "Работа", translit: "Rabota", meaning: "工作" },
    { word: "Время", translit: "Vremya", meaning: "時間" }
  ];

  window.RuLettersApp.GRAMMAR_RULES = [
    {
      title: "名詞性別",
      points: [
        "陽性：多數以子音結尾（例：дом）",
        "陰性：多數以 -а / -я 結尾（例：книга）",
        "中性：多數以 -о / -е 結尾（例：время）"
      ]
    },
    {
      title: "動詞現在式變化",
      points: [
        "第一變位常見結尾：-у/-ю, -ешь, -ет, -ем, -ете, -ут/-ют",
        "第二變位常見結尾：-у/-ю, -ишь, -ит, -им, -ите, -ат/-ят",
        "例：говорить → я говорю, ты говоришь, он/она говорит"
      ]
    }
  ];
})();
