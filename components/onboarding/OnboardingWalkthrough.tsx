'use client'

import { useState } from 'react'

const STORAGE_KEY = 'coachos_onboarding_seen'

interface Step {
  counter: string
  title: string
  body: string
  features: string[] | null
  isFinal?: boolean
}

const STEPS: Step[] = [
  {
    counter: '01',
    title: 'Welcome to CoachOS',
    body: 'Most coaches end up with a folder of AI prompts they ran once and forgot. CoachOS is different. It runs on your voice, your ideal client, and your offers. Every output, from LinkedIn sequences to full proposals, is checked for voice and conversion quality before it reaches you. Nothing to fix. Ready to send.',
    features: null,
  },
  {
    counter: '02',
    title: 'Your foundation',
    body: 'CoachOS runs on four files you build once. Your voice profile, ideal client, offer stack, and credential bank. Every workflow reads from them so every output sounds like you and speaks to your clients.',
    features: ['Voice profile', 'Ideal client avatar', 'Offer stack', 'Credential bank'],
  },
  {
    counter: '03',
    title: 'Seven workflow patterns',
    body: 'Tell CoachOS what you want to accomplish. It chains the right skills together and runs the full workflow end to end.',
    features: [
      'Land a new client',
      'Launch an offer',
      'Workshop to 1:1 conversion',
      'Refresh your foundation',
      'Reactivate dormant leads',
      'Deliver an engagement',
      'Quality audit',
    ],
  },
  {
    counter: '04',
    title: 'Every output ships in your voice',
    body: 'Prospect research, proposals, LinkedIn outreach, email campaigns, landing pages, and content. Two quality gates run on every output before it reaches you: voice-check and conversion-check.',
    features: [
      'Prospect research and SWOT',
      'Proposals and contracts',
      'LinkedIn outreach sequences',
      'Email campaigns',
      'Landing pages and ads',
      'Workshop scripts and social content',
    ],
  },
  {
    counter: '05',
    title: 'Two steps from your first output',
    body: 'Set up your foundation and CoachOS can run any workflow. Takes about 15 minutes.',
    features: null,
    isFinal: true,
  },
]

const MAX_VISIBLE = 3

function renderTitle(title: string) {
  const parts = title.split('CoachOS')
  if (parts.length === 1) return <>{title}</>
  return (
    <>
      {parts[0]}
      <span style={{ color: 'var(--ccc-raspberry)' }}>CoachOS</span>
      {parts[1]}
    </>
  )
}

interface Props {
  onComplete: () => void
}

