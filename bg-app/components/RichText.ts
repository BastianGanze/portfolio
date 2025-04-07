import type { VNode } from 'vue'
import { h } from 'vue'

interface TextNode {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  code?: boolean
  strikethrough?: boolean
}

interface ElementNode {
  type: string
  children: (TextNode | ElementNode)[]
  url?: string
  alt?: string
}

type SlateNode = TextNode | ElementNode

function RichText({ 'initial-value': initialValue }: { 'initial-value': SlateNode[] }) {
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

  const children = RichText({ 'initial-value': node.children })

  switch (node.type) {
    case 'paragraph':
      return h('p', { key }, children)
    case 'heading-one':
      return h('h1', { key }, children)
    case 'heading-two':
      return h('h2', { key }, children)
    case 'heading-three':
      return h('h3', { key }, children)
    case 'heading-four':
      return h('h4', { key }, children)
    case 'heading-five':
      return h('h5', { key }, children)
    case 'heading-six':
      return h('h6', { key }, children)
    case 'bulleted-list':
      return h('ul', { key }, children)
    case 'numbered-list':
      return h('ol', { key }, children)
    case 'list-item':
      return h('li', { key }, children)
    case 'link':
      return h('a', { key, href: node.url, target: '_blank', rel: 'noopener noreferrer' }, children)
    case 'image':
      return h('img', { key, src: node.url, alt: node.alt || '' })
    case 'blockquote':
      return h('blockquote', { key }, children)
    case 'code-block':
      return h('pre', { key }, [h('code', {}, children)])
    case 'divider':
      return h('hr', { key })
    default:
      return h('div', { key }, children)
  }
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
