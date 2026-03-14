# TouchKey Typing Trainer 🎹

A fully functional, web-based typing practice application built for a custom **10-key hardware keyboard** designed for visually impaired individuals. The application connects directly to an Arduino microcontroller via the Web Serial API.

## 🌟 Motivation

Standard keyboards have over 100 keys, which can be overwhelming for visually impaired users learning to navigate a computer. The **TouchKey Typing Trainer** solves this by using a minimalist 10-key layout. By combining single presses, double presses, and dual-key chords, users can type the entire alphabet. This application serves as an interactive, accessible training ground to master this unique layout.

## ✨ Features
- 🔌 **Hardware Integration:** Connects seamlessly to Arduino devices sending serial inputs.
- ⌨️ **Virtual Keyboard:** Real-time 10-key visualization that highlights on input to help users visualize their keypresses.
- ⏱️ **Monkeytype-style Typing Mode:** Green/Red character tracking with instant WPM, Accuracy, and Error counts.
- 🔊 **Voice Feedback:** High-speed, low-latency audio feedback utilizing the Web Speech API (reads the typed character instantly).
- 🕶️ **Blind Mode:** Designed to hide visual tests and rely entirely on auditory feedback for a true accessible experience.
- 🎮 **Simulator Mode:** Built-in keyboard interceptor allowing the web app to be demonstrated *without* the hardware connected.

---

## 🛠️ Technology Stack
- **Frontend:** React 19 + Vite 6
- **Styling:** TailwindCSS v4
- **Hardware Comms:** Web Serial API
- **Accessibility:** Web Speech API
- **Microcontroller:** Arduino (Mega/Uno or compatible)
- **Legacy Support:** Python script (`keystroke.py`) provided for translating serial directly to OS keystrokes.

---

## 🔠 The 10-Key Mapping System

The Arduino handles the complex logic of converting key combinations into characters. Here is how the 10 physical keys (labeled K1 to K10) map to the alphabet:

### Single Press
| Keys | K1 | K2 | K3 | K4 | K5 | K6 | K7 | K8 | K9 | K10 |
|------|----|----|----|----|----|----|----|----|----|-----|
| Char | a  | b  | c  | d  | e  | f  | g  | h  | i  | j   |

### Double Press
| Keys | K1 | K2 | K3 | K4 | K5 | K6 | K7 | K8 | K9 | K10 |
|------|----|----|----|----|----|----|----|----|----|-----|
| Char | k  | l  | m  | n  | o  | p  | q  | r  | s  | t   |

### Dual-Key Chords
| Keys | K1+K2 | K2+K3 | K3+K4 | K7+K8 | K8+K9 | K9+K10 | K5+K6 | K6+K7 |
|------|-------|-------|-------|-------|-------|--------|-------|-------|
| Char | u     | v     | w     | x     | y     | z      | Space |  Del  |

---

## 🚀 Setup & Workflow

To get this project running, you need to set up both the **Software (Web App)** and the **Hardware (Arduino)**.

### 1. Hardware Setup (Arduino)
The root folder contains the `sketch.ino` file which handles the chorded 10-key logic.

1. Connect your Arduino to your computer.
2. Open `sketch.ino` in the Arduino IDE.
3. Ensure your 10 physical switches are wired to pins `[11, 10, 9, 8, 7, 6, 5, 4, 3, 2]` using `INPUT_PULLUP` wiring to Ground.
4. Upload the sketch to the Arduino.
5. Close the Arduino IDE Serial Monitor. **(CRITICAL: The web app cannot connect to the serial port if the IDE is using it).**

### 2. Software Setup (Web App)
The web app requires Node.js to be installed.

1. Open a terminal in the project directory.
2. Install the required JavaScript dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser (Google Chrome or Microsoft Edge only — Firefox/Safari do not support Web Serial API) and navigate to `http://localhost:5173`.

### 3. Usage & Connection
1. In the Web App, click **Connect Hardware**.
2. A browser prompt will appear asking for permission. Select your Arduino's COM port (e.g., `COM3` on Windows, `/dev/tty.usbmodem` on Mac).
3. Ensure **Voice Feedback** is toggled ON if required.
4. Begin typing on the 10-key hardware! The virtual keys will flash green and the words will fill out perfectly on screen.

> **Note on Simulator Mode:** If you do not have the hardware configured yet, simply click **"Try Simulator"** in the header. You can then use your regular PC keyboard to type letters and simulate the hardware behavior.

---

## 📁 Project Structure

```text
├── sketch.ino               # Hardware: The Arduino logic
├── package.json             # Node dependencies 
├── index.html               # Entry HTML with Inter fonts
└── src/
    ├── main.jsx             # React DOM injection
    ├── App.jsx              # Main App assembly & State manager
    ├── index.css            # Tailwind Configuration & Custom Animations
    ├── components/          
    │   ├── Header.jsx       # Controls, Connect buttons, and Toggles
    │   ├── KeyboardView.jsx # Dynamic 10-key visualization
    │   ├── StatsPanel.jsx   # WPM and Session trackers
    │   └── TypingArea.jsx   # The visual text renderer
    ├── hooks/
    │   ├── useSerialConnection.js # Web Serial API stream reader
    │   └── useTypingStats.js      # Timing and calculation logic
    └── utils/
        ├── keyMapping.js    # Character ↔ Hardware Pin mapper
        ├── speechEngine.js  # Dedicated text-to-speech wrapper
        └── typingMetrics.js # Pure math calculators
```

---

## 🔮 Future Enhancements
- **Numbers & Punctuation Support:** Expand the Arduino sketch to support a "shift" or modifier layer for numbers and symbols.
- **Build ergonomic keyboard:** Outer case + keys and keycaps.
- **Use key macros:** Shortcuts for frequently used phrases.
- **Better narrator voice:** Use a new narrator which is more human and pleasant to hear.
- **Leaderboards:** Implement a backend database to track high scores globally for the typing test.
- **Custom Hardware Mapping UI:** Allow users to redefine which keys map to which letters directly in the browser.