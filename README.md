# 🩸 TSOAC Reverse-Master

**An interactive clinical education dashboard for Target-Specific Oral Anticoagulants**

Built by [Blood Doctor](https://github.com/abdulmannan1974) — Consultant Haematologist, Director of Bangor Haemophilia Centre, Betsi Cadwaladr University Health Board.

---

## What it covers

Four TSOACs side by side: **Dabigatran · Rivaroxaban · Apixaban · Edoxaban**

| Tab | Content |
|-----|---------|
| Drug Profiles | Pharmacokinetics, half-life, renal clearance, animated bar charts |
| Lab Interpretation | Matrix of PT, aPTT, TT, anti-Xa, Hemoclot per drug |
| Management Protocol | Reversal agents with full **NICE TA697** restriction flagged |
| Quiz | 5 MCQs + 5 EMQs, reshuffled every attempt, final assessment with improvement map |

## Key clinical points built in

- Dabigatran 80% renal — AKI accumulation and dialysability
- Edoxaban contraindicated in AF when CrCl > 95 mL/min (paradoxical stroke risk)
- **NICE TA697** (updated Jan 2025): Andexanet Alfa approved for GI tract life-threatening bleeds only (apixaban/rivaroxaban)
- FFP has no role in any TSOAC reversal
- Calibrated anti-Xa is gold standard for Xa inhibitor quantification

## Features

- Light / Dark mode toggle
- Cursor-tracking 3D tilt cards
- Animated progress bars (IntersectionObserver)
- Heartbeat Blood Doctor logo
- Fisher-Yates shuffle on every quiz attempt (questions + options)
- Final assessment with tiered encouragement and topic-mapped improvement plan

## Tech stack

React 18 · TypeScript · Tailwind CSS 3.4 · shadcn/ui · Vite · Parcel (single-file bundle)

## Run locally

```bash
pnpm install
pnpm dev
```

## Build single-file HTML

```bash
bash scripts/bundle-artifact.sh
# Output: bundle.html
```

---

> "Four TSOACs. Four different clearance profiles. One wrong decision at 2am in A&E."
