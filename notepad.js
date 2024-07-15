// Notepad functionality
const editor = document.getElementById('editor');
const fontSelect = document.getElementById('font-select');
const fontSize = document.getElementById('font-size');
const boldBtn = document.getElementById('bold-btn');
const italicBtn = document.getElementById('italic-btn');
const underlineBtn = document.getElementById('underline-btn');
const colorPicker = document.getElementById('color-picker');
const saveBtn = document.getElementById('save-btn');
const loadBtn = document.getElementById('load-btn');

function applyCommand(command, value = null) {
    editor.focus();
    document.execCommand(command, false, value);
}

fontSelect.addEventListener('change', () => {
    applyCommand('fontName', fontSelect.value);
});

fontSize.addEventListener('change', () => {
    applyCommand('fontSize', fontSize.value);
});

boldBtn.addEventListener('click', () => {
    applyCommand('bold');
});

italicBtn.addEventListener('click', () => {
    applyCommand('italic');
});

underlineBtn.addEventListener('click', () => {
    applyCommand('underline');
});

colorPicker.addEventListener('change', () => {
    applyCommand('foreColor', colorPicker.value);
});

saveBtn.addEventListener('click', () => {
    const content = editor.innerHTML;
    const blob = new Blob([content], {type: 'text/html'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'notepad_content.html';
    a.click();
});

loadBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.html,.txt';
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function(event) {
            editor.innerHTML = event.target.result;
        };
        reader.readAsText(file);
    };
    input.click();
});

// Ensure the editor is focusable when the notepad window is opened
document.getElementById('notepad-icon').addEventListener('click', () => {
    setTimeout(() => editor.focus(), 0);
});
