# Clyric 

Clyric is an advanced, full-stack real-time competitive programming, online judge, and mock interview practice platform. It combines the rigorous code execution capabilities of an online judge with collaborative peer-to-peer live video interview rooms, gamified learning (quests & streaks), an AI-powered coding assistant, and comprehensive performance analytics.

##  Tech Stack

### Frontend
- **Framework**: React 19, Vite (Rolldown-Vite)
- **Styling**: Tailwind CSS v4, DaisyUI, Framer Motion, GSAP
- **State & Data Fetching**: TanStack React Query v5
- **Editor**: Monaco Editor (`@monaco-editor/react`)
- **Graphics**: Three.js, React Three Fiber, OGL

### Backend
- **Framework**: Node.js (v22.x), Express 5
- **Database**: MongoDB & Mongoose v8 (utilizing aggregation pipelines & atomic transactions)
- **Real-Time Engine**: Socket.IO v4.8 (WebSockets) + WebRTC P2P Signaling
- **Execution Engine**: Custom Process Sandbox + WASI runtime
- **Background Jobs**: Inngest v3 (Event-driven asynchronous processing)

### Authentication & Services
- **Auth**: Clerk (`@clerk/express`, `@clerk/clerk-react`) + Custom JWT (Admin)
- **AI**: Google Generative AI API (Gemini)
- **File Storage**: Cloudinary, Multer

##  Project Structure

```text
Clyric/
├── BackEnd/
│   ├── src/
│   │   ├── config/          # Environment & Cloudinary configs
│   │   ├── controllers/     # API request handlers
│   │   ├── judge/           # Core Online Judge Engine (Runners, Sandboxes, WASM)
│   │   ├── lib/             # Utilities (Socket.IO, Inngest, DB, Crypto)
│   │   ├── middleware/      # Auth & Subscription gating
│   │   ├── models/          # Mongoose DB Schemas (20+ models)
│   │   ├── routes/          # Express API routes
│   │   ├── services/        # Business logic (Code execution, Payments, Quests)
│   │   └── server.js        # Main entry point
│   ├── Dockerfile           # Backend containerization
│   └── package.json
│
├── FrontEnd/
│   ├── src/
│   │   ├── api/             # Axios API client wrappers
│   │   ├── components/      # Reusable UI, 3D graphics, Chatbot, WebRTC logic
│   │   ├── context/         # React Context providers
│   │   ├── hooks/           # Custom React hooks (useWebRTCSession, etc.)
│   │   ├── Pages/           # Application route pages
│   │   ├── prompts/         # AI Assistant context & prompt engineering
│   │   ├── App.jsx          # Router configuration
│   │   └── index.css        # Tailwind directives & global styles
│   ├── vite.config.js
│   └── package.json
│
└── package.json             # Root workspace concurrently runner
```

##  Installation & Setup

### 1. Prerequisites
- **Node.js**: v22.x or higher
- **MongoDB**: Local instance or MongoDB Atlas cluster
- **C/C++ Compiler**: GCC (MinGW for Windows) installed to execute C++ code natively. (See `install_gcc.ps1`)
- **Python & Java**: Installed and added to system PATH for multi-language execution.

### 2. Clone & Install Dependencies
```bash
# Clone the repository
git clone <your-repo-url>
cd Clyric

# Install dependencies for both Frontend and Backend concurrently
npm run build
```
*(Or run `npm install` inside both `FrontEnd` and `BackEnd` directories manually).*

### 3. Environment Variables
You need to set up two `.env` files.

**Backend (`BackEnd/.env`):**
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret
CLERK_PUBLISHABLE_KEY=your_clerk_publishable
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ESEWA_PAYMENT_URL=https://rc-epay.esewa.com.np/api/epay/main/v2/form
ESEWA_MERCHANT_CODE=your_merchant_code
ESEWA_SECRET_KEY=your_esewa_secret
KHALTI_SECRET_KEY=your_khalti_secret
ADMIN_JWT_SECRET=your_jwt_secret
```

**Frontend (`FrontEnd/.env`):**
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Running the Application (Development)
The root `package.json` uses `concurrently` to spin up both servers at once.

```bash
# From the root directory
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

##  Architecture Highlights

- **Sandboxed Code Execution**: The judge module isolates executions using Node.js child processes. It strips away standard environment variables (`safeEnv`) to prevent secret leakage and strictly enforces runtime limitations.
- **WASI Native Runtime**: Integrates `wasiRuntime.js` utilizing the Node.js `wasi` module to compile and run WebAssembly binaries inside restricted file-system environments (`/sandbox`).
- **WebRTC Candidate Buffering**: The custom `useWebRTCSession.js` hook queues ICE candidates (`pendingIceRef`) arriving before remote descriptions are applied, resolving common signaling race conditions in P2P negotiation.
- **Event-Driven Subscriptions**: Integrates with Inngest to handle asynchronous processing tasks (like Clerk user webhooks) without blocking the main Express thread.
- **Atomic Transactions**: Leverages MongoDB transactions during payment callbacks (eSewa & Khalti) to ensure robust subscription creations and tier assignments without race conditions.
