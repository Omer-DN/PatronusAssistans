# Patronus - Personal AI Companion Chrome Extension

**Patronus** is a magical Chrome extension that creates a floating, animated companion on any website. It helps users by answering questions, providing helpful insights, and being a delightful presence on screen — just like your personal digital patronus.

---

## Features

-  **AI Assistance** – Ask any question (including in Hebrew) and get instant AI responses.
-  **Personal Quiz** – One-time quiz determines your unique patronus (e.g. owl, lion, dolphin...).
-  **Floating Character** – The patronus floats on the screen and can be dragged around.
-  **Minimal Setup** – Just install the extension and it works right away.
-  **Smart Interaction** – Triple-click your patronus to retake the quiz anytime.
-  **Offline Assets** – Patronus images are stored locally in the extension.

---

## How It Works

1. **On First Use** – The user is presented with a short personality quiz.
2. **Animal Matching** – Answers are analyzed to determine the matching animal.
3. **Floating UI** – A floating image of the patronus appears and stays on screen.
4. **Chat Bubble** – Clicking the patronus opens a question input bubble.
5. **Remote API Call** – Questions are sent to a remote AI server (proxy) for response.

---

## Remote Server Integration

This extension sends user questions to a **remote proxy server** that connects to an AI model via OpenRouter.

>  **Note:** The integration with the remote server is partially complete.  
> Final API connection and response handling still needs to be finished and deployed.

---

## Project Structure

```plaintext
patronus-extension/
├── content.js           # Main logic for quiz, floating UI, and communication
├── manifest.json        # Chrome extension manifest
├── patronus-pic/        # Folder with patronus images (e.g. Owl.png, Lion.png, etc.)
├── background.js        # (optional) Background logic
└── README.md            # You are here.



Clone or download the repository:

bash
Copy
Edit
git clone https://github.com/your-user/patronus-extension.git
Open Chrome and go to chrome://extensions.

Enable Developer Mode.

Click Load Unpacked, then select the project folder.

Done! Your patronus is ready to float
