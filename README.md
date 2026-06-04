# 🌸 Kavi (කවි) — Sri Lanka's Smarter AI Shopping Agent

Kavi (කවි — meaning "poet" in Sinhala) is an immersive, culturally-tuned multilingual AI shopping assistant designed to connect customers with the live **Kapruka** catalog. Built for the **Kapruka Agent Challenge 2026**, Kavi guides shoppers all the way from product discovery to guest checkout via a premium, responsive full-screen chat application.

---

## ✨ Key Features

- 🎭 **Culturally Tailored Chat Experience**: Built with a warm, witty Sri Lankan personality. Kavi natively supports and dynamically switches languages between **English**, **Sinhala**, **Tamil**, and **Tanglish**.
- 🔌 **Live Kapruka MCP Integration**: Real-time integration with Kapruka's Model Context Protocol (MCP) server to browse catalog items, query specific products, and check availability.
- 🛍️ **Immersive Interactive UI**:
  - **Product Carousel & Grid**: Features smooth layout grids, star rating previews, and horizontal scroll snap carousels for easy navigation.
  - **Slide-in Cart Drawer**: Side drawer calculating accurate subtotals, flat Sri Lankan delivery fees (Rs. 350), and total pricing configurations.
  - **Pay Countdown Card**: Checkout card featuring 60-minute payment countdowns, urgent timer highlights, and call-to-action buttons with animated gradient shimmers.
- ⚡ **Dual-Backend AI Router (Gemini & Anthropic)**:
  - Dynamically routes requests through the **Google Gemini API** (`gemini-2.5-flash`) if `GEMINI_API_KEY` is present.
  - Automatically falls back to **Anthropic Claude 3.5 Sonnet** if running on `ANTHROPIC_API_KEY`.
- 🛡️ **Robust Error Resilience**: Gracefully intercepts billing limits (HTTP 400 credit errors) or rate limits (HTTP 429) on the server/client and translates them into friendly local error messages.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) & TypeScript (Strict Mode) |
| **Styling & Motion** | Tailwind CSS v3 & Framer Motion v11 |
| **Integrations** | Model Context Protocol (MCP) Streamable HTTP transport |
| **Fonts** | Google Fonts (Inter, Noto Sans Sinhala, Noto Sans Tamil) |

---

## 🚀 Setup & Local Installation

### 1. Clone the repository
```bash
git clone https://github.com/Tehan-Hewage/kavi.git
cd kavi
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env.local` file in the root directory:
```env
# Add either or both keys. Kavi will dynamically switch LLMs.
GEMINI_API_KEY=your_gemini_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to start shopping with Kavi!

---

## 🛡️ License

Built as an entry for the **Kapruka Agent Challenge 2026**. All rights reserved.
