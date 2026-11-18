// Home page motion only (AR44): the Masthead strata scrub and the Artefact of the Day fade-up.
// Not loaded at all under prefers-reduced-motion, so bands stay closed and nothing moves on scroll (UX-DR42).
//
// Prototype decisions (emil-design-eng + motion-design, "Premium" personality: calm, no overshoot):
// - Scrub maps scroll straight to progress; the shaping curve is power1.inOut so the bands leave rest gently
//   and settle softly at the end, and scrub: 0.3 smooths wheel steps without visible lag.
// - Gap distance: each band moves 2 steps out from the centre band (step 32px desktop, 16px mobile; raised 2026-11-18 so the dug layers visibly part), so the gap
//   between neighbours opens by one step. Only transform moves, well under a third of the screen (1/3 rule).
// - Fade-up on the Artefact of the Day is once, 0.6s power3.out, 24px, as DESIGN.md specifies.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const mast = document.querySelector<HTMLElement>('[data-masthead]');
  const bands = [...document.querySelectorAll<HTMLElement>('[data-band]')];
  const aotd = document.querySelector<HTMLElement>('[data-aotd] .wrap');
  if (mast || aotd) {
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger);
      if (mast && bands.length === 5) {
        gsap.matchMedia().add('(min-width: 768px)', () => spread(32)).add('(max-width: 767px)', () => spread(16));
      }
      if (aotd) {
        gsap.from(aotd, { opacity: 0, y: 24, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: aotd, start: 'top 85%', once: true } });
      }

      function spread(step: number) {
        bands.forEach((band, i) => {
          gsap.to(band, {
            y: (i - 2) * step,
            ease: 'power1.inOut',
            scrollTrigger: { trigger: mast, start: 'top top', end: 'bottom top', scrub: 0.3 },
          });
        });
      }
    });
  }
}
