'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── Command definitions ────────────────────────────────────────────────────
const COMMANDS: Record<string, { output: () => Line[] }> = {
    help: {
        output: () => [
            { text: 'Available commands:', type: 'info' },
            { text: '' },
            { text: '  whoami        — who is this guy?', type: 'dim' },
            { text: '  about         — background & story', type: 'dim' },
            { text: '  skills        — tech stack & tools', type: 'dim' },
            { text: '  projects      — recent work', type: 'dim' },
            { text: '  education     — academic background', type: 'dim' },
            { text: '  contact       — get in touch', type: 'dim' },
            { text: '  clear         — clear terminal', type: 'dim' },
            { text: '' },
            { text: 'Tip: try typing "whoami" to start →', type: 'accent' },
        ],
    },
    whoami: {
        output: () => [
            { text: 'sadeepa bandara', type: 'accent' },
            { text: '' },
            { text: 'Investor · Entrepreneur · Developer · Designer', type: 'info' },
            { text: 'Based in Melbourne, Australia  ·  From Sri Lanka', type: 'dim' },
        ],
    },
    about: {
        output: () => [
            { text: '> Background', type: 'accent' },
            { text: '' },
            { text: "BSc (Hons) Computing — Coventry University, UK", type: 'dim' },
            { text: 'MSc IT Management    — Deakin University, AU (current)', type: 'dim' },
            { text: '' },
            { text: '> Currently', type: 'accent' },
            { text: '' },
            { text: 'Building products · studying forex · editing video', type: 'dim' },
            { text: "Passionate about innovation, growth & making things that matter.", type: 'dim' },
        ],
    },
    skills: {
        output: () => [
            { text: '> Languages', type: 'accent' },
            { text: '  JavaScript  TypeScript  Python  Dart', type: 'dim' },
            { text: '' },
            { text: '> Frontend', type: 'accent' },
            { text: '  React  Next.js  Flutter  Tailwind  Framer Motion', type: 'dim' },
            { text: '' },
            { text: '> Backend & DB', type: 'accent' },
            { text: '  Node.js  Express  Supabase  PostgreSQL  Firebase', type: 'dim' },
            { text: '' },
            { text: '> Tools', type: 'accent' },
            { text: '  Git  Figma  VS Code  Docker  Vercel', type: 'dim' },
        ],
    },
    projects: {
        output: () => [
            { text: '> Recent Work', type: 'accent' },
            { text: '' },
            { text: '  BlockMate      — AI-powered property investment platform', type: 'dim' },
            { text: '  This Portfolio — Next.js · GSAP · Framer Motion · Supabase', type: 'dim' },
            { text: '' },
            { text: 'Scroll up ↑ to Projects section for full case studies.', type: 'info' },
        ],
    },
    education: {
        output: () => [
            { text: '> Academic Timeline', type: 'accent' },
            { text: '' },
            { text: '  2024 – now   MSc Information Technology Management', type: 'dim' },
            { text: '               Deakin University, Melbourne', type: 'dim' },
            { text: '' },
            { text: '  2020 – 2023  BSc (Hons) Computing', type: 'dim' },
            { text: '               Coventry University, United Kingdom', type: 'dim' },
        ],
    },
    contact: {
        output: () => [
            { text: '> Reach out', type: 'accent' },
            { text: '' },
            { text: '  Email    sadeepa@example.com', type: 'dim' },
            { text: '  GitHub   github.com/sadeepa', type: 'dim' },
            { text: '  LinkedIn linkedin.com/in/sadeepa', type: 'dim' },
            { text: '' },
            { text: "Or scroll down ↓ to the Contact section — I reply fast.", type: 'info' },
        ],
    },
    clear: { output: () => [] }, // handled separately
};

const UNKNOWN = (cmd: string): Line[] => [
    { text: `command not found: ${cmd}`, type: 'error' as const },
    { text: "Type 'help' for available commands.", type: 'dim' as const },
];

const BOOT: Line[] = [
    { text: 'sadeepa-portfolio v1.0.0  —  type "help" to explore', type: 'accent' },
    { text: '─'.repeat(52), type: 'line' },
];

// ── Types ──────────────────────────────────────────────────────────────────
type LineType = 'default' | 'dim' | 'info' | 'accent' | 'error' | 'line' | 'cmd';
interface Line { text: string; type?: LineType; }
interface Block { cmd: string; lines: Line[]; id: number; }

// ── Line renderer ──────────────────────────────────────────────────────────
function colorFor(type?: LineType) {
    switch (type) {
        case 'accent': return 'var(--or)';
        case 'dim': return 'var(--fg2)';
        case 'info': return 'var(--fg)';
        case 'error': return '#e05a5a';
        case 'line': return 'var(--line)';
        case 'cmd': return 'var(--fg)';
        default: return 'var(--fg)';
    }
}

