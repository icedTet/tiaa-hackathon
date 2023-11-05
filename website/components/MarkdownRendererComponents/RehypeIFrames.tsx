import { visit } from 'unist-util-visit'

interface Options {
  className: string
}

// https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
export const urlRegex =
  /\!\(((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)\)/g

export const rehypeIFrames = (options: Options) => {
  return (tree: any) => {
    visit(tree, 'text', (node: any,i,p) => {
      console.log('node',node.value,p)

      // let matches = node.value.matchAll(urlRegex)
      // if ([...matches].length === 0) {
      //   // console.log('no matches')
      //   return
      // }

      // matches = [...node.value.matchAll(urlRegex)]
      // // console.log('match', matches)
      // node.children = []

      // for (const match of matches) {
      //   // console.log('match', match)
      //   if (node.value.indexOf(match[0]) !== 0) {
      //     node.children.push({
      //       type: 'text',
      //       value: node.value.slice(0, node.value.indexOf(match[0])),
      //     })
      //     // console.log('match[0]', match[0])
      //     node.children.push({
      //       tagName: 'iframe',
      //       type: 'element',
      //       properties: {
      //         src: node.value.slice(node.value.indexOf(match[0]), node.value.indexOf(match[0]) + match[0].length),
      //         className: [options.className],
      //         target: '_blank',
      //       },
      //       children: [
      //         {
      //           type: 'text',
      //           value: node.value.slice(
      //             node.value.indexOf(match[0]),
      //             node.value.indexOf(match[0]) + match[0].length - 1
      //           ),
      //         },
      //       ],
      //     })
      //     // console.log(node.children)
      //     node.value = node.value.slice(node.value.indexOf(match[0]) + match[0].length, node.value.length)
      //   } else {
      //     node.children.push({
      //       tagName: 'iframe',
      //       type: 'element',
      //       properties: {
      //         src: node.value.slice(0, match[0].length),
      //         className: [options.className],
      //       },
      //       children: [
      //         {
      //           type: 'text',
      //           value: node.value.slice(0, match[0].length),
      //         },
      //       ],
      //     })

      //     node.value = node.value.slice(match[0].length, node.value.length)
      //   }
      // }
      // if (node.value !== '') {
      //   node.children.push({
      //     type: 'text',
      //     value: node.value,
      //   })
      // }
      // node.value = undefined

      // node.tagName = 'iframe'
      // node.type = 'element'
      // node.properties = {
      //   src: node.children[1].properties.src,
      //   className: [options.className],
      // }

      // // Stop infinite loop
      return 'skip'
    })
  }
}
