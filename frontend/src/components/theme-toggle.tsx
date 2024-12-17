'use client'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { MoonIcon, Sun } from 'lucide-react'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'
import { cn } from '@/lib/utils'

type ThemeToggleProps = {
  className?: string
}

const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant={`ghost`} size={`lg`} className={className}>
        <Skeleton className='h-10 w-10' />
      </Button>
    )
  }

  return (
    <Button
      variant='ghost'
      className={cn('text-black border border-neutral-200 dark:border-neutral-800 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-900', className)}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {theme === 'dark' ? (
        <Sun className='h-5 w-5' />
      ) : (
        <MoonIcon className='h-5 w-5' />
      )}
    </Button>
  )
}

export default ThemeToggle
