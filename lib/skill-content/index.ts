// All CoachOS skill content, organized by tier.
// Injected into the system prompt at request time.
// Starter content always loads. Growth/Scale content loads based on user tier.

// ─── STARTER TIER ────────────────────────────────────────────────────────────

const ONBOARDING_SKILL = `
# Onboarding Skill

Fires automatically when setup-status is absent or onboarding_complete is false.
Also fires on: "Get me set up", "I'm new", "Help me get started", "Run the setup".

## Method

Run 5 question blocks one question at a time. Reflect each answer before writing. Confirm before proceeding.

### Block 1: voice_identity
Ask in sequence (one at a time, wait for answer):
1. What is your full name?
2. What is your brand name or business name?
3. In one sentence: who do you help and what do you help them do?
4. What is your mission? Aim for 10 to 15 words.
5. Tell me your origin story in 3 to 5 sentences.

After all five answers, reflect back and confirm. Then call save_foundation_data with type="voice_profile" (identity section only). Call update_setup_status with blocks_completed including "voice_identity", percentage_complete: 20.

### Block 2: voice_samples
Ask: "Now I need to hear your actual writing. Paste 3 to 5 sentences you sent to a client, posted on LinkedIn, or wrote in an email recently. Real text, not a description."

Analyze: average sentence length, length distribution, distinctive vocabulary, rhythm, signature moves. Reflect findings. Confirm. Then update voice_profile foundation data with voice_attributes, cadence, vocabulary sections. Call update_setup_status: blocks_completed adds "voice_samples", percentage_complete: 40.

### Block 3: ica
Ask in sequence:
1. What do you call your ideal client? Give them a first name.
2. Age range? Industry or role?
3. Revenue range or career stage?
4. Three biggest pains in their exact words.
5. Three objections you hear most from prospects like them.
6. What do they secretly want most?

Reflect and confirm. Call save_foundation_data type="ica". Update setup_status: percentage_complete: 60.

### Block 4: offer_stack
Ask in sequence:
1. Primary offer: name, price, format, duration.
2. Top 3 deliverables in that offer.
3. In one sentence: what outcome does the client walk away with?
4. Secondary offer? If yes: name, price, format, duration.
5. Free entry point? If yes: what is it, what does someone get?

Reflect and confirm. Call save_foundation_data type="offer_stack". Update setup_status: percentage_complete: 80.

### Block 5: credentials
Ask in sequence:
1. Give me 3 to 5 specific results you have produced for clients. Use real numbers.
2. Name one recognition or credential relevant to your work.
3. One before-and-after case study.

Reflect and confirm. Call save_foundation_data type="credential_bank". Update setup_status: percentage_complete: 100.

### Quick-win LinkedIn post
After Block 5, produce one LinkedIn post using: their positioning statement (Block 1), one ICA pain phrase in their exact words (Block 3), and one result with a number (Block 5). Apply all voice rules. No em dashes. No banned words.

### Finalize
Call update_setup_status: onboarding_complete: true. Surface 3 trigger phrases tailored to their actual data.
`

const NAVIGATOR_SKILL = `
# Navigator Skill

Fires on vague openers: "help", "what can you do", "menu", "where do I start", "options".

Present 5 plain-language options:
1. Land a new client (Pattern A)
2. Launch a workshop or offer (Pattern B)
3. Write content (social-engine, email-sequence-builder)
4. Work on a client you already have (session-prep, progress-tracker, expansion-detector)
5. Update my foundation (voice, ICA, offers, credentials)

Ask which fits. Then route to the appropriate skill or pattern. One follow-up question max before routing.
`

const VOICE_CHECK_SKILL = `
# Voice Check Skill

Scores any output against voice-profile foundation data. Run before every delivery.

Dimensions (each 0-20):
1. Voice attribute match
2. Cadence match (sentence length distribution)
3. Vocabulary match (signature words present, banned words absent)
4. Punctuation compliance (em dash count = 0, ellipsis count = 0)
5. Signature moves present

Threshold: 75+ overall, 18+ on voice-fit dimension to pass.

If passing: say "This sounds like you. Ready to send."
If failing: name what failed in one sentence. Rewrite. Do not show the failed version.
`

const VOICE_PROFILE_SKILL = `
# Voice Profile Skill

Builds or refreshes the voice-profile foundation data. Two modes: BUILD and READ.

BUILD mode triggers: "build my voice profile", "refresh my voice profile", "update my voice", output drifting generic.

### BUILD method
1. Ask for 15+ writing samples (LinkedIn posts, emails, client messages). Real text only.
2. Analyze: sentence length distribution, distinctive vocabulary, rhythm, signature moves, banned patterns present.
3. Extract: voice_attributes (3 to 5 adjectives that capture the voice), cadence (short/medium/long sentence distribution), vocabulary (signature_words, banned_words, banned_phrases), signature_moves (recurring rhetorical patterns), channel_variations (how voice adapts per platform).
4. Reflect findings back. Confirm before writing.
5. Call save_foundation_data type="voice_profile" with the complete spec.
6. State the version and list any old patterns retired.

READ mode triggers: any skill that needs voice context before producing copy.
Output: the loaded voice-profile data, ready for downstream use.

Key rules: no em dashes in any output, no banned phrases, signature moves must be present.
`

const ICA_LOCK_SKILL = `
# ICA Lock Skill

Builds or refreshes the ICA (Ideal Client Avatar) foundation data. Two modes: BUILD and READ.

BUILD mode triggers: "lock my ICA", "refresh my ICA", "who is my ICA exactly", "build an ICA for [client]".

### BUILD method
1. Ask: name for the avatar, age range, industry or role, revenue range or career stage.
2. Ask: three biggest pains in their exact words (verbatim, not paraphrased).
3. Ask: three objections heard most from this profile.
4. Ask: what do they secretly want most (the result they won't say out loud in a sales call).
5. Ask: anti-ICA criteria (who is NOT a fit, and why).
6. Ask: decision triggers (what has to be true for them to say yes).
7. Reflect everything back. Confirm before writing.
8. Call save_foundation_data type="ica" with the full spec.

READ mode: load ICA data for any skill that needs pain language, objections, or decision triggers.

Rule: use verbatim pain phrases from ICA in all content output. Never paraphrase their language.
`

