# 🚀 Deploying Aivora DocFlow to Vercel (Step-by-Step)

Your full-stack **Aivora DocFlow** platform is fully configured and ready for **1-click deployment on Vercel**.

---

## 🌟 Method 1: Deploy via GitHub + Vercel Dashboard (Recommended)

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: Aivora DocFlow document studio and e-sign platform"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/aivora-docflow.git
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com) and log in.
   - Click **"Add New..." &rarr; "Project"**.
   - Select your GitHub repository (`aivora-docflow`).
   - Framework Preset: **Next.js** (Vercel detects this automatically).
   - Click **"Deploy"**.

3. **Done!**:
   - In ~45 seconds, your app will be live at `https://your-project.vercel.app`.
   - Your team can immediately start creating documents and generating live client links!

---

## ⚡ Method 2: Deploy via Vercel CLI (Instant from Terminal)

If you have the Vercel CLI installed:

```bash
# 1. Install Vercel CLI globally (if not installed)
npm i -g vercel

# 2. Run deploy
vercel

# 3. For production deployment:
vercel --prod
```

Follow the on-screen prompts (accept defaults). Vercel will build and give you a live production URL instantly!

---

## 🎯 How Your Team Uses the Live System:

1. **Agency Dashboard (`/`)**:
   - See all active client documents, deal values, and real-time completion stages.
   - Stage progress indicator:
     - 📝 **Draft (25%)**: Created, ready to send.
     - ✉️ **Sent (50%)**: Shared with client.
     - 👁️ **Viewed (75%)**: Client has opened and read the document.
     - ✍️ **Signed / Paid (100%)**: Client has digitally signed with verified timestamp.

2. **Creating a Document for a Specific Client (`/create`)**:
   - Pick any template (Contract/MSA, Proposal, SOW, NDA, Invoice, Quote, Receipt, Case Study).
   - Enter client name, price, scope, and milestone items.
   - Click **"Generate Client Link"** &rarr; Generates `yourapp.vercel.app/d/client-slug-123`.

3. **Sending to Client (`/d/[id]`)**:
   - Click **"Copy Link"** or **"Share on WhatsApp"**.
   - Send link to client via WhatsApp or Email.

4. **Client E-Signing (`/d/[id]`)**:
   - When the client opens the link, the system **automatically logs the view** and updates the dashboard status to **"Viewed by Client (75%)"**!
   - Client clicks **"Sign Document Now"** &rarr; draws or types their signature.
   - Submitting signs and locks the document with a legal timestamp.
   - Both client and agency can download a clean PDF copy anytime!

5. **Audit Trail & Activity Log (`/doc/[id]`)**:
   - Internal view showing exact date & time when the document was created, opened, and signed.
