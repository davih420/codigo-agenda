
let nav = 0;
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];
let ultimaSelecao = {}; // variável que armazenará as informações do último evento selecionado pelo usuário

const calendar = document.getElementById('calendar');
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
const eventTimeInput = document.getElementById('eventTimeInput');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function openModal(date, time) {
  clicked = { date, time };

  const eventForDay = events.find(e => e.date === clicked.date && e.time === clicked.time);

  if (eventForDay) {
    document.getElementById('eventText').innerText = `${eventForDay.time}: ${eventForDay.title}`;
    deleteEventModal.style.display = 'block';
  } else {
    newEventModal.style.display = 'block';
  }

  backDrop.style.display = 'block';
}

function selectEvent(date, event) {
  clicked = { date, time: event.time };
  document.getElementById('eventText').innerText = `${event.time}: ${event.title}`;
  ultimaSelecao = event;
  deleteEventModal.style.display = 'block';
  backDrop.style.display = 'block';
}

function load() {
  const dt = new Date();

  console.log('Loading events...');

  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }

  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

  document.getElementById('monthDisplay').innerText =
    `${dt.toLocaleDateString('pt-br', { month: 'long' })} ${year}`;

  calendar.innerHTML = '';

   for (let i = 1; i <= daysInMonth + paddingDays; i++) {
    const daySquare = document.createElement('div');
    daySquare.classList.add('day');

    if (i > paddingDays) {
      const dayNumber = i - paddingDays;
      daySquare.innerText = dayNumber;
      const dayString = `${month + 1}/${dayNumber}/${year}`;

      console.log('Checking events for day:', dayString);
      const eventsForDay = events.filter((e) => e.date === dayString);

      if (i - paddingDays === day && nav === 0) {
        daySquare.id = 'currentDay';
      }

      eventsForDay.forEach((event) => {
        console.log('Event found for day:', event);
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.innerText = `${event.time}: ${event.title}`;
        eventDiv.addEventListener('click', () => selectEvent(dayString, event));
        daySquare.appendChild(eventDiv);
      });

      daySquare.addEventListener('click', () => openModal(dayString, eventTimeInput.value));
    } else {
      daySquare.classList.add('padding');
    }

    calendar.appendChild(daySquare);
  }

  console.log('Events loaded:', events);
}

function closeModal() {
  console.log('Closing modal...');
  eventTitleInput.classList.remove('error');
  eventTimeInput.classList.remove('error');
  newEventModal.style.display = 'none';
  deleteEventModal.style.display = 'none';
  backDrop.style.display = 'none';
  eventTitleInput.value = '';
  eventTimeInput.value = '';
  clicked = null;
  load();
}

function saveEvent() {
  console.log('Saving event...');
  const time = eventTimeInput.value;
  if (eventTitleInput.value && time && clicked) {
    console.log('Event details:', clicked.date, time, eventTitleInput.value);
    eventTitleInput.classList.remove('error');
    eventTimeInput.classList.remove('error');

    events.push({
      date: clicked.date,
      time: time,
      title: eventTitleInput.value,
    });

    localStorage.setItem('events', JSON.stringify(events));
    console.log('Event saved:', events);
    closeModal();
    load();
  } else {
    if (!eventTitleInput.value) {
      eventTitleInput.classList.add('error');
    }
    if (!time) {
      eventTimeInput.classList.add('error');
    }
  }
}

function deleteEvent() {
  console.log('Deleting event...');
  if (ultimaSelecao && ultimaSelecao.date && ultimaSelecao.time) {
    const indexToRemove = events.findIndex(
      (e) => e.date === ultimaSelecao.date && e.time === ultimaSelecao.time
    );

    if (indexToRemove !== -1) {
      console.log('Event to delete:', events[indexToRemove]);
      events.splice(indexToRemove, 1);
      localStorage.setItem('events', JSON.stringify(events));
      console.log('Event deleted:', events);
      closeModal();
      load();
    }
  }
}
function initButtons() {
  document.getElementById('nextButton').addEventListener('click', () => {
    nav++;
    load();
  });

  document.getElementById('backButton').addEventListener('click', () => {
    nav--;
    load();
  });

  document.getElementById('saveButton').addEventListener('click', saveEvent);
  document.getElementById('cancelButton').addEventListener('click', closeModal);
  document.getElementById('deleteButton').addEventListener('click', deleteEvent);
  document.getElementById('closeButton').addEventListener('click', closeModal);
}

initButtons();
load();