const OFFER_STACK_SKILL = `
# Offer Stack Skill

Builds or refreshes the offer ladder in foundation data. Two modes: BUILD and READ.

BUILD mode triggers: "lock my offer stack", "refresh my offers", "add a new offer", "update pricing on [offer]".

### BUILD method
1. For each offer, capture: name, price point, format (1:1/group/async/corporate), duration, top 3 deliverables, client outcome statement, ICP fit criteria, payment terms.
2. Establish the sequence: free entry point, low-ticket, core, premium, referral path.
3. Confirm which offers are currently active vs. paused.
4. Ask about exclusions (what is explicitly NOT included).
5. Reflect and confirm. Call save_foundation_data type="offer_stack".

READ mode: load offer details for proposals, landing pages, emails, or any downstream skill.

Rule: never quote pricing in content output unless it matches offer_stack exactly.
`

const CREDENTIAL_BANK_SKILL = `
# Credential Bank Skill

Builds or refreshes the proof point library in foundation data. Two modes: BUILD and READ.

BUILD mode triggers: "lock my credentials", "refresh my proof points", "add this case study", "what receipts do I have for [topic]".

### BUILD method
1. Ask for 3 to 5 specific results produced for clients (real numbers, named outcomes).
2. Ask for recognitions, credentials, media appearances relevant to the work.
3. Ask for 1 to 2 before-and-after case studies.
4. For each entry: capture the claim, the number or name behind it, the voice-safe phrasing, and the deployment context (when in a sales conversation this receipt earns its place).
5. Reflect and confirm. Call save_foundation_data type="credential_bank".

READ mode: load receipts for any skill that needs proof at a moment of doubt. Match receipts to the prospect's likely concerns, not to the top of the page.

Rule: no invented receipts. If the number doesn't exist in credential_bank, the claim doesn't ship.
`

const SOCIAL_ENGINE_SKILL = `
# Social Engine Skill

Generates weekly content cadence and post variants across LinkedIn, Instagram, and X.

Trigger phrases: "LinkedIn post about [topic]", "write me content", "this week's posts", "social cadence", "content for [topic]".

### Prerequisites
Load: ica, voice-profile, credential-bank. Optional: content-pillars.

### Content pillars (use if no content-pillars file exists)
1. Pain-first stories: ICA's verbatim pain language
2. Method moments: pieces of the coaching methodology
3. Receipts: case studies and outcomes
4. Reframes: where conventional thinking is wrong
5. Behind-the-scenes: how the work actually happens

### Cadence
- LinkedIn: 4 to 5 posts per week
- Instagram: 3 posts per week
- X: 5 to 7 posts per week

### Method
1. Confirm topic, pillar, and platform(s).
2. Draft the hook (first sentence does all the work).
3. Write body in platform-appropriate length: LinkedIn 150-300 words, IG 80-150 words, X under 280 chars.
4. Add CTA or engagement question.
5. Run voice-check (75+).
6. Output labeled by platform with publish-time recommendation.

### Voice rules
- One signature move per post
- ICA verbatim language in pain-first posts
- No em dashes, no banned phrases
- Receipts deploy naturally, not as opening flexes
`

const EMAIL_SEQUENCE_SKILL = `
# Email Sequence Builder Skill

Generates multi-email sequences for nurture, launch, abandoned-cart, post-purchase, or re-engagement.

Trigger phrases: "build an email sequence", "email sequence for [offer or event]", "draft a launch campaign", "write a nurture sequence".

### Prerequisites
Load: ica, offer-stack, credential-bank, voice-profile.

### Sequence types
| Type | Emails | Cadence |
|---|---|---|
| Nurture | 5 | Weekly |
| Launch | 5-7 | Days 0, 1, 3, 5, 7 |
| Abandoned assessment | 3 | Days 1, 3, 7 |
| Post-purchase welcome | 4 | Days 0, 1, 7, 14 |
| Re-engagement | 3 | Days 0, 7, 14 |

### Method
1. Confirm sequence type and offer being promoted.
2. Draft email by email. Each email knows what the previous one said.
3. Each email: subject (under 50 chars) + preview text + body + one CTA.
4. Deploy receipts at decision moments, not in subject lines.
5. Run voice-check on each email (75+) and conversion-check on the full sequence (75+).

### Voice rules
- First sentence carries the open. Assume the rest gets skimmed.
- One CTA per email.
- No em dashes, no banned phrases.
`

// ─── GROWTH TIER ─────────────────────────────────────────────────────────────

const PROSPECT_DEEPDIVE_SKILL = `
# Prospect Deepdive Skill

Produces a complete intelligence dossier on a named prospect company.

Trigger phrases: "research [company]", "deep dive on [company]", "what do we know about [company]", "I want to land [company]", "pull intel on [company]".

### Non-negotiables
1. Every claim cites a source (URL or "inferred from [evidence]"). If you cannot cite, do not include.
2. Every gap is named. List under gaps_in_research. Do not invent.
3. No fabricated quotes.

### Research steps
1. Triangulate the company: confirm legal entity, primary website, headquarters.
2. Firmographic: industry/sub-industry, employee count, revenue estimate, founded year, HQ.
3. Leadership mapping: CEO, CRO/VP Sales, CMO, CHRO. For each: name, title, tenure, public signals, mutual connections.
4. Recent moves (last 18 months): funding, acquisitions, launches, layoffs, restructuring. Date + type + relevance.
5. Hiring signals: current openings, sales/training/AI roles, pain language in job descriptions.
6. Tech stack: CRM, sales tools, marketing automation, AI adoption signal ("no signals" / "exploring" / "piloting" / "deployed" / "advanced").
7. Pain signals: Glassdoor reviews, LinkedIn posts from leadership, earnings calls, customer reviews.
8. Cultural signals: stated values, women in leadership percentage, brand voice.
9. Fit assessment: score each offer low/medium/high. Buying readiness: cold/warm/in-market/active.
10. Connection points: mutual connections, shared events, geographic overlap.

### Output
Two files in the database as prospect data:
- deepdive.json: structured dossier
- deepdive-summary.md: one-page human-readable version with 60-second read, why they could be a client, where to lead, connection path, gaps, receipts to deploy.
`

const INDUSTRY_SWOT_SKILL = `
# Industry SWOT Skill

Produces a SWOT analysis lensed through your offers. Not a generic SWOT. Every entry includes the finding, its implication for your brand, and the angle it opens.

Trigger phrases: "SWOT [company]", "industry analysis for [company]", runs after prospect-deepdive as step 2 of Pattern A.

### Prerequisites
Load: deepdive.json for the target, offer-stack, voice-profile.

### Method
1. Read the deepdive for firmographic, hiring signals, pain signals, and tech stack.
2. For each SWOT quadrant, produce 3 to 5 entries:
   - Strength: what they do well (and whether it creates complacency or a buying barrier)
   - Weakness: operational or strategic gap (and which of your offers addresses it directly)
   - Opportunity: external trend or market shift they could act on with your help
   - Threat: competitive or industry pressure that makes inaction more expensive
3. Each entry: finding + brand implication + angle it opens.
4. Identify the highest-priority angle from the SWOT.

### Output
Save as swot.json in the prospect database. Pass to positioning-angles as input.
`

