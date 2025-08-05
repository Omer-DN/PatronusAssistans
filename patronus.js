

const animalKeywords = {
  owl:      ["חכמה", "ידע", "למידה"],
  lion:     ["אומץ", "מנהיגות", "גבורה"],
  dog:      ["משפחה", "נאמנות", "חברות"],
  deer:     ["שלווה", "רוגע", "טבע"],
  fox:      ["חופש", "עצמאות", "תחכום"],
  dolphin:  ["ים", "מים", "גלים"],
  panther:  ["כוח", "עוצמה", "חוזק"],
  hog:      [] // ברירת מחדל
};


export function determineAnimalFromAnswers(answers) {
  const joined = answers.join(" ").toLowerCase();
  const scores = {};
  for (const animal in animalKeywords) {
    scores[animal] = 0;
    for (const keyword of animalKeywords[animal]) {
      if (joined.includes(keyword)) {
        scores[animal]++;
      }
    }
  }
  // למצוא את החיה עם הניקוד הכי גבוה
  let maxScore = 0;
  let selectedAnimal = "hog"; // ברירת מחדל
  for (const animal in scores) {
    if (scores[animal] > maxScore) {
      maxScore = scores[animal];
      selectedAnimal = animal;
    }
  }
  return selectedAnimal;
}


/**
 * פונקציה להוספת אנימציית ציפה על אלמנט נתון
 * @param {HTMLElement} element
 */
export function addFloatingAnimation(element) {
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

/**
 * פונקציה שמטפלת בבקשת שאלה לשרת ומחזירה תשובה
 * @param {string} question
 * @returns {Promise<string>} תשובת הפטרונוס
 */
export async function fetchPatronusAnswer(question) {
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
