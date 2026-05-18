'use client';

import { motion } from 'framer-motion';
import { Menu, Bell, User, LogOut, ChevronDown, Radio } from 'lucide-react';
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
    <header className="sticky top-0 z-20 flex h-14 items-center border-b border-gray-100 bg-white/95 backdrop-blur-sm px-4 md:px-6">
      {/* Left section */}
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          className="text-gray-500 hover:bg-gray-100 md:hidden"
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
          <span className="hidden text-sm text-gray-200 sm:inline">/</span>
          <h1 className="text-sm font-bold text-gray-800 md:text-base">
            {moduleName}
          </h1>
        </motion.div>
      </div>

      {/* Right section */}
      <div className="ml-auto flex items-center gap-2 md:gap-3">
        {/* Live indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-100">
          <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-pulse" />
          <span className="text-[10px] font-bold text-[#FF6B00]">EN VIVO</span>
        </div>

        {/* Notification bell */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-gray-400 hover:bg-gray-50 hover:text-gray-600"
          aria-label="Notificaciones"
        >
          <Bell className="h-[18px] w-[18px]" />
          <Badge className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full border-0 bg-[#FF6B00] px-1 text-[9px] font-bold text-white">
            3
          </Badge>
        </Button>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 rounded-full pl-1.5 pr-2.5 hover:bg-gray-50"
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-[#FF6B00] text-white text-[10px] font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium text-gray-700 md:inline">
                {userName}
              </span>
              <ChevronDown className="h-3 w-3 text-gray-400" />
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