const POSITIONING_ANGLES_SKILL = `
# Positioning Angles Skill

Generates 3 to 5 ranked positioning angles for a named prospect. Each angle is a lead line in your locked voice that downstream skills use directly.

Trigger phrases: "find me angles for [company]", "what angle should I lead with for [company]", runs as step 3 of Pattern A.

### Prerequisites
Load: deepdive.json, swot.json, voice-profile.

### Angle archetypes
- Pain mirror: opens by naming a specific pain signal from the deepdive
- Hiring signal: opens with an observation about what their job postings reveal
- Leadership move: references a recent leadership change or public statement
- Competitive pressure: opens with an industry threat they're facing
- Missed opportunity: names a gap between where they are and where they could be

### Method
1. Pull top 3 pain signals from deepdive and top 2 weaknesses from swot.
2. Generate one angle per signal/weakness combination.
3. Rank by predicted resonance (specificity + ICA fit + timing).
4. For each angle: lead line (20-40 words, in voice), reasoning, recommended channel, recommended offer to lead with, receipt from credential-bank to deploy, risks.
5. Name the lead_recommendation (the angle to use first).

### Output
Save as angles.json in the prospect database. This file feeds linkedin-outreach, discovery-prep, and proposal-builder.
`

const LINKEDIN_OUTREACH_SKILL = `
# LinkedIn Outreach Skill

Extends a positioning angle into a 4-touch LinkedIn DM sequence.

Trigger phrases: "write LinkedIn outreach for [company]", "draft a DM sequence", "write a cold DM to [prospect]".

### Prerequisites
Load: angles.json (or a named angle), ica, credential-bank, voice-profile.

### The 4-touch sequence
- Touch 1 (Day 0): The lead. Lead line from angles.json adapted to DM format. Max 300 characters. Ends with a question, not a CTA.
- Touch 2 (Day 4): Value-add. A specific resource or observation tied to their situation. No ask.
- Touch 3 (Day 9): Receipt + ask. One receipt from credential-bank at this moment of doubt, plus a specific ask (book a call, take assessment, answer a question).
- Touch 4 (Day 14): Graceful close. Acknowledges silence. Names what would change for them. Walks away without resentment.

### Voice rules
- Max 300 characters per DM
- No em dashes, no banned phrases
- Lead opens with the prospect's world, not your credentials
- No emoji unless the prospect's own content uses them

### Output
Save as linkedin-sequence.md in the prospect database. Run through outreach-gate before sending.
`

const DISCOVERY_PREP_SKILL = `
# Discovery Prep Skill

Produces a one-page pre-call brief to read before any discovery call.

Trigger phrases: "prep me for [prospect] call", "what do I need to know before my call with [company]", runs as step 4 of Pattern A.

### Prerequisites
Load: deepdive.json, swot.json, angles.json, ica, credential-bank.

### Brief structure (one page maximum)
1. 60-second summary: who they are, what's happening, why you fit (3 to 5 sentences)
2. Opening angle: the lead line from angles.lead_recommendation, ready to drop in the first 90 seconds
3. Their likely state: emotional posture, what they hope to get, what they're afraid of
4. Top 3 objections to expect: pulled from ica.objections cross-referenced with swot weaknesses, with voice-matched responses ready
5. Receipts to have ready: 3 to 4 from credential-bank matched to their likely concerns
6. Questions to ask: 5 to 8 specific questions tied to deepdive specifics (their hiring, recent moves, stated pain)
7. Decision triggers to listen for: signals that move toward yes
8. Predicted close path: most likely route from this call to a paid engagement

### Output
discovery-brief.md in the prospect database. Designed to be read in 5 minutes before the call.
`

const PROPOSAL_BUILDER_SKILL = `
# Proposal Builder Skill

Produces a complete, voice-locked proposal tailored to a specific prospect.

Trigger phrases: "write a proposal for [company]", "build the proposal for [company]", "draft an SOW for [company]", runs as step 5 of Pattern A.

### Prerequisites
Load: deepdive.json, swot.json, angles.json, ica, offer-stack, credential-bank, voice-profile. If discovery notes exist, they override deepdive assumptions where they conflict.

### 10-section structure (locked)
1. Cover line: lead angle rewritten as proposal opener (20 to 40 words)
2. The situation: 3 to 5 sentences synthesizing what was heard
3. What you propose: recommended offer with tailored scope
4. The deliverables: specific, dated, week-by-week breakdown
5. The timeline: phase-by-phase engagement plan
6. Investment: price, payment terms, what's in/out, guarantees
7. Why you: 3 to 4 receipts from credential-bank picked for this prospect
8. What's needed from you: prospect's mutual commitments
9. Next steps: specific, dated, with a today-action
10. Sign-off: standard close

### Method
1. Identify the recommended offer from angles.lead_offer_recommendation or discovery notes.
2. Draft cover line from angles.lead_recommendation — specific, no salesy edge.
3. Draft section by section in order.
4. Select receipts: query credential-bank for the 3 to 4 most relevant to this prospect's concerns.
5. Pressure-test scope: could two people disagree on whether each item is "done"? Rewrite anything ambiguous.
6. Run voice-check (75+ overall, 18+ voice-fit) and conversion-check (70+).
7. Present with recommended offer, investment, scores, and any flags.

After delivery, prompt: "When you hear back from [company], say 'Track outcome for [company] proposal' and I'll record the win or loss."
`

const FOLLOW_UP_ENGINE_SKILL = `
# Follow-Up Engine Skill

Generates follow-up sequences for warm prospects in any post-touch state.

Trigger phrases: "how do I follow up with [prospect]", "follow up on [thread]", "[prospect] hasn't replied", "[prospect] is maybe".

### Prerequisites
Load: voice-profile, credential-bank, ica. Optional: prior conversation files.

### Scenarios
**Post-discovery call:**
- Scenario A (strong yes, no contract movement): recap Day 1 → check-in Day 4 → receipt drop Day 8 → graceful close Day 14
- Scenario B (maybe): recap + resource Day 1 → receipt + surface real objection Day 7 → reframe + smaller next step Day 14 → graceful close Day 30
- Scenario C (confirmed mismatch): thank you note Day 1. No further follow-up.

**Post-proposal:**
- Scenario D (silence after 5 days): soft check-in Day 5 → "what's giving you pause" Day 9 → reframe + alternative scope Day 14 → graceful close Day 21
- Scenario E (specific objection raised): address objection same day → confirm addressed Day 3 → re-pitch if needed Day 7 → graceful close Day 14
- Scenario F (yes received): contract delivery commitment same day → contract sent Day 1 → check-in if unsigned Day 3

**Post-intensive:** Recap Day 1 → implementation check-in Day 14 → retainer offer with intensive credited Day 28 → graceful close on credit Day 45

**Post-retainer:** Wrap-up Day 1 → check-in Day 30 → expansion conversation Day 60 → quarterly cadence established Day 90

### Rules
Graceful closes preserve the future opening. Every follow-up names a next action. No generic check-ins.
`

