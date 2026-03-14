# 10 KEYS

A fully functional, web-based typing practice application built for a custom **10-key hardware keyboard** designed for visually impaired individuals. The application connects directly to an Arduino microcontroller via the Web Serial API.

## Motivation

Standard keyboards have over 100 keys, which can be overwhelming for visually impaired users learning to navigate a computer. The **TouchKey Typing Trainer** solves this by using a minimalist 10-key layout. By combining single presses, double presses, and dual-key chords, users can type the entire alphabet. This application serves as an interactive, accessible training ground to master this unique layout.

## Features
-  **Hardware Integration:** Connects seamlessly to Arduino devices via USB Serial.
-  **Virtual Keyboard:** Real-time 10-key visualization that highlights on input to help users visualize their keypresses.
-  **Monkeytype-style Typing Mode:** Green/Red character tracking with instant WPM, Accuracy, Error counts, and Backspace support.
-  **Voice Feedback:** High-speed, natural audio feedback utilizing the Web Speech API in-browser, or globally across your OS via the Python script.
-  **Blind Mode:** Designed to hide visual tests and rely entirely on auditory feedback for a true accessible experience.
-  **Simulator Mode:** Built-in keyboard interceptor allowing the web app to be demonstrated *without* the hardware connected.

---

## Technology Stack
- **Frontend:** React 19 + Vite 6
- **Styling:** TailwindCSS v4
- **Hardware Comms:** Web Serial API
- **Accessibility:** Web Speech API (Browser) & SAPI5/win32com (Windows OS)
- **Microcontroller:** Arduino (Mega/Uno or compatible)
- **Global OS Support:** Python script (`keystroke.py`) translates serial inputs directly to OS keystrokes and provides global text-to-speech.

---

##  The 10-Key Mapping System

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
| Keys | K1+K2 | K2+K3 | K3+K4 | K7+K8 | K8+K9 | K9+K10 | K5+K6 |
|------|-------|-------|-------|-------|-------|--------|-------|
| Char | u     | v     | w     | x     | y     | z      | Space |

---

##  Setup & Workflow

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
1. In the Web App, choose either **Connect USB** or **Connect Bluetooth**.
2. A browser prompt will appear asking for permission. Select your Arduino's COM port or your generic BLE module.
3. Ensure **Voice Feedback** is toggled ON if required.
4. Begin typing on the 10-key hardware! The virtual keys will flash green, mistakes can be deleted with Backspace, and words will fill out.

> **Note on Simulator Mode:** If you do not have the hardware configured yet, simply click **"Try Simulator"** in the header. You can then use your regular PC keyboard to type letters and simulate the hardware behavior.

### 4. Global OS Voice Support (Optional)
If you want to use the keyboard outside the web app (e.g., in Notepad or Word) with voice feedback:
1. Ensure your device is plugged in via USB.
2. Install Python dependencies: `pip install pyserial pynput pywin32`
3. Run the script: `python keystroke.py`
4. The script will auto-detect your COM port and use the native Windows SAPI voice engine to speak your characters globally as you type.

---

##  Project Structure

```text
├── sketch.ino               # Hardware: The Arduino firmware logic
├── package.json             # Software: Node dependencies 
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
