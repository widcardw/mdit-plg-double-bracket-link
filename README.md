# mdit-plg-double-bracket-link

[![NPM version](https://img.shields.io/npm/v/mdit-plg-double-bracket-link?color=a1b858&label=)](https://www.npmjs.com/package/mdit-plg-double-bracket-link)

Parse `[[path/to/page]]` into html in markdown-it!

Inspired by the combination usage between [vite](https://vitejs.dev) and [Obsidian](https://obsidian.md). 

Twin plugin: [mdit-plg-double-bracket-media](https://github.com/widcardw/mdit-plg-double-bracket-media)

> Probably for my personal blog...

## Usage

```sh
pnpm i mdit-plg-double-bracket-link -D
```

```ts
// use this plugin in markdown-it
import DoubleBracketLink from 'mdit-plg-double-bracket-link'

md.use(DoubleBracketLink, {
  /**
   * (Optional) remove the prefix in the double brackets.
   * It will parse ![[pages/path/to/file|target link]] into
   * <a href="/path/to/file">target link</a>
   */
  removePrefix: 'pages/',
  /**
   * (Optional) after removing the provided prefix,
   * param `addPrefix` will be added to the front of url.
   *
   * For example, if the params are `{ removePrefix: 'pages/', addPrefix: 'src/' }`,
   * then it will parse ![[pages/path/to/file|target link]] into
   * <a href="/src/path/to/file">target link</a>
   */
  addPrefix: ''
})
```

## License

[MIT](./LICENSE) License © 2022 widcardw