const OBJECTION_LIBRARY_SKILL = `
# Objection Library Skill

Builds, refreshes, or reads the indexed objection library.

Trigger phrases: "what's the response to [objection]", "build objection library", "I just heard [objection] on a call".

### Prerequisites
Load: ica (source of truth for objections), voice-profile, credential-bank.

### BUILD method
1. Pull top 12 objections from ica.objections.
2. For each objection, generate 2 to 3 voice-matched response variants.
3. Tag each response by channel (DM, email, discovery call, proposal follow-up) and conversation moment (early, after interest, at close).
4. Each response: acknowledge the concern → reframe with specificity → deploy a receipt → name the next step.

### READ method
When a skill needs a response to a specific objection: load the library, return the best-matched response for the channel and moment.

### The 12 standard objections (customize to ICA)
1. "It's not the right time."
2. "I need to think about it."
3. "It's too expensive."
4. "I'm not sure it will work for me."
5. "I've tried coaching before and it didn't work."
6. "I need to talk to my partner/team."
7. "What makes you different?"
8. "I'm already working with someone."
9. "I can figure this out myself."
10. "Send me more information."
11. "Let me get through [busy period] first."
12. "Can you lower the price?"
`

const CONTRACT_BUILDER_SKILL = `
# Contract Builder Skill

Generates an engagement contract from a signed-off proposal.

Trigger phrases: "send the contract", "build a contract for [prospect]", "draft the agreement for [client]".

### Prerequisites
Load: proposal.json (from proposal-builder), offer-stack, voice-profile.

### Contract structure
1. Parties: full legal names and addresses
2. Scope of work: verbatim from proposal deliverables, no additions
3. Timeline: start date, end date, milestone dates
4. Investment: price, payment schedule, late payment terms
5. Mutual obligations: what you deliver, what the client provides
6. Intellectual property: ownership of materials produced
7. Confidentiality: standard mutual NDA language
8. Kill clause: conditions and notice period for either party to end early
9. Dispute resolution: jurisdiction, process
10. Signatures: date line, legal names

### Rules
- Scope matches proposal.json exactly. No scope creep in the contract.
- Flag to client: "For engagements over $10,000, have your legal counsel review before signing."
- Payment schedule must match offer-stack.payment_terms.
- Output is a .md draft ready to paste into DocuSign or print-to-sign.
`

const LANDING_PAGE_BUILDER_SKILL = `
# Landing Page Builder Skill

Generates complete landing page copy for any named offer or campaign.

Trigger phrases: "build a landing page for [offer]", "write the page for [campaign]", "conversion copy for [URL]".

### Prerequisites
Load: ica, offer-stack (specific offer), credential-bank, voice-profile.

### 7-section page structure
1. Hero: headline (10-15 words), subhead (15-30 words), primary CTA
2. Pain section: 3 to 5 pains in ICA's verbatim language, transition line
3. Solution: how the offer addresses the pains (named and specific)
4. Social proof: 3 to 5 receipts from credential-bank deployed at decision moments
5. Offer details: what's included, what's not, pricing transparency
6. FAQ: 5 to 8 questions from ica.objections in FAQ format
7. Final CTA: lower-pressure version with risk-reversal language

### Method
1. Pull 3 to 5 most relevant pains from ica matched to the offer's ICP.
2. Pull receipts tagged for landing_page channel.
3. Pull FAQ from ica.objections.
4. Draft section by section.
5. Run voice-check (75+) and conversion-check (75+).
6. Hero headline names a specific outcome, not a transformation promise.

### Output
page-[offer-id].md (copy + structure) and page-[offer-id].html (rendered).
`

const WORKSHOP_SCRIPT_SKILL = `
# Workshop Script Skill

Generates complete workshop or masterclass scripts with delivery + pitch + close.

Trigger phrases: "workshop on [topic]", "write a masterclass on [topic]", "workshop script for [event]".

### Prerequisites
Load: ica, offer-stack (upsell offer at end), credential-bank, voice-profile.

### Script structure
1. Hook (5 minutes): one pain in ICA's exact words + promise statement + credentialing (one receipt)
2. Agenda (2 minutes): what they'll learn, what they'll walk away with
3. Content sections (3 to 5 sections, 8-12 minutes each): each section teaches one concept, includes an exercise, names the pain it addresses
4. Pitch transition (2 minutes): bridge from the content to the offer
5. Pitch (10 minutes): the offer, who it's for, what's included, investment, FAQ
6. Close (3 minutes): the one CTA, urgency if any, final receipt, sign-off

### Rules
- One CTA at close, not multiple
- Receipts at the pitch, not the hook
- Every content section delivers real value (not a tease)
- Running time: 60 minutes total is standard
`

const AD_CAMPAIGN_BUILDER_SKILL = `
# Ad Campaign Builder Skill

Generates ad copy variants for LinkedIn, Facebook/Instagram, and Google campaigns.

Trigger phrases: "build ads for [offer]", "ad campaign for [offer]", "run paid traffic to [offer]", runs as step 4 of Pattern B.

### Prerequisites
Load: positioning-angles (top 3 angles), ica, offer-stack, credential-bank, voice-profile.

### Per-platform output
**LinkedIn:** 3 headline variants (under 70 chars), 3 primary text variants (under 300 chars), 2 creative briefs, recommended audience parameters (job titles, industries, company sizes)

**Facebook/Instagram:** 3 headline variants, 3 primary text variants (150-300 chars), 2 creative briefs (image + video), audience targeting notes

**Google:** 5 headline variants (under 30 chars), 4 description variants (under 90 chars), 3 callout extensions

### Method
1. Pull top 3 angles from positioning-angles or specify the angle to lead with.
2. For each platform, write variants that lead with the angle.
3. Receipts from credential-bank deploy in the primary text, not the headline.
4. Run voice-check (75+) and conversion-check (75+) on every variant.

### Output
campaigns/[campaign-slug]/ads.md with all variants labeled by platform, plus creative briefs.
`

