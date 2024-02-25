/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import { gfmHeadingId } from "marked-gfm-heading-id";
import { HighlightJS as hljs } from "highlight.js";
import { sanitize } from "dompurify";

export class Markdown extends HTMLElement {

  #marked;
  #observer;
  
  constructor () {
    super();
    //Marked
    //Don't mutate global scope and ensure options and extensions are locally scoped.
    this.#marked = new Marked({ 
      gfm: true, //GitHub Flavored Markdown spec
      breaks: true //Requires gfm to true
    });
    
    //Extensions
    
    //Code block highlighting
    //Hook hljs to markedHighlight which is used as a Marked extension
    this.#marked.use(markedHighlight({
      highlight: (code, lang) => {
        return hljs.highlight(code, { 
          language: lang || "plaintext", 
          ignoreIllegals: true 
        }).value;
      }
    }));
    
    //Add ids to headings like GitHub  
    this.#marked.use(gfmHeadingId({ prefix: "user-content-" }));
    this.#observer = new IntersectionObserver((entries)=>{
      entries.map((entry) => {
        if (entry.isIntersecting) {
          this.dispatchEvent(new CustomEvent("intersect", {
            detail: { id: entry.target.id }
          }));
        }
      });
    }, { threshold: 0.8, rootMargin: "0% 0% -80% 0%" });
  }
  
  get src(){ 
    return this.getAttribute("src"); 
  }
  
  set src(value){
    this.setAttribute("src", value);
  }
  
  get integrity(){
    return this.getAttribute("integrity");
  }
  
  set integrity(value){
    this.setAttribute("integrity", value);
  }
  
  set manual(value){
    if(value === true) 
      this.setAttribute("manual", "");
    else
      this.removeAttribute("manual");
  }
  
  get manual(){
    return this.hasAttribute("manual");
  }
  
  get rendered(){
    return this.hasAttribute("rendered");
  }
  
  get headings(){
    const result = new List(); //extended Set with .toHTML()
    if(this.rendered){
      const headings = [...this.querySelectorAll("h1, h2, h3, h4, h5, h6")];
      for (const heading of headings)
      {
        const item = Object.create(null);
        
        item.id = heading.id;
        item.level = +heading.tagName.toLowerCase().at(1);
        item.title = heading.textContent;
        
        if(!item.id || !item.title) continue;
        result.add(item);
      }
    }
    return result;
  }

  static get observedAttributes(){
    return ["src"];
  }
  
  attributeChangedCallback(name, old, value){
    if(name === "src" && old !== value && value){
      this.dispatchEvent(new CustomEvent("change"));
      this.#observer.disconnect();
      if(this.manual === false) this.#render(value);
    }
  }

  async #render(path){
    try{
      if(!(typeof path === "string" && path.length > 0))
        throw new TypeError("Invalid path parameter");
      
      this.dispatchEvent(new CustomEvent("load"));
      const res = await fetch(path, {
        integrity: this.integrity || ""
      });
      if (!res.ok) throw new Error("HTTP Code: " + res.status);
      const markdown = await res.text();

      this.dispatchEvent(new CustomEvent("render"));
      const html = this.#marked.parse(markdown);
      
      /* Sanitizer API; drop dompurify
      this.setHTML(html);
      */ 
      this.innerHTML = sanitize(html);
      this.setAttribute("rendered", "");
      
      [...this.querySelectorAll("h1, h2, h3, h4, h5, h6")].forEach((el)=>{
        if(el.id && el.textContent) this.#observer.observe(el);
      });
      
      this.dispatchEvent(new CustomEvent("success"));
    }catch(err){
      this.removeAttribute("rendered");
      this.dispatchEvent(new CustomEvent("failure", {
          detail: { error: err }
      }));
      throw err;
    }
  }
  
  render(){
    return this.#render(this.src);
  }
}

class List extends Set {
  constructor(){
    super();
  }
      
  toHTML(options = {}){
    const depth = Number.isSafeInteger(options?.depth) && options.depth >= 1 && options.depth <= 6 ? 
                  options.depth : 6;
    const floors = [...Array(depth).keys()].map(i=>i+1); //1,2,3,...
    
    const tag = options?.ordered === true ? "ol": "ul";
    const result = document.createElement(tag);
    
    let root = result;
    let previous = 1;
    for (const { level, id, title } of this)
    {
      if(!floors.includes(level)) continue;

      if (level > previous) {
        for (let i = 0; i < level - previous; ++i) {
          const item = document.createElement("ul");
          root.appendChild(item);
          root = item;
        }
      } else if (level < previous) {
        for (let i = 0; i < previous - level; ++i) {
          root = root.parentNode;
        }
      }

      const ref = document.createElement("a");
      ref.setAttribute("href", "#" + id);
      ref.textContent = title;
          
      const item = document.createElement("li");
      item.appendChild(ref);
          
      root.appendChild(item);
      previous = level;
    }
    
    return sanitize(result.outerHTML);
  }
}