/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

export function createSanitizer(){
  // "Raw HTML" within a Markdown document is part of the original Markdown specification and is a common trope.
  // Therefore the sanitizer is set to the default configuration.
  const sanitizer = new Sanitizer("default"); 
  
  // However the default configuration is overly restrictive:
  // - Headings, Syntax highlight & GFM Alerts 
  sanitizer.allowAttribute("id");  
  sanitizer.allowAttribute("class"); 
  
  // - Media Embedding
  sanitizer.allowElement({
    name: "audio",
    attributes: [
      "controls",
      "preload"
    ]
  });
  sanitizer.allowElement({
    name: "video",
    attributes: [
      "controls",
      "preload",
      "width",
      "height"
    ]
  });
  sanitizer.allowElement({
    name: "source",
    attributes: [
      "src",
      "type"
    ]
  });
  sanitizer.allowElement({
    name: "img",
    attributes: [
      "src",
      "alt",
      "loading",
      "width",
      "height"
    ]
  });
  
  return sanitizer;
}