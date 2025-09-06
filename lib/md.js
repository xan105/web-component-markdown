/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import { gfmHeadingId } from "marked-gfm-heading-id";
import markedAlert from "marked-alert"
import hljs from "highlight.js/lib/common"; //common subset of languages

export function createMarkdownParser(){
  //cf: https://marked.js.org/
  //Don't mutate global scope and ensure options and extensions are locally scoped.
  const parser = new Marked({ 
    gfm: true, //GitHub Flavored Markdown spec
    breaks: true //Requires gfm to true
  });
  
  //Extensions
  //----------
  
  //Code block highlighting
  //Hook hljs to markedHighlight which is used as a Marked extension
  parser.use(markedHighlight({
    highlight: (code, lang) => {
      return hljs.highlight(code, { 
        language: lang || "plaintext", 
        ignoreIllegals: true 
      }).value;
    }
  }));

  //Add ids to headings like GitHub  
  parser.use(gfmHeadingId({ prefix: "user-content-" }));
  
  //GFM Alerts
  parser.use(markedAlert({
    variants: [
      { type: "note", icon: "<span class=\"icon note\"></span>" },
      { type: "tip", icon: "<span class=\"icon tip\"></span>" },
      { type: "important", icon: "<span class=\"icon important\"></span>" },
      { type: "warning", icon: "<span class=\"icon warning\"></span>" },
      { type: "caution", icon: "<span class=\"icon caution\"></span>" }
    ]
  }));
  
  //Custom
  //------
  
  //Image to Figure
  //[!text](/path/to/img)
  parser.use({
    renderer: {
      image(token) {
        let html = `<figure><img src="${token.href}" alt="${token.text}" loading="lazy"/>`;
        if (token.text) html += `<figcaption>${token.text}</figcaption>`;
        html += `</figure>`;
        return html;
      }
    }
  });
  
  return parser;
}