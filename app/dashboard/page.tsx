'use client'

import { useUser } from '@clerk/nextjs'
import { Button, Card, CardBody, CardHeader, Chip } from '@heroui/react'
import Link from 'next/link'

export default function Dashboard() {
  const { user } = useUser()

  return (
    <div className='p-8'>
      <div className='mx-auto max-w-4xl space-y-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold text-gray-900'>Admin Dashboard</h1>
        </div>

        <Card>
          <CardHeader>
            <h2 className='text-xl font-semibold'>Welcome Back!</h2>
          </CardHeader>
          <CardBody className='space-y-4'>
            <div className='flex items-center gap-2'>
              <span className='font-medium'>Admin Status:</span>
              <Chip color='success' variant='flat'>
                Authenticated
              </Chip>
            </div>
            <div>
              <span className='font-medium'>Admin:</span> {user?.firstName} {user?.lastName}
            </div>
            <div>
              <span className='font-medium'>Email:</span> {user?.primaryEmailAddress?.emailAddress}
            </div>
            <div>
              <span className='font-medium'>Last Login:</span> {new Date().toLocaleDateString()}
            </div>
          </CardBody>
        </Card>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          <Card>
            <CardBody className='text-center'>
              <h3 className='mb-2 text-lg font-semibold'>Projects</h3>
              <p className='text-gray-600'>Manage and monitor all projects.</p>
              <Button as={Link} href='/dashboard/projects' color='primary' variant='light' className='mt-2'>
                View Projects
              </Button>
            </CardBody>
          </Card>

          <Card>
            <CardBody className='text-center'>
              <h3 className='mb-2 text-lg font-semibold'>Production Lines</h3>
              <p className='text-gray-600'>Monitor production line status and performance.</p>
              <Button as={Link} href='/dashboard/lines' color='primary' variant='light' className='mt-2'>
                View Lines
              </Button>
            </CardBody>
          </Card>

          <Card>
            <CardBody className='text-center'>
              <h3 className='mb-2 text-lg font-semibold'>Blogs</h3>
              <p className='text-gray-600'>Manage blog posts and content.</p>
              <Button as={Link} href='/dashboard/blogs' color='primary' variant='light' className='mt-2'>
                View Blogs
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