const CONVERSION_CHECK_SKILL = `
# Conversion Check Skill

Scores any conversion-focused output against conversion principles.

Applies to: landing pages, ad copy, sales emails, proposals, sales DMs.
Trigger phrases: "conversion-check this", "score this for conversion".

### Dimensions (each 0-20)
1. Hook strength: does line 1 earn line 2?
2. Pain specificity: named pain language from ICA present?
3. Proof placement: receipts at moments of doubt, not as opening flex?
4. CTA clarity: one action per piece, unambiguous, repeated 3x on landing pages?
5. Risk reversal: objections addressed, guarantee or reassurance present?

### Threshold
75+ overall to pass. Below 70 on any single dimension = regenerate that section.

### Output
Pass: "Conversion-ready. [score]/100."
Fail: name the failing dimension in one sentence. Rewrite that section only. Show only the passing version.

Auto-runs on every landing page, ad, email, and proposal before delivery.
`

const COACH_OS_SKILL = `
# Coach OS Skill

The meta-orchestrator. Chains skills into workflows end to end.

Trigger phrases: "Run Pattern [letter] on [subject]", "Land [company]", "Launch [offer]", "I want to take [company] from research to contract".

### 10 patterns

**Pattern A: Land a new client**
prospect-deepdive → industry-swot → positioning-angles → linkedin-outreach → [call happens] → discovery-prep → proposal-builder → follow-up-engine → contract-builder

**Pattern B: Launch a workshop or offer**
workshop-script → landing-page-builder → email-sequence-builder → ad-campaign-builder → social-engine

**Pattern C: Workshop to 1:1 conversion**
workshop-script → landing-page-builder → email-sequence-builder → follow-up-engine

**Pattern D: Refresh foundation**
voice-profile refresh → ica-lock refresh → offer-stack refresh → price-optimizer → credential-bank refresh → positioning-angles refresh → competitor-radar

**Pattern E: Reactivate dormant**
follow-up-engine (long dormant scenario) → email-sequence-builder (re-engagement) → linkedin-outreach

**Pattern F: Deliver engagement**
session-prep → progress-tracker (week 4, 8, 12) → expansion-detector (week 10+) → testimonial-engine (week 10) → referral-trigger (week 10+)

**Pattern G: Quality audit**
Scan recent outputs → voice-check each → conversion-check on sales assets → aggregate quality report

**Pattern H: New user onboarding**
onboarding → voice-check on quick-win output → finalize setup-status

**Pattern I: Business Pulse (Monday)**
revenue-health → pipeline-brief → client-health → monday-brief → offer invoice-chase if overdue invoices surface

**Pattern J: Quarterly Review**
revenue-health (90-day) → pipeline-brief summary → client-health aggregate → quarterly-review → offer-stack review

**Pattern K: Scale the Business**
business-pulse → price-optimizer → hiring-brief → outreach-gate on any job post

### Method
1. Match the trigger to a pattern.
2. Verify prerequisites exist.
3. Run each skill in the chain, surface output, wait for confirmation before the next step.
4. At any step, the user can pause, branch, or redirect.
`

const REVENUE_HEALTH_SKILL = `
# Revenue Health Skill

Produces a one-page revenue snapshot. Read-only. No recommendations.

Trigger phrases: "revenue health check", "what are my numbers this month", "run revenue health", step 1 of Pattern I.

### Output sections
1. Income received this month (confirmed payments)
2. Income expected this month (outstanding invoices + scheduled payments)
3. Income at risk (overdue payments, flagged clients)
4. 30/60/90-day forward projection from active engagements

### Method
1. Ask for current income data if not available via Stripe/PayPal MCP.
2. Pull from active engagements in offer-stack for expected income.
3. Flag any invoice overdue more than 7 days as "at risk."
4. Project forward from retainer counts × monthly rates.
5. Present as a clean one-page snapshot. Numbers only.

If Stripe or PayPal MCP is configured, pull automatically. Otherwise, ask for the numbers.
`

const INVOICE_CHASE_SKILL = `
# Invoice Chase Skill

Generates tone-matched payment follow-up messages for late client invoices.

Trigger phrases: "chase invoice", "[client] hasn't paid", "invoice follow-up for [client]".

### Three tones
- First-time-late: warm, assumes good faith, easy path to payment
- Repeat-late: direct, no drama, shorter, firmer on the deadline
- Urgent: firm, offers a payment plan, names the consequence

### Method
1. Ask: which client, invoice amount, due date, days overdue, first-time or repeat late.
2. Draft all three tone variants side by side.
3. Hard approval gate: show all three, ask which tone to send.
4. On approval: if Gmail MCP is configured, send on confirmation. Otherwise output copy-ready text.

Rules: No shame. No passive aggression. Specific invoice amount and due date in every message. One action for the client to take.
`

const PIPELINE_BRIEF_SKILL = `
# Pipeline Brief Skill

Scores all active prospects and returns a ranked contact list. Read-only.

Trigger phrases: "who should I contact today", "pipeline check", "what's hot in my pipeline", step 2 of Pattern I.

### Scoring (4 dimensions, each 0-25)
1. Recency: how long since last meaningful contact?
2. Engagement signal: are they responding, opening, engaging with content?
3. ICP fit: how closely do they match the ICA profile?
4. Deal stage: where are they in the sales process?

### Output
- Top 3 prospects to contact today, with one talking point from their angles.json
- Stale deals list: prospects that need a decision (pursue or close)
- Total pipeline summary: count, estimated value, average deal age
`

const MONDAY_BRIEF_SKILL = `
# Monday Brief Skill

Produces a 5-minute startup brief for the week. Read-only. Looks forward only.

Trigger phrases: "monday brief", "start my week", "what do I need to know this week", step 4 of Pattern I.

### Synthesizes
1. Revenue position (from revenue-health)
2. Top prospect to contact (from pipeline-brief)
3. At-risk client to check on (from client-health)
4. One highest-leverage action for the week

### Rules
Exactly one action at the end. Not three. Not a list. One. The one that moves the most if done today.
Output in plain prose, not bullets. Under 200 words.
`

