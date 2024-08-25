// Этап 1. Создайте функцию, генерирующую массив парных чисел. Пример массива, который должна возвратить функция: [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8].count - количество пар.
function createNumbersArray(count) {
  let cardsArray = [];
  for (let card = 1; cardsArray.length < count; card++) {
    cardsArray.push(card);
    cardsArray.push(card);
  }
  return cardsArray;
}

// Этап 2. Создайте функцию перемешивания массива.Функция принимает в аргументе исходный массив и возвращает перемешанный массив. arr - массив чисел
function shuffle(arr) {
  for (i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[j], arr[i]] = [arr[i], arr[j]];
  }
  return arr;
}
let count; // количество карт
let cardsVert // количество столбцов 
let cardsHor // кол-во строк

// функция отображает начальный экран с настройкой игры
function setGameSettings() {
  const form = document.createElement("form");
  const inputVertical = document.createElement("input");
  const inputHorisontal = document.createElement("input");
  const btn = document.createElement("button");
  const heading = document.createElement("h1");
  const text = document.createElement("p");
  const helpMessage = document.createElement('p')

  heading.textContent = "Игра в пары";
  text.classList.add("settings__text");
  btn.classList.add("settings__btn");
  helpMessage.classList.add('helper')
  inputVertical.classList.add("settings__input");
  inputHorisontal.classList.add("settings__input");

  form.append(heading, text, helpMessage, inputVertical, inputHorisontal, btn);

  inputVertical.placeholder = "Количество столбцов";
  inputVertical.min = "2";
  inputVertical.max = "6";
  inputVertical.type = "number";

  inputHorisontal.placeholder = "Количество строк";
  inputHorisontal.min = "2";
  inputHorisontal.max = "4";
  inputHorisontal.type = "number";

  helpMessage.textContent = `Вы можете ввести четные значения от 2 до 4 включительно. Значение по умолчанию - 4х4` 
  btn.textContent = "Нажмите для начала игры";

  text.textContent =
    "Чтобы начать игру, укажите необходимое количество карт по вертикали и горизонтали и нажмите на кнопку";
  document.body.append(form);

  form.addEventListener("submit", (e) => {
    // событие отправки формы
    e.preventDefault();

    if (!inputHorisontal.value && !inputVertical.value) { 
      
      inputHorisontal.value = inputVertical.value = 4;

      count = inputHorisontal.value * inputVertical.value;
    } else if (inputHorisontal.value % 2 !== 0 || inputVertical.value % 2 !== 0){
      alert('Вы ввели некорректное значение. Игра будет запущена в режиме по умолчанию - поле 4х4') 
      inputHorisontal.value = inputVertical.value = 4;

      count = inputHorisontal.value * inputVertical.value;
    }
    
    else {
      cardsVert = +inputVertical.value
      cardsHor = +inputHorisontal.value

      count = cardsVert * cardsHor;
    }

    document.body.append(prepare);
    form.textContent = "";

    countDownFunc();
    let countDownBeforeStart = setInterval(() => {
      countDownFunc();
    }, 1000);

    if (countDown < 0) {
      prepare.textContent = "";
      clearInterval(countDownBeforeStart)
    }

    setTimeout(() => {
      startGame(count, cardsVert, cardsHor);

      document.body.removeChild(form);
      document.body.removeChild(prepare);
    }, 3000);
  });
}
setGameSettings();

// обратный отсчет
let prepare = document.createElement("span");
prepare.classList.add("prepare");
countDown = 3;
prepare.textContent = `Приготовьтесь! До начала игры: ${countDown}`;

// функция обратного отсчета перед игрой
function countDownFunc() {
  prepare.textContent = `Приготовьтесь! До начала игры: ${countDown--}`;
}

// создаем timer
const timer = document.createElement("span");
let time = 60;
// функция обратного отсчета длит. 1 мин
function setTimer() {
  timer.textContent = `До конца игры осталось: ${time--}`;
  if (time < 5) {
    timer.classList.add("warning");
  }
}

let visibleCards = []; // массив открытых рубашкой вверх карт

// ф-ция сравнивает две последние перевернутые карты
function checkOpenedCard(card) {
  if (card.classList.contains("opened")) {
    return;
  }

  card.classList.add("opened");

  // добавляем карту в массив видимых карт
  visibleCards.push(card);

  // проверка на то, открыты ли на данных момент 2 карты
  if (visibleCards.length % 2 !== 0) {
    return;
  }

  const [firstCard, secondCard] = visibleCards.slice(-2); // последние два элемента массива присваиваются в константы соответственно

  if (secondCard.textContent !== firstCard.textContent) {
    visibleCards = visibleCards.slice(0, visibleCards.length - 2);
    setTimeout(() => {
      firstCard.classList.remove("opened");
      secondCard.classList.remove("opened");
    }, 500);
  }
}

// Запуск игры
function startGame(count, Vertical, Horisontal) {
  const container = document.createElement("div");
  const cardsList = document.createElement("ul");
  const win = document.createElement("p");

  const restartBtn = document.createElement("button");
  restartBtn.classList.add('hidden')

  container.classList.add("container");
  cardsList.classList.add("cards__list");

  let shuffledArr = shuffle(createNumbersArray(count));

  // цикл добавляет карточки в dom, нажатым карточкам опр. стили, а также выводит номер карточки
  for (i = 0; i < shuffledArr.length; i++) {
    const card = document.createElement("li");

    card.classList.add("card__el");

    const cardType = shuffledArr[i];
    card.textContent = `${cardType}`;
    card.classList.add(`card_${cardType}`);

    cardsList.append(card);

   cardsList.style.gridTemplateColumns = `repeat(${Vertical}, 1fr)`
   cardsList.style.gridTemplateRows = `repeat(${Horisontal}, 1fr)`
  
    card.addEventListener("click", () => {
      checkOpenedCard(card);
      // проверка на то, перевернуты ли все карты 
      if (document.querySelectorAll(".opened").length === count) {
        clearInterval(timeLeft);
        setInterval(() => {
          cardsList.remove();
          timer.remove();

          restartBtn.classList.remove('hidden')
          restartBtn.classList.add("settings__btn");
          restartBtn.classList.add("restart__btn");

          win.classList.add("win__message");

          restartBtn.textContent = "Сыграть еще раз";
          win.textContent = "Ты справился! Сыграем еще разок?";

          restartBtn.addEventListener("click", () => {
            location.reload();
          });

          clearTimeout(timeout); // после выигрыша обратный отсчет остановится  
        }, 500);
      }
    });
  }

  // запуск таймера
  setTimer();
  let timeLeft = setInterval(() => {
    setTimer();
  }, 1000);
  // страница перезагрузится ровно через 60 сек
  let timeout = setTimeout(() => {
    location.reload();
  }, 60000);

  container.append(timer, cardsList, win, restartBtn);  
  document.body.append(container);
}
