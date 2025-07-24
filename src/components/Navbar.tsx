import React from 'react'
import { ModeToggle } from './mode-toggle'
import { TypographyH1 } from './ui/typography'
import { DateTimePickerDialog } from './ui/DateTimePickerDialog'

export default function Navbar() {
  return (
    <nav className='flex bg-zinc-100 dark:bg-zinc-900 h-12 w-full justify-between items-center px-6'>
      <TypographyH1>HaritaPark</TypographyH1>
      <div className='flex flex-row gap-6'>
        <DateTimePickerDialog ></DateTimePickerDialog>
        <ModeToggle></ModeToggle>
      </div>
    </nav>
  )
}
