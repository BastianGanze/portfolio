import type { VNode } from 'vue'
import { match, P } from 'ts-pattern'
import { h } from 'vue'

interface TextNode {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  code?: boolean
  strikethrough?: boolean
}

type ElementNode = {
  type: 'paragraph'
  children: SlateNode[]
} | {
  type: 'link'
  href: string
  children: SlateNode[]
} | {
  type: 'heading'
  level: number
  children: SlateNode[]
} | {
  type: 'layout'
  layout: number[]
  children: SlateNode[]
} | {
  type: 'layout-area'
  children: SlateNode[]
}

export type SlateNode = TextNode | ElementNode

function RichText({ document: initialValue, parent }: { document: SlateNode[], parent?: SlateNode }) {
  if (!initialValue || initialValue.length === 0) {
    return h('span', {}, '')
  }
  return initialValue.map((node, index) => renderNode(node, index, parent))
}

function renderNode(node: SlateNode, key: number, parent?: SlateNode): VNode {
  if ('text' in node) {
    return renderContentNode(node, key)
  }

  const children = RichText({ document: node.children, parent: node })
  return match(node)
    .with({ type: 'heading', level: P.select() }, (level) => {
      return h(`h${level}`, { key }, children)
    })
    .with({ type: 'paragraph' }, () => {
      return h('p', { key }, children)
    })
    .with({ type: 'link', href: P.select() }, (href) => {
      return h('a', { key, href, class: 'link link-info', target: '_blank', rel: 'noopener noreferrer' }, children)
    })
    .with({ type: 'layout', layout: P.select() }, (layout) => {
      const rows = layout.reduce((acc, col) => acc + col, 0)
      return h('div', { key, class: `grid grid-flow-col grid-cols-${rows} gap-4` }, children)
    })
    .with({ type: 'layout-area' }, () => {
      if (parent && (parent as ElementNode).type === 'layout') {
        const layoutParent = parent as { type: 'layout', layout: number[], children: SlateNode[] }
        const index = layoutParent.children.indexOf(node)
        const layout = layoutParent.layout
        const colSpan = layout[index]
        return h('div', { key, class: `col-span-${colSpan}` }, children)
      }
      return h('div', { key, class: 'col-span-1' }, children)
    })
    .otherwise(() => {
      return h('div', { key }, children)
    })
}

function renderContentNode(node: TextNode, key: number): VNode {
  const content = node.text

  if (content.includes('{{img=')) {
    const imgContent = content.split('{{')[1].split('}}')[0]
    const imgSrc = imgContent.split(',')[0].replace('img=', '').trim()
    const imgAlt = imgContent.split(',')[1].replace('alt=', '').trim()
    return h('img', { key, src: imgSrc, alt: imgAlt, class: 'max-w-full' })
  }

  if (!content) {
    return h('span', { key }, '')
  }

  let result = h('span', { key }, content)

  if (node.code) {
    result = h('code', {}, [result])
  }

  if (node.bold) {
    result = h('strong', {}, [result])
  }

  if (node.italic) {
    result = h('em', {}, [result])
  }

  if (node.underline) {
    result = h('u', {}, [result])
  }

  if (node.strikethrough) {
    result = h('s', {}, [result])
  }

  return result
}

export default RichText
