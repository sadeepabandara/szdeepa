'use client';

export default function Footer() {
    return (
        <div
            className="pt-8 pb-2 border-t flex flex-col sm:flex-row justify-between items-center gap-3"
            style={{ borderColor: 'var(--line)' }}
        >
            <span className="font-syne text-[13px] tracking-[0.06em] text-fg/40">
                © 2026 Sadeepa - All rights reserved
            </span>

            <span className="inline-flex items-center select-none" style={{ fontFamily: 'var(--font-syne), sans-serif' }}>
                <span
                    className="text-[11px] font-semibold"
                    style={{
                        color: 'rgba(245,240,232,0.3)',
                        marginRight: 5,
                        flexShrink: 0,
                    }}
                >
                    ©
                </span>
                <span
                    className="text-[11px] tracking-[0.12em] uppercase font-semibold"
                    style={{
                        color: 'rgba(245,240,232,0.3)',
                        marginRight: 5,
                        display: 'inline-block',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                    }}
                >
                    Code by
                </span>
                <span
                    className="text-[14px] font-bold tracking-[0.12em] uppercase"
                    style={{
                        color: 'rgba(245,240,232,0.85)',
                        whiteSpace: 'nowrap',
                    }}
                >
                    Sadeepa
                </span>
            </span>
        </div>
    );
}
