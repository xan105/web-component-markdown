import { whenReady, $select } from "@xan105/vanilla-query";
import { Markdown } from "@xan105/markdown";
customElements.define("mark-down", Markdown);

await Promise.all([
  customElements.whenDefined("mark-down"),
  whenReady
]);

const el = $select("mark-down");
el.$on("change", ()=>{ console.log("change") });
el.$on("load", ()=>{ console.log("load") });
el.$on("render", ()=>{ console.log("render") });
el.$on("success", ()=>{ console.log("success") });
el.$on("failure", ({ detail })=>{ console.error(detail) });

console.time("render");
await el.render().catch(console.error);
console.timeEnd("render");