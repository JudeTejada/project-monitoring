import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Download } from 'lucide-react';
import React, { useState } from 'react';
import { handleExport } from './utils/exportUtils';
import { Activity } from '@prisma/client';

type Props = {
  projects: Activity[];
};

export default function ExportActivitiesPopover({projects}: Props) {
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel' | 'pdf'>(
    'csv'
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline'>
          <Download className='h-4 w-4 mr-2' />
          Export
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-4'>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Sort by Month</label>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger>
                <SelectValue placeholder='Sort order' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='asc'>Ascending</SelectItem>
                <SelectItem value='desc'>Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Format</label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger>
                <SelectValue placeholder='Select format' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='csv'>CSV</SelectItem>
                <SelectItem value='excel'>Excel</SelectItem>
                <SelectItem value='pdf'>PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            className='w-full'
            onClick={() =>
              handleExport(projects, exportFormat, sortOrder)
            }
          >
            Export
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
