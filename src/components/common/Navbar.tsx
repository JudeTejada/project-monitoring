'use client';
import { Button } from '@/components/ui/button';
import { authClient, useSession } from '@/lib/auth-client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/sign-in');
  };

  const NavLinks = () => (
    <>
      <Link
        href='/'
        className={`px-3 py-2 rounded-md text-sm font-medium ${
          pathname === '/'
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:text-primary'
        }`}
      >
        Projects
      </Link>
      <Link
        href='/projects'
        className={`px-3 py-2 rounded-md text-sm font-medium ${
          pathname === '/projects'
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:text-primary'
        }`}
      >
        Activities
      </Link>
    </>
  );

  const UserInfo = () => (
    <div className='flex items-center gap-4'>
      <div className='text-left'>
        <p className='font-medium'>{session?.user.name}</p>
        <p className='text-sm text-muted-foreground'>{session?.user.email}</p>
      </div>
      {/* <Button variant='ghost' onClick={handleLogout}>
        Logout
      </Button> */}
    </div>
  );

  return (
    <nav className='flex justify-between items-center p-4 border-b'>
      <div className='flex items-center gap-6'>
        <h1 className='text-xl font-semibold'>Dashboard</h1>
        {/* Desktop Navigation */}
        <div className='hidden md:flex items-center gap-4'>
          <NavLinks />
        </div>
      </div>

      {/* Desktop User Info */}
      <div className='hidden md:block'>
        <UserInfo />
      </div>

      {/* Mobile Menu */}
      <div className='md:hidden'>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className='flex flex-col gap-6 mt-6'>
              <div className='flex flex-col gap-4'>
                <NavLinks />
              </div>
              <div className='pt-6 border-t'>
                <UserInfo />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
