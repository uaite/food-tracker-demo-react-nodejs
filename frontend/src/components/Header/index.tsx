import { Link } from '@tanstack/react-router';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HeaderNavigation from '@/components/Header/Navigation';
import User from './User';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Popover open={menuOpen} onOpenChange={setMenuOpen}>
            <PopoverTrigger asChild>
              <Button
                className="flex sm:hidden items-center justify-center"
                variant="ghost"
                size="icon"
                aria-description="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side="bottom"
              sideOffset={22}
              align="start"
              className="w-fit h-fit bg-white p-2 shadow-lg border rounded-md"
              onClick={() => setMenuOpen(false)}
            >
              <HeaderNavigation />
            </PopoverContent>
          </Popover>

          <Link to="/" className="text-xl font-bold text-gray-900 shrink-0">
            <img
              src="logo512.png"
              alt="Food Tracker"
              className="h-8 mr-0 sm:mr-8"
            />
          </Link>

          <HeaderNavigation className="hidden sm:block" />
        </div>
        <User />
      </div>
    </header>
  );
}
