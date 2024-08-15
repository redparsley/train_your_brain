// Этап 1. Создайте функцию, генерирующую массив парных чисел. Пример массива, который должна возвратить функция: [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8].count - количество пар.
function createNumbersArray(count) {
  let cardsArray = [];
  for (let card = 1; cardsArray.length < count * 2; card++) {
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
let count; // количество пар

// функция отображает начальный экран с настройкой игры
function setGameSettings() {
  const form = document.createElement("form");
  const input = document.createElement("input");
  const btn = document.createElement("button");
  const heading = document.createElement('h1')
  const text = document.createElement("p");

  heading.textContent = 'Игра в пары'
  text.classList.add("settings__text");
  btn.classList.add("settings__btn");
  input.classList.add("settings__input");

  form.append(heading)
  form.append(text);
  form.append(input);
  form.append(btn);

  input.placeholder = "2";
  input.min = "1";
  input.max = "8";
  input.type = "number";

  btn.textContent = "Нажмите для начала игры";

  text.textContent =
    "Чтобы начать игру, укажите необходимое количество пар и нажмите на кнопку";
  document.body.append(form);

  form.addEventListener("submit", (e) => {  // событие отправки формы
    e.preventDefault();

    if (!input.value) {
      count = 2;
    } else {
      count = +input.value;
    }

    document.body.append(prepare);
    form.textContent = ''

    countDownFunc()
    setInterval(() => {
     countDownFunc()
    }, 1000);

    setTimeout(() => {
      startGame(count);

      document.body.removeChild(form)
      document.body.removeChild(prepare)
    }, 3000);
    
  });
}
setGameSettings();

 // обратный отсчет
 let prepare = document.createElement("span");
 prepare.classList.add('prepare')
 countDown = 3;
 prepare.textContent = `Приготовьтесь! До начала игры: ${countDown}`;

// функция обратного отсчета перед игрой
function countDownFunc() {
  prepare.textContent = `Приготовьтесь! До начала игры: ${countDown--}`;
  if (countDown < 0) {
    prepare.textContent = "";
    countDown = null; 
  }
}

// создаем timer
const timer = document.createElement("span");
let time = 60;
timer.textContent = `До конца игры осталось: ${time}`;
// функция обратного отсчета: 1 мин
function setTimer() {
  timer.textContent = `До конца игры осталось: ${time--}`;
  if (time < 5) {
    timer.classList.add("warning");
  }
}

let visibleCards = []; // массив открытых рубашкой вверх карт

// ф-ция сравнивает две последние перевернутые карты
function handleCard(card) {
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
    }, 1000);
  }
  
}

// Запуск игры
function startGame(count) {
  const container = document.createElement("div");
  const cardsList = document.createElement("ul");
  const win = document.createElement('p')
 
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

    card.addEventListener("click", () => {
      handleCard(card);

      if (document.querySelectorAll('.opened').length === count * 2) {

        setInterval(() => {
          container.removeChild(cardsList)
          container.removeChild(timer)
          
          let restartBtn = document.createElement('button')
          restartBtn.classList.add('settings__btn')
          restartBtn.classList.add('restart__btn')
  
          win.classList.add('win__message')
          
          restartBtn.textContent = 'Сыграть еще раз'
          win.textContent = 'Ты справился! Сыграем еще разок?'
          
          restartBtn.addEventListener('click', () => {
              location.reload();
          })
  
          container.append(restartBtn)
        }, 500) 
      }
    });
  }

  // запуск таймера 
  setTimer();
  setInterval(() => {
    setTimer();
  }, 1000);

  setTimeout(() => {
    location.reload();
  }, 60000);

  container.append(timer);
  container.append(cardsList);
  container.append(win)
  document.body.append(container);
}