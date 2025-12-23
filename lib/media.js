const MIME = {
  png:  "image/png",
  jpg:  "image/jpeg",
  jpeg: "image/jpeg",
  jxl:  "image/jxl",
  gif:  "image/gif",
  webp: "image/webp",
  avif: "image/avif",
  svg:  "image/svg+xml"
};

function getFileExtFrom(url){
  const filename = (url.substr(1 + url.lastIndexOf("/"))).split(/[#?]/)[0];
  const ext = filename.split(".").pop().trim();
  return ext.toLowerCase();
}

async function getMimeType(url) {
  try {
    const response = await fetch(url, { method: "HEAD" });
    if (!response.ok) return null;
    return response.headers.get("Content-Type");
  } catch {
    return null;
  }
}

function image(token) {
  const size = [];
  if (token.width) size.push(`width="${token.width}px"`);
  if (token.height) size.push(`height="${token.height}px"`);
  
  const tags = ["<figure>"];
  if (token.mime && token.mime.startsWith("video/")) {
    tags.push(`<video controls preload="metadata" ${size.join(" ")}><source src="${token.href}" type="${token.mime}"/></video>`);
  } else if (token.mime && token.mime.startsWith("audio/")) {
    tags.push(`<audio controls preload="metadata"><source src="${token.href}" type="${token.mime}"/></audio>`);
  } else {
    tags.push(`<img src="${token.href}" alt="${token.text}" loading="lazy" ${size.join(" ")}/>`);
  }
  if (token.text) tags.push(`<figcaption>${token.text}</figcaption>`);
  tags.push("</figure>");
  return tags.join("");
}

export const ExtendImageRenderer = {
  async: true,
  async walkTokens(token) {
    if (token.type !== "image") return;
    if (token.title) {
        const pos = token.title.lastIndexOf("@");
        if (pos !== -1) {
          const size = token.title.substring(pos + 1);
          const [ , width, height ] = size.match(/^(\d+)\s*x\s*(\d+)\s*$/);
          token.width = +width;
          token.height = +height;
          token.mime = token.title.substring(0, pos).trim();
        } else {
          token.mime = token.title.trim();
        }
      } 
    if (!token.mime) {
      const ext = getFileExtFrom(token.href);
      token.mime = MIME[ext] ?? await getMimeType(token.href); //Video/Audio containers are ambiguous so ask the server
    }
  },
  renderer: { image }
};