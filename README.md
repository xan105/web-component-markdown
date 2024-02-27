About
=====

Web-component to load an external markdown file (.md) and render it into sanitized HTML with syntax highlighting.

📦 Scoped `@xan105` packages are for my own personal use but feel free to use them.

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg?style=flat-square)](https://www.webcomponents.org/element/@xan105/markdown)

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
  querySelector("#toc").innerHTML = el.headings.toHTML({ depth: 4 });
  
  el.addEventListener("intersect", ({detail})=>{
    //Do something when a heading (h1, h2, ...) has entered the top of the viewport
    querySelector(`#toc a[href="#${detail.id}"]`).classList.add("active");
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

Styling
=======

⚠️ Markdown is rendered into the light DOM without any predefined css styling, this is by design.<br/>
Use regular selectors to style just like you would for the rest of the page.

For syntax highlighting you can use one of the many [hljs themes](https://github.com/highlightjs/highlight.js/tree/main/src/styles) available.

💡That being said, there is a basic css style available in the `./dist` folder to get you started.

API
===

⚠️ This module is only available as an ECMAScript module (ESM) and is intended for the browser.

## Named export

### `Markdown(): Class`

This is a Web-component as such you need to define it:

```js
import { Markdown } from "/path/to/md.js"
customElements.define("mark-down", Markdown);
```

**Events**

  - `change()`

    The source (src) attribute has changed.

  - `load()`

    Markdown is being loaded.
    
  - `render()`

    Markdown is being rendered.

  - `success()`

    Markdown was rendered without any issue.

  - `failure(detail: object)`

    Something went wrong, see `detail`:
    
    ```ts
    { error: Error }
    ```
    
  - `intersect(detail: object)`

    A heading (h1, h2, ...) has entered the top of the viewport, see `detail`:

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
    
    Example:
    
    ```js
      //<h2 id="user-content-links">Links</h2>
      { id: "user-content-links", title: "Links", level: 2 }
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