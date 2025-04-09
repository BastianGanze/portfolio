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
}

export type SlateNode = TextNode | ElementNode

function RichText({ document: initialValue }: { document: SlateNode[] }) {
  if (!initialValue || initialValue.length === 0) {
    return h('span', {}, '')
  }
  return initialValue.map((node, index) => renderNode(node, index))
}

/**
 * Renders a single Slate node
 * @param node The Slate node to render
 * @param key A unique key for the node
 * @returns A Vue VNode
 */
function renderNode(node: SlateNode, key: number): VNode {
  if ('text' in node) {
    return renderTextNode(node, key)
  }

  const children = RichText({ document: node.children })
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
    .otherwise(() => {
      return h('div', { key }, children)
    })
}

function renderTextNode(node: TextNode, key: number): VNode {
  const content = node.text

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
