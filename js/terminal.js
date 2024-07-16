document.addEventListener('DOMContentLoaded', () => {
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');

  terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
          const command = terminalInput.value.trim();
          if (command) {
              processCommand(command);
              terminalInput.value = '';
          }
      }
  });

  function processCommand(command) {
      const outputLine = document.createElement('div');
      outputLine.className = 'terminal-output-line';
      outputLine.textContent = `user@talkobrowser-os:~$ ${command}`;
      terminalOutput.appendChild(outputLine);

      const response = executeCommand(command);
      if (response) {
          const responseElement = document.createElement('div');
          responseElement.className = 'terminal-response';
          responseElement.textContent = response;
          terminalOutput.appendChild(responseElement);
      }

      terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function executeCommand(command) {
      const args = command.split(' ');
      const cmd = args[0].toLowerCase();

      switch (cmd) {
          case 'help':
              return 'Available commands: help, echo, clear, date, whoami';
          case 'echo':
              return args.slice(1).join(' ');
          case 'clear':
              terminalOutput.innerHTML = '';
              return '';
          case 'date':
              return new Date().toString();
          case 'whoami':
              return 'user@talkobrowser-os';
          default:
              return `Unknown command: ${cmd}`;
      }
  }
});
