## OPUS – AI‑Powered Crypto Trading 

OPUS is a Next.js 15 + React 19 dashboard for AI‑assisted, non‑custodial crypto trading.  
It focuses on **portfolio visibility**, **AI token scanning**, **AI trade proposals**, **EIP‑712 signing**, and **copy‑trading**, presented in a polished, trading‑terminal‑style UI.

---

## Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **UI**: React 19, Radix UI, Tailwind CSS v4, shadcn-style components
- **Styling**: Tailwind CSS, custom CSS modules, framer‑motion animations
- **State / Forms**: React Hook Form, Zod
- **Charts & Panels**: Recharts, custom dashboard components
- **Web3**: Custom web3 context + signature / wallet modals

---

## Project Structure {</>}

- **`app/`**
  - `layout.tsx` – root layout, fonts, theme provider
  - `page.tsx` – landing page wiring the hero, bento sections, pricing, FAQ, etc.
  - `app/page.tsx` – main in‑app trading dashboard shell
  - `dashboard/page.tsx` – dedicated dashboard route (portfolio, scanner, activity, etc.)

- **`components/app/`** – high‑level app views
  - `dashboard.tsx` – main dashboard layout (sidebar + content panels)
  - `sidebar.tsx` – navigation + wallet connect entrypoint
  - `portfolio.tsx` – portfolio tracker view
  - `trading.tsx` – trading / proposals area
  - `activity.tsx` – activity & alerts feed

- **`components/dashboard/`** – dashboard widgets & modals
  - `dashboard-header.tsx` – top header (balances, quick actions)
  - `portfolio-tracker.tsx` – total portfolio value, positions, PnL, liquidation warnings
  - `ai-token-scanner.tsx` – “Scan Market” entry, token scores, risk/liquidity reasons
  - `trade-proposal-modal.tsx` – AI “Suggest Trade” proposal (side, size, risk, slippage)
  - `eip712-signature-modal.tsx` – human‑readable EIP‑712 summary with Approve / Reject
  - `copy-trading-section.tsx` – list of top traders, strategy, PnL and risk score
  - `activity-panel.tsx` – trade alerts, liquidations, whale activity, timestamped logs

- **`components/web3/`**
  - `wallet-connect-modal.tsx` – wallet selection (MetaMask, WalletConnect, etc.)
  - `signature-modal.tsx` – generic signing UX

- **`components/bento/` & marketing components**
  - `hero-section.tsx`, `bento-section.tsx`, `pricing-section.tsx`, `faq-section.tsx`, etc.
  - Showcase the product, AI features, integrations, and social proof on the landing page.

- **`lib/web3/`**
  - `context.tsx` – web3 provider, connection state, selected wallet
  - `contracts.ts` – contract addresses / ABIs stubs
  - `types.ts` – shared web3 types

---

## User Flow

1. **Landing → App**
   - User lands on the marketing page (`/`), sees hero, product preview, AI features and pricing.
   - Clicking **“Open App” / “Launch Dashboard”** navigates to the main dashboard route (`/app` or `/dashboard`).

2. **Connect Wallet**
   - From the sidebar or header, the user clicks **“Connect Wallet”**.
   - `wallet-connect-modal` opens, allowing selection of wallets (MetaMask, WalletConnect, etc.).
   - On success, the dashboard loads on‑chain balances and positions into the portfolio tracker.

3. **Portfolio Tracker**
   - `portfolio-tracker` shows:
     - **Total portfolio value**
     - **Token list / positions**
     - **PnL and leverage info**
     - **Liquidation warnings** for risky positions

4. **AI Token Scanner**
   - In the **AI Token Scanner** panel (`ai-token-scanner`), user clicks **“Scan Market”**.
   - The panel lists top Web3 tokens & digital assets with:
     - **Score (0–100)**
     - **Risk level**
     - **Liquidity profile**
     - **Reasoning** (why the score / risk was assigned)

5. **AI Trade Proposal**
   - From a token row, user clicks **“AI Suggest Trade”**.
   - `trade-proposal-modal` opens with:
     - **Buy / sell recommendation**
     - **Reasoning** and **risk score**
     - **Estimated slippage & liquidation zone**
     - Button: **“Generate Signature Request”**

6. **EIP‑712 Signature**
   - Clicking **“Generate Signature Request”** opens the **EIP‑712 Signature** popup
     (`eip712-signature-modal`).
   - Shows a **human‑readable summary** of the intent (token, direction, size, risk, etc.).
   - User chooses **Approve** or **Reject**:
     - **Approve**: forwards data to wallet for signing and execution.
     - **Reject**: closes the modal and logs a cancelled action in `activity-panel`.

7. **Copy‑Trading Section**
   - The **Copy‑Trading** area lists:
     - **Top traders**
     - Their **strategy description**
     - **PnL** and **risk score**
   - User can click **“Mirror Strategy”** to follow a trader’s moves (conceptually wired to the same
     signing flow as above).

8. **Activity / Alerts Panel**
   - `activity-panel` aggregates:
     - **Trade alerts** (executed / failed / cancelled)
     - **Liquidation warnings**
     - **Whale activity**
     - All with **timestamps** and contextual metadata.

---

## Running the Project

1. **Install dependencies**

```bash
pnpm install
```

2. **Start the development server**

```bash
pnpm dev
```

Then open `http://localhost:3000` (or the port shown in the terminal) in your browser.

3. **Production build**

```bash
pnpm build
pnpm start
```

---

## Notes & Future Work

- The current repo focuses on **frontend UX and flows**; real on‑chain execution, price feeds,
  and risk engines should be wired to production‑grade Web3 infrastructure.
- Extend `lib/web3/contracts.ts` and `lib/web3/context.tsx` with actual protocols, RPC URLs, and
  signing logic when integrating with live networks.
