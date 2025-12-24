About
=====

Web-component to load an external markdown file (.md) and render it into sanitized HTML.

- GFM (GitHub Flavored Markdown spec)
- Light DOM CSS styling
- Optional JavaScript API
- Syntax highlighting
- Table of contents
- Copy code to clipboard
- Media embedding (image, audio, video)

📦 Scoped `@xan105` packages are for my own personal use but feel free to use them.

🤔 Curious to see it in real use? This package powers [my personal blog](https://xan105.com/).

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg?style=flat-square)](https://www.webcomponents.org/element/@xan105/markdown)

Example
=======

Import and define the Web-component:

```js
import { Markdown } from "/path/to/markdown.js"
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
  const toc = el.headings.createElement({ depth: 4 });
  document.querySelector("#toc").replaceWith(toc);
  
  el.addEventListener("intersect", ({detail})=>{
    //Do something when a heading (h1, h2, ...) has entered the top of the viewport
    document.querySelector(`#toc a[href="#${detail.id}"]`).classList.add("active");
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
        "@xan105/markdown": "./path/to/node_modules/@xan105/markdown/dist/markdown.min.js"
      }
    }
    </script>
    <script type="module">
      import { Markdown } from "@xan105/markdown"
      customElements.define("mark-down", Markdown);
    </script>
    </body>
  </html>
  ```

Styling
=======

Markdown is rendered into the light DOM without any predefined CSS styling, **this is by design**.<br/>
Use regular selectors to style just like you would for the rest of the page.

For syntax highlighting you can use one of the many [hljs themes](https://github.com/highlightjs/highlight.js/tree/main/src/styles) available.

💡That being said, there is a basic CSS style with Github-like syntax highlighting available in the `./dist` folder to get you started.

### Copy to clipboard

To target the "copy to clipboard" unstyled button added to "code blocks" use CSS `::part()` selector:

```
clipboard-copy-code { display: block } //by default it is not rendered (display: none)
clipboard-copy-code::part(button) { ... }
clipboard-copy-code::part(button)::before { /*go nuts this also works*/ }
```

`clipboard-copy-code` will have the attribute `copied` set when the content has been copied to the clipboard;
You can target it via CSS and add a `timeout` (ms) attribute/property value if you wish to do some kind of animation on copy.

`clipboard-copy-code` also fires a `copied` event just in case.

Media embedding
===============

The markdown image syntax has been extended to support audio and video in addition to image.
Media are represented inside a `<figure>` with an optional `<figcaption>` and rendered with their corresponding html tag.

```md
![text](url "mime @size")
![text](url "mime")
![text](url "@size")
![text](url)
![](url)
```

- `url`: 
  The URL of the media file. Can be an image, audio, or video file.
- `text` (optional): 
  The text caption (also used as the `alt` text for images).
- `@size` (optional):
  Size override **in pixels** as `width` x `height`.
  
  _For advanced sizing requirements, consider using CSS instead._
- `mime` (optional): 
  The MIME type of the file (e.g., image/png, audio/ogg; codecs=opus, video/mp4).

  If the MIME type is omitted, this library will try to infer it from the file extension.
  If the file extension is ambiguous (e.g., .mp4, .webm, .ogg), it performs a `HEAD` request to fetch the `Content-Type` from the server.

  The "mime" attribute is mainly for audio/video containers, providing it:
    - avoid extra network request for MIME detection.
    - ensure correct codec/container handling for audio/video.

**Example**

```md
![Big Buck Bunny](./mov_bbb.mp4 "video/mp4 @640x480")
```

Renders as:

```html
<figure>
  <video controls preload="metadata" width="640px" height="480px">
    <source src="./mov_bbb.mp4" type="video/mp4">
  </video>
  <figcaption>Big Buck Bunny</figcaption>
</figure>
```

For more advanced media type (e.g., canvas, iframe, web-component) you should use the html _"as is"_ within the markdown file, and if necesarry, allow it in the `sanitizeOptions`  of the `render()` method (see below). 

**Example**

I personally do this for my STL renderer: [xan105/web-component-3DViewer](https://github.com/xan105/web-component-3DViewer) _(experimental)_.

```js
  const md = document.querySelector("mark-down");
  await md.render({
    CUSTOM_ELEMENT_HANDLING: {
      tagNameCheck: /^stl-viewer$/,
      attributeNameCheck: (attr) => ["src", "gizmos", "pan", "zoom", "rotate", "inertia"].includes(attr), 
      allowCustomizedBuiltInElements: false
    }
  });
  
  //Conditional Import
  if (document.querySelector("stl-viewer")) {
    const { STLViewer } = await import("@xan105/3dviewer");
    customElements.define("stl-viewer", STLViewer);
    await customElements.whenDefined("stl-viewer")
  }
```

API
===

⚠️ This module is only available as an ECMAScript module (ESM) and is intended for the browser.

## Named export

### `Markdown(): Class`

This is a Web-component as such you need to define it:

```js
import { Markdown } from "/path/to/markdown.js"
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
    
    The returned `Set` is _extended_ with additional functions: `createElement()` and `toHTML()`:
    
    + `createElement(options?: object): HTMLElement`
    
      Returns a HTMLElement representing the table of contents from the headings (nested list).

      Options:

        - `ordered?: boolean` (false)
        
          Whether to use `ul` (false) or `ol` (true) as HTMLElement.
          
        - `depth?: number` (6)
        
          How deep to list ? Headings start from 1 to 6.
     
     + `toHTML(options?: object): string`    
     
       Same as above but returns the list as a raw HTML string, eg:
 
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
    
**Methods**

  - `render(sanitizeOptions?: object): Promise<void>`

    Load and render markdown into sanitized HTML.
    
    👷🔧 You can pass an optional [DOMPurify configuration](https://github.com/cure53/DOMPurify?tab=readme-ov-file#can-i-configure-dompurify) object to configure the sanitization.
    
    ✔️ Resolves when markdown has been sucesfully rendered.<br />
    ❌ Rejects on error
    
    💡 Invoking this method still triggers related events.
    
  - `estimateReadingTime(speed?: number): number`
  
    Estimate the _"time to read"_ of the markdown's content in minutes.<br />
    By default `speed` is `265` words per minute; the average reading speed of an adult (English).