export function OnboardingWalkthrough({ onComplete }: Props) {
  const [stepIndex, setStepIndex] = useState(0)
  const [fading, setFading] = useState(false)

  function navigate(direction: 'next' | 'prev') {
    if (fading) return
    if (direction === 'next' && stepIndex === STEPS.length - 1) {
      dismiss()
      return
    }
    setFading(true)
    setTimeout(() => {
      setStepIndex((i) => (direction === 'next' ? i + 1 : i - 1))
      setFading(false)
    }, 160)
  }

  function dismiss() {
    try { localStorage.setItem(STORAGE_KEY, '1') } catch {}
    onComplete()
  }

  const step = STEPS[stepIndex]
  const visible = step.features ? step.features.slice(0, MAX_VISIBLE) : null
  const hasMore = step.features ? step.features.length > MAX_VISIBLE : false

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(15,15,15,0.80)', backdropFilter: 'blur(6px)' }}
    >
      <div
        className="w-full max-w-[620px] rounded-3xl relative overflow-hidden animate-fade-up"
        style={{
          background: 'var(--ccc-cream)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.30)',
        }}
      >
        {/* Raspberry left accent */}
        <div
          className="absolute top-0 left-0 w-[3px] h-full"
          style={{ background: 'var(--ccc-raspberry)' }}
        />

        {/* Ambient orb */}
        <div
          className="absolute pointer-events-none animate-float"
          style={{
            width: '440px',
            height: '440px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(217,36,106,0.065) 0%, transparent 65%)',
            top: '-160px',
            right: '-120px',
          }}
        />

        <div className="px-10 pt-9 pb-8 relative z-10">
          {/* Header row */}
          <div className="flex items-center justify-between mb-7">
            <p
              className="text-[9px] tracking-[0.22em] uppercase font-semibold"
              style={{ color: 'var(--ccc-tiffany)', fontFamily: 'var(--font-body)' }}
            >
              Getting started
            </p>
            <p
              className="text-[9px] tracking-[0.16em] uppercase"
              style={{ color: 'var(--muted-foreground)', opacity: 0.5, fontFamily: 'var(--font-body)' }}
            >
              {step.counter} / 05
            </p>
          </div>

          {/* Step content */}
          <div
            className="min-h-[250px]"
            style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.16s ease' }}
          >
            <h2
              className="mb-4 leading-[0.92] tracking-tight"
              style={{
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontWeight: 600,
                fontSize: 'clamp(2.4rem, 5vw, 3.2rem)',
                color: 'var(--ccc-near-black)',
              }}
            >
              {renderTitle(step.title)}
            </h2>

            <p
              className="leading-relaxed mb-6 max-w-[460px]"
              style={{
                color: 'var(--muted-foreground)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.9375rem',
              }}
            >
              {step.body}
            </p>

            {visible && (
              <div>
                <div className="flex flex-wrap gap-2">
                  {visible.map((f) => (
                    <span
                      key={f}
                      className="px-3 py-1.5 rounded-full text-sm font-medium"
                      style={{
                        background: 'rgba(217,36,106,0.07)',
                        color: 'var(--ccc-raspberry)',
                        border: '1px solid rgba(217,36,106,0.16)',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
                {hasMore && (
                  <div className="flex items-center gap-3 mt-4">
                    <div className="flex-1" style={{ height: '1px', background: 'rgba(217,36,106,0.10)' }} />
                    <span
                      className="text-xs tracking-wide"
                      style={{
                        color: 'var(--muted-foreground)',
                        opacity: 0.50,
                        fontFamily: 'var(--font-body)',
                        fontStyle: 'italic',
                      }}
                    >
                      Plus more
                    </span>
                    <div className="flex-1" style={{ height: '1px', background: 'rgba(217,36,106,0.10)' }} />
                  </div>
                )}
              </div>
            )}

            {step.isFinal && (
              <div className="grid grid-cols-2 gap-3">
                <div
                  className="p-5 rounded-xl border"
                  style={{
                    borderColor: 'var(--ccc-tiffany-border)',
                    background: 'var(--ccc-tiffany-muted)',
                  }}
                >
                  <p
                    className="text-[10px] tracking-[0.20em] uppercase font-semibold mb-2"
                    style={{ color: 'var(--ccc-tiffany)', opacity: 0.65, fontFamily: 'var(--font-body)' }}
                  >
                    Option 1
                  </p>
                  <p
                    className="text-sm font-bold mb-1.5"
                    style={{ color: 'var(--ccc-tiffany)', fontFamily: 'var(--font-body)' }}
                  >
                    Upload your documents
                  </p>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)' }}
                  >
                    Your bio, ICA doc, or offer deck. CoachOS extracts what it needs.
                  </p>
                </div>
                <div
                  className="p-5 rounded-xl border"
                  style={{
                    borderColor: 'var(--ccc-raspberry-border)',
                    background: 'var(--ccc-raspberry-muted)',
                  }}
                >
                  <p
                    className="text-[10px] tracking-[0.20em] uppercase font-semibold mb-2"
                    style={{ color: 'var(--ccc-raspberry)', opacity: 0.65, fontFamily: 'var(--font-body)' }}
                  >
                    Option 2
                  </p>
                  <p
                    className="text-sm font-bold mb-1.5"
                    style={{ color: 'var(--ccc-raspberry)', fontFamily: 'var(--font-body)' }}
                  >
                    Answer the setup questions
                  </p>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)' }}
                  >
                    Five blocks, one question at a time. Nothing saves until you confirm.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div
            className="flex items-center justify-between mt-7 pt-5"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <div className="flex gap-1.5 items-center">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === stepIndex ? '22px' : '6px',
                    height: '6px',
                    borderRadius: '3px',
                    background: i === stepIndex ? 'var(--ccc-raspberry)' : 'rgba(28,28,28,0.14)',
                    transition: 'all 0.28s cubic-bezier(0.16,1,0.3,1)',
                  }}
                />
              ))}
            </div>

            <div className="flex gap-2.5">
              {stepIndex > 0 && (
                <button
                  onClick={() => navigate('prev')}
                  className="px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-80"
                  style={{
                    background: 'var(--muted)',
                    color: 'var(--muted-foreground)',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  Back
                </button>
              )}
              <button
                onClick={() => navigate('next')}
                className="px-6 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: 'var(--ccc-raspberry)',
                  boxShadow: '0 4px 20px rgba(217,36,106,0.26)',
                  fontFamily: 'var(--font-body)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--ccc-raspberry-dark)'
                  e.currentTarget.style.boxShadow = '0 6px 28px rgba(217,36,106,0.36)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--ccc-raspberry)'
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(217,36,106,0.26)'
                }}
              >
                {step.isFinal ? "Let's go" : 'Next'}
              </button>
            </div>
          </div>
        </div>

        {!step.isFinal && (
          <button
            onClick={dismiss}
            className="absolute top-9 right-9 text-[10px] tracking-[0.14em] uppercase transition-opacity duration-200"
            style={{
              color: 'var(--muted-foreground)',
              opacity: 0.4,
              fontFamily: 'var(--font-body)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.65' }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.40' }}
          >
            Skip tour
          </button>
        )}
      </div>
    </div>
  )
}
