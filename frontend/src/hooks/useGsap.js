import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/**
 * Scroll-triggered fade-in-up reveal for a single element.
 */
export function useScrollReveal(options = {}) {
    const ref = useRef(null);
    const {
        y = 60,
        duration = 0.8,
        delay = 0,
        ease = 'power3.out',
        start = 'top 85%',
    } = options;

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        gsap.fromTo(el,
            { y, opacity: 0 },
            {
                y: 0, opacity: 1, duration, delay, ease,
                scrollTrigger: { trigger: el, start, toggleActions: 'play none none none' },
            }
        );

        return () => ScrollTrigger.getAll().forEach(t => {
            if (t.trigger === el) t.kill();
        });
    }, [y, duration, delay, ease, start]);

    return ref;
}

/**
 * Staggered reveal for children of a container.
 */
export function useStaggerReveal(childSelector, options = {}) {
    const ref = useRef(null);
    const {
        y = 50,
        duration = 0.6,
        stagger = 0.12,
        ease = 'power3.out',
        start = 'top 85%',
    } = options;

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const children = el.querySelectorAll(childSelector);
        if (!children.length) return;

        gsap.fromTo(children,
            { y, opacity: 0 },
            {
                y: 0, opacity: 1, duration, stagger, ease,
                scrollTrigger: { trigger: el, start, toggleActions: 'play none none none' },
            }
        );

        return () => ScrollTrigger.getAll().forEach(t => {
            if (t.trigger === el) t.kill();
        });
    }, [childSelector, y, duration, stagger, ease, start]);

    return ref;
}

/**
 * Magnetic hover effect — element subtly follows cursor.
 */
export function useMagnetic(strength = 0.3) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const onMove = (e) => {
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * strength;
            const y = (e.clientY - rect.top - rect.height / 2) * strength;
            gsap.to(el, { x, y, duration: 0.3, ease: 'power2.out' });
        };

        const onLeave = () => {
            gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
        };

        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);

        return () => {
            el.removeEventListener('mousemove', onMove);
            el.removeEventListener('mouseleave', onLeave);
        };
    }, [strength]);

    return ref;
}

/**
 * Parallax scroll effect — element moves at a different speed.
 */
export function useParallax(speed = 0.3) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const st = ScrollTrigger.create({
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            animation: gsap.fromTo(el,
                { y: -50 * speed },
                { y: 50 * speed, ease: 'none' }
            ),
        });

        return () => st.kill();
    }, [speed]);

    return ref;
}

/**
 * Text split reveal — words animate in one by one.
 */
export function useTextSplitReveal(options = {}) {
    const ref = useRef(null);
    const {
        duration = 0.5,
        stagger = 0.04,
        ease = 'power3.out',
        start = 'top 85%',
        y = 40,
    } = options;

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const text = el.textContent;
        const words = text.split(' ');
        el.innerHTML = words.map(w =>
            `<span style="display:inline-block;overflow:hidden;vertical-align:top;"><span style="display:inline-block">${w}</span></span>`
        ).join(' ');

        const innerSpans = el.querySelectorAll('span > span');
        gsap.fromTo(innerSpans,
            { y, opacity: 0, rotationX: -40 },
            {
                y: 0, opacity: 1, rotationX: 0, duration, stagger, ease,
                scrollTrigger: { trigger: el, start, toggleActions: 'play none none none' },
            }
        );

        return () => ScrollTrigger.getAll().forEach(t => {
            if (t.trigger === el) t.kill();
        });
    }, [duration, stagger, ease, start, y]);

    return ref;
}

/**
 * Scale-in reveal with rotation — great for cards and icons.
 */
export function useScaleReveal(options = {}) {
    const ref = useRef(null);
    const {
        scale = 0.7,
        rotation = -5,
        duration = 0.6,
        delay = 0,
        ease = 'back.out(1.7)',
        start = 'top 85%',
    } = options;

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        gsap.fromTo(el,
            { scale, rotation, opacity: 0 },
            {
                scale: 1, rotation: 0, opacity: 1, duration, delay, ease,
                scrollTrigger: { trigger: el, start, toggleActions: 'play none none none' },
            }
        );

        return () => ScrollTrigger.getAll().forEach(t => {
            if (t.trigger === el) t.kill();
        });
    }, [scale, rotation, duration, delay, ease, start]);

    return ref;
}

/**
 * Horizontal slide reveal — element slides from left or right.
 */
export function useSlideReveal(direction = 'left', options = {}) {
    const ref = useRef(null);
    const {
        distance = 80,
        duration = 0.7,
        delay = 0,
        ease = 'power3.out',
        start = 'top 85%',
    } = options;

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const xFrom = direction === 'left' ? -distance : distance;
        gsap.fromTo(el,
            { x: xFrom, opacity: 0 },
            {
                x: 0, opacity: 1, duration, delay, ease,
                scrollTrigger: { trigger: el, start, toggleActions: 'play none none none' },
            }
        );

        return () => ScrollTrigger.getAll().forEach(t => {
            if (t.trigger === el) t.kill();
        });
    }, [direction, distance, duration, delay, ease, start]);

    return ref;
}
