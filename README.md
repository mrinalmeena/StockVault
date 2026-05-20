# 🏦 StockVault — Portfolio Tracker

A sophisticated, interactive stock portfolio tracker with a stunning dark olive green UI, universe-themed animations, and real-time market data.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

## ✨ Features

- **Real-time Stock Prices** — Powered by Alpha Vantage API with 15-minute cache
- **Portfolio Dashboard** — Total invested, current value, and gain/loss tracking
- **User Authentication** — Sign up, login, and password reset (localStorage-based)
- **Interactive Universe Background** — Parallax starfield, floating spiral galaxy, nebulae, shooting stars
- **Landing Page** — Split-screen design with animated tech patterns and floating stock cards
- **3D Fintech Icons** — 18 cursor-reactive floating SVG icons
- **Glassmorphism UI** — Dark olive green palette with glass cards and smooth animations
- **Responsive Design** — Works on desktop and mobile
- **Zero Dependencies** — Pure HTML, CSS, and vanilla JavaScript

## 🚀 Quick Start

1. Clone the repo:
   ```bash
   git clone https://github.com/mrinalmeena/StockVault.git
   cd StockVault
   ```

2. Add your Alpha Vantage API key in `app.js` (line 2):
   ```js
   const API_KEY = "YOUR_API_KEY";
   ```
   Get a free key at [alphavantage.co](https://www.alphavantage.co/support/#api-key)

3. Serve locally:
   ```bash
   python3 -m http.server 8090
   ```

4. Open `http://localhost:8090`

## 🎨 Design

- **Theme:** Dark olive green with gold accents
- **Background:** Interactive starfield canvas with parallax, spiral galaxy, nebula clouds
- **Cards:** Glassmorphism with gradient top borders
- **Typography:** Inter + Playfair Display (Google Fonts)

## 📁 Structure

```
├── index.html    # All pages (Landing → Auth → Dashboard)
├── styles.css    # Complete styling with olive green theme
├── app.js        # Logic, animations, API integration
└── Frame 1.png   # Design reference
```

## 📊 API

Uses [Alpha Vantage](https://www.alphavantage.co/) `GLOBAL_QUOTE` endpoint.
- Free tier: 25 calls/day, 5/minute
- Prices are ~15 min delayed
- Results cached in localStorage for 15 minutes

## 📄 License

MIT
