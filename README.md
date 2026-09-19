# 🎙️ VoiceStock AI — Voice-Based Inventory Management for Small Businesses

> **GigPoint Hackathon Project**  
> An AI-powered, voice-first inventory assistant tailored for small business owners and shopkeepers in India. Understands Hinglish, natural speech, and common Indian trade units.

---

## 📌 Problem Statement

Millions of small business owners (kirana stores, retail shops, traders) manage inventory using paper notebooks, calculators, or WhatsApp messages. This leads to:
- Frequent stock shortages or excess overstock.
- Typing frustration on small mobile screens.
- Difficulty using English-only inventory software.
- Inability to quickly check current stock or reorder requirements.

**VoiceStock AI** solves this with a **Voice-First**, zero-typing application that allows shopkeepers to add, remove, and query stock using natural spoken language (English, Hindi, Telugu, and Hinglish).

---

## 🌟 Key Features

### P0 (Core MVP Features)
- 🎙️ **Voice Stock-In**: e.g., *"10 bags rice add karo"* updates stock automatically.
- 📉 **Voice Stock-Out**: e.g., *"5 carton biscuits hata do"* decreases stock with negative stock validation.
- ❓ **Natural-Language Inventory Queries**: e.g., *"Rice ke kitne bags hain?"* returns real-time MongoDB stock count.
- 🚨 **Low-Stock & Out-of-Stock Alerts**: Instant notification when items drop below threshold.
- 📦 **Indian Trade Unit Normalization**: Supports `pcs`, `kg`, `grams`, `bags`, `cartons`, `boxes`, `dozens`, `litres`, `quintals`, `bottles`, `packets`.
- 🇮🇳 **Multilingual & Hinglish Support**: Parser understands natural mixed-language phrasing without requiring translation.
- 🛡️ **Voice Confirmation Guard**: AI interprets intent; backend validates and displays a confirmation card before executing database mutations.
- 📊 **Real-time Dashboard**: Overview of 24 pre-seeded products, low stock items, and recent activity logs.
- 🔄 **Resilient Storage Engine**: MongoDB Atlas integration with automatic zero-downtime fallback store.

---

## 🏗️ System Architecture & Speech Pipeline

```
[ Microphone ]
      │
      ▼ (Audio Capture / Browser Web Speech API)
[ Speech-to-Text Transcript ]
      │
      ▼
[ FastAPI Backend ] ───► [ Gemini 2.5/1.5 Flash LLM + Hinglish NLP Parser ]
      │                                       │
      ▼                                       ▼
[ Business Validation ] ◄─────── [ Structured JSON Intent ]
      │  (Qty > 0, Negative Stock Check, Unit Normalization, RequestId Deduplication)
      │
      ├───► [ MongoDB Atlas / In-Memory Store ]
      │
      ▼
[ Voice Confirmation / TTS Audio Response ] ───► [ React UI Dashboard ]
```

> **CRITICAL RULE**: The AI model is **NOT** the source of truth. AI parses speech into intent; the backend validates business rules; MongoDB stores the single source of truth.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS v4, Lucide React icons, Axios, Web Speech API (STT & TTS)
- **Backend**: Python 3.13, FastAPI, Pydantic v2, Uvicorn, PyMongo, Motor
- **AI / NLP**: Gemini AI API (`gemini-2.5-flash`) + Resilient Hybrid Hinglish Rule-based Parser Fallback
- **Database**: MongoDB Atlas (with in-memory fallback for zero-downtime execution)

---

## 📦 Database Schema

### `products` Collection
```json
{
  "_id": "uuid-string",
  "name": "Rice",
  "normalizedName": "rice",
  "unit": "bags",
  "quantity": 25.0,
  "lowStockThreshold": 5.0,
  "price": 1500.0,
  "category": "Grains",
  "createdAt": "2026-09-19T16:15:00Z",
  "updatedAt": "2026-09-19T16:15:00Z"
}
```

