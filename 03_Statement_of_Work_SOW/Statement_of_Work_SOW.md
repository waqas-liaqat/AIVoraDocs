# STATEMENT OF WORK (SOW)
**AIVORA AUTOMATIONS**  
*Website:* https://aivoraai.online/ | *Email:* info@aivoraautomations.com

---

**SOW Number:** `AIV-SOW-[YEAR]-[001]`  
**Governing MSA Reference:** `AIV-MSA-[YEAR]-[001]`  
**Issue Date:** `[DD/MM/YYYY]`  
**Target Completion Date:** `[DD/MM/YYYY]` *(Approx. 10 business days from kickoff)*  

---

## 1. PROJECT IDENTIFICATION & PARTIES

- **Client Company:** `[Client Company Name]`
- **Client Project Lead:** `[Client Name, Title]`
- **Client Email:** `[client@company.com]`
- **Provider Lead:** `[Aivora AI Project Manager / Engineer]`
- **Project Title:** `[e.g., Autonomous WhatsApp & Voice Lead Qualification System]`

This Statement of Work ("**SOW**") is executed pursuant to and governed by the Master Services Agreement between **Aivora Automations** and **[Client Company Name]**.

---

## 2. PROJECT OBJECTIVE & SUCCESS CRITERIA

### 2.1 Project Objective
To engineer and deploy an autonomous AI agent and workflow automation pipeline that handles inbound customer inquiries, qualifies leads through structured conversational logic, books qualified prospects directly into the sales calendar, and synchronizes all contact records into the CRM in real time.

### 2.2 Measurable Success Criteria
1. **Response Latency**: AI chatbot responds to customer messages on WhatsApp/Web within `< 3 seconds`.
2. **Qualification Accuracy**: System accurately extracts required qualification parameters (e.g., budget, timeline, service interest, company size) with `>= 95%` accuracy.
3. **Calendar Automation**: Confirmed appointments are created directly in Google Calendar / Cal.com with automatic attendee invitations and SMS/Email reminders.
4. **CRM Data Sync**: 100% of qualified leads logged with enriched tags and deal stages in `[HubSpot / GoHighLevel / Zoho CRM]`.

---

## 3. TECHNICAL SPECIFICATIONS & TECH STACK

| Component Layer | Technology / Platform | Purpose & Implementation Details |
| :--- | :--- | :--- |
| **Conversational AI Engine** | **OpenAI GPT-4o / Claude 3.5 Sonnet** | Natural language comprehension, objection handling, intent recognition, and personalized responses. |
| **Workflow Automation Engine** | **n8n (Self-Hosted / Cloud) or Make.com** | Orchestration of webhooks, conditional routing, data transformations, API calls, and retry logic. |
| **Messaging Channel** | **WhatsApp Cloud API / Twilio** | Front-facing customer interface with automated session management and interactive buttons. |
| **Voice AI Agent (Optional)** | **VAPI + Deepgram / ElevenLabs** | Inbound/outbound conversational voice agent for live call qualification and booking. |
| **CRM & Database** | **HubSpot / GoHighLevel / Airtable** | Central repository for lead status, qualification notes, pipeline deals, and customer interaction history. |
| **Scheduling Engine** | **Google Calendar / Cal.com / Calendly** | Real-time availability check, slot reservation, and automated buffer management. |

---

## 4. DETAILED WORK BREAKDOWN & DELIVERABLES

```
========================================================================================
MODULE 1: AI CONVERSATIONAL ARCHITECTURE & PROMPT ENGINEERING
========================================================================================
Deliverable 1.1: System Prompt & Guardrails
- Development of system prompt defining persona, tone of voice, company knowledge, and boundary rules.
- Negative constraints preventing hallucinated pricing, unauthorized commitments, or off-brand responses.

Deliverable 1.2: 7-Stage Dynamic Qualification Flow
- Stage 1: Welcoming & Intent Capture
- Stage 2: Service / Requirement Assessment
- Stage 3: Timeline & Urgency Verification
- Stage 4: Budget / Capability Filter
- Stage 5: Contact Detail Extraction (Name, Email, Company)
- Stage 6: Live Calendar Slot Offering & Confirmation
- Stage 7: Summary & Human Handoff (if requested or out-of-bounds)

========================================================================================
MODULE 2: AUTOMATION WORKFLOWS & API INTEGRATION (n8n / Make.com)
========================================================================================
Deliverable 2.1: Inbound Webhook & Message Router
- Webhook listener for incoming messages; payload validation and duplicate message prevention.

Deliverable 2.2: CRM Integration Scenario
- Automatic contact lookup; create new contact or update existing record with conversational tags.
- Creation of CRM Deals in designated sales pipeline stages (e.g., "AI Qualified Lead").

Deliverable 2.3: Calendar Scheduling Integration
- Real-time API query to check calendar availability.
- Automated creation of calendar invite with meeting link and confirmation WhatsApp/Email to user.

Deliverable 2.4: Human Escalation & Failure Fallback Workflow
- Error handling logic: if AI confidence < threshold or user requests human agent, route conversation to human inbox with Slack/Email ping.

========================================================================================
MODULE 3: SYSTEM TESTING, USER ACCEPTANCE & HANDOVER
========================================================================================
Deliverable 3.1: Quality Assurance & Edge-Case Testing
- Stress-testing conversation flows with 50+ simulated user prompts (typos, edge cases, language switching).

Deliverable 3.2: Loom Video Walkthroughs & Documentation
- Step-by-step video guide explaining workflow logic, credential locations, and how to update knowledge base.
- Delivery of workflow export JSON files and API documentation.
```

---

## 5. OUT-OF-SCOPE WORK (BOUNDARIES)

To avoid project creep, the following items are strictly out-of-scope unless agreed upon via a formal Change Order:
- Custom mobile app or frontend web software development outside the defined chat widget/WhatsApp.
- Migration or cleanup of legacy CRM databases prior to integration.
- Payment of ongoing third-party API subscription costs (OpenAI, Make, VAPI, Twilio, WhatsApp API).
- Architectural redesign requested after the sign-off of Phase 1 prompts.

---

## 6. PROJECT MILESTONES & PAYMENT SCHEDULE

| Milestone Ref | Milestone Description | Target Timeline | Fee Breakdown |
| :--- | :--- | :--- | :--- |
| **M1: Kickoff Deposit** | Contract & SOW execution; access credentials provided. | Day 1 | **50% of Project Fee** (`$ [Amount]`) |
| **M2: Staging Delivery** | Core workflows, prompt logic, and CRM connections built and demonstrated in staging. | Day 7 | Milestone Review |
| **M3: Production Handover** | End-to-end testing complete, live deployment, handover SOP video delivered, 30-day warranty starts. | Day 10 | **50% Final Balance** (`$ [Amount]`) |

**Total Fixed Project Investment:** `$[TOTAL AMOUNT] [USD]`

---

## 7. ACCEPTANCE CRITERIA & SIGN-OFF

The project shall be deemed complete and accepted when the deliverables pass the Acceptance Criteria outlined in Section 2.2 during the 5-day User Acceptance Testing (UAT) window.

```
========================================================================================
AGREED AND ACCEPTED:

FOR AIVORA AUTOMATIONS:                       FOR CLIENT: [CLIENT COMPANY NAME]

Signature:  _____________________________     Signature:  _____________________________

Name:       [Authorized Representative]       Name:       [Client Signatory Name]

Title:      Lead AI Automation Engineer       Title:      [Client Signatory Title]

Date:       ____ / ____ / ________            Date:       ____ / ____ / ________
========================================================================================
```
