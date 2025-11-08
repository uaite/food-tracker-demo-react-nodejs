'use client';

import * as React from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { format, set, startOfToday } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DateTimePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  disabled?: boolean;
}

export default function DateTimePicker({
  value,
  onChange,
  disabled = false,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [timeValue, setTimeValue] = React.useState(() => {
    if (value) {
      return format(value, 'HH:mm');
    }
    return format(startOfToday(), 'HH:mm');
  });

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const [hours, minutes] = timeValue.split(':').map(Number);
      const newDate = set(selectedDate, {
        hours,
        minutes,
        seconds: 0,
        milliseconds: 0,
      });
      onChange(newDate);
      setOpen(false);
    }
  };

  const handleTimeChange = (timeString: string) => {
    setTimeValue(timeString);
    if (value) {
      const [hours, minutes] = timeString.split(':').map(Number);
      const newDate = set(value, {
        hours,
        minutes,
        seconds: 0,
        milliseconds: 0,
      });
      onChange(newDate);
    }
  };

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-2 flex-1">
        <Label htmlFor="date-picker" className="text-sm font-medium">
          Date
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              disabled={disabled}
              className="justify-between font-normal"
            >
              {value ? format(value, 'PP') : 'Select date'}
              <ChevronDownIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={value}
              captionLayout="dropdown"
              onSelect={handleDateSelect}
              disabled={disabled}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col gap-2 flex-1">
        <Label htmlFor="time-picker" className="text-sm font-medium">
          Time
        </Label>
        <Input
          type="time"
          id="time-picker"
          value={timeValue}
          onChange={(e) => handleTimeChange(e.target.value)}
          disabled={disabled}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  );
}
