import type MarkdownIt from 'markdown-it'
import type Token from 'markdown-it/lib/token'

interface DoubleBracketLinkOptions {
  /**
   * Remove the prefix of the url in double brackets
   */
  removePrefix?: string
  /**
   * After removing the provided prefix, param `addPrefix` will be added to the front of url
   */
  addPrefix?: string

  /**
   * add suffix to uri
   */
  uriSuffix?: string

  /**
   * parse link with attribute target="_blank"
   * @default false
   */
  blank?: boolean
}

const processLink = (link: string, uriSuffix?: string): string => {
  let [path, title] = link.split('#')

  if (uriSuffix && path)
    path = path + uriSuffix

  if (!title)
    return `/${path}`

  if (title[0] === '^')
    title = title.slice(1)

  //   if (title.match(/^[0-9][\s\S]+/))
  //     title = `_${title}`

  title = title.replace(/ /g, '-')

  if (!path)
    return `#${title}`

  return `/${path}#${title}`
}

const DoubleBracketLink: MarkdownIt.PluginWithOptions<DoubleBracketLinkOptions> = (md: markdownit, options = {}) => {
  md.inline.ruler.before('emphasis', 'dbl', (state, silent) => {
    let match
    let pos
    let token: Token

    if (state.pos + 2 >= state.posMax)
      return false

    if (state.src.slice(state.pos, state.pos + 2) !== '[['
            && state.src.slice(state.pos, state.pos + 3) !== '![[')
      return false

    let offset: number

    if (state.src.slice(state.pos, state.pos + 2) === '[[')
      offset = 2

    else
      offset = 3

    const start = state.pos + offset

    match = start

    // ไป katex ๆ็
    // eslint-disable-next-line no-cond-assign
    while ((match = state.src.indexOf(']]', match)) !== -1) {
      /*
        * Found potential $, look for escapes, pos will point to
        * first non escape when complete
        */
      pos = match - 1
      while (state.src[pos] === '\\') pos -= 1

      // Even number of escapes, potential closing delimiter found
      if ((match - pos) % 2 === 1)
        break

      match += 1
    }

    if (match === -1) {
      if (!silent)
        state.pending += ']]'

      state.pos = start + offset

      return true
    }

    const _content = state.src.slice(start, match)
    if (_content === 'toc')
      return false

    if (!silent) {
      // ้พๆฅ่็นๆๅผ
      token = state.push('link_open', 'a', 1)
      token.markup = 'dblink'
      let content = state.src.slice(start, match)

      // remove prefix
      if (options.removePrefix) {
        if (content.startsWith(options.removePrefix))
          content = content.slice(options.removePrefix.length)
      }

      // add prefix
      if (options.addPrefix)
        content = options.addPrefix + content

      const [url, text] = content.split('|')

      const link = processLink(url, options.uriSuffix)

      // ่ฎพ็ฝฎ้พๆฅ็ๅๆฐ
      const bIndex = token.attrIndex('href')
      if (bIndex < 0) {
        token.attrPush(['href', link])
      }
      else {
        if (token.attrs)
          token.attrs[bIndex][1] = link
      }

      if (options.blank)
        token.attrPush(['target', '_blank'])

      // ๆๆฌ่็น
      token = state.push('text', '', 0)
      token.content = text ?? url

      // ้พๆฅ่็นๅณ้ญ
      token = state.push('link_close', 'a', -1)
      token.markup = 'dblink'
      token.content = ''
    }

    // ๆ้ๅๅ็งปๅจๅฐๆนๆฌๅทๅ้ข
    state.pos = match + 2

    return true
  })
}

export default DoubleBracketLink
