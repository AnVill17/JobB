LangGraph / External Agent Integration

Where to attach your agent:
- File: `backend/controllers/uploadController.js`
- Inside `startAgentMission` we collect `resume` (multipart), `userId`, `config` and `callbackUrl`.
- Set `LANGGRAPH_URL` in `.env` (or `PYTHON_AGENT_URL` as a fallback).

Expected behavior of your agent endpoint:
- Accept multipart/form-data with fields:
  - `resume` (file)
  - `userId` (string)
  - `config` (JSON string of preferences)
  - `callbackUrl` (string) - backend endpoint to POST application(s) results back to: `http://localhost:5000/api/applications`

Callback format (recommended):
- POST to `http://localhost:5000/api/applications` with a JSON body matching the Application schema (fields such as `company`, `jobTitle`, `status`, `coverLetter`, `resumePath`)

Notes & TODOs:
- The controller will attempt to POST to `LANGGRAPH_URL` when configured and will not fail the mission start if that call fails (it logs the error).
- Implement any authentication between backend and agent if needed.
- You may also implement a separate scheduling or queueing mechanism for long-running workflows.
