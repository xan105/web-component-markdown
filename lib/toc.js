/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import DOMPurify from "dompurify";

export class TableOfContent extends Set {
  constructor(headings){
    super();
    
    for (const { id, tagName, textContent } of headings)
    {
      const heading = Object.create(null);
      heading.id = id;
      heading.title = textContent;
      heading.level = +tagName.toLowerCase().at(1);
      
      if(!heading.id || !heading.title) continue;
      this.add(heading);
    }
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
    
    return DOMPurify.sanitize(result.outerHTML);
  }
}