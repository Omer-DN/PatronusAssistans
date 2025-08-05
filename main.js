import { runPatronusQuiz } from './quiz.js';

chrome.storage.local.get("patronusAnimal", (result) => {
  if (!result.patronusAnimal) {
    runPatronusQuiz((animal) => {
      generateImagePrompt(animal);
      initPatronusUI(animal);
    });
  } else {
    initPatronusUI(result.patronusAnimal);
  }
});

function generateImagePrompt(animal) {
  const prompt = `A glowing, ethereal ${animal} Patronus, translucent and radiant in cool blue-white hues, magical and mysterious.`;
  console.log("🎨 Prompt:", prompt);
}

function initPatronusUI(animal) {
const capitalizedAnimal = animal.charAt(0).toUpperCase() + animal.slice(1);
patronus.src = chrome.runtime.getURL(`patronus-pic/${capitalizedAnimal}.png`);
  //patronus.id = 'patronus';
  patronus.alt = `Your Patronus (${animal})`;
  patronus.title = "גרור אותי ✨";
  patronus.style.position = 'fixed';
  patronus.style.width = '90px';
  patronus.style.height = '90px';
  patronus.style.bottom = '20px';
  patronus.style.right = '20px';
  patronus.style.borderRadius = '50%';
  patronus.style.boxShadow = '0 0 15px rgba(173, 216, 230, 0.6)';
  patronus.style.cursor = 'grab';
  patronus.style.zIndex = '9999';
  patronus.style.animation = 'float 3s ease-in-out infinite';

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  patronus.addEventListener('mousedown', (e) => {
    isDragging = true;
    patronus.style.cursor = 'grabbing';
    offsetX = e.clientX - patronus.getBoundingClientRect().left;
    offsetY = e.clientY - patronus.getBoundingClientRect().top;
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    patronus.style.left = `${e.clientX - offsetX}px`;
    patronus.style.top = `${e.clientY - offsetY}px`;
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    patronus.style.cursor = 'grab';
  });

  document.body.appendChild(patronus);

  const style = document.createElement('style');
  style.textContent = `
    @keyframes float {
      0% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
      100% { transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
}
