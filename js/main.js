// Main script for window management and application imports
const windows = {
  'browser-window': { icon: '🌐', title: 'Browser' },
  'notepad-window': { icon: '📝', title: 'Notepad' },
  'calculator-window': { icon: '🧮', title: 'Calculator' },
  'paint-window': { icon: '🎨', title: 'Paint' },
  'music-window': { icon: '🎵', title: 'Music Player' },
  'explorer-window': { icon: '📁', title: 'File Explorer' },
  'clock-window': { icon: '⏰', title: 'Clock & Alarm' },
  'video-window': { icon: '🎥', title: 'Video Player' },
  'terminal-window': { icon: '💻', title: 'Terminal' }
};

let highestZIndex = 100;
let clickTimeout = null;

// Desktop grid configuration
const gridSize = 80; // Size of each grid cell in pixels
let desktopGrid = [];

// Initialize desktop grid
function initializeDesktopGrid() {
  const desktop = document.getElementById('desktop');
  const rows = Math.floor(desktop.clientHeight / gridSize);
  const cols = Math.floor(desktop.clientWidth / gridSize);
  
  desktopGrid = Array(rows).fill().map(() => Array(cols).fill(null));
}

// Place icons in the grid
function placeIconsInGrid() {
  const icons = document.querySelectorAll('.desktop-icon');
  icons.forEach((icon, index) => {
    const row = Math.floor(index / desktopGrid[0].length);
    const col = index % desktopGrid[0].length;
    if (row < desktopGrid.length && desktopGrid[row][col] === null) {
      placeIconAtGridPosition(icon, row, col);
    }
  });
}

// Place icon at a specific grid position
function placeIconAtGridPosition(icon, row, col) {
  icon.style.left = `${col * gridSize}px`;
  icon.style.top = `${row * gridSize}px`;
  desktopGrid[row][col] = icon;
}

// Make desktop icons draggable
function makeDraggable(element) {
  let isDragging = false;
  let startX, startY, startLeft, startTop;

  element.addEventListener('mousedown', startDragging);

  function startDragging(e) {
    e.preventDefault();
    isDragging = false;
    startX = e.clientX;
    startY = e.clientY;
    startLeft = parseInt(element.style.left) || 0;
    startTop = parseInt(element.style.top) || 0;
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);
  }

  function drag(e) {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      isDragging = true;
      element.style.left = `${startLeft + dx}px`;
      element.style.top = `${startTop + dy}px`;
    }
  }

  function stopDragging(e) {
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDragging);
    if (isDragging) {
      snapToGrid(element);
    } else {
      // Clear any existing timeout
      if (clickTimeout) clearTimeout(clickTimeout);

      // Set a timeout to distinguish between click and drag
      clickTimeout = setTimeout(() => {
        if (!isDragging) {
          // Find the corresponding window ID
          let windowId = element.id.replace('-icon', '-window');
          if (!windows.hasOwnProperty(windowId)) {
            // If not found, try to match based on the icon's text content
            const iconTitle = element.querySelector('.icon-title').textContent;
            windowId = Object.keys(windows).find(id => windows[id].title === iconTitle);
          }
          if (windowId) {
            toggleWindow(windowId);
          }
        }
      }, 200);
    }
  }
}

// Snap icon to nearest grid position
function snapToGrid(icon) {
  const rect = icon.getBoundingClientRect();
  const desktopRect = document.getElementById('desktop').getBoundingClientRect();
  const row = Math.round((rect.top - desktopRect.top) / gridSize);
  const col = Math.round((rect.left - desktopRect.left) / gridSize);

  if (row >= 0 && row < desktopGrid.length && col >= 0 && col < desktopGrid[0].length) {
    if (desktopGrid[row][col] === null || desktopGrid[row][col] === icon) {
      placeIconAtGridPosition(icon, row, col);
    } else {
      // Find the nearest empty cell
      const emptyCell = findNearestEmptyCell(row, col);
      if (emptyCell) {
        placeIconAtGridPosition(icon, emptyCell.row, emptyCell.col);
      }
    }
  }
}

// Find the nearest empty cell in the grid
function findNearestEmptyCell(startRow, startCol) {
  const maxDistance = Math.max(desktopGrid.length, desktopGrid[0].length);
  for (let d = 0; d < maxDistance; d++) {
    for (let i = -d; i <= d; i++) {
      for (let j = -d; j <= d; j++) {
        if (Math.abs(i) === d || Math.abs(j) === d) {
          const row = startRow + i;
          const col = startCol + j;
          if (row >= 0 && row < desktopGrid.length && col >= 0 && col < desktopGrid[0].length) {
            if (desktopGrid[row][col] === null) {
              return { row, col };
            }
          }
        }
      }
    }
  }
  return null;
}

