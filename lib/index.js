/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import { sanitize } from "dompurify";
import { createMarkdownParser } from "./md.js";
import { TableOfContent } from "./toc.js";

export class Markdown extends HTMLElement {

  #parser;
  #observer;
  
  constructor() {
    super();
    this.#parser = createMarkdownParser();
    this.#observer = new IntersectionObserver(this.#watch.bind(this), { 
      threshold: 0.8, 
      rootMargin: "0% 0% -80% 0%" 
    });
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
    const headings = [...this.querySelectorAll("h1, h2, h3, h4, h5, h6")];
    const result = new TableOfContent(headings);
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

  #watch(entries){
    entries.map((entry) => {
      if (entry.isIntersecting) {
        this.dispatchEvent(new CustomEvent("intersect", {
          detail: { id: entry.target.id }
        }));
      }
    });
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
      const html = this.#parser.parse(markdown);
      
      /* Sanitizer API; drop dompurify
      this.setHTML(html);
      */ 
      this.innerHTML = sanitize(html);
      this.setAttribute("rendered", "");
      
      //Observe headings
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

