/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import { gfmHeadingId } from "marked-gfm-heading-id";
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
  
  return parser;
}

//web worker
//comlink: instead of message ping pong -> promise like
//tc39/proposal-module-expressions: to resolve the separate file or stringify / blobification workaround

