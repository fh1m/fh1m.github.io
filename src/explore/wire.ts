/**
 * Everything the Pi says to the board for "move forward": one MAVLink 2 COMMAND_LONG frame.
 * Built here exactly as pymavlink packs it (little-endian, trailing zeros truncated, X.25 CRC
 * seeded with COMMAND_LONG's crc_extra = 152). With 3 s at gain 40 it reproduces Mongla's own
 * published frame: 44 bytes, CRC 0x1EFD (mongla_ws tools/site/wire_frame.py).
 */
import { C, h, scrub, sentence, readout, choice, poke } from "./kit";

function x25(bytes: Iterable<number>, crc = 0xffff) {
  for (const b of bytes) { let t = (b ^ (crc & 0xff)) & 0xff; t = (t ^ (t << 4)) & 0xff; crc = ((crc >> 8) ^ (t << 8) ^ (t << 3) ^ (t >> 4)) & 0xffff; }
  return crc;
}

type Field = { name: string; from: number; len: number; tone: string; what: string };

export function mount(root: HTMLElement) {
  let secs = 3, gain = 40, seq = 0;
  const { slots } = sentence(root, `The operator types <code>move_forward {secs} --gain {gain}</code>. The cable carries <b class="k-me">{n} bytes</b>, ending in checksum <b>{crc}</b>.`);
  const grid = h("div", { class: "x-bytes", role: "list", "aria-label": "The frame, byte by byte" }, root);
  const say = readout(root);

  const build = () => {
    const dv = new DataView(new ArrayBuffer(33));
    [0, secs, gain / 100, 0, 0, 0, 0].forEach((f, i) => dv.setFloat32(i * 4, f, true));
    dv.setUint16(28, 31000, true); dv.setUint8(30, 1); dv.setUint8(31, 1); dv.setUint8(32, 0);
    let payload = Array.from(new Uint8Array(dv.buffer));
    const full = payload.length;
    while (payload.length > 1 && payload[payload.length - 1] === 0) payload = payload.slice(0, -1);
    const hdr = [0xfd, payload.length, 0, 0, seq & 0xff, 255, 191, 76, 0, 0];
    let crc = x25([...hdr.slice(1), ...payload]); crc = x25([152], crc);
    return { bytes: [...hdr, ...payload, crc & 0xff, crc >> 8], plen: payload.length, trimmed: full - payload.length, crc };
  };

  const draw = () => {
    const { bytes, plen, trimmed, crc } = build();
    const P = 10, end = P + plen;
    const fields: Field[] = [
      { name: "STX", from: 0, len: 1, tone: C.faint, what: "a MAVLink 2 frame starts here" },
      { name: "LEN", from: 1, len: 1, tone: C.faint, what: `payload length: ${plen} (MAVLink 2 cut ${trimmed} trailing zero byte${trimmed === 1 ? "" : "s"})` },
      { name: "FLAGS", from: 2, len: 2, tone: C.faint, what: "no flags: the frame is unsigned" },
      { name: "SEQ", from: 4, len: 1, tone: C.faint, what: "counts frames, so the board can see a loss" },
      { name: "SYS", from: 5, len: 1, tone: C.me, what: "who is speaking: 255, the Pi" },
      { name: "COMP", from: 6, len: 1, tone: C.me, what: "191 = ONBOARD_COMPUTER, the id the board's link failsafe listens for" },
      { name: "MSG", from: 7, len: 3, tone: C.faint, what: "76 = COMMAND_LONG, little-endian" },
      { name: "type", from: 10, len: 4, tone: C.medium, what: "param 1: verb type 0, MOVE_FORWARD" },
      { name: "seconds", from: 14, len: 4, tone: C.measured, what: `param 2: ${secs} as a 32-bit float` },
      { name: "speed", from: 18, len: 4, tone: C.measured, what: `param 3: ${(gain / 100).toFixed(2)} as a 32-bit float` },
      { name: "p4–p7", from: 22, len: 16, tone: C.line, what: "params 4–7: unused, zero" },
      { name: "COMMAND", from: 38, len: 2, tone: C.estimate, what: "31000 = CMD_SROT_MOVE, the one custom command" },
      { name: "TARGET", from: 40, len: 2, tone: C.faint, what: "the board (1), its autopilot (1)" },
    ];
    grid.replaceChildren();
    bytes.forEach((b, i) => {
      const inPayload = i >= P && i < end;
      const f = i >= end ? { name: "CRC", tone: C.failure, what: `X.25 checksum over the frame, seeded with crc_extra 152: 0x${crc.toString(16).toUpperCase().padStart(4, "0")}` } : fields.find((ff) => i >= ff.from && i < ff.from + ff.len) ?? { name: "?", tone: C.faint, what: "" };
      const cell = h("span", { class: "x-byte", role: "listitem", tabindex: 0, style: `--c:${f.tone}`, title: `${i}: ${f.name}`, "aria-label": `byte ${i}, ${f.name}, value ${b}` }, grid);
      cell.innerHTML = `<i>${i}</i>${b.toString(16).padStart(2, "0").toUpperCase()}<em>${(i === (fields.find((ff) => ff.name === f.name)?.from ?? i) || f.name === "CRC" && i === end) ? f.name : ""}</em>`;
      const show = () => say(`<b>byte ${i} · ${f.name}</b>: ${f.what}${inPayload ? "" : ""}`);
      cell.addEventListener("pointerenter", show); cell.addEventListener("focus", show);
    });
    slots.n.textContent = String(bytes.length);
    slots.crc.textContent = `0x${crc.toString(16).toUpperCase().padStart(4, "0")}`;
    say(`no thrust in it. No motor, no angle, no depth. Which thrusters spin, and how the hull holds heading for those ${secs} seconds, is the board's business. Hover or tab through the bytes.`);
  };
  scrub(slots.secs, { value: secs, min: 0, max: 20, step: 0.5, fmt: (v) => String(v), label: "Seconds", tone: "measured" }, (v) => { secs = v; draw(); poke(); });
  scrub(slots.gain, { value: gain, min: 0, max: 100, step: 1, fmt: (v) => String(v), label: "Gain", tone: "measured" }, (v) => { gain = v; draw(); poke(); });
  choice(root, "Frame sequence number", [{ label: "first frame (seq 0)", on: () => { seq = 0; draw(); } }, { label: "the next one (seq 1)", on: () => { seq = 1; draw(); } }], 0);
  draw();
}
