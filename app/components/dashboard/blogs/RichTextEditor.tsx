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
import { EditorContent, useEditor } from '@tiptap/react'
import type { NodeViewRendererProps } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useCallback, useEffect } from 'react'

import MediaUploadModal from '@/app/modals/UploadModal'

// Define proper types for image attributes
interface ImageAttributes {
  src: string
  alt?: string
  title?: string
  width?: number
  height?: number
}

// Custom Image Node with resize functionality
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
    }
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
  },

  addCommands() {
    return {
      setResizableImage:
        (options: ImageAttributes) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
    }
  },

  addNodeView() {
    return ({ node, getPos, editor }: NodeViewRendererProps) => {
      const container = document.createElement('div')
      container.className = 'resizable-image-container'

      const img = document.createElement('img')
      img.src = node.attrs.src
      img.alt = node.attrs.alt || ''
      img.title = node.attrs.title || ''

      if (node.attrs.width) img.style.width = `${node.attrs.width}px`
      if (node.attrs.height) img.style.height = `${node.attrs.height}px`

      img.className = 'resizable-image'
      img.style.maxWidth = '100%'
      img.style.height = 'auto'
      img.style.borderRadius = '8px'
      img.style.display = 'block'
      img.style.margin = '16px auto'

      let isSelected = false

      // Add resize handles
      const resizeHandle = document.createElement('div')
      resizeHandle.className = 'resize-handle'
      resizeHandle.style.cssText = `
        position: absolute;
        bottom: -5px;
        right: -5px;
        width: 10px;
        height: 10px;
        background: #3b82f6;
        border: 2px solid white;
        border-radius: 50%;
        cursor: se-resize;
        display: ${isSelected ? 'block' : 'none'};
      `

      container.style.position = 'relative'
      container.style.display = 'inline-block'
      container.appendChild(img)
      container.appendChild(resizeHandle)

      // Handle resize
      let isResizing = false
      let startX: number
      let startY: number
      let startWidth: number
      let startHeight: number

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
        e.preventDefault()
      }

      const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing) return

        const width = startWidth + (e.clientX - startX)
        const height = startHeight + (e.clientY - startY)

        if (width > 50 && height > 50) {
          img.style.width = `${width}px`
          img.style.height = `${height}px`
          updateAttributes({ width, height })
        }
      }

      const handleMouseUp = () => {
        isResizing = false
      }

      resizeHandle.addEventListener('mousedown', handleMouseDown)
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)

      // Delete on backspace/delete
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Backspace' || e.key === 'Delete') {
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

      // Make container focusable for keyboard events
      container.tabIndex = -1
      container.addEventListener('keydown', handleKeyDown)

      return {
        dom: container,
        update: (updatedNode) => {
          if (updatedNode.type.name !== this.name) return false

          img.src = updatedNode.attrs.src
          img.alt = updatedNode.attrs.alt || ''
          img.title = updatedNode.attrs.title || ''

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
          container.classList.add('selected')
          resizeHandle.style.display = 'block'
        },
        deselectNode: () => {
          isSelected = false
          container.classList.remove('selected')
          resizeHandle.style.display = 'none'
        },
        destroy: () => {
          // Clean up event listeners
          resizeHandle.removeEventListener('mousedown', handleMouseDown)
          document.removeEventListener('mousemove', handleMouseMove)
          document.removeEventListener('mouseup', handleMouseUp)
          container.removeEventListener('keydown', handleKeyDown)
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
        // Ensure heading and list extensions are enabled
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
          class: 'max-w-full h-auto rounded-lg my-4',
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
      editor.chain().focus().setTextAlign(alignment).run()
    },
    [editor],
  )

  const handleImageUpload = useCallback(
    (imageUrl: string) => {
      if (editor) {
        editor.chain().focus().setResizableImage({ src: imageUrl }).run()
      }
    },
    [editor],
  )

  const resizeSelectedImage = useCallback(
    (size: 'small' | 'medium' | 'large' | 'original') => {
      if (!editor) return

      const { selection } = editor.state
      const node = editor.state.doc.nodeAt(selection.from)

      if (node && node.type.name === 'resizableImage') {
        let width: number | null = null
        let height: number | null = null

        switch (size) {
          case 'small':
            width = 200
            height = null
            break
          case 'medium':
            width = 400
            height = null
            break
          case 'large':
            width = 600
            height = null
            break
          case 'original':
            width = null
            height = null
            break
        }

        editor.chain().focus().updateAttributes('resizableImage', { width, height }).run()
      }
    },
    [editor],
  )

  if (!editor) {
    return null
  }

  const hasSelectedImage = editor.isActive('resizableImage')

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
                  color={editor.isActive({ textAlign: 'left' }) ? 'primary' : 'default'}
                  isIconOnly
                  title='Align Left'
                >
                  <Bars3Icon className='h-4 w-4' />
                </Button>
                <Button
                  onPress={() => setTextAlign('center')}
                  color={editor.isActive({ textAlign: 'center' }) ? 'primary' : 'default'}
                  isIconOnly
                  title='Align Center'
                >
                  <Bars3CenterLeftIcon className='h-4 w-4' />
                </Button>
                <Button
                  onPress={() => setTextAlign('right')}
                  color={editor.isActive({ textAlign: 'right' }) ? 'primary' : 'default'}
                  isIconOnly
                  title='Align Right'
                >
                  <Bars4Icon className='h-4 w-4' />
                </Button>
                <Button
                  onPress={() => setTextAlign('justify')}
                  color={editor.isActive({ textAlign: 'justify' }) ? 'primary' : 'default'}
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

              {/* Headings */}
              <ButtonGroup size='sm' variant='flat'>
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

              {/* Image Resize Controls - Only show when image is selected */}
              {hasSelectedImage && (
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
