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
    <header
      className="sticky top-0 z-20 flex h-14 items-center px-4 md:px-6"
      style={{
        background: 'linear-gradient(135deg, #FF6B00 0%, #E05500 40%, #C44A00 100%)',
        boxShadow: '0 2px 12px rgba(255,107,0,0.2)',
      }}
    >
      {/* Left section */}
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          className="text-white/80 hover:bg-white/15 hover:text-white md:hidden"
          aria-label="Abrir menú"
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
          <span className="hidden text-sm text-white/50 sm:inline">Módulos</span>
          <span className="hidden text-sm text-white/30 sm:inline">/</span>
          <h1 className="text-sm font-bold text-white md:text-base">
            {moduleName}
          </h1>
        </motion.div>
      </div>

      {/* Right section */}
      <div className="ml-auto flex items-center gap-2 md:gap-3">
        {/* Live indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/10">
          <Radio className="w-3 h-3 text-white animate-pulse" />
          <span className="text-[10px] font-bold text-white tracking-wide">EN VIVO</span>
        </div>

        {/* Notification bell */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-white/70 hover:bg-white/15 hover:text-white"
          aria-label="Notificaciones"
        >
          <Bell className="h-[18px] w-[18px]" />
          <Badge className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full border-0 bg-white px-1 text-[9px] font-bold text-[#E05500]">
            3
          </Badge>
        </Button>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 rounded-full pl-1.5 pr-2.5 hover:bg-white/15 text-white"
            >
              <Avatar className="h-7 w-7 border-2 border-white/30">
                <AvatarFallback className="bg-white/20 text-white text-[10px] font-bold border-0">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium md:inline">
                {userName}
              </span>
              <ChevronDown className="h-3 w-3 text-white/50" />
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
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
