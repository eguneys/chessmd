## Chess MD - Chess Blog Generator

Generate static blogs for chess commentary. See [15 minute of French Defense Advanced](https://eguneys.github.io/chess/rb2.html) for example.

Chess MD, provides visual representation of a chess board, with shapes. It replaces given static html data with visually enriched static html.

### Usage

Copy files `dist/bundle.js dist/main.css dist/assets` to your html project.

Write your blog in the html file, embed chess notation using `data-line` attribute, embed a board using `data-ply` attribute:

```html
    <section id="chessmd">
      <h1> 15 minutes of French Defense Advanced </h1>
      <p> The opening starts off with french defense advance variation. </p>
      <div data-line="1. e4 d5 2. d4 e6 3. Nf3 Nf6"
           data-shapes='d4 b8-c6 d8-b6'></div>

      <div data-ply="6"></div>
      <p> Enjoy! </p>
    </section>
```

Reference `bundle.js main.css` from the html file.

```html
    <link rel="stylesheet" href="main.css"/>
    <script src="bundle.js"></script>
```

Run this script within your html file to generate:

```js
   Tetris(document.getElementById("chessmd"), {});
```
    
For a local example, Run `yarn build` and see `dist/index.html`.

### API

Pass the element to enrich `Tetris(document.getElementById('myblog'), {});`

Use `data-line` attribute to specify chess moves. Use [SAN notation](https://en.wikipedia.org/wiki/Algebraic_notation_(chess)).
Use `data-ply` attribute to embed a chess board. Specify the ply number of the position to show.
Use `data-shapes` attribute to add shapes:

    <div data-ply="6" data-shapes="shapes"></div>

`shapes` is a series of, a single square or, two squares separated by a dash `square1-square2`; separated by spaces.

### Markdown

You can also pass chess markdown to generate from markdown: `Tetris(document.getElementById('myblog'), { content: "<markdown>" });`.

    # This is a header
    This is a paragraph. Embed chess notation like <1. e3 e6 2. Nf3 Nf6 3. d3>
    Continue paragraph. Continue from black's move <3... d6 4. a3 a6>

    To embed a chess board use ply number like:
    =8

    Happy blogging

### Contribute

[Become patreon](https://www.patreon.com/eguneys)

Happy blogging 💙
