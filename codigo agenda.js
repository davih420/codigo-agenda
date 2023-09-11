let nav = 0;
let clicked = null;
let tarefas = localStorage.getItem('tarefas') ? JSON.parse(localStorage.getItem('tarefas')) : [];

const calendar = document.getElementsById('calendar');
const weekdays = ('Dom', 'Seg', 'Ter', 'Quar', 'Qui', 'Sex', 'Sab');

function load() {
    const dt = new Date();

    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();

    console.log(day, month, year);
}

load();