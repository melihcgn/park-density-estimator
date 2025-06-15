import React from 'react'
import { ModeToggle } from './mode-toggle'
import { TypographyH1 } from './ui/typography'
import { DatePicker } from './ui/datepicker'
import DatePickerWrapper from './DatePickerWrapper'
import { DateTimePickerDialog } from './ui/DateTimePickerDialog'
import { useDateTime } from '@/context/DateTimeContext'

export default function Navbar() {
  return (
    <nav className='flex bg-zinc-100 dark:bg-zinc-900 h-12 w-full justify-between items-center px-6'>
      <TypographyH1>ParkMap</TypographyH1>
      <div className='flex flex-row gap-6'>
        <DateTimePickerDialog ></DateTimePickerDialog>
        <ModeToggle></ModeToggle>
      </div>
    </nav>
  )
}
