(function () {
  window.RuLettersApp = window.RuLettersApp || {};

  window.RuLettersApp.BASIC_VOCAB = [
    { word: "Привет", translit: "Privet", meaning: "Hello (informal)" },
    { word: "Спасибо", translit: "Spasibo", meaning: "Thank you" },
    { word: "Пожалуйста", translit: "Pozhaluysta", meaning: "Please / You are welcome" },
    { word: "Да", translit: "Da", meaning: "Yes" },
    { word: "Нет", translit: "Net", meaning: "No" },
    { word: "Дом", translit: "Dom", meaning: "House" },
    { word: "Книга", translit: "Kniga", meaning: "Book" },
    { word: "Вода", translit: "Voda", meaning: "Water" },
    { word: "Семья", translit: "Semya", meaning: "Family" },
    { word: "Друг", translit: "Drug", meaning: "Friend" },
    { word: "Работа", translit: "Rabota", meaning: "Work" },
    { word: "Время", translit: "Vremya", meaning: "Time" }
  ];

  window.RuLettersApp.GRAMMAR_RULES = [
    {
      title: "Noun Genders（名詞性別）",
      points: [
        "陽性：多數以子音結尾（例：дом）",
        "陰性：多數以 -а / -я 結尾（例：книга）",
        "中性：多數以 -о / -е 結尾（例：время）"
      ]
    },
    {
      title: "Basic Verb Conjugation（動詞現在式）",
      points: [
        "第一變位常見結尾：-у/-ю, -ешь, -ет, -ем, -ете, -ут/-ют",
        "第二變位常見結尾：-у/-ю, -ишь, -ит, -им, -ите, -ат/-ят",
        "例：говорить → я говорю, ты говоришь, он/она говорит"
      ]
    }
  ];
})();
