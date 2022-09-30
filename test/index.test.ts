import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
import DoubleBracketLink from '../src/index'

describe('should', () => {
  it('should parse', () => {
    const md = new MarkdownIt()
    md.use(DoubleBracketLink, { removePrefix: 'pages/' })

    expect(md.render('[[pages/posts/index|index page]]')).toMatchInlineSnapshot(`
      "<p><a href=\\"/posts/index\\">index page</a></p>
      "
    `)

    expect(md.render('![[posts/404]]')).toMatchInlineSnapshot(`
      "<p><a href=\\"/posts/404\\">posts/404</a></p>
      "
    `)
  })
})
