'use client'

import { Button, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo,
  Strikethrough,
  Type,
  UnderlineIcon,
  Undo,
} from 'lucide-react'
import { useCallback, useState } from 'react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = 'Start writing...',
  className,
}: RichTextEditorProps) {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4',
      },
    },
  })

  const addImage = useCallback(() => {
    const url = window.prompt('Enter image URL:')
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  const addLink = useCallback(() => {
    if (editor) {
      const { from, to } = editor.state.selection
      const selectedText = editor.state.doc.textBetween(from, to)
      setLinkText(selectedText)
      setLinkUrl('')
      setIsLinkModalOpen(true)
    }
  }, [editor])

  const insertLink = useCallback(() => {
    if (editor && linkUrl) {
      if (linkText) {
        editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkText}</a>`).run()
      } else {
        editor.chain().focus().setLink({ href: linkUrl }).run()
      }
      setIsLinkModalOpen(false)
      setLinkUrl('')
      setLinkText('')
    }
  }, [editor, linkUrl, linkText])

  if (!editor) {
    return null
  }

  const ToolbarButton = ({ onClick, isActive, children, title }: any) => (
    <Button
      isIconOnly
      size='sm'
      variant={isActive ? 'solid' : 'light'}
      color={isActive ? 'primary' : 'default'}
      onPress={onClick}
      className='h-8 min-w-8'
      title={title}
    >
      {children}
    </Button>
  )

  return (
    <div className={`overflow-hidden rounded-lg border border-default-200 ${className}`}>
      {/* Toolbar */}
      <div className='border-b border-default-200 bg-default-50 p-2'>
        <div className='flex flex-wrap gap-1'>
          {/* Text Formatting */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title='Bold'
          >
            <Bold className='h-4 w-4' />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title='Italic'
          >
            <Italic className='h-4 w-4' />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            title='Underline'
          >
            <UnderlineIcon className='h-4 w-4' />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            title='Strikethrough'
          >
            <Strikethrough className='h-4 w-4' />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            title='Code'
          >
            <Code className='h-4 w-4' />
          </ToolbarButton>

          <Divider orientation='vertical' className='mx-1 h-6' />

          {/* Headings */}
          <ToolbarButton
            onClick={() => editor.chain().focus().setParagraph().run()}
            isActive={editor.isActive('paragraph')}
            title='Paragraph'
          >
            <Type className='h-4 w-4' />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            title='Heading 1'
          >
            <Heading1 className='h-4 w-4' />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title='Heading 2'
          >
            <Heading2 className='h-4 w-4' />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            title='Heading 3'
          >
            <Heading3 className='h-4 w-4' />
          </ToolbarButton>

          <Divider orientation='vertical' className='mx-1 h-6' />

          {/* Lists */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title='Bullet List'
          >
            <List className='h-4 w-4' />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title='Numbered List'
          >
            <ListOrdered className='h-4 w-4' />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title='Quote'
          >
            <Quote className='h-4 w-4' />
          </ToolbarButton>

          <Divider orientation='vertical' className='mx-1 h-6' />

          {/* Alignment */}
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
            title='Align Left'
          >
            <AlignLeft className='h-4 w-4' />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
            title='Align Center'
          >
            <AlignCenter className='h-4 w-4' />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
            title='Align Right'
          >
            <AlignRight className='h-4 w-4' />
          </ToolbarButton>

          <Divider orientation='vertical' className='mx-1 h-6' />

          {/* Media */}
          <ToolbarButton onClick={addLink} title='Add Link'>
            <LinkIcon className='h-4 w-4' />
          </ToolbarButton>

          <ToolbarButton onClick={addImage} title='Add Image'>
            <ImageIcon className='h-4 w-4' />
          </ToolbarButton>

          <Divider orientation='vertical' className='mx-1 h-6' />

          {/* History */}
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} isActive={false} title='Undo'>
            <Undo className='h-4 w-4' />
          </ToolbarButton>

          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} isActive={false} title='Redo'>
            <Redo className='h-4 w-4' />
          </ToolbarButton>
        </div>
      </div>

      {/* Editor */}
      <div className='min-h-[300px] bg-white'>
        <EditorContent editor={editor} />
      </div>

      {/* Link Modal */}
      <Modal isOpen={isLinkModalOpen} onOpenChange={setIsLinkModalOpen} placement='center'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Add Link</ModalHeader>
              <ModalBody className='space-y-4'>
                <Input
                  label='Link Text'
                  placeholder='Enter link text'
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  variant='bordered'
                />
                <Input
                  label='URL'
                  placeholder='https://example.com'
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  variant='bordered'
                />
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  Cancel
                </Button>
                <Button color='primary' onPress={insertLink}>
                  Add Link
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
