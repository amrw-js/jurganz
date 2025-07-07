'use client'

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react'
import { Copy, Facebook, Linkedin, Mail, MessageCircle, Share2, Twitter } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  url: string
  description?: string
}

export default function ShareModal({ isOpen, onClose, title, url, description = '' }: ShareModalProps) {
  const { t } = useTranslation('blog')
  const [copied, setCopied] = useState(false)

  const shareUrl = url
  const shareTitle = title
  const shareDescription = description || `Check out this article from GBS: ${title}`

  // Share handlers
  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    window.open(facebookUrl, '_blank', 'width=600,height=400')
  }

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`
    window.open(twitterUrl, '_blank', 'width=600,height=400')
  }

  const shareToLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    window.open(linkedinUrl, '_blank', 'width=600,height=400')
  }

  const shareToWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}`
    window.open(whatsappUrl, '_blank')
  }

  const shareViaEmail = () => {
    const emailUrl = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareDescription}\n\n${shareUrl}`)}`
    window.location.href = emailUrl
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = shareUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shareOptions = [
    {
      name: 'Facebook',
      icon: Facebook,
      onClick: shareToFacebook,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      onClick: shareToTwitter,
      color: 'bg-sky-500 hover:bg-sky-600',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      onClick: shareToLinkedIn,
      color: 'bg-blue-700 hover:bg-blue-800',
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      onClick: shareToWhatsApp,
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      name: 'Email',
      icon: Mail,
      onClick: shareViaEmail,
      color: 'bg-gray-600 hover:bg-gray-700',
    },
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement='center'
      backdrop='blur'
      size='md'
      classNames={{
        base: 'bg-white',
        header: 'border-b border-gray-100',
        body: 'py-6',
        footer: 'border-t border-gray-100',
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex items-center gap-3 px-6 py-4'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-[#155E75]/10'>
                <Share2 className='h-5 w-5 text-[#155E75]' />
              </div>
              <div className='flex-1'>
                <h3 className='text-lg font-semibold text-gray-900'>{t('shareArticle')}</h3>
              </div>
            </ModalHeader>

            <ModalBody className='px-6'>
              <div className='space-y-6'>
                {/* Article Preview */}
                <div className='rounded-lg border border-gray-100 bg-gray-50 p-4'>
                  <h4 className='mb-1 line-clamp-2 font-medium text-gray-900'>{shareTitle}</h4>
                  <p className='truncate text-sm text-gray-500'>{shareUrl}</p>
                </div>

                {/* Social Media Share Buttons */}
                <div>
                  <h5 className='mb-3 text-sm font-medium text-gray-700'>{t('blog:shareOnSocialMedia')}</h5>
                  <div className='grid grid-cols-2 gap-3'>
                    {shareOptions.map((option) => {
                      const IconComponent = option.icon
                      return (
                        <Button
                          key={option.name}
                          onPress={option.onClick}
                          variant='flat'
                          className={`${option.color} h-12 justify-start text-white transition-all duration-200 hover:scale-105`}
                          startContent={<IconComponent className='h-4 w-4' />}
                        >
                          {option.name}
                        </Button>
                      )
                    })}
                  </div>
                </div>

                {/* Copy Link Section */}
                <div>
                  <div className='flex gap-2'>
                    <div className='flex-1 truncate rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600'>
                      {shareUrl}
                    </div>
                    <Button
                      isIconOnly
                      variant={copied ? 'solid' : 'bordered'}
                      style={copied ? { backgroundColor: '#155E75' } : {}}
                      className={copied ? 'text-white' : 'border-gray-200 hover:border-[#155E75] hover:text-[#155E75]'}
                      onPress={copyToClipboard}
                    >
                      <Copy className='h-4 w-4' />
                    </Button>
                  </div>
                  {copied && (
                    <p className='mt-2 flex items-center gap-1 text-sm font-medium text-[#155E75]'>
                      <div className='h-1.5 w-1.5 rounded-full bg-[#155E75]'></div>
                      {t('linkCopied')}
                    </p>
                  )}
                </div>
              </div>
            </ModalBody>

            <ModalFooter className='px-6 py-4'>
              <Button variant='light' onPress={onClose} className='text-gray-600 hover:text-gray-800'>
                {t('close')}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
