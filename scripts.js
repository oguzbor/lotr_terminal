document.addEventListener("DOMContentLoaded", function() {
    const terminalInput = document.getElementById("terminal-input");
    const terminalOutput = document.getElementById("terminal-output");
    const promptText = document.getElementById("prompt-text");
    const terminalTitle = document.getElementById("terminal-title");
    const terminal = document.querySelector('.terminal');
    const terminalHeader = document.querySelector('.terminal-header');
    const terminalBody = document.querySelector('.terminal-body');
    const validCommands = ['help', 'about', 'characters', 'contact', 'social', 'clear', 'history', 'home'];
    const cursorColors = ['#00ff00', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    const lotrCharacters = ['Gandalf', 'Frodo', 'Sauron', 'Galadriel', 'Arwen', 'Gollum', 'Legolas', 'Bilbo', 'Elrond', 'Gimli', 'Peregrin', 'Éowyn', 'Samwise', 'Balrog', 'Saruman', 'Boromir', 'Tom', 'Meriadoc', 'Théoden', 'Faramir', 'Black', 'Éomer', 'Gríma', 'Treebeard', 'Radagast', 'Shelob', 'Elendil', 'Celeborn', 'Denethor', 'Glorfindel', 'Brego', 'Anárion', 'Eldarion', 'Thengel', 'Gothmog', 'Theodred', 'Gamling', 'Fréaláf', 'Fredegar', 'Fíriel', 'Elrohir', 'Fengel', 'Bergil', 'Aldor', 'Baldor', 'Beregond'];
    let history = [];
    let typingInterval;
    let isTyping = false;
    let currentText = "";

    // Rastgele bir cursor rengi seç
    function getRandomColor() {
        return cursorColors[Math.floor(Math.random() * cursorColors.length)];
    }

    // Rastgele bir karakter ismi seç
    function getRandomCharacter() {
        return lotrCharacters[Math.floor(Math.random() * lotrCharacters.length)];
    }

    // Cursor rengini ayarla
    function setCursorColor() {
        terminalInput.style.borderRightColor = getRandomColor();
    }

    // Karakter ismini güncelle
    function updatePromptCharacter() {
        const newCharacter = getRandomCharacter();
        promptText.innerHTML = `[<span class="bold">oguz</span>]─[<span class="bold">${newCharacter}</span>]─[$]: `;
    }

    // Terminal başlığını güncelle
    function updateTerminalTitle() {
        const titleText = "Ash nazg durbatulûk, ash nazg gimbatul, Ash nazg thrakatulûk agh burzum-ishi krimpatul";
        let index = 0;
        function typeWriter() {
            if (index < titleText.length) {
                terminalTitle.innerHTML += titleText.charAt(index);
                index++;
                setTimeout(typeWriter, 50);
            }
        }
        typeWriter();
    }

    // Yazma fonksiyonu
    function typeText(text, callback) {
        let index = 0;
        isTyping = true;
        currentText = text;

        terminalOutput.innerHTML = ''; // Clear current output

        function typeWriter() {
            if (index < text.length) {
                const output = document.createElement("span");
                output.innerHTML = text.charAt(index);
                terminalOutput.appendChild(output);
                index++;
                terminalOutput.scrollTop = terminalOutput.scrollHeight; // Otomatik kaydırma
                typingInterval = setTimeout(typeWriter, 50);
            } else {
                isTyping = false;
                if (callback) callback();
            }
        }

        typeWriter();
    }

    function completeText(text) {
        clearTimeout(typingInterval);
        terminalOutput.innerHTML = text;
        isTyping = false;
        terminalInput.focus();
        terminalOutput.appendChild(document.createElement('br')); // Yeni satıra geç
        terminalOutput.scrollTop = terminalOutput.scrollHeight; // Scroll'u aşağı çek
    }

    // Terminali otomatik olarak boyutlandır
    function resizeTerminal() {
        const lines = terminalOutput.textContent.split('\n').length;
        const lineHeight = parseInt(getComputedStyle(terminalOutput).lineHeight);
        const newHeight = lines * lineHeight + 100; // Ekstra boşluk için +100
        terminal.style.height = `${newHeight}px`;
    }

    // Terminal açıldığında gösterilecek mesaj
    const welcomeMessage = `
Welcome to <span class="bold">Oğuz Bor's</span> interactive portfolio shell.
To list available commands use <span class="bold">\`help\`</span> command. 
Maybe if you want to have a bit of fun you can take a look at <span class="bold">\`characters\`</span>.
`;
    printText(welcomeMessage);

    // İlk karakter ismini ayarla
    updatePromptCharacter();

    // Terminal başlığını güncelle
    updateTerminalTitle();

    // İmleç için sınıf ekle
    terminalInput.classList.add('blinking-cursor');

    terminalInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            if (isTyping) {
                completeText(currentText);
            } else {
                const userCommand = terminalInput.value.trim();
                handleCommand(userCommand);
                history.push(userCommand);
                terminalInput.value = "";
                resetInactiveState();
                setCursorColor();
                updatePromptCharacter(); // Her Enter tuşuna basıldığında karakter ismini güncelle
            }
        } else if (event.key === "Tab") {
            event.preventDefault(); 
            autoCompleteCommand();
            resetInactiveState();
        }
    });

    // Terminale çift tıklama olayı
    terminal.addEventListener("dblclick", function() {
        if (isTyping) {
            completeText(currentText);
        }
    });

    function handleCommand(command) {
        terminalOutput.innerHTML = ''; // Yeni komut çalıştığında önceki çıktıyı temizle
        const output = document.createElement("div");
        output.textContent = `> ${command}`;
        terminalOutput.appendChild(output);

        const [cmd, ...args] = command.split(' ');

        if (validCommands.includes(cmd)) {
            switch (cmd) {
                case "help":
                    printHelp();
                    break;
                case "about":
                    printAbout();
                    break;
                case "characters":
                    printCharacters();
                    break;
                case "contact":
                    printContact();
                    break;
                case "social":
                    printSocial();
                    break;
                case "clear":
                    clearTerminal();
                    break;
                case "history":
                    printHistory();
                    break;
                case "home":
                    goToHome();
                    break;
            }
        } else {
            printUnknownCommand(command);
        }

        terminalOutput.scrollTop = terminalOutput.scrollHeight; // Otomatik kaydırma
        resizeTerminal(); // Terminali yeniden boyutlandır
    }

    function autoCompleteCommand() {
        const inputText = terminalInput.value.trim().toLowerCase();
        const allCommands = [...validCommands];
        const matchingCommands = allCommands.filter(cmd => cmd.startsWith(inputText));
        
        if (matchingCommands.length === 1) {
            terminalInput.value = matchingCommands[0];
        } else if (matchingCommands.length > 1) {
            printText(`Possible commands: ${matchingCommands.join(', ')}`);
        }
    }

    function printHelp() {
        const helpText = `
Available commands:
- help: Show this help message
- about: Information about this portfolio
- characters: List of main characters
- contact: How to contact me
- social: Show my social media links
- clear: Clear the terminal screen
- history: Show command history
- home: Go to the home page
`;
        printText(helpText);
        resizeTerminal();
    }

    function printAbout() {
        const aboutText = `
In the realm of software testing, where code and quality intertwine, I have embarked on a journey much like the quests of Middle-earth. With ISTQB, SS.T.U, and ISO27001 ISMS implementation certificates, I stand as a guardian of software integrity, akin to the Fellowship of the Ring.

With a robust foundation in software testing, test data management (TDM), and quality processes, my career focuses on optimizing testing processes and enhancing quality. I have managed the creation of static test data, data masking, and data migration, using tools like CA TDM and Ab Initio MetadataHub EDM.

Experienced in every phase of the Software Testing Life Cycle (STLC), I have planned, executed, and managed functional, performance, security, and automation tests for web and mobile applications. My journey through Agile and Kanban methodologies has made project processes more efficient and effective.

Among my technical proficiencies are automation tools (Selenium, Appium, UFT, JMeter, LoadRunner), cloud solutions (AWS Device Farm), BDD frameworks (Cucumber, Karate), CI/CD process tools (Jenkins, SonarQube), and test data management systems.

In this saga of software testing, I am committed to excellence, striving to ensure quality and reliability in every project. As Gandalf once said, "All we have to decide is what to do with the time that is given us." I have chosen to dedicate my time to the noble quest of software quality.
`;
        terminalOutput.innerHTML = ''; // Clear current output
        typeText(aboutText, () => {
            terminalOutput.appendChild(document.createElement('br')); // Yeni satıra geç
            terminalOutput.scrollTop = terminalOutput.scrollHeight; // Scroll'u aşağı çek
            resizeTerminal(); // Terminali yeniden boyutlandır
        }); // Start typing the text
    }

    function printCharacters() {
        const charactersText = `
Main Characters:
- <span class="bold">Gandalf</span>: The Grey Wizard (The senior developer who always knows the right solution)
- <span class="bold">Frodo Baggins</span>: The Ring-bearer (The dedicated programmer who carries the heavy burden of maintaining the legacy code)
- <span class="bold">Sauron</span>: The Dark Lord (The critical bug that threatens the entire system)
- <span class="bold">Galadriel</span>: The Lady of Light (The UI/UX designer who ensures everything looks perfect)
- <span class="bold">Arwen</span>: The Half-elf (The front-end developer bridging the gap between design and functionality)
- <span class="bold">Gollum</span>: The Creature Obsessed with the One Ring (The spaghetti code or the missing semicolon that always causes trouble)
- <span class="bold">Legolas</span>: The Elven Archer (The front-end developer with a keen eye for design and detail)
- <span class="bold">Bilbo Baggins</span>: The Adventurer (The developer who loves exploring new technologies)
- <span class="bold">Elrond</span>: The Wise Elf (The architect who designs robust and scalable systems)
- <span class="bold">Gimli</span>: The Dwarf Warrior (The back-end developer who deals with the heavy lifting)
- <span class="bold">Peregrin Took</span>: The Curious Hobbit (The intern who is eager to learn and explore)
- <span class="bold">Éowyn</span>: The Shieldmaiden (The QA engineer who ensures the product is battle-ready)
- <span class="bold">Samwise Gamgee</span>: Frodo's Loyal Companion (The supportive team member who is always there to help)
- <span class="bold">Balrog</span>: The Fiery Demon (The production issue that needs immediate attention)
- <span class="bold">Saruman</span>: The Corrupted Wizard (The legacy code that once was great but now is problematic)
- <span class="bold">Boromir</span>: The Noble Warrior (The team leader who sometimes struggles with difficult decisions)
- <span class="bold">Meriadoc Brandybuck</span>: The Brave Hobbit (The developer who is always ready to take on new challenges)
- <span class="bold">Théoden</span>: The King of Rohan (The project manager who leads the team with courage)
`;
        printText(charactersText);
        resizeTerminal();
    }

    function printContact() {
        const contactText = `
<a href="mailto:oguzbor1@gmail.com">oguzbor1@gmail.com</a>
`;
        printText(contactText);
        resizeTerminal();
    }

   function printSocial() {
    const socialText = `
    <div style="text-align: left;">
        <a href="https://twitter.com/oguzbor" target="_blank">x: oguzbor</a><br>
        <a href="https://www.linkedin.com/in/oguzbor" target="_blank">linkedin: oguzbor</a><br>
        <a href="https://www.instagram.com/oguzbor" target="_blank">instagram: oguzbor</a><br>
        <a href="https://www.youtube.com/@LordOfCodes" target="_blank">youtube: LordOfCodes</a>
    </div>
    `;
    printText(socialText);
    resizeTerminal();
}

    function clearTerminal() {
        terminalOutput.innerHTML = '';
        resizeTerminal();
    }

    function printHistory() {
        const historyText = history.join('\n');
        printText(historyText);
        resizeTerminal();
    }

    function goToHome() {
        location.reload();
    }

    function printUnknownCommand(command) {
        const unknownCommandText = `
Unknown command: ${command}
Type 'help' for a list of available commands.
`;
        printText(unknownCommandText);
        resizeTerminal();
    }

    function printText(text) {
        const textLines = text.trim().split("\n");
        textLines.forEach(line => {
            const output = document.createElement("div");
            output.innerHTML = line;
            terminalOutput.appendChild(output);
        });
        resizeTerminal();
    }

    // Terminali hareket ettirme
    let isDragging = false;
    let initialX, initialY, offsetX = 0, offsetY = 0;

    terminalHeader.addEventListener('mousedown', function(e) {
        isDragging = true;
        initialX = e.clientX - offsetX;
        initialY = e.clientY - offsetY;
        terminal.classList.add('no-select'); // Metin seçimini engelle
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
        terminal.classList.remove('no-select'); // Metin seçimini geri getir
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            e.preventDefault();
            offsetX = e.clientX - initialX;
            offsetY = e.clientY - initialY;
            terminal.style.left = `${offsetX}px`;
            terminal.style.top = `${offsetY}px`;
        }
    });

    // Kullanıcı etkileşimi olmadığında terminali soldur
    let inactiveTimeout;

    function setInactiveState() {
        terminal.classList.add('inactive');
    }

    function resetInactiveState() {
        terminal.classList.remove('inactive');
        clearTimeout(inactiveTimeout);
        inactiveTimeout = setTimeout(setInactiveState, 20000);
    }

    document.addEventListener('mousemove', resetInactiveState);
    document.addEventListener('keydown', resetInactiveState);

    resetInactiveState();
});
