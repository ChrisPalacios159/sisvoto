'use client';

import { motion } from 'framer-motion';
import { Menu, Bell, User, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  moduleName: string;
  onMenuToggle: () => void;
  userName?: string;
}

export default function Header({
  moduleName,
  onMenuToggle,
  userName = 'Administrador',
}: HeaderProps) {
  const initials = userName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center border-b border-gray-200 bg-white px-4 md:px-6">
      {/* Left section */}
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          className="text-gray-600 hover:bg-gray-100 md:hidden"
          aria-label="Abrir men\u00fa"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Module title / Breadcrumb */}
        <motion.div
          key={moduleName}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="flex items-center gap-2"
        >
          <span className="hidden text-sm text-gray-400 sm:inline">M\u00f3dulos</span>
          <span className="hidden text-sm text-gray-300 sm:inline">/</span>
          <h1 className="text-base font-semibold text-gray-800 md:text-lg">
            {moduleName}
          </h1>
        </motion.div>
      </div>

      {/* Right section */}
      <div className="ml-auto flex items-center gap-2 md:gap-3">
        {/* Notification bell */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          aria-label="Notificaciones"
        >
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full border-0 bg-[#FF6B00] px-1.5 text-[10px] font-bold text-white shadow-sm">
            3
          </Badge>
        </Button>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 rounded-full pl-2 pr-3 hover:bg-gray-100"
            >
              <Avatar className="h-8 w-8 border-2 border-[#FF6B00]/30">
                <AvatarFallback className="bg-[#FF6B00]/15 text-[#FF6B00] text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium text-gray-700 md:inline">
                {userName}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground">admin@electoral.gob</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Mi Perfil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesi\u00f3n
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
