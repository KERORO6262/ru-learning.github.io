const russianContent = {
  vocabulary: [
    { russian: 'Привет', romanization: 'Privet', translation: 'Hello / 你好' },
    { russian: 'Пока', romanization: 'Poka', translation: 'Bye / 再见' },
    { russian: 'Спасибо', romanization: 'Spasibo', translation: 'Thank you / 谢谢' },
    { russian: 'Да', romanization: 'Da', translation: 'Yes / 是' },
    { russian: 'Нет', romanization: 'Net', translation: 'No / 不' },
    { russian: 'Пожалуйста', romanization: 'Pozhaluysta', translation: 'Please / You are welcome / 请 / 不客气' },
    { russian: 'Вода', romanization: 'Voda', translation: 'Water / 水' },
    { russian: 'Дом', romanization: 'Dom', translation: 'House / 家' },
    { russian: 'Книга', romanization: 'Kniga', translation: 'Book / 书' },
    { russian: 'Друг', romanization: 'Drug', translation: 'Friend / 朋友' }
  ],
  grammar: [
    {
      title: 'Noun Genders',
      explanation: 'Russian nouns can be masculine, feminine, or neuter. Endings often give clues: consonant = masculine, -а/-я = feminine, -о/-е = neuter.'
    },
    {
      title: 'Nominative Case',
      explanation: 'The nominative case is the dictionary form used for the subject of a sentence, e.g., Это книга (This is a book).'
    },
    {
      title: 'Present Tense Verb Conjugation',
      explanation: 'Verbs change by person and number: я говорю, ты говоришь, он/она говорит. Learning endings helps build basic sentences quickly.'
    },
    {
      title: 'Word Order Flexibility',
      explanation: 'Russian allows flexible word order due to cases, but Subject-Verb-Object is common in neutral statements.'
    },
    {
      title: 'No Articles',
      explanation: 'Russian does not use a/an/the. Context and word endings indicate meaning, so focus on noun forms and sentence context.'
    }
  ],
  alphabet: [
    { upper: 'А', lower: 'а', nameSound: 'a' },
    { upper: 'Б', lower: 'б', nameSound: 'be' },
    { upper: 'В', lower: 'в', nameSound: 've' },
    { upper: 'Г', lower: 'г', nameSound: 'ge' },
    { upper: 'Д', lower: 'д', nameSound: 'de' },
    { upper: 'Е', lower: 'е', nameSound: 'ye' },
    { upper: 'Ё', lower: 'ё', nameSound: 'yo' },
    { upper: 'Ж', lower: 'ж', nameSound: 'zhe' },
    { upper: 'З', lower: 'з', nameSound: 'ze' },
    { upper: 'И', lower: 'и', nameSound: 'ee' },
    { upper: 'Й', lower: 'й', nameSound: 'short ee' },
    { upper: 'К', lower: 'к', nameSound: 'ka' },
    { upper: 'Л', lower: 'л', nameSound: 'el' },
    { upper: 'М', lower: 'м', nameSound: 'em' },
    { upper: 'Н', lower: 'н', nameSound: 'en' },
    { upper: 'О', lower: 'о', nameSound: 'o' },
    { upper: 'П', lower: 'п', nameSound: 'pe' },
    { upper: 'Р', lower: 'р', nameSound: 'er' },
    { upper: 'С', lower: 'с', nameSound: 'es' },
    { upper: 'Т', lower: 'т', nameSound: 'te' },
    { upper: 'У', lower: 'у', nameSound: 'u' },
    { upper: 'Ф', lower: 'ф', nameSound: 'ef' },
    { upper: 'Х', lower: 'х', nameSound: 'kha' },
    { upper: 'Ц', lower: 'ц', nameSound: 'tse' },
    { upper: 'Ч', lower: 'ч', nameSound: 'che' },
    { upper: 'Ш', lower: 'ш', nameSound: 'sha' },
    { upper: 'Щ', lower: 'щ', nameSound: 'shcha' },
    { upper: 'Ъ', lower: 'ъ', nameSound: 'hard sign' },
    { upper: 'Ы', lower: 'ы', nameSound: 'yery' },
    { upper: 'Ь', lower: 'ь', nameSound: 'soft sign' },
    { upper: 'Э', lower: 'э', nameSound: 'e' },
    { upper: 'Ю', lower: 'ю', nameSound: 'yu' },
    { upper: 'Я', lower: 'я', nameSound: 'ya' }
  ]
};

