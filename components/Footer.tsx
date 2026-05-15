'use client';

import SignatureTag from '@/components/SignatureTag';

export default function Footer() {
    return (
        <div
            className="pt-8 pb-2 border-t flex flex-col sm:flex-row justify-between items-center gap-3"
            style={{ borderColor: 'var(--line)' }}
        >
            <span className="font-syne text-[13px] tracking-[0.06em] text-fg/40">
                © 2026 Sadeepa — All rights reserved
            </span>
            <SignatureTag />
        </div>
    );
}
