console.log("🎾 Patronus script loaded 🚀");

chrome.storage.local.get(["patronusAnimal", "patronusPos"], (result) => {
  if (!result.patronusAnimal) {
    runPatronusQuiz();
  } else {
    initPatronusUI(result.patronusAnimal, result.patronusPos);
  }
});

function determineAnimalFromAnswers(answers) {
  const joined = answers.join(" ").toLowerCase();
  if (joined.includes("חכמה") || joined.includes("ידע")) return "owl";
  if (joined.includes("אומץ") || joined.includes("מנהיגות")) return "lion";
  if (joined.includes("משפחה") || joined.includes("נאמנות")) return "dog";
  if (joined.includes("שלווה") || joined.includes("רוגע") || joined.includes("טבע")) return "deer";
  if (joined.includes("חופש") || joined.includes("עצמאות")) return "fox";
  if (joined.includes("ים")) return "dolphin";
  if (joined.includes("כוח") || joined.includes("עוצמה")) return "panther";
  return "hog";
}

function addFloatingAnimation(element) {
  element.style.animation = "float 3s ease-in-out infinite";
  if (!document.getElementById("patronus-float-style")) {
    const style = document.createElement("style");
    style.id = "patronus-float-style";
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
    `;
    document.head.appendChild(style);
  }
}

async function fetchPatronusAnswer(question) {
  if (!question.trim()) return "❗ נא להכניס שאלה או בקשה.";
  try {
    const response = await fetch('https://mypatronus.omerdayan94.workers.dev/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: question.trim() })
    });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const data = await response.json();
    return data.answer || "❗ לא הצלחתי לקבל תשובה.";
  } catch (error) {
    console.error(error);
    return "❗ שגיאה בשליחת השאלה. נסה שוב.";
  }
}

function runPatronusQuiz() {
  const answers = [];
  answers.push(prompt("מה התכונה הכי בולטת שלך? (אומץ, חכמה, יצירתיות, רוגע...)"));
  answers.push(prompt("איפה אתה מרגיש הכי בנוח? (יער, ספריה, בית, ים...)"));
  answers.push(prompt("מה הכי חשוב לך? (חופש, ידע, משפחה, שלווה...)"));

  const animal = determineAnimalFromAnswers(answers);
  chrome.storage.local.set({ patronusAnimal: animal }, () => {
    alert(`✨ הפטרונוס שלך הוא ${animal}`);
    initPatronusUI(animal, null);
  });
}

function initPatronusUI(animal, pos) {
  let container = document.getElementById("patronus-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "patronus-container";
    document.body.appendChild(container);
  }

  container.style.position = "fixed";
  container.style.width = "90px";
  container.style.height = "90px";
  container.style.zIndex = "9999";
  container.style.cursor = "grab";
  container.style.transition = "top 0.2s ease, left 0.2s ease";
  container.style.left = pos?.left || "1300px";
  container.style.top = pos?.top || "300px";
  container.innerHTML = "";

  const patronus = document.createElement("img");
  const formattedAnimal = animal.charAt(0).toUpperCase() + animal.slice(1);
  patronus.src = chrome.runtime.getURL(`patronus-pic/${formattedAnimal}.png`);
  patronus.alt = animal;
  patronus.onerror = () => {
    patronus.src = chrome.runtime.getURL("patronus-pic/Cat.png");
  };
  patronus.style.width = "90px";
  patronus.style.height = "90px";
  patronus.style.borderRadius = "50%";
  patronus.style.boxShadow = "0 0 15px rgba(173, 216, 230, 0.6)";
  patronus.style.userSelect = "none";

  container.appendChild(patronus);

  const bubble = document.createElement("div");
  bubble.style.position = "absolute";
  bubble.style.minWidth = "200px";
  bubble.style.background = "white";
  bubble.style.padding = "10px";
  bubble.style.borderRadius = "10px";
  bubble.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
  bubble.style.display = "none";
  bubble.style.flexDirection = "column";
  bubble.style.gap = "5px";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "במה אפשר לעזור?";
  input.style.padding = "5px";
  input.style.width = "100%";

  const sendBtn = document.createElement("button");
  sendBtn.textContent = "שלח";
  sendBtn.style.padding = "5px";

  const response = document.createElement("div");
  response.style.fontSize = "14px";
  response.style.color = "#333";
  response.style.marginTop = "5px";

  bubble.appendChild(input);
  bubble.appendChild(sendBtn);
  bubble.appendChild(response);
  container.appendChild(bubble);

  let clickCount = 0;
  patronus.addEventListener("click", () => {
    clickCount++;
    setTimeout(() => (clickCount = 0), 1000);
    if (clickCount === 3) {
      chrome.storage.local.clear(() => location.reload());
      return;
    }
    bubble.style.display = bubble.style.display === "none" ? "flex" : "none";
    if (bubble.style.display === "flex") input.focus();
  });

  sendBtn.addEventListener("click", () => handleQuery(input.value, response));
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendBtn.click();
  });

  let isDragging = false;
  let offsetX = 0, offsetY = 0;

  container.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - container.getBoundingClientRect().left;
    offsetY = e.clientY - container.getBoundingClientRect().top;
    container.style.cursor = "grabbing";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;
    x = Math.max(0, Math.min(window.innerWidth - 90, x));
    y = Math.max(0, Math.min(window.innerHeight - 90, y));
    container.style.left = `${x}px`;
    container.style.top = `${y}px`;
  });

  document.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    container.style.cursor = "grab";
    chrome.storage.local.set({ patronusPos: { left: container.style.left, top: container.style.top } });
  });

  addFloatingAnimation(container);

  let idleTimer = null;
  let wanderInterval = null;

  function resetIdleTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => startWandering(), 5000);
  }

  function startWandering() {
    if (bubble.style.display !== "none") return;
    clearInterval(wanderInterval);
    wanderInterval = setInterval(() => {
      let left = parseFloat(container.style.left);
      let top = parseFloat(container.style.top);
      left += (Math.random() - 0.5) * 20;
      top += (Math.random() - 0.5) * 20;
      left = Math.max(0, Math.min(window.innerWidth - 90, left));
      top = Math.max(0, Math.min(window.innerHeight - 90, top));
      container.style.left = `${left}px`;
      container.style.top = `${top}px`;
    }, 4000);
  }

  ["mousemove", "mousedown", "keydown"].forEach((evt) => document.addEventListener(evt, resetIdleTimer));
  resetIdleTimer();
}

async function handleQuery(text, responseDiv) {
  responseDiv.textContent = "⏳ חושב...";
  const answer = await fetchPatronusAnswer(text);
  responseDiv.textContent = answer;
}
