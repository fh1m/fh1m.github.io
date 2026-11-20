/** Mount explorables lazily. One IntersectionObserver for the whole page. */
const explorables = import.meta.glob<{ mount: (el: HTMLElement) => void }>(["./*.ts", "!./kit.ts", "!./loader.ts"]);
const benches = import.meta.glob<{ mount: (el: HTMLElement, bus: EventTarget) => void }>(["../benches/*.ts", "!../benches/ui.ts"]);
const bus = new EventTarget();

async function mount(fig: HTMLElement) {
  const body = fig.querySelector<HTMLElement>(".x-body")!;
  const id = fig.dataset.explore, bench = fig.dataset.benchMount;
  try {
    if (id) {
      const load = explorables[`./${id}.ts`];
      if (!load) throw new Error(`no explorable "${id}"`);
      const m = await load(); body.replaceChildren(); m.mount(body);
    } else if (bench) {
      const load = benches[`../benches/${bench}.ts`];
      if (!load) throw new Error(`no bench "${bench}"`);
      const m = await load(); body.replaceChildren(); m.mount(body, bus);
    }
    fig.dataset.ready = "true";
  } catch (err) {
    body.querySelector(".x-wait")!.textContent = `This diagram failed to load (${(err as Error).message}). The text says it in words.`;
    throw err;
  }
}

const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { io.unobserve(e.target); mount(e.target as HTMLElement); } }), { rootMargin: "300px 0px" });
// Leave the first paint to the reading content; mounts live only for this document.
const start = () => document.querySelectorAll<HTMLElement>("figure.x:not([data-ready])").forEach((f) => io.observe(f));
if (document.readyState === "complete") start(); else addEventListener("load", start, { once: true });
