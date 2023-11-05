import { visit } from 'unist-util-visit'

interface Options {
  className: string
}

// https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
export const urlRegex =
  /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/g

export const rehypeLinks = (options: Options) => {
  return (tree: any) => {
    visit(tree, 'text', (node: any) => {
      let matches = node.value.matchAll(urlRegex)
      if ([...matches].length === 0) {
        return
      }

      matches = [...node.value.matchAll(urlRegex)]

      node.children = []

      for (const match of matches) {
        if (node.value.indexOf(match[0]) !== 0) {
          node.children.push({
            type: 'text',
            value: node.value.slice(0, node.value.indexOf(match[0])),
          })
          node.children.push({
            tagName: 'a',
            type: 'element',
            properties: {
              href: node.value.slice(node.value.indexOf(match[0]), node.value.indexOf(match[0]) + match[0].length),
              className: [options.className],
              target: '_blank',
            },
            children: [
              {
                type: 'text',
                value: node.value.slice(node.value.indexOf(match[0]), node.value.indexOf(match[0]) + match[0].length),
              },
            ],
          })
          node.value = node.value.slice(node.value.indexOf(match[0]) + match[0].length, node.value.length)
        } else {
          node.children.push({
            tagName: 'a',
            type: 'element',
            properties: {
              href: node.value.slice(0, match[0].length),
              className: [options.className],
              target: '_blank',
            },
            children: [
              {
                type: 'text',
                value: node.value.slice(0, match[0].length),
              },
            ],
          })
          node.value = node.value.slice(match[0].length, node.value.length)
        }
      }
      if (node.value !== '') {
        node.children.push({
          type: 'text',
          value: node.value,
        })
      }
      node.value = undefined

      node.tagName = 'span'
      node.type = 'element'
      // Stop infinite loop
      return 'skip'
    })
  }
}
