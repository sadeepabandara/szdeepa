'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface QuoteData {
    text: string;
    author: string;
}

const fallback: QuoteData = {
    text: 'Rule No. 1 : Never lose money. Rule No. 2 : Never forget Rule No. 1.',
    author: 'Warren Buffett',
};

export default function Quote({ data }: { data?: QuoteData | null }) {
    const d = data ?? fallback;
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const fills = Array.from(
            section.querySelectorAll<HTMLElement>('.q-word-fill'),
        );

        const total = fills.length;
        if (total === 0) return;

        // Single ScrollTrigger drives all words
        const st = ScrollTrigger.create({
            trigger: section,
            start: 'top 75%',
            end: '0%',
            scrub: 1.2,
            onUpdate: (self) => {
                const p = self.progress; // 0 → 1

                fills.forEach((fill, i) => {
                    // Each word owns an equal non-overlapping slice of [0, 1]
                    const wordStart = i / total;
                    const wordEnd = (i + 1) / total;

                    // How far through this word's slice are we?
                    const wordProgress = Math.max(
                        0,
                        Math.min(1, (p - wordStart) / (wordEnd - wordStart)),
                    );

                    // Reveal left-to-right: inset right side shrinks from 100% → 0%
                    fill.style.clipPath = `inset(0 ${(1 - wordProgress) * 100}% 0 0)`;
                });
            },
        });

        return () => {
            st.kill();
        };
    }, [d.text]);

    const words = d.text.split(' ');

    return (
        <section
            ref={sectionRef}
            className="px-6 md:px-14 py-20 md:py-32 bg-bg border-b"
            style={{ borderColor: 'var(--line)' }}
        >
            <div className="max-w-5xl mx-auto">
                {/* Decorative opening quote mark */}
                <div
                    className="font-extrabold mb-2 -ml-2"
                    style={{
                        color: 'rgba(255,94,26,0.15)',
                        lineHeight: 0.8,
                        fontSize: 'clamp(64px, 8vw, 96px)',
                        userSelect: 'none',
                    }}
                >
                    "
                </div>

                {/* Quote text with scroll-fill animation */}
                <p
                    className="font-extrabold leading-[1.15] tracking-[-0.025em] mb-10 flex flex-wrap"
                    style={{
                        fontSize: 'clamp(22px, 3.8vw, 52px)',
                        gap: '0 0.28em',
                    }}
                >
                    {words.map((word, i) => (
                        <span
                            key={i}
                            className="inline-block relative"
                            style={{ lineHeight: 'inherit' }}
                        >
                            {/* Ghost dim layer — holds layout space */}
                            <span
                                style={{
                                    color: 'rgba(245,240,232,0.10)',
                                    display: 'block',
                                    whiteSpace: 'pre',
                                    userSelect: 'none',
                                }}
                            >
                                {word}
                            </span>
                            {/* Fill layer — clipped until scroll reveals it */}
                            <span
                                className="q-word-fill"
                                style={{
                                    color: 'var(--fg)',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    whiteSpace: 'pre',
                                    clipPath: 'inset(0 100% 0 0)',
                                    willChange: 'clip-path',
                                }}
                            >
                                {word}
                            </span>
                        </span>
                    ))}
                </p>

                {/* Attribution — static, no animation */}
                <div className="flex items-center gap-4">
                    <span
                        className="w-10 h-px block flex-shrink-0"
                        style={{ background: 'rgba(255,94,26,0.5)' }}
                    />
                    <span
                        className="font-mono tracking-[0.22em] uppercase"
                        style={{
                            color: 'rgba(255,94,26,0.7)',
                            fontSize: '11px',
                        }}
                    >
                        {d.author}
                    </span>
                </div>
            </div>
        </section>
    );
}