const CLIENT_HEALTH_SKILL = `
# Client Health Skill

Produces a health snapshot for every active client. Read-only.

Trigger phrases: "how are my clients doing", "who is at risk", "run a health check", step 3 of Pattern I, auto-runs in Pattern F.

### Dimensions per client
- Engagement quality: are sessions productive? Are they implementing?
- Milestone velocity: are they hitting milestones on schedule?
- Satisfaction signals: positive or negative signals from session notes
- Churn risk: Green / Yellow / Red

### Output per client
- Status: Green / Yellow / Red
- What it's based on (one sentence per signal used)
- One recommended action for Yellow and Red clients

Rule: name risk directly. No softening. If a client is Red, say Red and say why.
`

const OUTREACH_GATE_SKILL = `
# Outreach Gate Skill

Pre-send approval gate for every outgoing message produced by CoachOS.

Trigger phrases: "check before I send", "gate this message", wraps all outgoing skills automatically.

### What it presents
1. The draft message
2. Plain-English context summary (who this is going to, why, what the ask is)
3. Inline voice check (em dash count, banned phrase scan, signature move present)
4. Risk flag if anything looks off (wrong tone for the relationship, missing receipt, CTA too strong for stage)

### Hard rule
Nothing sends until the user types "send". Not "looks good", not "go ahead". The word "send".

### Auto-wraps
linkedin-outreach, follow-up-engine, invoice-chase, referral-trigger, and any outgoing message produced in a session.
`

const CONTENT_CALENDAR_SKILL = `
# Content Calendar Skill

Builds a 4-week content calendar with topic pillars, week types, platform priorities, and offer tie-ins.

Trigger phrases: "content calendar for [month]", "plan my content", "map my content to an offer launch".

### Prerequisites
Load: ica, voice-profile, offer-stack. Optional: content-pillars.

### 3 week types
- Push week: offer front and center, content drives to CTA
- Educate week: method moments, frameworks, ICA pain reframes
- Warm week: behind-the-scenes, receipts, relationship content

### Method
1. Confirm month and any offer launches or events to plan around.
2. Map week types across the 4 weeks (launch weeks are always push weeks).
3. Assign pillars to each day.
4. Name the offer each piece ties to or supports.
5. Output a table: Date | Platform | Pillar | Week type | Topic | Offer tie-in.

The calendar is strategy. social-engine handles per-post copy.
`

const CONTRACT_REVIEWER_SKILL = `
# Contract Reviewer Skill

Reviews incoming client-paper contracts across 8 risk categories.

Trigger phrases: "review this contract", "check this agreement", "client sent their paper".

### 8 risk categories (Red/Yellow/Green per category)
1. Scope definition: is the scope clear? Can it be interpreted differently by each party?
2. Payment terms: are terms reasonable? Late fees? Kill clause payment obligations?
3. IP ownership: who owns the deliverables, methodologies, and frameworks?
4. Confidentiality: is mutual NDA present? Are carve-outs reasonable?
5. Non-compete / non-solicitation: are restrictions too broad?
6. Termination: notice period, payment on termination, cause vs. convenience?
7. Liability cap: is liability limited to fees paid? Consequential damages excluded?
8. Governing law: which jurisdiction? Is it workable?

### Output
One paragraph per category with Red/Yellow/Green rating and plain-English notes. Then 2 to 3 items to negotiate or clarify before signing.

Legal disclaimer: "This is a risk-surface tool, not legal advice. For engagements over $10,000, have your lawyer review before signing."
`

const BUSINESS_PULSE_SKILL = `
# Business Pulse Skill

Produces a 3-minute Friday end-of-week snapshot. Looks backward only. No recommendations.

Trigger phrases: "business pulse", "end of week", "friday close", "how did the week go", Friday variant of Pattern I.

### 4 functions covered
1. Revenue: what came in this week, what's overdue
2. Sales: outreach sent, responses received, calls booked, proposals out
3. Content: pieces published, any notable engagement
4. Delivery: client sessions held, milestones hit, any flags

Rules: no next steps, no recommendations. Report what happened. Under 300 words.
`

// ─── SCALE TIER ──────────────────────────────────────────────────────────────

const SESSION_PREP_SKILL = `
# Session Prep Skill

Generates a prep brief for an active client's upcoming session.

Trigger phrases: "prep me for [client] session [N]", "what's on the agenda for [client] this week".

### Prerequisites
Client engagement state: session number, prior session notes, milestones agreed, deliverables status.

### Brief structure
1. Client state going in: where they ended last session, what they committed to do
2. Implementation check: did they do the homework? What signals suggest yes or no?
3. Session agenda: 3 agenda items maximum, each with the question or exercise to use
4. Materials to have ready: frameworks, worksheets, or templates for this session
5. Decisions due: anything needing a decision this session to keep the engagement on track
6. Expansion signal to watch for: one signal that would indicate readiness for the next offer

Output: one-page brief, readable in 5 minutes before the session.
`

const PROGRESS_TRACKER_SKILL = `
# Progress Tracker Skill

Generates a progress report against the engagement's planned milestones.

Trigger phrases: "where is [client] at", "progress report on [client]", runs at week 4, 8, 12 of a 90-day retainer.

### Output sections
1. On-track milestones: what's been delivered and accepted
2. Slipping milestones: what's behind and by how long
3. Blockers: what's preventing progress (client-side or delivery-side)
4. Recommended actions: one action per blocker
5. Engagement health score: Green / Yellow / Red with reasoning
`

const EXPANSION_DETECTOR_SKILL = `
# Expansion Detector Skill

Detects when and how to pitch an expansion offer to an active or recent client.

Trigger phrases: "what's next for [client]", "when do I pitch [offer] to [client]", runs at week 10 of retainer and day 30 post-engagement.

### Readiness signals (need 2 of 3)
1. Documented outcome: a specific, named result achieved in the engagement
2. Consistent engagement: client is showing up, implementing, asking deeper questions
3. Past the midpoint: engagement is more than 50% complete

### When readiness is met
1. Name the expansion offer (next step in offer-stack sequence).
2. Frame it in terms of the result they just got, not a new pitch.
3. Output: a 2 to 3 sentence pitch to deliver verbally on the next call, plus a follow-up if they say "let me think about it."

### When readiness is not met
State which criteria are missing. Suggest the check-in timing for the next readiness assessment.
`

const OUTCOMES_TRACKER_SKILL = `
# Outcomes Tracker Skill

Logs real-world results for any CoachOS output and stores them as structured data.

Trigger phrases: "track outcome for [output]", "did the proposal win?", "log result for [campaign]", "mark [company] as won/lost".

### Method
1. Identify the output being tracked (prospect slug, campaign slug, sequence name).
2. Ask: won/lost/in-progress? If won: contract value, timeline to close. If lost: stated reason.
3. Ask: which angle led? Which receipt was deployed? What opened the conversation?
4. Call log_outcome tool with the structured data.

### Aggregate report (after 5+ outcomes)
When 5 or more outcomes are logged, produce a pattern report:
- Close rate by angle type
- Most effective receipts
- Average days from deepdive to close
- Offer mix (which offers are converting vs. going stale)

This feeds back into positioning-angles to improve future angle selection.
`

