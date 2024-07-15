// File Explorer functionality
const folderTree = document.getElementById('folder-tree');
const fileList = document.getElementById('file-list');
const pathInput = document.getElementById('path-input');
const backBtn = document.getElementById('back-btn');
const forwardBtn = document.getElementById('forward-btn');
const upBtn = document.getElementById('up-btn');
const fileModal = document.getElementById('file-modal');
const fileModalTitle = document.getElementById('file-modal-title');
const fileContent = document.getElementById('file-content');
const saveFileBtn = document.getElementById('save-file-btn');
const closeModalBtn = document.getElementById('close-modal-btn');

let currentPath = '/';
let explorerHistory = ['/'];
let explorerHistoryIndex = 0;

// Simulated file system
const fileSystem = {
    '/': {
        type: 'folder',
        children: {
            'Documents': { type: 'folder', children: {} },
            'Pictures': { type: 'folder', children: {} },
            'Music': { type: 'folder', children: {} },
            'readme.txt': { type: 'file', content: 'Welcome to TalkoBrowser OS!' }
        }
    }
};

function getFolder(path) {
    return path.split('/').reduce((folder, name) => folder && folder.children && folder.children[name], fileSystem);
}

function updateExplorer() {
    updateFolderTree();
    updateFileList();
    pathInput.value = currentPath;
    backBtn.disabled = explorerHistoryIndex === 0;
    forwardBtn.disabled = explorerHistoryIndex === explorerHistory.length - 1;
    upBtn.disabled = currentPath === '/';
}

function updateFolderTree() {
    folderTree.innerHTML = generateFolderTree(fileSystem, '');
}

function generateFolderTree(folder, path) {
    let html = '<ul class="pl-4">';
    for (const [name, item] of Object.entries(folder)) {
        if (item.type === 'folder') {
            const fullPath = path + '/' + name;
            html += `
                <li>
                    <span class="cursor-pointer hover:bg-gray-200 px-1" onclick="navigateTo('${fullPath}')">${name}</span>
                    ${generateFolderTree(item.children, fullPath)}
                </li>
            `;
        }
    }
    return html + '</ul>';
}

function updateFileList() {
    const folder = getFolder(currentPath);
    if (!folder) return;

    fileList.innerHTML = '';
    for (const [name, item] of Object.entries(folder.children)) {
        const div = document.createElement('div');
        div.className = 'flex items-center p-2 hover:bg-gray-100 cursor-pointer';
        div.innerHTML = `
            <span class="mr-2">${item.type === 'folder' ? '📁' : '📄'}</span>
            <span>${name}</span>
        `;
        div.onclick = () => {
            if (item.type === 'folder') {
                navigateTo(currentPath + '/' + name);
            } else {
                openFile(currentPath + '/' + name);
            }
        };
        fileList.appendChild(div);
    }
}

function navigateTo(path) {
    currentPath = path;
    explorerHistory = explorerHistory.slice(0, explorerHistoryIndex + 1);
    explorerHistory.push(path);
    explorerHistoryIndex = explorerHistory.length - 1;
    updateExplorer();
}

function openFile(path) {
    const file = getFolder(path);
    if (file && file.type === 'file') {
        fileModalTitle.textContent = path.split('/').pop();
        fileContent.value = file.content || '';
        fileModal.style.display = 'flex';
    }
}

backBtn.addEventListener('click', () => {
    if (explorerHistoryIndex > 0) {
        explorerHistoryIndex--;
        currentPath = explorerHistory[explorerHistoryIndex];
        updateExplorer();
    }
});

forwardBtn.addEventListener('click', () => {
    if (explorerHistoryIndex < explorerHistory.length - 1) {
        explorerHistoryIndex++;
        currentPath = explorerHistory[explorerHistoryIndex];
        updateExplorer();
    }
});

upBtn.addEventListener('click', () => {
    const parentPath = currentPath.split('/').slice(0, -1).join('/') || '/';
    navigateTo(parentPath);
});

saveFileBtn.addEventListener('click', () => {
    const file = getFolder(currentPath + '/' + fileModalTitle.textContent);
    if (file) {
        file.content = fileContent.value;
    }
    fileModal.style.display = 'none';
});

closeModalBtn.addEventListener('click', () => {
    fileModal.style.display = 'none';
});

// Context menu for file operations
fileList.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const target = e.target.closest('div');
    if (!target) return;

    const name = target.querySelector('span:last-child').textContent;
    const contextMenu = document.createElement('div');
    contextMenu.className = 'absolute bg-white border rounded shadow-lg';
    contextMenu.style.left = `${e.clientX}px`;
    contextMenu.style.top = `${e.clientY}px`;
    contextMenu.innerHTML = `
        <div class="p-2 hover:bg-gray-100 cursor-pointer" onclick="renameItem('${name}')">Rename</div>
        <div class="p-2 hover:bg-gray-100 cursor-pointer" onclick="deleteItem('${name}')">Delete</div>
    `;
    document.body.appendChild(contextMenu);

    const removeMenu = () => {
        contextMenu.remove();
        document.removeEventListener('click', removeMenu);
    };
    document.addEventListener('click', removeMenu);
});

function renameItem(oldName) {
    const newName = prompt(`Rename ${oldName} to:`, oldName);
    if (newName && newName !== oldName) {
        const folder = getFolder(currentPath);
        if (folder && folder.children[oldName]) {
            folder.children[newName] = folder.children[oldName];
            delete folder.children[oldName];
            updateExplorer();
        }
    }
}

function deleteItem(name) {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
        const folder = getFolder(currentPath);
        if (folder && folder.children[name]) {
            delete folder.children[name];
            updateExplorer();
        }
    }
}

// New folder and file creation
fileList.addEventListener('dblclick', (e) => {
    if (e.target === fileList) {
        const name = prompt('Enter name for new folder:');
        if (name) {
            const folder = getFolder(currentPath);
            if (folder) {
                folder.children[name] = { type: 'folder', children: {} };
                updateExplorer();
            }
        }
    }
});

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'n' && document.activeElement !== fileContent) {
        e.preventDefault();
        const name = prompt('Enter name for new file:');
        if (name) {
            const folder = getFolder(currentPath);
            if (folder) {
                folder.children[name] = { type: 'file', content: '' };
                updateExplorer();
            }
        }
    }
});

// Initialize file explorer
document.getElementById('explorer-icon').addEventListener('click', () => {
    toggleWindow('explorer-window');
    updateExplorer();
});
