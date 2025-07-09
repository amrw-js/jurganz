'use client'

import {
  Bars3CenterLeftIcon,
  Bars3Icon,
  Bars4Icon,
  BoldIcon,
  ChatBubbleLeftRightIcon,
  CodeBracketIcon,
  ItalicIcon,
  LinkIcon,
  ListBulletIcon,
  NumberedListIcon,
  PhotoIcon,
  QueueListIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from '@heroicons/react/24/outline'
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from '@heroui/react'
import { Node, mergeAttributes } from '@tiptap/core'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { NodeSelection } from '@tiptap/pm/state'
import { EditorContent, useEditor } from '@tiptap/react'
import type { NodeViewRendererProps } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useCallback, useEffect } from 'react'

import MediaUploadModal from '@/app/modals/UploadModal'

// Type declarations for better TypeScript support
declare global {
  interface HTMLImageElement {
    updateTimeout?: NodeJS.Timeout
  }
}

// Define proper types for image attributes
interface ImageAttributes {
  src: string
  alt?: string
  title?: string
  width?: number
  height?: number
  align?: 'left' | 'center' | 'right'
}

type TextAlignType = {
  attrs: { textAlign?: 'left' | 'center' | 'right' | 'justify' }
  textAlign?: 'left' | 'center' | 'right' | 'justify'
}
// Custom Image Node with resize functionality and alignment
const ResizableImage = Node.create({
  name: 'resizableImage',

  addOptions() {
    return {
      inline: false,
      allowBase64: false,
      HTMLAttributes: {},
    }
  },

  inline: false,
  group: 'block',
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: null,
      },
      height: {
        default: null,
      },
      align: {
        default: 'center',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
        getAttrs: (element) => {
          const img = element as HTMLImageElement
          return {
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt'),
            title: img.getAttribute('title'),
            width: img.getAttribute('width') ? parseInt(img.getAttribute('width')!) : null,
            height: img.getAttribute('height') ? parseInt(img.getAttribute('height')!) : null,
            align: img.getAttribute('data-align') || 'center',
          }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { align, ...attrs } = HTMLAttributes
    return [
      'img',
      mergeAttributes(this.options.HTMLAttributes, attrs, {
        'data-align': align,
      }),
    ]
  },

  addCommands() {
    return {
      setResizableImage:
        (options: ImageAttributes) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { align: 'center', ...options },
          })
        },
    }
  },

  addNodeView() {
    return ({ node, getPos, editor }: NodeViewRendererProps) => {
      const wrapper = document.createElement('div')
      wrapper.className = 'resizable-image-wrapper'

      const container = document.createElement('div')
      container.className = 'resizable-image-container'

      // Set wrapper alignment
      const align = node.attrs.align || 'center'
      wrapper.style.textAlign = align
      wrapper.style.margin = '16px 0'
      wrapper.style.width = '100%'

      const img = document.createElement('img')
      img.src = node.attrs.src
      img.alt = node.attrs.alt || ''
      img.title = node.attrs.title || ''

      if (node.attrs.width) {
        img.style.width = `${node.attrs.width}px`
      } else {
        img.style.maxWidth = '100%'
      }

      if (node.attrs.height) {
        img.style.height = `${node.attrs.height}px`
      } else {
        img.style.height = 'auto'
      }

      img.className = 'resizable-image'
      img.style.borderRadius = '8px'
      img.style.display = 'inline-block'

      let isSelected = false

      // Add resize handles
      const resizeHandle = document.createElement('div')
      resizeHandle.className = 'resize-handle'
      resizeHandle.style.cssText = `
        position: absolute;
        bottom: -5px;
        right: -5px;
        width: 12px;
        height: 12px;
        background: #3b82f6;
        border: 2px solid white;
        border-radius: 50%;
        cursor: se-resize;
        display: none;
        z-index: 10;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      `

      container.style.position = 'relative'
      container.style.display = 'inline-block'
      container.appendChild(img)
      container.appendChild(resizeHandle)
      wrapper.appendChild(container)

      // Handle resize
      let isResizing = false
      let startX: number
      let startY: number
      let startWidth: number
      let startHeight: number
      let aspectRatio: number

      const updateAttributes = (attrs: Partial<ImageAttributes>) => {
        const pos = getPos()
        if (pos !== undefined) {
          editor.view.dispatch(
            editor.view.state.tr.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              ...attrs,
            }),
          )
        }
      }

      const handleMouseDown = (e: MouseEvent) => {
        isResizing = true
        startX = e.clientX
        startY = e.clientY
        startWidth = img.offsetWidth
        startHeight = img.offsetHeight
        aspectRatio = startWidth / startHeight

        e.preventDefault()
        e.stopPropagation()

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
      }

      const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing) return

        const deltaX = e.clientX - startX
        const deltaY = e.clientY - startY

        // Use the larger delta to maintain aspect ratio
        const delta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY * aspectRatio

        let newWidth = startWidth + delta
        let newHeight = newWidth / aspectRatio

        // Minimum size constraints
        if (newWidth < 50) {
          newWidth = 50
          newHeight = newWidth / aspectRatio
        }

        // Maximum size constraints
        const maxWidth = editor.view.dom.clientWidth - 40
        if (newWidth > maxWidth) {
          newWidth = maxWidth
          newHeight = newWidth / aspectRatio
        }

        img.style.width = `${newWidth}px`
        img.style.height = `${newHeight}px`

        // Update attributes with debouncing
        if (img.updateTimeout) {
          clearTimeout(img.updateTimeout)
        }
        img.updateTimeout = setTimeout(() => {
          updateAttributes({ width: Math.round(newWidth), height: Math.round(newHeight) })
        }, 100)
      }

      const handleMouseUp = () => {
        if (isResizing) {
          isResizing = false
          document.removeEventListener('mousemove', handleMouseMove)
          document.removeEventListener('mouseup', handleMouseUp)

          // Final update
          if (img.updateTimeout) {
            clearTimeout(img.updateTimeout)
          }
          updateAttributes({
            width: Math.round(img.offsetWidth),
            height: Math.round(img.offsetHeight),
          })
        }
      }

      resizeHandle.addEventListener('mousedown', handleMouseDown)

      // Delete on backspace/delete when selected
      const handleKeyDown = (e: KeyboardEvent) => {
        if (isSelected && (e.key === 'Backspace' || e.key === 'Delete')) {
          e.preventDefault()
          const pos = getPos()
          if (pos !== undefined) {
            const nodeSize = node.nodeSize
            editor
              .chain()
              .focus()
              .deleteRange({ from: pos, to: pos + nodeSize })
              .run()
          }
        }
      }

      // Click to select
      container.addEventListener('click', (e) => {
        e.preventDefault()
        const pos = getPos()
        if (pos !== undefined) {
          const selection = NodeSelection.create(editor.state.doc, pos)
          editor.view.dispatch(editor.state.tr.setSelection(selection))
        }
      })

      document.addEventListener('keydown', handleKeyDown)

      return {
        dom: wrapper,
        update: (updatedNode) => {
          if (updatedNode.type.name !== this.name) return false

          img.src = updatedNode.attrs.src
          img.alt = updatedNode.attrs.alt || ''
          img.title = updatedNode.attrs.title || ''

          // Update alignment
          const newAlign = updatedNode.attrs.align || 'center'
          wrapper.style.textAlign = newAlign

          if (updatedNode.attrs.width) {
            img.style.width = `${updatedNode.attrs.width}px`
          }
          if (updatedNode.attrs.height) {
            img.style.height = `${updatedNode.attrs.height}px`
          }

          return true
        },
        selectNode: () => {
          isSelected = true
          container.style.outline = '2px solid #3b82f6'
          container.style.outlineOffset = '2px'
          resizeHandle.style.display = 'block'
        },
        deselectNode: () => {
          isSelected = false
          container.style.outline = 'none'
          resizeHandle.style.display = 'none'
        },
        destroy: () => {
          document.removeEventListener('keydown', handleKeyDown)
          document.removeEventListener('mousemove', handleMouseMove)
          document.removeEventListener('mouseup', handleMouseUp)
          if (img.updateTimeout) {
            clearTimeout(img.updateTimeout)
          }
        },
      }
    }
  },
})

