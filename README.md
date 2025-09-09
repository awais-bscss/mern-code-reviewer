# mern-code-reviewer

This repository is a small MERN-style demo that provides an AI-powered code-review endpoint (backend) and a lightweight frontend UI to submit code and display the AI review.

## Quick overview

- Backend: Express server that exposes a single AI endpoint at `/ai/get-review`.
- Frontend: Vite + React app (editor + markdown-rendered AI response).

## Requirements (environment)

- Node.js 16+ (or compatible)
- An API key for the Google Generative AI client: set `GOOGLE_API_KEY` in the backend environment.

## Environment variables

- `GOOGLE_API_KEY` — required for AI calls.
- `PORT` — optional (default: `5000` in `server.js`).
- Frontend dev server typically runs on `5173` (Vite default) and the backend allows CORS for `http://localhost:5173`.

## Run (local development)

Open two terminals (PowerShell) — one for backend, one for frontend.

Backend (from `backend/`):

```powershell
cd backend; npm install; npm run start # or: node server.js
```

Frontend (from `frontend/`):

```powershell
cd frontend; npm install; npm run dev
```

If your `package.json` uses different scripts, use the appropriate npm script (for example `npm start` or `npm run dev`).

## API: Endpoints

POST /ai/get-review

- Description: Send a code snippet to the AI service and receive a formatted code review.
- URL: http://localhost:4000/ai/get-review (adjust port to backend `PORT` — default in this repo may be `5000`)
- Method: POST
- Request headers: `Content-Type: application/json`
- Request body (JSON):

```json
{
  "code": "function greet() { console.log(\"Hi\"); }"
}
```

- Success response (200):

```json
{
  "text": "<AI generated markdown review>"
}
```

- Error responses:
  - 400: `{ "error": "Prompt is required" }` — when `code` is missing.
  - 500: `{ "error": "Something went wrong" }` — server/AI failures.

### Example: curl (PowerShell)

```powershell
curl -Uri http://localhost:4000/ai/get-review -Method POST -ContentType 'application/json' -Body (@{ code = 'console.log("hi")' } | ConvertTo-Json)
```

### Example: Axios (frontend)

```javascript
import axios from "axios";

const res = await axios.post("http://localhost:4000/ai/get-review", {
  code: myCode,
});
console.log(res.data.text);
```

## Frontend: notes & best practices

- Keep the editor isolated from business logic. The frontend should only collect the code string and display the returned markdown.
- UX: show loading state, handle network errors, and display helpful error messages returned by the API.
- Security: never embed secret keys in frontend code. The frontend only talks to your backend.
- Performance: debounce the editor autosave/preview features if you implement them. Don’t send large payloads automatically.

Recommended quick checks and small improvements:

- Limit payload size before sending. Example (in React) — check length and refuse if too large:

```javascript
// before sending
if (code.length > 50_000) {
  alert("Code too large. Please submit a smaller snippet.");
  return;
}
```

- Show a spinner while awaiting the API and disable the button to prevent duplicate requests.

## Backend: notes & best practices

- Validate and sanitize inputs. The backend must never trust client data.
- Protect your AI key: keep it in environment variables and out of source control.
- Add rate limiting and request size limits to defend against abuse.
- Add structured logging and better error messages for debugging.
- Use proper CORS configuration for allowed origins in production.

Small example improvements (illustrative; do not copy blindly):

1. Guard in controller (validate payload & size):

```javascript
// In controller (pseudo)
const code = (req.body.code || "").toString();
if (!code.trim()) return res.status(400).json({ error: "Prompt is required" });
if (code.length > 200_000)
  return res.status(413).json({ error: "Payload too large" });
// continue to call AI service
```

2. Basic rate limiting (use `express-rate-limit`):

```javascript
const rateLimit = require("express-rate-limit");
app.use("/ai", rateLimit({ windowMs: 60_000, max: 30 }));
```

3. Limit JSON size (Express built-in):

```javascript
app.use(express.json({ limit: "200kb" }));
```

4. Example safe CORS (allow only known origin):

```javascript
app.use(
  cors({ origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173" })
);
```

## Security considerations

- Never commit `GOOGLE_API_KEY` or other secrets. Use `.env` and add `.env` to `.gitignore`.
- Sanitize any data that might be rendered in the frontend.
- Monitor usage and billing for the Generative AI key.

## Tests & reliability

- Add simple unit tests for the controller/service. At minimum, test:
  - Missing `code` returns 400.
  - Oversized payload returns 413.
  - Service errors return 500 with a helpful message.

## What I changed here

- Expanded `README.md` with runnable instructions, endpoint docs, examples, and practical frontend/backend best-practice recommendations.

## Next steps (suggested)

1. Add input validation middleware (express-validator) and rate-limiter to `backend/src/app.js`.
2. Add a small loading state and payload-size guard in the frontend `App.jsx`.
3. Add basic tests for the controller.

---

Requirements mapping:

- Create endpoint docs: Done
- Add frontend best-practice guidance and examples: Done
- Add backend best-practice guidance and examples: Done

If you want, I can implement the small backend controller guard and the frontend payload-size guard as code edits next.