### `transactions` Collection
```json
{
  "_id": "uuid-string",
  "productId": "uuid-string",
  "productName": "Rice",
  "action": "ADD",
  "quantity": 10.0,
  "unit": "bags",
  "previousQuantity": 15.0,
  "newQuantity": 25.0,
  "source": "VOICE",
  "transcript": "10 bags rice add karo",
  "requestId": "unique-request-id",
  "createdAt": "2026-09-19T16:15:00Z"
}
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status & AI provider state |
| `GET` | `/api/products` | Get list of products with search & status filter |
| `POST` | `/api/products` | Add a new product to inventory |
| `GET` | `/api/products/{id}` | Get product details by ID |
| `PATCH` | `/api/products/{id}` | Update product parameters |
| `DELETE` | `/api/products/{id}` | Delete product from inventory |
| `POST` | `/api/inventory/mutate` | Execute validated stock ADD / REMOVE operation |
| `POST` | `/api/inventory/query` | Process natural language inventory queries |
| `GET` | `/api/inventory/low-stock` | Get items requiring immediate reorder |
| `GET` | `/api/inventory/stats` | Dashboard statistics counters |
| `POST` | `/api/inventory/seed` | Reset demo dataset with 24 realistic products |
| `POST` | `/api/voice/parse` | Parse transcript into structured intent JSON |
| `POST` | `/api/voice/command` | End-to-end voice transcript processor |
| `GET` | `/api/transactions` | History log of stock movements |

---

## ⚡ Quick Start & Local Setup

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1

pip install -r requirements.txt

# Start backend server
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
*Backend API will run at `http://127.0.0.1:8000`*

### 2. Frontend Setup
```bash
cd frontend
npm install

# Start frontend dev server
npx vite --host 127.0.0.1 --port 5173
```
*Frontend app will run at `http://127.0.0.1:5173`*

---

## 🧪 Running Automated Tests

Run backend pytest suite verifying inventory business rules, unit normalizations, negative stock prevention, and Hinglish intent parsing:
```bash
cd backend
python -m pytest tests/
```

---

## 🎬 2-Minute Hackathon Demo Script

1. **Dashboard Overview**: Open app at `http://127.0.0.1:5173`. Show 24 products, 3 low stock items, 1 out-of-stock item.
2. **Voice Stock-In**: Click microphone button. Say or click preset: `"10 bags rice add karo"`.
3. **Intent Parsing & Confirmation**: Show parsed intent (`ADD`, `Rice`, `10`, `bags`). Click **Confirm**.
4. **Database & UI Sync**: Watch stock increase from 25 to 35 bags; activity log updates instantly.
5. **Natural Language Query**: Click microphone. Ask: `"Rice ke kitne bags hain?"`. System responds: *"You currently have 35 bags of Rice."*
6. **Voice Stock-Out**: Say: `"5 carton biscuits hata do"`. Stock decreases with confirmation.
7. **Low Stock Query**: Ask: `"Which products are low?"`. System returns exact low stock items.

---

## 🏆 Suggested 2-Minute Judge Presentation

> *"Judges, over 12 million Kirana shopkeepers in India manage inventory using memory or notebooks because traditional software requires complex typing in English. We built **VoiceStock AI**—a voice-first inventory assistant that speaks Hinglish. When a shopkeeper says '10 bags rice add karo', our AI intent engine parses the trade unit, validates business rules on FastAPI, updates MongoDB, and responds via speech synthesis. It eliminates typing, supports common trade units like cartons, quintals, and bags, and prevents negative stock errors. Most importantly, AI doesn't touch the database directly—our backend acts as a strict guard. VoiceStock AI brings voice-first automation to India's retail backbone."*

---

## 🚀 Future Roadmap (Post-Hackathon)
- [ ] Offline local Whisper STT model integration for zero-internet environments.
- [ ] WhatsApp voice note integration via Twilio / WhatsApp Business API.
- [ ] OCR receipt scanning to auto-populate stock-in from supplier invoices.
- [ ] Multi-store inventory sync & GST invoice generation.
