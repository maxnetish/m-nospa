const greetingElementId = 'greeting';
const greetings = [
    'Доброй ночи.',
    'Доброе утро.',
    'Доброго дня.',
    'Добрый вечер.'
];

function chooseGreeting () {
    let partOfDay = Math.floor((new Date()).getHours() / 6);
    return greetings[partOfDay];
}

(function setGreeting () {
    let elm = document.getElementById(greetingElementId);
    let greeting = chooseGreeting();
    if (elm && greeting) {
        elm.innerHTML = greeting;
    }
})();
