import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
import DoubleBracketLink from '../src/index'

describe('should', () => {
  it('should parse', () => {
    const md = new MarkdownIt()
    md.use(DoubleBracketLink, { removePrefix: 'pages/', uriSuffix: '.html', addPrefix: 'src/', blank: true })

    expect(md.render('[[pages/posts/index|index page]]')).toMatchInlineSnapshot(`
      "<p><a href=\\"/src/posts/index.html\\" target=\\"_blank\\">index page</a></p>
      "
    `)

    expect(md.render('![[posts/404]]')).toMatchInlineSnapshot(`
      "<p><a href=\\"/src/posts/404.html\\" target=\\"_blank\\">src/posts/404</a></p>
      "
    `)

    expect(md.render('[[post/page#1 你好|你好]]')).toMatchInlineSnapshot(`
      "<p><a href=\\"/src/post/page.html#1-你好\\" target=\\"_blank\\">你好</a></p>
      "
    `)
  })
})
