// Clock functionality
function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString();
  document.getElementById('time-date').textContent = `${time} ${date}`;
}

setInterval(updateClock, 1000);
updateClock();
