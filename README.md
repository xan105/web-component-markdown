About
=====

Web-component to load an external markdown (.md) file and render it into html.

💡 Markdown is rendered into the light DOM without any predefined css styling.

📦 Scoped `@xan105` packages are for my own personal use but feel free to use them.

Example
=======

Import and define the Web-component:

```js
import { Markdown } from "/path/to/md.js"
customElements.define("mark-down", Markdown);
```

HTML:

```html
  <mark-down src="/path/to/md"></mark-down>
```

Optional JavaScript API:

```js
  const el = document.querySelector("mark-down");
  el.addEventListener("load", ()=>{
    console.log("loading...");
  });
  el.addEventListener("success", ()=>{
    console.log("ok");
  });
  el.addEventListener("failure", ({detail})=>{
    console.error(detail.error);
  });
  el.integrity = "sha384-0xabcd...";
  el.src = "/path/to/md";
```

Install
=======

```
npm i @xan105/markdown
```

### Optional 

Create an importmap:

```json
{
  "imports": {
    "@xan105/markdown": "./path/to/node_modules/@xan105/markdown/dist/md.min.js"
  }
}
```

index.html:

```html
  <script src="./importmap.json" type="importmap"></script>
  <script src="./index.js" type="module"></script>
  </body>
</html>
```

index.js:

```js
import { Markdown } from "@xan105/markdown"
customElements.define("mark-down", Markdown);
```

API
===

⚠️ This module is only available as an ECMAScript module (ESM) and is intended for the browser.

## Named export

### `Markdown(): Class`

**Options**

N/A

**Events**

- `load()`

  New markdown src path has been requested to be rendered.

- `success()`

  Markdown was rendered without any issue.

- `failure(detail)`

  Something went wrong, see `detail`:
  
```ts
  {
    error: Error
  }
```

**Methods**

N/A

**Attribute / Property**

- `src` 
  
  Path/URL to the .md file to load.
  
- `integrity` 

  Integrity hash passed to `fetch()`. See [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) for more details.
  
- `rendered` _(Read-only)_  

  Whether the markdown was succesfuly rendered or not. You can use `:not([rendered])` in your CSS to style the element differently before rendering.
  
Related
=======

## Markdown to HTML

- [Marked](https://github.com/markedjs/marked)
- [Markdown-it](https://github.com/markdown-it/markdown-it)
- [Remark](https://github.com/remarkjs/remark)
- [Micromark](https://github.com/micromark/micromark)

## Web Component

- [wc-markdown](https://github.com/vanillawc/wc-markdown)
- [zero-md](https://github.com/zerodevx/zero-md)
- [md-block](https://github.com/LeaVerou/md-block)

## Syntax Highlighting

- [HighlightJS](https://github.com/highlightjs/highlight.js/)
- [Prism.js](https://github.com/PrismJS/prism)