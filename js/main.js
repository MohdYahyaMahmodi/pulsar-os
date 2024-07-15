// Main script for window management and application imports
const windows = {
  'browser-window': { icon: '🌐', title: 'Browser' },
  'notepad-window': { icon: '📝', title: 'Notepad' },
  'calculator-window': { icon: '🧮', title: 'Calculator' },
  'paint-window': { icon: '🎨', title: 'Paint' },
  'music-window': { icon: '🎵', title: 'Music Player' },
  'explorer-window': { icon: '📁', title: 'File Explorer' },
  'clock-window': { icon: '⏰', title: 'Clock & Alarm' }
};

function toggleWindow(windowId) {
  const window = document.getElementById(windowId);
  if (window.classList.contains('hidden')) {
      window.classList.remove('hidden');
      addTaskbarIcon(windowId);
  }
  bringToFront(window);
}

function bringToFront(element) {
  const allWindows = document.querySelectorAll('.window');
  let maxZIndex = 0;
  allWindows.forEach(win => {
      const zIndex = parseInt(window.getComputedStyle(win).zIndex, 10);
      maxZIndex = Math.max(maxZIndex, zIndex);
  });
  element.style.zIndex = maxZIndex + 1;
}

function addTaskbarIcon(windowId) {
  const taskbarApps = document.getElementById('taskbar-apps');
  if (!document.getElementById(`taskbar-${windowId}`)) {
      const icon = document.createElement('div');
      icon.id = `taskbar-${windowId}`;
      icon.className = 'taskbar-icon p-2 rounded cursor-pointer active';
      icon.textContent = windows[windowId].icon;
      icon.onclick = () => toggleWindowVisibility(windowId);
      taskbarApps.appendChild(icon);
  }
}

function toggleWindowVisibility(windowId) {
  const window = document.getElementById(windowId);
  const icon = document.getElementById(`taskbar-${windowId}`);
  if (window.classList.contains('hidden')) {
      window.classList.remove('hidden');
      icon.classList.add('active');
      bringToFront(window);
  } else {
      window.classList.add('hidden');
      icon.classList.remove('active');
  }
}

function closeWindow(windowId) {
  const window = document.getElementById(windowId);
  window.classList.add('hidden');
  const icon = document.getElementById(`taskbar-${windowId}`);
  if (icon) icon.remove();
}

function maximizeWindow(windowId) {
  const window = document.getElementById(windowId);
  if (window.style.width === '100vw') {
      window.style.width = '800px';
      window.style.height = '600px';
      window.style.top = '50px';
      window.style.left = '50px';
  } else {
      window.style.width = '100vw';
      window.style.height = 'calc(100vh - 56px)';
      window.style.top = '0';
      window.style.left = '0';
  }
}

function makeResizable(windowId) {
  const windowElement = document.getElementById(windowId);
  const resizeHandle = windowElement.querySelector('.resize-handle');

  resizeHandle.addEventListener('mousedown', initResize, false);

  function initResize(e) {
      window.addEventListener('mousemove', resize, false);
      window.addEventListener('mouseup', stopResize, false);
  }

  function resize(e) {
      const newWidth = e.clientX - windowElement.offsetLeft;
      const newHeight = e.clientY - windowElement.offsetTop;
      windowElement.style.width = newWidth + 'px';
      windowElement.style.height = newHeight + 'px';
  }

  function stopResize(e) {
      window.removeEventListener('mousemove', resize, false);
      window.removeEventListener('mouseup', stopResize, false);
  }
}

Object.keys(windows).forEach(windowId => {
  document.getElementById(`${windowId.split('-')[0]}-icon`).addEventListener('click', () => toggleWindow(windowId));

  const windowElement = document.getElementById(windowId);
  windowElement.querySelector('.close-btn').addEventListener('click', () => closeWindow(windowId));
  windowElement.querySelector('.minimize-btn').addEventListener('click', () => toggleWindowVisibility(windowId));
  windowElement.querySelector('.maximize-btn').addEventListener('click', () => maximizeWindow(windowId));

  windowElement.querySelector('.title-bar').addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('window-btn')) return;
      bringToFront(windowElement);

      let isDragging = true;
      const startX = e.clientX - windowElement.offsetLeft;
      const startY = e.clientY - windowElement.offsetTop;

      function moveWindow(e) {
          if (isDragging && windowElement.style.width !== '100vw') {
              windowElement.style.left = `${e.clientX - startX}px`;
              windowElement.style.top = `${e.clientY - startY}px`;
          }
      }

      function stopDragging() {
          isDragging = false;
          document.removeEventListener('mousemove', moveWindow);
          document.removeEventListener('mouseup', stopDragging);
      }

      document.addEventListener('mousemove', moveWindow);
      document.addEventListener('mouseup', stopDragging);
  });

  makeResizable(windowId);
});

// Audio and Battery Icons
let audioLevel = 5;
document.getElementById('audio-icon').addEventListener('click', () => {
  audioLevel = (audioLevel % 3) + 1;
  const icon = document.getElementById('audio-icon');
  icon.textContent = audioLevel === 1 ? '🔇' : audioLevel === 2 ? '🔉' : '🔊';
});

let batteryLevel = 100;
setInterval(() => {
  batteryLevel = Math.max(0, batteryLevel - 1);
  const icon = document.getElementById('battery-icon');
  icon.textContent = batteryLevel > 66 ? '🔋' : batteryLevel > 33 ? '🪫' : '🔌';
}, 10000);

// Importing individual application scripts
const scripts = ['js/browser.js', 'js/notepad.js', 'js/calculator.js', 'js/paint.js', 'js/music.js', 'js/explorer.js', 'js/clock.js'];
scripts.forEach(script => {
  const scriptElement = document.createElement('script');
  scriptElement.src = script;
  document.body.appendChild(scriptElement);
});
