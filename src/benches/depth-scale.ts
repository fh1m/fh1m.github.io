import { slider, readout } from "./ui";

/** A numerical illustration of Matra's archived conversion, not depth inference. */
export function mount(el: HTMLElement) {
  const explanation = document.createElement("p");
  explanation.className = "bench-note";
  explanation.textContent = "One raw pixel stays at 6.222222. Change only a different pixel—the frame maximum. No camera or model runs here.";
  el.append(explanation);

  const ruler = document.createElement("div");
  ruler.setAttribute("aria-hidden", "true");
  ruler.style.cssText = "margin:1.5rem 0 1rem;padding-top:.5rem";
  ruler.innerHTML = `<div style="position:relative;height:1.5rem;border-bottom:2px solid var(--line-2)"><span style="position:absolute;bottom:-5px;width:3px;height:1.7rem;background:var(--measured);transform:translateX(-50%)"></span></div><div style="display:flex;justify-content:space-between;margin-top:.5rem;font:400 .85rem var(--mono);color:var(--ink)"><span>0.1</span><span>configured numerical range</span><span>20.0</span></div>`;
  const marker = ruler.querySelector<HTMLElement>("div > span")!;
  const heldRaw = 6.222222328186035;
  let maximum = 8;
  let say: ReturnType<typeof readout>;
  const update = () => {
    const normalized = (heldRaw - 4) / (maximum - 4);
    const mapped = .1 + normalized * 19.9;
    marker.style.left = `${normalized * 100}%`;
    say(`Unchanged raw pixel: <b>6.222222</b><br>Mapped output: <b style="font-weight:500;font-size:1.2rem;color:var(--estimate)">${mapped.toFixed(3)}</b> — not a calibrated distance.<br>Only another pixel changed. The ruler moved, not this observation.`);
  };
  slider(el, { id:"matra-far-raw", label:"A different pixel: frame maximum", min:8, max:80, step:1, value:8, fmt:(v) => `${v} raw units` }, (value) => { maximum = value; update(); });
  el.append(ruler);
  say = readout(el);
  update();
}
