// quiz.js
import { determineAnimalFromAnswers } from './patronus.js'; // ייבוא הפונקציה מקובץ patronus.js


export async function runPatronusQuizUI(callback) {
    let questions = [];
    try {
        // טעינת השאלות מקובץ quiz.json
        const response = await fetch(chrome.runtime.getURL('quiz.json'));
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        questions = await response.json();
        if (!Array.isArray(questions) || questions.length === 0) {
            throw new Error("קובץ השאלות ריק או לא תקין.");
        }
    } catch (err) {
        console.error('Failed to load quiz questions:', err);
        alert('❗ לא ניתן לטעון את השאלון כרגע. נסה שוב מאוחר יותר.');
        return;
    }

    const answers = [];
    let currentIndex = 0;

    // --- בניית ממשק המשתמש (UI) של השאלון ---
    const quizOverlay = document.createElement("div");
    quizOverlay.id = "patronus-quiz-overlay";
    Object.assign(quizOverlay.style, {
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.8)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10000,
        color: "white",
        fontSize: "20px",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
    });

    const questionElem = document.createElement("div");
    questionElem.style.marginBottom = "20px";
    questionElem.style.textAlign = "center";
    questionElem.style.maxWidth = "80%";

    const inputElem = document.createElement("input");
    inputElem.type = "text";
    inputElem.placeholder = "הקלד/י תשובה כאן...";
    Object.assign(inputElem.style, {
        padding: "12px",
        fontSize: "18px",
        width: "350px",
        maxWidth: "90%",
        borderRadius: "8px",
        border: "1px solid #ccc",
        outline: "none",
        textAlign: "center"
    });
    inputElem.autofocus = true;

    const submitBtn = document.createElement("button");
    submitBtn.textContent = "הבא";
    Object.assign(submitBtn.style, {
        padding: "12px 25px",
        fontSize: "18px",
        marginTop: "15px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
    });
    submitBtn.disabled = true; // כפתור לא פעיל עד להקלדת טקסט

    // הוספת אלמנטים ל-overlay
    quizOverlay.appendChild(questionElem);
    quizOverlay.appendChild(inputElem);
    quizOverlay.appendChild(submitBtn);
    document.body.appendChild(quizOverlay);

    // --- לוגיקת השאלון ---
    function updateQuestion() {
        if (currentIndex < questions.length) {
            const currentQuestion = questions[currentIndex];
            questionElem.textContent = currentQuestion.question;
            inputElem.placeholder = `אפשרויות: ${currentQuestion.options.join(', ')}`;
            inputElem.value = "";
            submitBtn.disabled = true; // השבת כפתור עד לקלט חדש
            inputElem.focus();
        } else {
            // סיום השאלון
            document.body.removeChild(quizOverlay);
            const animal = determineAnimalFromAnswers(answers); // קבע את הפטרונוס
            callback(animal); // קרא לפונקציית הקריאה החוזרת עם חיית הפטרונוס
        }
    }

    // אירועים
    inputElem.addEventListener("input", () => {
        submitBtn.disabled = inputElem.value.trim().length === 0;
    });

    submitBtn.addEventListener("click", () => {
        const userAnswer = inputElem.value.trim().toLowerCase();
        const currentQuestionOptions = questions[currentIndex].options.map(opt => opt.toLowerCase());

        // ולידציה של התשובה
        if (userAnswer && currentQuestionOptions.includes(userAnswer)) {
            answers.push(userAnswer);
            currentIndex++;
            updateQuestion();
        } else {
            alert(`❗ אנא בחר/י תשובה תקינה מתוך האפשרויות: ${questions[currentIndex].options.join(', ')}`);
            inputElem.focus(); // החזר מיקוד לשדה הקלט
        }
    });

    inputElem.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !submitBtn.disabled) {
            submitBtn.click();
        }
    });

    // התחל את השאלון
    updateQuestion();
}