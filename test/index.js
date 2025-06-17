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
  const toc = $select("#toc");
  const active = toc.$select(`a[href="#${detail.id}"]`);
  if(active){
    console.log("intersect", detail.id);
    toc.$selectAll("a").forEach(el => el.$css("color", "blue"));
    active.$css("color", "red");
  }
});

console.time("render");
await el.render().catch(console.error);
console.timeEnd("render");

const headings = el.headings;
console.log(headings);
$select("#toc").innerHTML = headings.toHTML({depth: 2});

console.log(el.estimateReadingTime() + " min to read");