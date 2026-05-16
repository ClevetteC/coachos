// Skill SKILL.md files stored as TypeScript constants.
// Injected into the system prompt at session start.
// Only Starter-tier skills included here; Growth/Scale skills load on upgrade.

export const ONBOARDING_SKILL = `
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
After Block 5, produce one LinkedIn post using: their positioning statement (Block 1), one ICA pain phrase in their exact words (Block 3), and one result with a number (Block 5). Apply all voice rules from what was written. No em dashes. No banned words.

### Finalize
Call update_setup_status: onboarding_complete: true. Surface 3 trigger phrases tailored to their actual data from Block 1 and Block 4.
`

export const NAVIGATOR_SKILL = `
# Navigator Skill

Fires on vague openers: "help", "what can you do", "menu", "where do I start", "options".

Present 5 plain-language options:
1. Land a new client (Pattern A)
2. Launch a workshop or offer (Pattern B)
3. Write content (social-engine, hook-writer)
4. Work on a client you already have (Pattern D or F)
5. Update my foundation (voice, ICA, offers, credentials)

Ask which fits. Then route to the appropriate skill or pattern. One follow-up question max before routing.
`

export const VOICE_CHECK_SKILL = `
# Voice Check Skill

Scores any output against voice-profile.json. Run before every delivery.

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
