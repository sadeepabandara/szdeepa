'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function Cursor({ hidden = false }: { hidden?: boolean }) {
    const x = useMotionValue(-100);
    const y = useMotionValue(-100);
    const lastPointerRef = useRef({ x: -10000, y: -10000 });

    // Spring config that gives the backOut elastic lag feel
    const springX = useSpring(x, { stiffness: 120, damping: 18, mass: 0.8 });
    const springY = useSpring(y, { stiffness: 120, damping: 18, mass: 0.8 });

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            x.set(e.clientX);
            y.set(e.clientY);
        };
        document.addEventListener('mousemove', onMove);
        return () => document.removeEventListener('mousemove', onMove);
    }, [x, y]);

    const [hoveringInteractive, setHoveringInteractive] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const isInteractiveAt = (clientX: number, clientY: number) => {
            const el = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
            const isInteractive = !!el?.closest?.('a, button, [role="button"], [data-cursor-hide]');
            setHoveringInteractive(isInteractive);
        };

        // Track pointer and detect if it's over an interactive element
        const onPointerMove = (e: PointerEvent) => {
            lastPointerRef.current = { x: e.clientX, y: e.clientY };
            isInteractiveAt(e.clientX, e.clientY);
        };

        const onScrollOrResize = () => {
            const { x, y } = lastPointerRef.current;

            if (x !== -10000 && y !== -10000) {
                isInteractiveAt(x, y);
                return;
            }

            // Fallback for cases where pointer didn't move yet.
            const hovered = document.querySelectorAll(':hover');
            const el = hovered[hovered.length - 1] as HTMLElement | undefined;
            const isInteractive = !!el?.closest?.('a, button, [role="button"], [data-cursor-hide]');
            setHoveringInteractive(isInteractive);
        };

        window.addEventListener('pointermove', onPointerMove, { passive: true });
        window.addEventListener('scroll', onScrollOrResize, { passive: true });
        window.addEventListener('resize', onScrollOrResize);
        return () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('scroll', onScrollOrResize);
            window.removeEventListener('resize', onScrollOrResize);
        };
    }, []);

    return (
        <>
            <motion.div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    x: springX,
                    y: springY,
                    translateX: '-50%',
                    translateY: '-50%',
                    width: '33px',
                    height: '33px',
                    borderRadius: '50%',
                    background: 'var(--or)',
                    pointerEvents: 'none',
                    zIndex: 9998,
                    opacity: hidden || hoveringInteractive ? 0 : 1,
                }}
            />
            <style>{`* { cursor: default !important; } a, button { cursor: pointer !important; }`}</style>
        </>
    );
}
