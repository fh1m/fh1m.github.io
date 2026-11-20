import { slider, readout } from "./ui";

/** Controlled arithmetic, not a camera replay or a run of the archived pipeline. */
export function mount(el: HTMLElement) {
  let intervalMs = 100, extraDelayMs = 170, speed = 0.5;
  const firstDelayMs = 30;
  let say: ReturnType<typeof readout>;
  const lanes = document.createElement("div");
  lanes.className = "timing-lanes";
  lanes.innerHTML = `<div class="timing-capture"><p class="timing-label">Capture <span></span></p><div class="timing-track" aria-hidden="true"><i></i><i></i></div></div><div class="timing-completion"><p class="timing-label">Completion <span></span></p><div class="timing-track" aria-hidden="true"><i></i><i></i></div></div>`;
  const labels = lanes.querySelectorAll<HTMLElement>(".timing-label span");
  const markers = lanes.querySelectorAll<HTMLElement>(".timing-track i");
  const update = () => {
    const captureSeconds = intervalMs / 1000;
    const displacement = speed * captureSeconds;
    const captureVelocity = displacement / captureSeconds;
    const completionVelocity = displacement / ((intervalMs + extraDelayMs) / 1000);
    const secondCompletion = intervalMs + firstDelayMs + extraDelayMs;
    const percentPerMs = 100 / (secondCompletion + 50);
    labels[0].textContent = `0 → ${intervalMs} ms`;
    labels[1].textContent = `${firstDelayMs} → ${secondCompletion} ms`;
    markers[0].style.left = "0%";
    markers[1].style.left = `${intervalMs * percentPerMs}%`;
    markers[2].style.left = `${firstDelayMs * percentPerMs}%`;
    markers[3].style.left = `${secondCompletion * percentPerMs}%`;
    say(`Archived field: <b>${displacement.toFixed(3)} m</b> of displacement, despite its m/s comment.<br>Capture-time average: <b style="color:var(--measured)">${captureVelocity.toFixed(3)} m/s</b>.<br>Completion-time guess: <b style="color:var(--failure)">${completionVelocity.toFixed(3)} m/s</b>.<br>${extraDelayMs === 0 ? "Equal processing delays cancel from this interval; the poses can still be old." : "Only the second observation's extra worker delay changed the completion-time denominator."}`);
  };
  slider(el, { id:"dhara-interval-ms", label:"Accepted capture interval", min:10, max:1000, step:1, value:intervalMs, fmt:v => `${v} ms` }, value => { intervalMs = value; update(); });
  slider(el, { id:"dhara-delay-ms", label:"Extra processing delay on the second observation", min:0, max:500, step:10, value:extraDelayMs, fmt:v => `${v} ms` }, value => { extraDelayMs = value; update(); });
  slider(el, { id:"dhara-speed", label:"Constructed physical speed", min:0, max:1.2, step:0.05, value:speed, fmt:v => `${v.toFixed(2)} m/s` }, value => { speed = value; update(); });
  el.append(lanes);
  say = readout(el);
  update();
}