const sectionButtons = [...document.querySelectorAll('.nav-btn')];
const contentSections = [...document.querySelectorAll('.content-section')];

const quizLetterElement = document.getElementById('quizLetter');
const quizOptionsElement = document.getElementById('quizOptions');
const quizFeedbackElement = document.getElementById('quizFeedback');

const vocabGridElement = document.getElementById('vocabGrid');
const grammarListElement = document.getElementById('grammarList');

let activeQuestion = null;

const getRandomItem = (items) => items[Math.floor(Math.random() * items.length)];

const shuffle = (items) => {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }
  return shuffled;
};

const setActiveSection = (sectionId) => {
  sectionButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.section === sectionId);
  });

  contentSections.forEach((section) => {
    section.classList.toggle('active', section.id === sectionId);
  });
};

const createQuizOptions = (correctLetter) => {
  const distractors = shuffle(
    russianContent.alphabet.filter((letter) => letter.upper !== correctLetter.upper)
  ).slice(0, 3);

  return shuffle([correctLetter, ...distractors]);
};

const loadNextQuestion = () => {
  activeQuestion = getRandomItem(russianContent.alphabet);
  quizLetterElement.textContent = `${activeQuestion.upper} ${activeQuestion.lower}`;
  quizFeedbackElement.textContent = 'Choose one option.';

  const options = createQuizOptions(activeQuestion);
  quizOptionsElement.innerHTML = '';

  options.forEach((option) => {
    const optionButton = document.createElement('button');
    optionButton.type = 'button';
    optionButton.className = 'option-btn';
    optionButton.textContent = option.nameSound;
    optionButton.addEventListener('click', () => handleQuizAnswer(option, optionButton));
    quizOptionsElement.appendChild(optionButton);
  });
};

const handleQuizAnswer = (selectedLetter, selectedButton) => {
  const isCorrect = selectedLetter.upper === activeQuestion.upper;
  selectedButton.classList.add(isCorrect ? 'correct' : 'incorrect');
  quizFeedbackElement.textContent = isCorrect
    ? 'Correct! Loading next letter...'
    : `Incorrect. Correct answer: ${activeQuestion.nameSound}. Loading next letter...`;

  [...quizOptionsElement.children].forEach((buttonElement) => {
    buttonElement.disabled = true;
    if (buttonElement.textContent === activeQuestion.nameSound) {
      buttonElement.classList.add('correct');
    }
  });

  setTimeout(loadNextQuestion, 900);
};

const renderVocabulary = () => {
  vocabGridElement.innerHTML = russianContent.vocabulary
    .map(
      ({ russian, romanization, translation }) => `
        <button class="flashcard" type="button" aria-label="Vocabulary card ${russian}">
          <span class="ru">${russian}</span>
          <span class="extra">${romanization}</span>
          <span class="extra">${translation}</span>
        </button>
      `
    )
    .join('');

  [...vocabGridElement.querySelectorAll('.flashcard')].forEach((card) => {
    card.addEventListener('click', () => card.classList.toggle('revealed'));
  });
};

const renderGrammar = () => {
  grammarListElement.innerHTML = russianContent.grammar
    .map(
      ({ title, explanation }) => `
        <details>
          <summary>${title}</summary>
          <p>${explanation}</p>
        </details>
      `
    )
    .join('');
};

const initializeNavigation = () => {
  sectionButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setActiveSection(button.dataset.section);
    });
  });
};

const initializeApp = () => {
  initializeNavigation();
  renderVocabulary();
  renderGrammar();
  loadNextQuestion();
};

initializeApp();
