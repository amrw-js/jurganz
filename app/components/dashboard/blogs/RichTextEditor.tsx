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
import { Button, ButtonGroup, Card, CardBody, useDisclosure } from '@heroui/react'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useCallback, useEffect } from 'react'

import MediaUploadModal from '@/app/modals/UploadModal'

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
      Image.configure({
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
        editor.chain().focus().setImage({ src: imageUrl }).run()
      }
    },
    [editor],
  )

  if (!editor) {
    return null
  }

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