// Custom right-click menu
const contextMenu = document.createElement('div');
contextMenu.id = 'context-menu';
contextMenu.className = 'hidden fixed bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50';
contextMenu.innerHTML = `
  <ul class="py-2">
    <li class="px-4 py-2 hover:bg-gray-700 cursor-pointer text-gray-300 hover:text-white transition-colors duration-200" data-action="create-folder">
      <i class="fas fa-folder-plus mr-2"></i>Create Folder
    </li>
    <li class="px-4 py-2 hover:bg-gray-700 cursor-pointer text-gray-300 hover:text-white transition-colors duration-200" data-action="refresh">
      <i class="fas fa-sync-alt mr-2"></i>Refresh
    </li>
    <li class="px-4 py-2 hover:bg-gray-700 cursor-pointer text-gray-300 hover:text-white transition-colors duration-200" data-action="change-background">
      <i class="fas fa-image mr-2"></i>Change Background
    </li>
    <li class="px-4 py-2 hover:bg-gray-700 cursor-pointer text-gray-300 hover:text-white transition-colors duration-200" data-action="open-terminal">
      <i class="fas fa-terminal mr-2"></i>Open Terminal
    </li>
  </ul>
`;
document.body.appendChild(contextMenu);

// Handle custom right-click menu
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  contextMenu.style.top = `${e.clientY}px`;
  contextMenu.style.left = `${e.clientX}px`;
  contextMenu.classList.remove('hidden');
});

document.addEventListener('click', () => {
  contextMenu.classList.add('hidden');
});

contextMenu.addEventListener('click', (e) => {
  const action = e.target.closest('li')?.dataset.action;
  if (action) {
    console.log(`Action clicked: ${action}`);
    // Implement actions here in the future
  }
});

// Window management functions
function toggleWindow(windowId) {
  const window = document.getElementById(windowId);
  if (window.classList.contains('hidden')) {
    window.classList.remove('hidden');
    addTaskbarIcon(windowId);
  }
  bringToFront(window);
}

function bringToFront(element) {
  highestZIndex++;
  element.style.zIndex = highestZIndex;
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
  bringToFront(window);
}

function makeResizable(windowId) {
  const windowElement = document.getElementById(windowId);
  const resizeHandle = windowElement.querySelector('.resize-handle');

  resizeHandle.addEventListener('mousedown', initResize, false);

  function initResize(e) {
    e.stopPropagation();
    window.addEventListener('mousemove', resize, false);
    window.addEventListener('mouseup', stopResize, false);
  }

  function resize(e) {
    const newWidth = e.clientX - windowElement.offsetLeft;
    const newHeight = e.clientY - windowElement.offsetTop;
    windowElement.style.width = newWidth + 'px';
    windowElement.style.height = newHeight + 'px';
  }

  function stopResize() {
    window.removeEventListener('mousemove', resize, false);
    window.removeEventListener('mouseup', stopResize, false);
  }
}

// Initialize windows and icons
Object.keys(windows).forEach(windowId => {
  const iconId = windowId.replace('-window', '-icon');
  const desktopIcon = document.getElementById(iconId);
  if (desktopIcon) {
    makeDraggable(desktopIcon);
  } else {
    console.warn(`Desktop icon not found for window: ${windowId}`);
  }

  const windowElement = document.getElementById(windowId);
  if (windowElement) {
    windowElement.addEventListener('mousedown', () => bringToFront(windowElement));

    const closeBtn = windowElement.querySelector('.close-btn');
    if (closeBtn) closeBtn.addEventListener('click', () => closeWindow(windowId));

    const minimizeBtn = windowElement.querySelector('.minimize-btn');
    if (minimizeBtn) minimizeBtn.addEventListener('click', () => toggleWindowVisibility(windowId));

    const maximizeBtn = windowElement.querySelector('.maximize-btn');
    if (maximizeBtn) maximizeBtn.addEventListener('click', () => maximizeWindow(windowId));

    const titleBar = windowElement.querySelector('.title-bar');
    if (titleBar) {
      titleBar.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('window-btn')) return;

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
    }

    makeResizable(windowId);
  } else {
    console.warn(`Window element not found: ${windowId}`);
  }
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

// Initialize desktop grid and place icons
window.addEventListener('load', () => {
  initializeDesktopGrid();
  placeIconsInGrid();
});

// Handle window resizing
window.addEventListener('resize', () => {
  initializeDesktopGrid();
  placeIconsInGrid();
});

// Importing individual application scripts
const scripts = ['js/browser.js', 'js/notepad.js', 'js/calculator.js', 'js/paint.js', 'js/music.js', 'js/explorer.js', 'js/clock.js', 'js/video.js', 'js/terminal.js'];
scripts.forEach(script => {
    const scriptElement = document.createElement('script');
    scriptElement.src = script;
    document.body.appendChild(scriptElement);
});

document.getElementById('openPopupBtn').addEventListener('click', function() {
  document.getElementById('popup').style.display = 'flex';
});

document.querySelector('.close-btn').addEventListener('click', function() {
  document.getElementById('popup').style.display = 'none';
});

window.addEventListener('click', function(event) {
  if (event.target === document.getElementById('popup')) {
      document.getElementById('popup').style.display = 'none';
  }
});