# 🎰 Lucky Lottery

A modern, sleek lottery number generator built with **Vue 3**, **Vite**, and **Pinia**. Featuring a beautiful glassmorphism design, manual entry modes, and persistent history with memos.

---

## ✨ Features

- **🎲 Random Generator**: Instant generation of lottery numbers (6 numbers between 1-38, plus a special number between 1-8).
- **📝 Manual Edit**: Fine-tune your lucky numbers with an intuitive edit mode.
- **💾 Persistent History**: Your drawings are automatically saved to `localStorage`, so you never lose your history.
- **🗒️ Memos & Notes**: Add optional memos to each history entry to keep track of your thoughts or specific draws.
- **🎨 Glassmorphism UI**: A premium, translucent interface with smooth animations and responsive design.
- **🚀 Auto Save**: State is preserved across sessions, including your current unconfirmed draw.

---

## 🛠️ Tech Stack

- **Framework**: [Vue.js 3](https://vuejs.org/) (Composition API)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: [Vue Router](https://router.vuejs.org/)
- **Styling**: Vanilla CSS (Custom Glassmorphism)
- **Icons**: Material Symbols Rounded


---

## 📂 Project Structure

```text
lottery/
├── src/
│   ├── css/          # Custom global and component styles
│   ├── stores/       # Pinia state management (lottery.js)
│   ├── views/        # Main pages (Home, History)
│   ├── App.vue       # Root component
│   └── main.js       # Entry point
├── public/           # Static assets
├── index.html        # Main HTML file
└── vite.config.js    # Vite configuration
```

---

## 🔗 Useful Links

- [Official Taiwan Lottery Results](https://www.taiwanlottery.com/today_last_number)

---

*Updated on: 2026/01/07*
