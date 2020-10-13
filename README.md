## Chess MD - Chess Blog Generator

Generate static blogs for chess commentary. See [15 minute of French Defense Advanced]() for example.

Chess MD, provides visual representation of a chess board, with shapes. It replaces given static html data with visually enriched static html.

### Usage

Copy files `dist/bundle.js dist/main.css dist/assets` to your html project.

Write your blog in the html file, include `data-fen` attribute to embed a board:

```html
    <section id="chessmd">
      <h1> 15 minutes of French Defense Advanced </h1>
      <p> The opening starts off with french defense advance variation. </p>
      <div data-fen='rnbqkbnr/pp3ppp/4p3/2ppP3/3P4/5N2/PPP2PPP/RNBQKB1R b KQkq - 1 4'
           data-shapes='d4 b8-c6 d8-b6'></div>
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

Generate blog for `#myblog` with `Tetris(document.getElementById('myblog'), {});`

Use `data-fen` attribute to embed a chess board.
Use `data-shapes` attribute to add shapes:

    <div data-fen="chess fen" data-shapes="shapes"></div>

`shapes` is a series of, a single square or, two squares separated by a dash `square1-square2`; separated by spaces.


### Contribute

[Become patreon](https://www.patreon.com/eguneys)

Happy blogging 💙
