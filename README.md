Overview

Citizens often struggle to use government services. Information is scattered across portals, written in English or formal Hindi, and hard to follow. Incomplete applications lead to rejections, and applicants rarely know where their request stands.

The Citizen Services Agent addresses this with one conversational agent that can:

Inform: answer questions about schemes, taxes, pensions and certificates in regional languages.
Assist: guide users step by step through an application, collecting details and checking documents.
Track: show application status on a timeline and send proactive updates when it changes.
Features
Module	Description
Knowledge Q&A	Answers grounded only in a curated knowledge base, with a source chip on every answer. If the answer is not in the knowledge base, the agent says so and points to the official portal.
Guided applications	One field at a time, with format validation (phone, pincode, dates), document upload, a review screen, and a generated application ID (APP-YYYY-XXXXXX).
Document check	Simulated verification of file type, size and required document slots, with a pass/fail reason.
Status tracking	Timeline: Submitted → Under Review → Verified → Approved / Rejected.
Proactive updates	Notification centre and WhatsApp-style messages triggered by status changes.
Multilingual	English, Hindi, Marathi, Tamil and Bengali, in text and voice.
Admin view	List of applications with status override for demo control.
Simulated Channels

All channels call one shared agent service, so behaviour is identical everywhere.

Channel	How it works in this prototype
Web chat	Text chat at /chat.
Voice	Microphone button in chat: speech-to-text, agent, spoken reply (Web Speech API).
WhatsApp	/whatsapp-sim is a phone-style chat window using the same agent and receiving the same status updates.
Phone call	/call-sim is a call UI (dial, hang up, live transcript) using the same voice pipeline.

Channel adapters sit behind a common interface, so real Twilio or WhatsApp Business integrations can replace the simulators without changing the agent.

Architecture
 Web chat   Voice   WhatsApp sim   Call sim
     \        |          |            /
      \-------+----------+-----------/
                    |
            Channel adapters
                    |
           Shared agent service  ---->  Knowledge base (JSON)
                    |
            Application logic
                    |
              SQLite (Prisma)
        applications, documents, status events
Presentation: responsive, mobile-first web UI.
Agent: Gemini API with a locked system prompt and retrieval from the local knowledge base.
Knowledge base: structured JSON entries with eligibility, required documents, steps, official portal URL and last-updated date.
Data: SQLite via Prisma.
Status simulator: a timer-based job that advances application statuses and writes status events.
Tech Stack
Next.js (App Router), TypeScript, Tailwind CSS
Prisma with SQLite
Gemini API
Web Speech API (speech recognition and speech synthesis)
next-intl for UI localisation
Getting Started
Prerequisites
Node.js 18 or later
A Gemini API key
Setup
bash
# 1. Clone the repository
git clone <your-repo-url>
cd citizen-services-agent

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# then edit .env and add your key

# 4. Set up the database and seed fake data
npx prisma migrate dev
npx prisma db seed

# 5. Start the development server
npm run dev

Open http://localhost:3000.

Environment Variables
Variable	Purpose
GEMINI_API_KEY	API key for the agent. Never commit this.
DATABASE_URL	SQLite path, for example file:./dev.db.

Voice features rely on the browser's Web Speech API. Chrome or Edge on desktop or Android gives the best results. Language support varies by browser and device.

Pages
Route	Purpose
/	Landing page with three entry points: Ask, Apply, Track
/chat	Question-and-answer chat with voice
/apply/[scheme]	Guided application flow
/track	Enter an application ID to see its timeline
/whatsapp-sim	WhatsApp channel simulator
/call-sim	Phone-call channel simulator
/admin	Application list and status override (demo control)
Project Structure

Adjust to match the generated code.

.
├── data/schemes/        # knowledge base (JSON, one file per service)
├── prisma/              # schema, migrations, seed script
├── src/
│   ├── app/             # pages and API routes
│   ├── components/      # UI components
│   ├── lib/agent/       # shared agent service and prompts
│   ├── lib/channels/    # channel adapter interface and simulators
│   └── messages/        # translation files per language
├── .env.example
└── README.md
What Is Real and What Is Mocked
Component	Status
AI answers (Gemini)	Real
Knowledge base	Curated sample set of 8-10 services, not a live feed of official data
Speech-to-text and text-to-speech	Real, browser-based
Document verification	Mock: checks file type, size and slot presence only
WhatsApp channel	Simulated
Phone-call channel	Simulated
Application status changes	Simulated by a timer job
Government system integration	None
Safety and Privacy
Grounded answers: the agent answers only from the knowledge base and never invents eligibility rules, amounts or deadlines.
Auditability: every answer is logged with the knowledge base entries used.
Prompt-injection guard: system instructions cannot be overridden by user messages or by text inside uploaded documents.
Rate limiting: applied to the agent API route.
Data minimisation: the app uses synthetic data only. ID-like inputs are masked, and real Aadhaar or PAN numbers should not be entered.
Accessibility: mobile-first layout, large touch targets, high contrast, icon-plus-short-sentence design, and voice on every screen.
Limitations
The knowledge base covers a small set of services, so many real-world questions fall outside it.
Document verification does not authenticate documents against government records.
Status updates are simulated and do not reflect real processing.
Translation quality for Marathi, Tamil and Bengali should be reviewed by native speakers before any real-world use.
Future Scope
Real WhatsApp Business and telephony integrations through the channel adapters
Authorised integration with systems such as DigiLocker and state portals
OCR-based document extraction and validation
More schemes, states and languages
Offline and low-bandwidth modes for rural users