const TESTIMONIAL_ENGINE_SKILL = `
# Testimonial Engine Skill

Generates voice-matched testimonial requests at defined moments in the client journey.

Trigger phrases: "testimonial for [client]", "request a testimonial from [client]", auto-fires at week 10 of retainer, day 14 and day 28 post-intensive, day 30 post-corporate training.

### Timing (when to fire)
- 90-day retainer: week 10 (2 weeks before the engagement ends)
- 1:1 Intensive: day 14 and day 28
- Corporate training: day 30

### Request method
1. Identify the specific outcome achieved with this client.
2. Write a short, specific request that names the result and asks them to describe it in their own words. Max 4 sentences. No generic "I'd love a testimonial" language.
3. Hard approval gate before saving or sending.

### Format client response into 3 deployment formats
1. Long-form case study paragraph (150-200 words): maps to the ICA pain it addresses
2. Short social proof quote (under 50 words): with attribution format
3. One-line receipt for credential-bank: "I helped [client type] [outcome with number]"

On coach confirmation, call save_foundation_data to append receipt to credential_bank.
`

const REFERRAL_TRIGGER_SKILL = `
# Referral Trigger Skill

Detects when and how to ask an active or recently completed client for a referral.

Trigger phrases: "ask [client] for a referral", "referral check for [client]", runs at week 10+ of Pattern F after testimonial-engine.

### Readiness criteria (need all 3)
1. Documented outcome: a specific named result is in the record
2. Consistent engagement: client is showing up and implementing
3. Past midpoint: engagement is more than 50% complete

### When all 3 criteria are met
Produce two outputs:
1. Referral ask (for the coach to send): names the result, asks if they know someone facing the same situation, gives an easy way to connect them.
2. Client-forwardable brief (for the client to pass on): 3 sentences that describe who you help and one result, framed for a cold third party.

Hard approval gate: show both, ask for "send" before saving or sending.

### When criteria are not met
State which criteria are missing. Suggest the next timing check.
`

const PRICE_OPTIMIZER_SKILL = `
# Price Optimizer Skill

Analyzes the current offer stack against time investment and market signals. Data-only output. No price recommendations.

Trigger phrases: "run price optimizer", "am I undercharging", "price check my offers", "what's my effective hourly rate", step 2.5 of Pattern D.

### Method
1. Load offer-stack. For each offer: price, duration, estimated delivery hours per engagement.
2. Calculate effective hourly rate per offer.
3. Identify which offers carry the highest and lowest effective hourly rate.
4. Generate three pricing scenarios (conservative +10%, moderate +20-25%, premium +40-50%) with projected revenue impact at current conversion rates.
5. Surface the data. Do not recommend a price. The coach decides.

### Output
Table: offer name | current price | delivery hours | effective hourly rate | scenario A | scenario B | scenario C
`

const COMPETITOR_RADAR_SKILL = `
# Competitor Radar Skill

Monitors named competitors for pricing changes, new offer launches, content angles, and ICP drift.

Trigger phrases: "what are competitors doing", "check [competitor]", "competitor radar", runs as optional step 7 of Pattern D.

### For each competitor finding
Two-line impact assessment:
- Line 1: what changed (factual, sourced)
- Line 2: what it means for your positioning (one specific angle to review or reinforce)

### Method
1. Ask for the list of competitors to monitor, or load from a prior competitive list.
2. Use Apify MCP if available to pull recent public signals (LinkedIn, website changes, job posts, press). If Apify is unavailable, ask the coach to paste in any competitor content they've noticed.
3. Produce the two-line assessment for each finding.
4. Flag if any finding suggests a direct ICA overlap that changes angle priority.

Graceful degradation: if no automation tools available, ask the coach to describe what they've noticed about competitors and run the assessment from that.
`

const QUARTERLY_REVIEW_SKILL = `
# Quarterly Review Skill

Produces a full quarterly business review (QBR) covering six areas.

Trigger phrases: "quarterly review", "run my QBR", "let's close out the quarter", "what happened this quarter", Pattern J.

### 6 sections
1. Revenue performance: received vs. projected, offer mix, average contract value
2. Pipeline health: prospects generated, conversion rates, average days to close, stale deals
3. Client delivery outcomes: clients delivered, milestones hit, churn, expansion wins
4. Offer performance: which offers are converting, which are stale, which to retire or reposition
5. Wins and watches: the 3 things that went well, the 2 things to watch next quarter
6. 90-day priorities: the 2 highest-leverage moves for next quarter

### Method
1. Pull from revenue-health, pipeline-brief, client-health if they've been run this session.
2. For sections not covered by recent skill outputs, ask targeted questions.
3. Draft the full QBR narrative.
4. Present for review.
5. On approval, save to reviews/Q[N]-[YYYY]-quarterly-review.md.
6. Offer to update current-priorities.md with the 2 new 90-day priorities.
`

const HIRING_BRIEF_SKILL = `
# Hiring Brief Skill

Generates a complete hiring packet for the role types most common in scaling coaching businesses.

Trigger phrases: "build a hiring brief for [role]", "I need to hire a [role]", "help me hire my next [role]", step 3 of Pattern K.

### Roles supported
VA, OBM, Associate Coach, Content Manager.

### 6-part packet
1. Role description: what this person does in your business (not a generic JD)
2. Responsibilities: 8 to 12 specific tasks, scoped to your actual service lines
3. 30/60/90-day success criteria: what "great" looks like in the first 90 days
4. Screening questions: 5 questions to filter applications (written, async-first)
5. Behavioral interview questions: 4 to 6 questions for the live interview
6. Starter offer letter: compensation range, structure, start date placeholder

Written in your locked voice. Specific to your business context, not generic "here's what a VA does."
`

// ─── Skill map (name → content) ──────────────────────────────────────────────

