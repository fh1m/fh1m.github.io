/**
 * Preserve the author's reading order. Only give wide technical material an
 * accessible scroll region; never move evidence away from its explanation.
 */
export default function rehypeReading() {
  return (tree) => {
    const visit = (node) => {
      const tag = node.type === "element" ? node.tagName : node.type === "mdxJsxFlowElement" ? node.name : undefined;
      if (tag === "pre" && node.type === "element") {
        node.properties = { ...node.properties, tabIndex:0, role:"region", ariaLabel:"Code; scroll horizontally if needed" };
        return node;
      }
      if (tag === "table" || tag === "svg") {
        const viewBox = node.properties?.viewBox ?? node.properties?.viewbox ?? node.attributes?.find((a) => a.name === "viewBox")?.value;
        const width = Math.max(320, Number(String(viewBox ?? "").trim().split(/[ ,]+/)[2]) || 640);
        return {
          type:"element", tagName:"div",
          properties:{
            className:["reading-region", tag === "svg" ? "reading-diagram" : "reading-table"],
            tabIndex:0, role:"region",
            ariaLabel:tag === "svg" ? "Technical diagram; scroll horizontally if needed" : "Data table; scroll horizontally if needed",
            ...(tag === "svg" ? { style:`--diagram-width:${width}px` } : {}),
          },
          children:[node],
        };
      }
      if (node.children) node.children = node.children.map(visit);
      return node;
    };
    tree.children = tree.children.map(visit);
  };
}
