/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import { marked } from "marked";
import { sanitize } from "dompurify";
import { HighlightJS as hljs } from "highlight.js";

export class Markdown extends HTMLElement {

  constructor () {
    super();
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

  static get observedAttributes(){
    return ["src"];
  }
  
  attributeChangedCallback(name, old, value){
    if(name === "src" && old !== value && value){
      this.dispatchEvent(new CustomEvent("change"));
      if(this.manual === false) this.#render(value);
    }
  }

  async #render(path){
    try{
      this.dispatchEvent(new CustomEvent("load"));
      const res = await fetch(path, {
        integrity: this.integrity || ""
      });
      if (!res.ok) throw new Error("HTTP Code: " + res.status);
      const markdown = await res.text();

      this.dispatchEvent(new CustomEvent("render"));
      const html = marked(markdown, { 
        gfm: true,
        breaks: true,
        highlight: (code, lang) => {
          return hljs.highlight(code, { 
            language: lang || "plaintext", 
            ignoreIllegals: true 
          }).value;
        }
      });
      this.innerHTML = sanitize(html);
      
      this.setAttribute("rendered", "");
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