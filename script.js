// ===== 1. Fetch API: load timetable.json and show it in the page =====
// async/await lets us write the fetch in a simple top-to-bottom way
// instead of chaining .then() everywhere.
async function loadTimetable() {
  const list = document.getElementById('timetableList');
  const info = document.getElementById('studentInfo');

  try {
    // fetch() sends a request and returns a Promise; await pauses until the response arrives
    const response = await fetch('timetable.json');

    // fetch does NOT throw on 404/500, so we check response.ok ourselves
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    // .json() reads the body and turns the text into a JavaScript object
    const data = await response.json();

    // show the student's details from the "student" object
    const { name, matric_number, program } = data.student;
    info.textContent = `${name} | ${matric_number} | ${program}`;

    // clear anything old, then loop through the "courses" array
    list.innerHTML = '';
    data.courses.forEach(course => {
      // create a new <article> for each course (DOM manipulation)
      const item = document.createElement('article');
      item.className = 'course';
      // template literal builds the inner HTML; trim() removes the extra space in the venue
      item.innerHTML = `
        <div>
          <span class="code">${course.code}</span>
          <h3>${course.title}</h3>
          <p class="small">${course.venue.trim()}</p>
        </div>
        <div class="when">
          <strong>${course.day}</strong>
          <p class="small">${course.time}</p>
        </div>`;
      list.appendChild(item); // add the card into the timetable section
    });
  } catch (error) {
    // runs if the network fails, the file is missing, or the JSON is broken
    console.error('Could not load timetable:', error);
    info.textContent = '';
    list.innerHTML = '<p class="error">Could not load the timetable. Open the page with a local server (e.g. VS Code Live Server) and check that timetable.json is in the same folder.</p>';
  }
}

// ===== 2. Menu: show the selected section, hide the others =====
const menuButtons = document.querySelectorAll('.menu-btn');
const sections = document.querySelectorAll('.panel');

menuButtons.forEach(button => {
  button.addEventListener('click', () => {
    const targetId = button.dataset.target; // reads data-target from the HTML

    // hide every section first, then reveal only the chosen one
    sections.forEach(section => section.classList.toggle('hidden', section.id !== targetId));

    // move the "active" highlight to the clicked button
    menuButtons.forEach(b => b.classList.toggle('active', b === button));
  });
});

// ===== 3. Dark mode toggle =====
const themeToggle = document.getElementById('themeToggle');

themeToggle.addEventListener('click', () => {
  // adding/removing the "dark" class on <body> swaps the CSS variables
  const isDark = document.body.classList.toggle('dark');
  themeToggle.textContent = isDark ? 'Light mode' : 'Dark mode';
});

// run the fetch once the page is ready
loadTimetable();