export default function Terminal() {
    const sectionRef = useRef<HTMLElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const outputRef = useRef<HTMLDivElement>(null);

    const [blocks, setBlocks] = useState<Block[]>([]);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>([]);
    const [histIdx, setHistIdx] = useState(-1);
    const idRef = useRef(0);

    // Boot sequence
    useEffect(() => {
        const helpLines = COMMANDS.help.output();
        setBlocks([
            { cmd: '', lines: BOOT, id: idRef.current++ },
            { cmd: 'help', lines: helpLines, id: idRef.current++ }
        ]);
    }, []);

    // Auto-scroll to bottom on new output
    useEffect(() => {
        const output = outputRef.current;
        if (!output) return;
        output.scrollTo({ top: output.scrollHeight, behavior: 'smooth' });
    }, [blocks]);

    // GSAP section reveal
    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;
        gsap.fromTo(
            section.querySelectorAll('.t-fu'),
            { opacity: 0, y: 40 },
            {
                opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
                scrollTrigger: { trigger: section, start: 'top 78%' },
            },
        );
    }, []);

    const runCommand = useCallback((raw: string) => {
        const cmd = raw.trim().toLowerCase();
        if (!cmd) return;

        setHistory(h => [cmd, ...h]);
        setHistIdx(-1);

        if (cmd === 'clear') {
            setBlocks([{ cmd: '', lines: BOOT, id: idRef.current++ }]);
            return;
        }

        const def = COMMANDS[cmd];
        const lines = def ? def.output() : UNKNOWN(cmd);
        setBlocks(b => [...b, { cmd: raw.trim(), lines, id: idRef.current++ }]);
    }, []);

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            runCommand(input);
            setInput('');
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const next = Math.min(histIdx + 1, history.length - 1);
            setHistIdx(next);
            setInput(history[next] ?? '');
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = Math.max(histIdx - 1, -1);
            setHistIdx(next);
            setInput(next === -1 ? '' : history[next]);
        }
    };

    return (
        <section
            ref={sectionRef}
            id="terminal"
            className="px-6 md:px-14 py-16 md:py-24 bg-bg border-t"
            style={{ borderColor: 'var(--line)' }}
        >
            {/* Section label */}
            <div className="max-w-4xl mx-auto">
                <p className="t-fu font-syne text-[13px] tracking-[0.2em] uppercase mb-6"
                    style={{ color: 'var(--fg3)' }}>
                    — terminal
                </p>
                <h2 className="t-fu font-syne font-extrabold mb-10 leading-none tracking-tight"
                    style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: 'var(--fg)' }}>
                    Explore via{' '}
                    <span style={{ color: 'var(--or)' }}>command line</span>
                </h2>

                {/* Terminal window */}
                <div
                    className="t-fu rounded-xl overflow-hidden"
                    style={{
                        background: '#0a0a0a',
                        border: '1px solid rgba(235,89,57,0.12)',
                        boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)',
                    }}
                >
                    {/* Window chrome */}
                    <div
                        className="flex items-center gap-2 px-4 py-3 border-b"
                        style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#111' }}
                    >
                        <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
                        <span className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
                        <span className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
                        <span
                            className="ml-auto font-syne text-[13px]"
                            style={{ color: 'rgba(255,255,255,0.2)' }}
                        >
                            sadeepa@portfolio: ~
                        </span>
                    </div>

                    {/* Output area */}
                    <div
                        ref={outputRef}
                        className="px-5 py-4 font-syne text-[14px] leading-relaxed overflow-y-auto"
                        style={{ height: '460px' }}
                        onClick={() => inputRef.current?.focus()}
                    >
                        {blocks.map((block) => (
                            <div key={block.id} className="mb-1">
                                {/* Command echo */}
                                {block.cmd && (
                                    <div className="flex items-center gap-2 mb-1">
                                        <span style={{ color: 'var(--or)', userSelect: 'none' }}>
                                            sadeepa<span style={{ color: 'var(--fg3)' }}>@portfolio</span>
                                            <span style={{ color: 'var(--fg3)' }}>:~$</span>
                                        </span>
                                        <span style={{ color: 'var(--fg)' }}>{block.cmd}</span>
                                    </div>
                                )}
                                {/* Output lines */}
                                {block.lines.map((line, li) => (
                                    <div
                                        key={li}
                                        style={{
                                            color: colorFor(line.type),
                                            minHeight: '1.4em',
                                            whiteSpace: 'pre',
                                        }}
                                    >
                                        {line.text || '\u00a0'}
                                    </div>
                                ))}
                                <div className="mb-3" />
                            </div>
                        ))}

                        {/* Active input line */}
                        <div className="flex items-center gap-2">
                            <span style={{ color: 'var(--or)', userSelect: 'none', whiteSpace: 'nowrap' }}>
                                sadeepa<span style={{ color: 'var(--fg3)' }}>@portfolio</span>
                                <span style={{ color: 'var(--fg3)' }}>:~$</span>
                            </span>
                            <div className="relative flex-1 flex items-center">
                                <input
                                    ref={inputRef}
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={onKeyDown}
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                    spellCheck={false}
                                    className="bg-transparent outline-none w-full"
                                    style={{
                                        color: 'var(--fg)',
                                        caretColor: 'var(--or)',
                                        fontFamily: 'inherit',
                                        fontSize: 'inherit',
                                    }}
                                    aria-label="Terminal input"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hint row */}
                <p
                    className="t-fu mt-4 font-syne text-[13px] text-center"
                    style={{ color: 'var(--fg3)' }}
                >
                    click inside the terminal and type a command · ↑↓ for history
                </p>
            </div>
        </section>
    );
}
