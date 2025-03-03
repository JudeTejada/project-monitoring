'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader
} from '@/components/ui/sidebar';
import { useSession } from '@/lib/auth-client';
import {
  LayoutDashboard,
  FolderKanban,
  CalendarDays,
  FileSpreadsheet
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AppSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className='flex items-center gap-2 px-4 py-4'>
          <Image
            src='/dict-logo.png'
            alt='DICT Logo'
            className=' object-cover '
            width={128}
            height={128}
          />
          {/* <span className='font-semibold text-lg'>DICT</span> */}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <div className='space-y-1 px-2'>
            <Link
              href='/'
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                pathname === '/'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <LayoutDashboard className='w-4 h-4' />
              Dashboard
            </Link>
            <Link
              href='/projects'
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                pathname === '/projects'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <FolderKanban className='w-4 h-4' />
              Projects
            </Link>
            <Link
              href='/activities'
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                pathname === '/activities'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <CalendarDays className='w-4 h-4' />
              Activities
            </Link>
            {/* <Link
              href='/request'
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                pathname === '/request'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <FileSpreadsheet className='w-4 h-4' />
              Requests
            </Link> */}
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className='p-4 border-t'>
          {session && (
            <div className='flex items-center gap-4'>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium truncate'>
                  {session.user.name}
                </p>
                <p className='text-xs text-muted-foreground truncate'>
                  {session.user.email}
                </p>
              </div>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
