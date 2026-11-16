/**
 * Turns a note into scenes: one idea per screen. Every h2 starts a scene; the text before the
 * first h2 is the opening scene. Inside a scene, visuals (figures, explorables, galleries,
 * charts, tables, equations) go to a sticky stage, text scrolls beside it in beats, and each
 * beat names the visual it belongs to (`data-step`), so the stage follows the reader.
 * A scene with no visuals becomes a statement: large type, centred, nothing beside it.
 */
const VISUAL_JSX = { Fig: true, Explore: true, Gallery: true, Chart: true, Bars: true, Stats: true };
const VISUAL_TAG = { table: true, pre: true, figure: true, img: true };

const isWhitespace = (n) => n.type === "text" && !n.value.trim();
const isVisual = (n) =>
  (n.type === "mdxJsxFlowElement" && VISUAL_JSX[n.name] === true) || (n.type === "element" && VISUAL_TAG[n.tagName] === true);
const isHeading = (n) => n.type === "element" && n.tagName === "h2";
const el = (tagName, properties, children) => ({ type: "element", tagName, properties, children });

function buildScene(nodes, index) {
  const stage = [], items = []; // items: { node, step } in reading order, text only
  const heading = nodes[0] && isHeading(nodes[0]) ? nodes.shift() : null;
  let step = -1, pending = [];
  const flush = (to) => { for (const n of pending) items.push({ node: n, step: to }); pending = []; };
  for (const n of nodes) {
    if (isWhitespace(n)) continue;
    if (!isVisual(n)) { pending.push(n); continue; }
    step += 1;
    // the paragraph right before a visual introduces it; anything earlier stays with the last one
    const intro = pending.pop();
    flush(Math.max(step - 1, 0));
    if (intro) items.push({ node: intro, step });
    stage.push(el("div", { className: ["stage-item"], dataStep: String(step) }, [n]));
  }
  flush(Math.max(step, 0));
  const text = [];
  let beat = null;
  for (const { node, step: s } of items) {
    if (!beat || beat.properties.dataStep !== String(s)) { beat = el("div", { className: ["beat"], dataStep: String(s) }, []); text.push(beat); }
    beat.children.push(node);
  }
  if (heading) { if (text[0]) text[0].children.unshift(heading); else text.push(el("div", { className: ["beat"], dataStep: "0" }, [heading])); }
  const kind = stage.length ? "split" : "statement";
  const cls = ["scene", `scene-${kind}`];
  if (index === 0) cls.push("scene-intro");
  const kids = [el("div", { className: ["scene-text"] }, text)];
  if (stage.length) kids.push(el("div", { className: ["scene-stage"], ariaLabel: "Figures for this part" }, [el("div", { className: ["stage-inner"] }, stage)]));
  return el("section", { className: cls, dataScene: String(index) }, kids);
}

export default function rehypeScenes() {
  return (tree) => {
    const keep = [], groups = [[]];
    for (const n of tree.children) {
      if (n.type === "mdxjsEsm") { keep.push(n); continue; } // imports stay top-level
      if (isHeading(n) && groups[groups.length - 1].some((x) => !isWhitespace(x))) groups.push([]);
      groups[groups.length - 1].push(n);
    }
    const scenes = groups.filter((g) => g.some((x) => !isWhitespace(x))).map((g, i) => buildScene(g, i));
    tree.children = [...keep, ...scenes];
  };
}
