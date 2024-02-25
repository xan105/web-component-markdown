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
el.$on("intersect", ({ detail })=>{ 
  
  console.log("intersect", detail.id);

  const toc = $select("#toc");
  toc.$selectAll("a").forEach(el => el.$css("color", "blue"));
  toc.$select(`a[href="#${detail.id}"]`)?.$css("color", "red");
  
});

console.time("render");
await el.render().catch(console.error);
console.timeEnd("render");

const headings = el.headings;
console.log(headings);
$select("#toc").innerHTML = headings.toHTML({depth: 2});