// Extend the editor commands interface
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    resizableImage: {
      setResizableImage: (options: ImageAttributes) => ReturnType
    }
  }
}

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      ResizableImage.configure({
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary hover:text-primary-600 underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
        defaultAlignment: 'left',
      }),
      Underline,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[300px] p-4 prose prose-sm max-w-none',
        style: 'font-size: 14px; line-height: 1.6; color: inherit;',
      },
    },
  })

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [editor, content])

  const addLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href
    const url = window.prompt('Enter URL:', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const toggleHeading = useCallback(
    (level: 1 | 2 | 3) => {
      if (!editor) return
      if (editor.isActive('heading', { level })) {
        editor.chain().focus().setParagraph().run()
      } else {
        editor.chain().focus().toggleHeading({ level }).run()
      }
    },
    [editor],
  )

  const setParagraph = useCallback(() => {
    if (!editor) return
    editor.chain().focus().setParagraph().run()
  }, [editor])

  const toggleBulletList = useCallback(() => {
    if (!editor) return
    editor.chain().focus().toggleBulletList().run()
  }, [editor])

  const toggleOrderedList = useCallback(() => {
    if (!editor) return
    editor.chain().focus().toggleOrderedList().run()
  }, [editor])

  const setTextAlign = useCallback(
    (alignment: 'left' | 'center' | 'right' | 'justify') => {
      if (!editor) return

      // Use the built-in TextAlign extension command instead of manual transaction
      editor.chain().focus().setTextAlign(alignment).run()
    },
    [editor],
  )

  const handleImageUpload = useCallback(
    (imageUrl: string) => {
      if (editor) {
        editor.chain().focus().setResizableImage({ src: imageUrl, align: 'center' }).run()
      }
    },
    [editor],
  )

  const resizeSelectedImage = useCallback(
    (size: 'small' | 'medium' | 'large' | 'original') => {
      if (!editor) return

      const { state } = editor
      const { selection } = state
      const { $from } = selection

      // Find the selected image node
      let imageNode = null
      let imagePos = null

      state.doc.descendants((node, pos) => {
        if (node.type.name === 'resizableImage' && pos <= $from.pos && pos + node.nodeSize >= $from.pos) {
          imageNode = node
          imagePos = pos
          return false
        }
      })

      if (imageNode && imagePos !== null) {
        let width: number | null = null
        let height: number | null = null

        switch (size) {
          case 'small':
            width = 200
            break
          case 'medium':
            width = 400
            break
          case 'large':
            width = 600
            break
          case 'original':
            width = null
            height = null
            break
        }

        editor.view.dispatch(
          editor.view.state.tr.setNodeMarkup(imagePos, undefined, {
            ...(imageNode as TextAlignType).attrs,
            width,
            height,
          }),
        )
      }
    },
    [editor],
  )

  const setImageAlignment = useCallback(
    (alignment: 'left' | 'center' | 'right') => {
      if (!editor) return

      const { state } = editor
      const { selection } = state
      const { $from } = selection

      // Find the selected image node
      let imageNode = null
      let imagePos = null

      state.doc.descendants((node, pos) => {
        if (node.type.name === 'resizableImage' && pos <= $from.pos && pos + node.nodeSize >= $from.pos) {
          imageNode = node
          imagePos = pos
          return false
        }
      })

      if (imageNode && imagePos !== null) {
        editor.view.dispatch(
          editor.view.state.tr.setNodeMarkup(imagePos, undefined, {
            ...(imageNode as TextAlignType).attrs,
            align: alignment,
          }),
        )
      }
    },
    [editor],
  )

  if (!editor) {
    return null
  }

  const hasSelectedImage = editor.isActive('resizableImage')

  // Get current text alignment only for the active node
  const getCurrentTextAlign = () => {
    const { selection } = editor.state
    const { $from } = selection
    const node = $from.node()
    return (node.attrs as TextAlignType)?.textAlign || 'left'
  }

  const currentTextAlign = getCurrentTextAlign()

  return (
    <>
      <Card>
        <CardBody className='p-0'>
          {/* Toolbar */}
          <div className='border-b border-divider bg-content2 p-3'>
            <div className='flex flex-wrap gap-2'>
              {/* Text Alignment */}
              <ButtonGroup size='sm' variant='flat'>
                <Button
                  onPress={() => setTextAlign('left')}
                  color={currentTextAlign === 'left' ? 'primary' : 'default'}
                  isIconOnly
                  title='Align Left'
                >
                  <Bars3Icon className='h-4 w-4' />
                </Button>
                <Button
                  onPress={() => setTextAlign('center')}
                  color={currentTextAlign === 'center' ? 'primary' : 'default'}
                  isIconOnly
                  title='Align Center'
                >
                  <Bars3CenterLeftIcon className='h-4 w-4' />
                </Button>
                <Button
                  onPress={() => setTextAlign('right')}
                  color={currentTextAlign === 'right' ? 'primary' : 'default'}
                  isIconOnly
                  title='Align Right'
                >
                  <Bars4Icon className='h-4 w-4' />
                </Button>
                <Button
                  onPress={() => setTextAlign('justify')}
                  color={currentTextAlign === 'justify' ? 'primary' : 'default'}
                  isIconOnly
                  title='Justify'
                >
                  <QueueListIcon className='h-4 w-4' />
                </Button>
              </ButtonGroup>

              {/* Text Formatting */}
              <ButtonGroup size='sm' variant='flat'>
                <Button
                  onPress={() => editor.chain().focus().toggleBold().run()}
                  color={editor.isActive('bold') ? 'primary' : 'default'}
                  isIconOnly
                  title='Bold'
                >
                  <BoldIcon className='h-4 w-4' />
                </Button>
                <Button
                  onPress={() => editor.chain().focus().toggleItalic().run()}
                  color={editor.isActive('italic') ? 'primary' : 'default'}
                  isIconOnly
                  title='Italic'
                >
                  <ItalicIcon className='h-4 w-4' />
                </Button>
                <Button
                  onPress={() => editor.chain().focus().toggleUnderline().run()}
                  color={editor.isActive('underline') ? 'primary' : 'default'}
                  isIconOnly
                  title='Underline'
                >
                  <UnderlineIcon className='h-4 w-4' />
                </Button>
                <Button
                  onPress={() => editor.chain().focus().toggleStrike().run()}
                  color={editor.isActive('strike') ? 'primary' : 'default'}
                  isIconOnly
                  title='Strikethrough'
                >
                  <StrikethroughIcon className='h-4 w-4' />
                </Button>
              </ButtonGroup>

              {/* Headings and Paragraph */}
              <ButtonGroup size='sm' variant='flat'>
                <Button
                  onPress={setParagraph}
                  color={editor.isActive('paragraph') && !editor.isActive('heading') ? 'primary' : 'default'}
                  className='font-normal'
                  title='Paragraph'
                >
                  P
                </Button>
                <Button
                  onPress={() => toggleHeading(1)}
                  color={editor.isActive('heading', { level: 1 }) ? 'primary' : 'default'}
                  className='font-bold'
                  title='Heading 1'
                >
                  H1
                </Button>
                <Button
                  onPress={() => toggleHeading(2)}
                  color={editor.isActive('heading', { level: 2 }) ? 'primary' : 'default'}
                  className='font-bold'
                  title='Heading 2'
                >
                  H2
                </Button>
                <Button
                  onPress={() => toggleHeading(3)}
                  color={editor.isActive('heading', { level: 3 }) ? 'primary' : 'default'}
                  className='font-bold'
                  title='Heading 3'
                >
                  H3
                </Button>
              </ButtonGroup>

              {/* Lists */}
              <ButtonGroup size='sm' variant='flat'>
                <Button
                  onPress={toggleBulletList}
                  color={editor.isActive('bulletList') ? 'primary' : 'default'}
                  isIconOnly
                  title='Bullet List'
                >
                  <ListBulletIcon className='h-4 w-4' />
                </Button>
                <Button
                  onPress={toggleOrderedList}
                  color={editor.isActive('orderedList') ? 'primary' : 'default'}
                  isIconOnly
                  title='Numbered List'
                >
                  <NumberedListIcon className='h-4 w-4' />
                </Button>
              </ButtonGroup>

              {/* Block Elements */}
              <ButtonGroup size='sm' variant='flat'>
                <Button
                  onPress={() => editor.chain().focus().toggleBlockquote().run()}
                  color={editor.isActive('blockquote') ? 'primary' : 'default'}
                  isIconOnly
                  title='Quote'
                >
                  <ChatBubbleLeftRightIcon className='h-4 w-4' />
                </Button>
                <Button
                  onPress={() => editor.chain().focus().toggleCodeBlock().run()}
                  color={editor.isActive('codeBlock') ? 'primary' : 'default'}
                  isIconOnly
                  title='Code Block'
                >
                  <CodeBracketIcon className='h-4 w-4' />
                </Button>
              </ButtonGroup>

              {/* Media & Links */}
              <ButtonGroup size='sm' variant='flat'>
                <Button
                  onPress={addLink}
                  color={editor.isActive('link') ? 'primary' : 'default'}
                  isIconOnly
                  title='Add Link'
                >
                  <LinkIcon className='h-4 w-4' />
                </Button>
                <Button onPress={onOpen} isIconOnly title='Upload Image' color='secondary'>
                  <PhotoIcon className='h-4 w-4' />
                </Button>
              </ButtonGroup>

              {/* Image Controls - Only show when image is selected */}
              {hasSelectedImage && (
                <>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button size='sm' variant='flat' color='secondary'>
                        Resize Image
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label='Image resize options'>
                      <DropdownItem key='small' onPress={() => resizeSelectedImage('small')}>
                        Small (200px)
                      </DropdownItem>
                      <DropdownItem key='medium' onPress={() => resizeSelectedImage('medium')}>
                        Medium (400px)
                      </DropdownItem>
                      <DropdownItem key='large' onPress={() => resizeSelectedImage('large')}>
                        Large (600px)
                      </DropdownItem>
                      <DropdownItem key='original' onPress={() => resizeSelectedImage('original')}>
                        Original Size
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>

                  <Dropdown>
                    <DropdownTrigger>
                      <Button size='sm' variant='flat' color='secondary'>
                        Align Image
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label='Image alignment options'>
                      <DropdownItem key='left' onPress={() => setImageAlignment('left')}>
                        Align Left
                      </DropdownItem>
                      <DropdownItem key='center' onPress={() => setImageAlignment('center')}>
                        Align Center
                      </DropdownItem>
                      <DropdownItem key='right' onPress={() => setImageAlignment('right')}>
                        Align Right
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </>
              )}
            </div>
          </div>

          {/* Editor */}
          <div className='bg-content1'>
            <div className='tiptap-editor'>
              <EditorContent editor={editor} />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Media Upload Modal */}
      <MediaUploadModal isOpen={isOpen} onOpenChange={onOpenChange} onImageSelect={handleImageUpload} />
    </>
  )
}
