About
=====

Web-component to load an external markdown (.md) file and render it into sanitized HTML.

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

  //auto rendering (default)
  el.integrity = "sha384-0xABCD...";
  el.src = "/path/to/md";

  //manual rendering
  el.manual = true;
  el.src = "/path/to/md";
  el.render().catch((err)=>{
    console.error(err);
  });
  
  //Table of contents
  querySelect("#toc").innerHTML = el.headings.toHTML({ depth: 4 });
  
  el.addEventListener("intersect", ({detail})=>{
    querySelect(`#toc a[href="#${detail.id}"]`).classList.add("active");
  });
```

Install
=======

```
npm i @xan105/markdown
```

💡 The bundled library and its minified version can be found in the `./dist` folder.

### Via importmap

Create an importmap and add it to your html:

```html
  <script type="importmap">
  {
    "imports": {
      "@xan105/markdown": "./path/to/node_modules/@xan105/markdown/dist/md.min.js"
    }
  }
  </script>
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

  - `change()`

    The source (src) attribute has changed.

  - `load()`

    Markdown is being loaded.
    
  - `render()`

    Markdown is being rendered.

  - `success()`

    Markdown was rendered without any issue.

  - `failure(detail)`

    Something went wrong, see `detail`:
    
    ```ts
      { error: Error }
    ```
    
  - `intersect(detail)`

    A heading (h1, h2, ...) is now visible and has entered the top of the viewport.

    ```ts
    { id: string }
    ```

**Attribute / Property**

  - `src: string`
    
    Path/URL to the `.md` file to load.
    
  - `integrity: string`

    Integrity hash passed to `fetch()`. See [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) for more details.

  - `manual: boolean`

    If set markdown will not be rendered automatically and you will have to call the `render()` method yourself (see below).
    
  - `rendered: boolean` _(Read-only)_

    Whether the markdown was succesfuly rendered or not. You can use `:not([rendered])` in your CSS to style the element differently before rendering.
    
**Property**
    
  - `headings: Set<object>` _(Read-only)_
  
    List of all headings (h1, h2, ...) with an id and text content represented as follows:
    
    ```ts
    {
      id: string,
      level: number,
      title: string
    }
    ```
    
    The returned `Set` is _extended_ with an additional `toHTML()` function:
    
    + `toHTML(options?: object): string`
    
      Which returns sanitized HTML string representing the table of contents from the headings (nested list).
      
      ```html
        <ul>
          <li><a href="#id">title</a></li>
          <li>
            <ul>
              <li><a href="#id">title</a></li>
              <li><a href="#id">title</a></li>
            </ul>
          </li>
        <ul/>
      ```
      
      Options:
      
        - `depth?: number` (6)
        
          How deep to list ? Headings start from 1 to 6.
          
        - `ordered?: boolean` (false)
        
          When set to false the root of the list is `ul` otherwise `ol`.
    
**Methods**

  - `render(): Promise<void>`

    Load and render markdown into sanitized HTML.
    
    ✔️ Resolves when markdown has been sucesfully rendered.<br />
    ❌ Rejects on error
    
    💡 Invoking this method still triggers related events.
  
Related
=======

### Markdown to HTML

- [Marked](https://github.com/markedjs/marked)
- [Markdown-it](https://github.com/markdown-it/markdown-it)
- [Remark](https://github.com/remarkjs/remark)
- [Micromark](https://github.com/micromark/micromark)

### Web Component

- [wc-markdown](https://github.com/vanillawc/wc-markdown)
- [zero-md](https://github.com/zerodevx/zero-md)
- [md-block](https://github.com/LeaVerou/md-block)

### Syntax Highlighting

- [HighlightJS](https://github.com/highlightjs/highlight.js/)
- [Prism.js](https://github.com/PrismJS/prism)