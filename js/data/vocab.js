(function () {
  window.RuLettersApp = window.RuLettersApp || {};

  window.RuLettersApp.BASIC_VOCAB = [
    { category: "問候與基礎短語", word: "Привет", translit: "Privet", meaning: "你好（非正式） / Hi" },
    { category: "問候與基礎短語", word: "Здравствуйте", translit: "Zdravstvuyte", meaning: "您好（正式） / Hello" },
    { category: "問候與基礎短語", word: "Доброе утро", translit: "Dobroye utro", meaning: "早安 / Good morning" },
    { category: "問候與基礎短語", word: "Добрый вечер", translit: "Dobryy vecher", meaning: "晚上好 / Good evening" },
    { category: "問候與基礎短語", word: "Спасибо", translit: "Spasibo", meaning: "謝謝 / Thank you" },
    { category: "問候與基礎短語", word: "Пожалуйста", translit: "Pozhaluysta", meaning: "請／不客氣 / Please, You're welcome" },
    { category: "問候與基礎短語", word: "Извините", translit: "Izvinite", meaning: "對不起／打擾了 / Excuse me" },
    { category: "問候與基礎短語", word: "До свидания", translit: "Do svidaniya", meaning: "再見 / Goodbye" },
    { category: "問候與基礎短語", word: "Да", translit: "Da", meaning: "是 / Yes" },
    { category: "問候與基礎短語", word: "Нет", translit: "Net", meaning: "不是 / No" },

    { category: "數字（1-10）", word: "один", translit: "odin", meaning: "一 / one" },
    { category: "數字（1-10）", word: "два", translit: "dva", meaning: "二 / two" },
    { category: "數字（1-10）", word: "три", translit: "tri", meaning: "三 / three" },
    { category: "數字（1-10）", word: "четыре", translit: "chetyre", meaning: "四 / four" },
    { category: "數字（1-10）", word: "пять", translit: "pyat", meaning: "五 / five" },
    { category: "數字（1-10）", word: "шесть", translit: "shest", meaning: "六 / six" },
    { category: "數字（1-10）", word: "семь", translit: "sem", meaning: "七 / seven" },
    { category: "數字（1-10）", word: "восемь", translit: "vosem", meaning: "八 / eight" },
    { category: "數字（1-10）", word: "девять", translit: "devyat", meaning: "九 / nine" },
    { category: "數字（1-10）", word: "десять", translit: "desyat", meaning: "十 / ten" },

    { category: "家庭成員", word: "мама", translit: "mama", meaning: "媽媽 / mother" },
    { category: "家庭成員", word: "папа", translit: "papa", meaning: "爸爸 / father" },
    { category: "家庭成員", word: "брат", translit: "brat", meaning: "兄弟 / brother" },
    { category: "家庭成員", word: "сестра", translit: "sestra", meaning: "姐妹 / sister" },
    { category: "家庭成員", word: "сын", translit: "syn", meaning: "兒子 / son" },
    { category: "家庭成員", word: "дочь", translit: "doch", meaning: "女兒 / daughter" },

    { category: "常見食物與飲品", word: "вода", translit: "voda", meaning: "水 / water" },
    { category: "常見食物與飲品", word: "чай", translit: "chay", meaning: "茶 / tea" },
    { category: "常見食物與飲品", word: "кофе", translit: "kofe", meaning: "咖啡 / coffee" },
    { category: "常見食物與飲品", word: "хлеб", translit: "khleb", meaning: "麵包 / bread" },
    { category: "常見食物與飲品", word: "молоко", translit: "moloko", meaning: "牛奶 / milk" },
    { category: "常見食物與飲品", word: "суп", translit: "sup", meaning: "湯 / soup" },

    { category: "核心動詞", word: "быть", translit: "byt", meaning: "是（to be）" },
    { category: "核心動詞", word: "есть", translit: "yest", meaning: "有（to have）" },
    { category: "核心動詞", word: "иметь", translit: "imet", meaning: "擁有（to possess）" },
    { category: "核心動詞", word: "идти", translit: "idti", meaning: "走路去（to go on foot）" },
    { category: "核心動詞", word: "ехать", translit: "yekhat", meaning: "搭乘交通工具去（to go by transport）" },
    { category: "核心動詞", word: "знать", translit: "znat", meaning: "知道（to know facts）" },
    { category: "核心動詞", word: "уметь", translit: "umet", meaning: "會、能夠（to know how to）" },
    { category: "核心動詞", word: "хотеть", translit: "khotet", meaning: "想要（to want）" },
    { category: "核心動詞", word: "говорить", translit: "govorit", meaning: "說（to speak）" },
    { category: "核心動詞", word: "понимать", translit: "ponimat", meaning: "理解（to understand）" }
  ];

  window.RuLettersApp.GRAMMAR_RULES = [
    {
      title: "名詞性別（Noun Genders）",
      overview: "俄語名詞通常有陽性、陰性、中性三種性別，常可透過詞尾快速判斷。",
      points: [
        {
          rule: "陽性（Masculine）：多數以子音結尾。",
          example: "例：стол（桌子）, дом（房子）。"
        },
        {
          rule: "陰性（Feminine）：多數以 -а / -я 結尾。",
          example: "例：мама（媽媽）, книга（書）。"
        },
        {
          rule: "中性（Neuter）：多數以 -о / -е 結尾。",
          example: "例：окно（窗戶）, море（海）。"
        }
      ]
    },
    {
      title: "人稱代名詞（Personal Pronouns）",
      overview: "初學者先掌握主格代名詞，能快速組成基本句型。",
      points: [
        {
          rule: "我 I：я；你 You：ты（非正式）/ вы（正式或複數）。",
          example: "例：Я студент.（我是學生）你：Ты дома?（你在家嗎？）"
        },
        {
          rule: "他/她/它：он / она / оно。",
          example: "例：Он врач.（他是醫生）Она дома.（她在家）Оно большое.（它很大）"
        },
        {
          rule: "我們 / 他們：мы / они。",
          example: "例：Мы друзья.（我們是朋友）Они в школе.（他們在學校）"
        }
      ]
    },
    {
      title: "格系統入門：主格 vs 受格（Nominative vs Accusative）",
      overview: "主格通常當主詞；受格常用於直接受詞（動作承受者）。",
      points: [
        {
          rule: "主格（Nominative）：句子的主詞基本形。",
          example: "例：Это книга.（這是一本書）книга 為主格。"
        },
        {
          rule: "受格（Accusative）：表示動作直接作用的對象。",
          example: "例：Я читаю книгу.（我在讀一本書）книга → книгу（陰性-a 名詞變化）。"
        },
        {
          rule: "陽性有生命名詞在受格時常與生格同形，無生命名詞常與主格同形。",
          example: "例：Я вижу брата.（我看到兄弟）/ Я вижу стол.（我看到桌子）"
        }
      ]
    }
  ];
})();
