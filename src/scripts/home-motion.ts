// Home page motion only (AR44): the series layers settle on scroll and the Artefact of the Day fades up once.
// Not loaded at all under prefers-reduced-motion, so the layers sit in place and nothing moves (UX-DR42).
//
// Decisions (emil-design-eng + motion-design, calm, no overshoot; "Indeks" direction 2026-11-19):
// - The one scroll moment: the four series layers start pressed together and part into place as the section scrolls
//   in, like layers lifted apart in a section drawing. Scrub maps scroll to progress (power1.out), only transform moves.
// - Fade-up on the Artefact of the Day is once, 0.6s power3.out, 24px.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const layers = [...document.querySelectorAll<HTMLElement>('[data-layers] [data-band]')];
  const aotd = document.querySelector<HTMLElement>('[data-aotd] .wrap');
  if (layers.length || aotd) {
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger);
      const list = layers[0]?.parentElement;
      if (list) {
        layers.forEach((layer, i) => {
          gsap.from(layer, {
            y: () => -i * Math.min(24, layer.offsetHeight * 0.15),
            ease: 'power1.out',
            scrollTrigger: { trigger: list, start: 'top 90%', end: 'top 30%', scrub: 0.3, invalidateOnRefresh: true },
          });
        });
      }
      if (aotd) {
        gsap.from(aotd, { opacity: 0, y: 24, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: aotd, start: 'top 85%', once: true } });
      }
    });
  }
}