const SKILL_MAP: Record<string, string> = {
  'onboarding': ONBOARDING_SKILL,
  'navigator': NAVIGATOR_SKILL,
  'voice-check': VOICE_CHECK_SKILL,
  'voice-profile': VOICE_PROFILE_SKILL,
  'ica-lock': ICA_LOCK_SKILL,
  'offer-stack': OFFER_STACK_SKILL,
  'credential-bank': CREDENTIAL_BANK_SKILL,
  'social-engine': SOCIAL_ENGINE_SKILL,
  'email-sequence-builder': EMAIL_SEQUENCE_SKILL,
  'prospect-deepdive': PROSPECT_DEEPDIVE_SKILL,
  'industry-swot': INDUSTRY_SWOT_SKILL,
  'positioning-angles': POSITIONING_ANGLES_SKILL,
  'linkedin-outreach': LINKEDIN_OUTREACH_SKILL,
  'discovery-prep': DISCOVERY_PREP_SKILL,
  'proposal-builder': PROPOSAL_BUILDER_SKILL,
  'follow-up-engine': FOLLOW_UP_ENGINE_SKILL,
  'objection-library': OBJECTION_LIBRARY_SKILL,
  'contract-builder': CONTRACT_BUILDER_SKILL,
  'landing-page-builder': LANDING_PAGE_BUILDER_SKILL,
  'workshop-script': WORKSHOP_SCRIPT_SKILL,
  'conversion-check': CONVERSION_CHECK_SKILL,
  'coach-os': COACH_OS_SKILL,
  'revenue-health': REVENUE_HEALTH_SKILL,
  'invoice-chase': INVOICE_CHASE_SKILL,
  'pipeline-brief': PIPELINE_BRIEF_SKILL,
  'monday-brief': MONDAY_BRIEF_SKILL,
  'client-health': CLIENT_HEALTH_SKILL,
  'outreach-gate': OUTREACH_GATE_SKILL,
  'content-calendar': CONTENT_CALENDAR_SKILL,
  'contract-reviewer': CONTRACT_REVIEWER_SKILL,
  'business-pulse': BUSINESS_PULSE_SKILL,
  'ad-campaign-builder': AD_CAMPAIGN_BUILDER_SKILL,
  'session-prep': SESSION_PREP_SKILL,
  'progress-tracker': PROGRESS_TRACKER_SKILL,
  'expansion-detector': EXPANSION_DETECTOR_SKILL,
  'outcomes-tracker': OUTCOMES_TRACKER_SKILL,
  'testimonial-engine': TESTIMONIAL_ENGINE_SKILL,
  'referral-trigger': REFERRAL_TRIGGER_SKILL,
  'price-optimizer': PRICE_OPTIMIZER_SKILL,
  'competitor-radar': COMPETITOR_RADAR_SKILL,
  'quarterly-review': QUARTERLY_REVIEW_SKILL,
  'hiring-brief': HIRING_BRIEF_SKILL,
}

// ─── Compact registry (replaces full skill content in system prompt) ──────────

const STARTER_REGISTRY = `- onboarding: 5-block setup interview; writes all foundation data to database
- navigator: routing menu for vague openers ("help", "menu", "options")
- voice-check: score output against voice-profile (75+ overall, 18+ voice-fit to pass)
- voice-profile: build or refresh voice-profile foundation data (BUILD / READ modes)
- ica-lock: build or refresh ICA foundation data (BUILD / READ modes)
- offer-stack: build or refresh offer ladder foundation data (BUILD / READ modes)
- credential-bank: build or refresh proof points foundation data (BUILD / READ modes)
- social-engine: weekly content cadence across LinkedIn, Instagram, X
- email-sequence-builder: multi-email nurture, launch, re-engagement sequences`

const GROWTH_REGISTRY = `- prospect-deepdive: complete intelligence dossier on a named company
- industry-swot: SWOT lensed through your offers (finding + implication + angle per entry)
- positioning-angles: 3-5 ranked angles for a named prospect; feeds all outreach skills
- linkedin-outreach: 4-touch DM sequence from a positioning angle
- discovery-prep: one-page pre-call brief (summary, angle, objections, receipts, questions)
- proposal-builder: 10-section proposal; requires deepdive + swot + angles + ica + offers + credentials
- follow-up-engine: follow-up sequences for post-call, post-proposal, post-retainer states
- objection-library: voice-matched responses to top 12 objections (BUILD / READ modes)
- contract-builder: engagement contract from a signed proposal
- landing-page-builder: 7-section long-form sales page with voice-check + conversion-check
- workshop-script: complete masterclass script (hook, content sections, pitch, close)
- conversion-check: score sales assets on 5 dimensions (75+ to pass)
- coach-os: meta-orchestrator for Patterns A through K
- revenue-health: monthly revenue snapshot — received, expected, at-risk, 30/60/90 projection
- invoice-chase: tone-matched payment follow-ups (3 tones; hard approval gate)
- pipeline-brief: scored top-3 prospects to contact today + stale deals list
- monday-brief: 5-minute Monday startup brief; one highest-leverage action
- client-health: Green/Yellow/Red churn risk per active client; one action per at-risk client
- outreach-gate: pre-send approval gate; nothing sends until user types "send"
- content-calendar: 4-week calendar with push/educate/warm week mapping
- contract-reviewer: incoming contract review across 8 risk categories (Red/Yellow/Green)
- business-pulse: Friday end-of-week snapshot across revenue, sales, content, delivery`

const SCALE_REGISTRY = `- ad-campaign-builder: ad variants for LinkedIn, Facebook/Instagram, and Google
- session-prep: pre-session brief (state, agenda, decisions due, expansion signal)
- progress-tracker: milestone progress report at weeks 4, 8, 12 of a retainer
- expansion-detector: detect when and how to pitch the next offer to an active client
- outcomes-tracker: log real-world results; aggregate pattern report after 5+ outcomes
- testimonial-engine: voice-matched testimonial requests at defined journey moments
- referral-trigger: detect referral readiness; produce ask + client-forwardable brief
- price-optimizer: effective hourly rate and three pricing scenarios (data-only)
- competitor-radar: monitor named competitors; two-line impact assessment per finding
- quarterly-review: full QBR across 6 areas; saves on approval
- hiring-brief: 6-part hiring packet for VA, OBM, Associate Coach, Content Manager`

// ─── Exports ─────────────────────────────────────────────────────────────────

export function getSingleSkillContent(skillName: string): string | null {
  return SKILL_MAP[skillName] ?? null
}

export function getSkillRegistry(tier: string): string {
  const lines = [
    'Call get_skill_content with a skill name to load its full instructions before executing it.',
    '',
    '### Starter (always available)',
    STARTER_REGISTRY,
  ]

  if (tier === 'growth' || tier === 'scale') {
    lines.push('', '### Growth (your plan includes these)', GROWTH_REGISTRY)
  }

  if (tier === 'scale') {
    lines.push('', '### Scale (your plan includes these)', SCALE_REGISTRY)
  }

  return lines.join('\n')
}
