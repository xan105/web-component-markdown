/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

export class Clipboard extends HTMLElement { 
  #button;
  
  constructor () {
    super();
    this.attachShadow({ mode: "open" });

    const button = document.createElement("button");
    button.part = "button"; //expose to lightdom css via ::part()
    this.#button = this.shadowRoot.appendChild(button);
    
    const sheet = new CSSStyleSheet();
    sheet.replace(":host { display: none; } button { all: unset; }")
    .then(()=>{
      this.shadowRoot.adoptedStyleSheets = [sheet];
    });
  }

  get copied(){
    return this.hasAttribute("copied");
  }

  get timeout(){
    return +this.getAttribute("timeout");
  }
  
  set timeout(value){
    this.setAttribute("timeout", value.toString());
  }

  async connectedCallback() {
    this.#button.addEventListener("click", this.copy.bind(this));
  }
  
  disconnectedCallback() {
    this.#button.removeEventListener("click", this.copy.bind(this));  
  }

  async copy(e){
    this.#button.disabled = true;
    try {
      this.removeAttribute("copied");
      const text = this.parentNode.querySelector("code").textContent;
      await navigator.clipboard.writeText(text);
      this.setAttribute("copied", "");
      this.dispatchEvent(new CustomEvent("copied"));
    } catch {/*do nothing*/}

    await new Promise(resolve => setTimeout(resolve, this.timeout));
    this.removeAttribute("copied");
    this.#button.disabled = false;
  }
}