'use client';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { Activity } from '@prisma/client';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { AddActivityModal } from './AddActivityModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Trash2, Download, Pencil, MoreVertical } from 'lucide-react';
import { AddProjectModal } from './AddProjectModal';

type Props = {
  projects: Activity[];
};
// Add new imports at the top
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { formatUrl, isValidUrl } from './util';
// Add this to your imports at the top
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
// Add this near the top of your file with other imports
import { cn } from '@/lib/utils';

// Add this helper function inside your component
const getStatusColor = (status: string) => {
  const statusMap: Record<string, { color: string; background: string }> = {
    Ongoing: { color: 'text-blue-700', background: 'bg-blue-100' },
    Completed: { color: 'text-green-700', background: 'bg-green-100' },
    Cancelled: { color: 'text-red-700', background: 'bg-red-100' },
    TENTATIVE: { color: 'text-red-700', background: 'bg-red-100' },
    PENDING: { color: 'text-red-700', background: 'bg-red-100' },
    Postponed: { color: 'text-yellow-700', background: 'bg-yellow-100' },
    Rescheduled: { color: 'text-purple-700', background: 'bg-purple-100' }
  };
  return (
    statusMap[status] || { color: 'text-gray-700', background: 'bg-gray-100' }
  );
};

export function DashboardTable({ projects }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sortedProjects, setSortedProjects] = useState<Activity[]>(projects);
  const [isDeleting, startTransition] = useTransition();
  // Add new state for time filter
  const [timeFilter, setTimeFilter] = useState<string>('all');

  // Add filter function
  const filterByTime = useCallback(
    (projects: Activity[]) => {
      const quarterMap = {
        Q1: ['january', 'february', 'march'],
        Q2: ['april', 'may', 'june'],
        Q3: ['july', 'august', 'september'],
        Q4: ['october', 'november', 'december'],
        S1: ['january', 'february', 'march', 'april', 'may', 'june'],
        S2: ['july', 'august', 'september', 'october', 'november', 'december']
      };

      switch (timeFilter) {
        case 'Q1':
        case 'Q2':
        case 'Q3':
        case 'Q4':
        case 'S1':
        case 'S2':
          return projects.filter(project =>
            quarterMap[timeFilter as keyof typeof quarterMap].includes(
              project.month.toLowerCase().trim()
            )
          );
        case 'year':
          return projects;
        default:
          return projects;
      }
    },
    [timeFilter]
  );

  useEffect(() => {
    setSortedProjects(filterByTime(projects));
  }, [filterByTime, projects, timeFilter]);

  const handleSort = (value: string) => {
    if (value === 'all') {
      setSortedProjects(filterByTime(projects));
      return;
    }

    const filtered = projects.filter(project => project.project === value);
    setSortedProjects(filterByTime(filtered));
  };

  // Add handler for time filter changes
  const handleTimeFilterChange = (value: string) => {
    setTimeFilter(value);
    //
  };

  // Get unique project names for the dropdown
  const uniqueProjects = Array.from(
    new Set(projects.map(p => p.project).filter(project => project !== ''))
  );

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/projects/import', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Import failed');
      }
      toast({
        title: 'Import successful'
      });
      window.location.reload(); // Reload the page to reflect changes
    } catch (error) {
      console.error('Error importing file:', error);
      toast({
        title: 'Import failed',
        description: 'An error occurred while importing the file.',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (activityId: string) => {
    startTransition(async () => {
      try {
        const response = await fetch(`/api/activities/${activityId}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Failed to delete activity');
        }

        const data = await response.json();

        toast({
          title: 'activity deleted successfully',
          description: data.projectdeleted
            ? 'project was also removed as it has no more activities.'
            : undefined
        });

        // Update the local state to remove the deleted activity
        const updatedProjects = sortedProjects.filter(
          project => project.id !== activityId
        );
        setSortedProjects(updatedProjects);
        console.log('IS SUCCESS?');

        // If the project was deleted, we should refresh the projects list
        if (data.projectDeleted) {
          window.location.reload();
        }
      } catch (error) {
        console.error('Error deleting activity:', error);
        toast({
          title: 'Failed to delete activity',
          description: 'An error occurred while deleting the activity.',
          variant: 'destructive'
        });
      }
    });
  };

  const handleExportCSV = () => {
    const csvData = sortedProjects.map(project => ({
      Year: project.year,
      Month: project.month,
      Project: project.project,
      'Inclusive Dates': project.inclusiveDates,
      'Activity Name': project.activityName,
      'Nature of Activity': project.natureOfActivity,
      'Number of Hours': project.numberOfHours,
      'Initiated By': project.initiatedBy,
      Status: project.status,
      Remarks: project.remarks,
      'Partnered Institutions': project.partneredInstitutions,
      // Beneficiary: project.beneficiary,
      'Number of Participants': project.numberOfParticipants,
      Male: project.male,
      Female: project.female,
      Component: project.component,
      MOVs: project.movs
    }));

    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row =>
        headers
          .map(
            header =>
              `"${
                row[header as keyof typeof row]
                  ?.toString()
                  .replace(/"/g, '""') || ''
              }"`
          )
          .join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `activities_report_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div>
      <header className='sticky top-0 z-10 bg-background flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b gap-4'>
        <div>
          <h1 className='text-2xl font-bold mb-1'>Activities Monitoring</h1>
          <p className='text-muted-foreground'>
            Manage and track all project activities
          </p>
        </div>
        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto'>
          <div className='flex gap-4 p-2 rounded-lg bg-muted/30'>
            <Select onValueChange={handleSort}>
              <SelectTrigger className='w-full sm:w-[180px] bg-background'>
                <SelectValue placeholder='Filter by project' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Projects</SelectItem>
                {uniqueProjects.map(project => (
                  <SelectItem key={project} value={project}>
                    {project}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className='w-[180px] bg-background'>
                  {timeFilter === 'all'
                    ? 'Filter by Time'
                    : timeFilter === 'year'
                    ? 'Whole Year'
                    : timeFilter.startsWith('S')
                    ? `Semester ${timeFilter[1]}`
                    : `Quarter ${timeFilter[1]}`}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Time Period</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={timeFilter}
                  onValueChange={handleTimeFilterChange}
                >
                  <DropdownMenuRadioItem value='all'>
                    All Time
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='year'>
                    Whole Year
                  </DropdownMenuRadioItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Quarters</DropdownMenuLabel>
                  <DropdownMenuRadioItem value='Q1'>
                    Q1 (Jan-Mar)
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='Q2'>
                    Q2 (Apr-Jun)
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='Q3'>
                    Q3 (Jul-Sep)
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='Q4'>
                    Q4 (Oct-Dec)
                  </DropdownMenuRadioItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Semesters</DropdownMenuLabel>
                  <DropdownMenuRadioItem value='S1'>
                    Semester 1 (Jan-Jun)
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='S2'>
                    Semester 2 (Jul-Dec)
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className='flex gap-4 w-full sm:w-auto'>
            <Button
              variant='outline'
              onClick={handleExportCSV}
              className='w-full sm:w-auto'
            >
              <Download className='h-4 w-4 mr-2' />
              Export CSV
            </Button>

            <AddActivityModal
              onActivityAdded={() => window.location.reload()}
            />
            <input
              type='file'
              accept='.csv'
              onChange={handleImport}
              ref={fileInputRef}
              className='hidden'
            />
            <Button
              variant='outline'
              onClick={() => fileInputRef.current?.click()}
              className='w-full sm:w-auto'
            >
              Import projects
            </Button>
          </div>
        </div>
      </header>
      <div className='rounded-md border overflow-x-auto'>
        <div className='min-w-[1200px]'>
          <Table>
            <TableHeader className='p-4'>
              <TableRow>
                {/* Header cells */}
                <TableCell
                  className='bg-gray-100 align-bottom whitespace-nowrap min-w-[80px]'
                  rowSpan={2}
                >
                  Year
                </TableCell>
                <TableCell
                  className='bg-gray-100 align-bottom whitespace-nowrap min-w-[100px]'
                  rowSpan={2}
                >
                  Month
                </TableCell>
                <TableCell
                  className='bg-gray-100 align-bottom whitespace-nowrap min-w-[200px]'
                  rowSpan={2}
                >
                  Project
                </TableCell>
                <TableCell
                  className='bg-gray-100 align-bottom whitespace-nowrap min-w-[150px]'
                  rowSpan={2}
                >
                  Component
                </TableCell>
                <TableCell
                  className='bg-gray-100 align-bottom whitespace-nowrap min-w-[150px]'
                  rowSpan={2}
                >
                  Inclusive Dates
                </TableCell>
                <TableCell
                  className='bg-gray-100 align-bottom whitespace-nowrap min-w-[200px]'
                  rowSpan={2}
                >
                  Activity Name
                </TableCell>
                <TableCell
                  className='bg-gray-100 align-bottom whitespace-nowrap min-w-[200px]'
                  rowSpan={2}
                >
                  Nature of Activity
                </TableCell>
                <TableCell
                  className='bg-gray-100 align-bottom whitespace-nowrap min-w-[100px]'
                  rowSpan={2}
                >
                  No. of Hours
                </TableCell>
                <TableCell
                  className='bg-gray-100 align-bottom whitespace-nowrap min-w-[150px]'
                  rowSpan={2}
                >
                  Initiated By
                </TableCell>
                <TableCell
                  className='bg-gray-100 align-bottom whitespace-nowrap min-w-[120px]'
                  rowSpan={2}
                >
                  Status
                </TableCell>
                <TableCell
                  className='bg-gray-100 align-bottom whitespace-nowrap min-w-[200px]'
                  rowSpan={2}
                >
                  Remarks
                </TableCell>
                <TableCell
                  className='bg-gray-100 align-bottom whitespace-nowrap min-w-[200px]'
                  rowSpan={2}
                >
                  Partnered Institutions
                </TableCell>
                {/* <TableCell
                  className='bg-gray-100 align-bottom whitespace-nowrap min-w-[200px]'
                  rowSpan={2}
                >
                  Beneficiary
                </TableCell> */}
                <TableCell
                  className='bg-gray-100 align-bottom whitespace-nowrap min-w-[120px]'
                  rowSpan={2}
                >
                  No. of Participants
                </TableCell>
                <TableCell
                  className='bg-gray-100 align-bottom whitespace-nowrap min-w-[80px]'
                  rowSpan={2}
                >
                  Male
                </TableCell>
                <TableCell
                  className='bg-gray-100 align-bottom whitespace-nowrap min-w-[80px]'
                  rowSpan={2}
                >
                  Female
                </TableCell>

                <TableCell
                  className='bg-gray-100 align-bottom whitespace-nowrap min-w-[200px]'
                  rowSpan={2}
                >
                  MOVs
                </TableCell>
                <TableCell
                  className='bg-gray-100 align-bottom whitespace-nowrap min-w-[80px]'
                  rowSpan={2}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProjects.map(project => (
                <TableRow key={project.id}>
                  <TableCell className='whitespace-nowrap'>
                    {project.year}
                  </TableCell>
                  <TableCell className='whitespace-nowrap'>
                    {project.month}
                  </TableCell>

                  <TableCell className='whitespace-nowrap'>
                    {project.project}
                  </TableCell>
                  <TableCell className='whitespace-nowrap'>
                    {project.component}
                  </TableCell>

                  <TableCell className='whitespace-nowrap'>
                    {project.inclusiveDates}
                  </TableCell>
                  <TableCell className='whitespace-nowrap'>
                    {project.activityName}
                  </TableCell>
                  <TableCell className='whitespace-nowrap'>
                    {project.natureOfActivity}
                  </TableCell>
                  <TableCell className='whitespace-nowrap'>
                    {project.numberOfHours}
                  </TableCell>
                  <TableCell className='whitespace-nowrap'>
                    {project.initiatedBy}
                  </TableCell>
                  <TableCell className='whitespace-nowrap'>
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                        getStatusColor(project.status).background,
                        getStatusColor(project.status).color
                      )}
                    >
                      {project.status}
                    </span>
                  </TableCell>
                  <TableCell className='whitespace-nowrap'>
                    {project.remarks}
                  </TableCell>
                  <TableCell className='whitespace-nowrap'>
                    {project.partneredInstitutions}
                  </TableCell>
                  {/* <TableCell className='whitespace-nowrap'>
                    {project.beneficiary}
                  </TableCell> */}
                  <TableCell className='whitespace-nowrap'>
                    {project.numberOfParticipants}
                  </TableCell>
                  <TableCell className='whitespace-nowrap'>
                    {project.male}
                  </TableCell>
                  <TableCell className='whitespace-nowrap'>
                    {project.female}
                  </TableCell>
                  <TableCell className='whitespace-nowrap'>
                    {isValidUrl(project.movs) ? (
                      <a
                        href={project.movs}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-600 hover:text-blue-800 hover:underline'
                        title={project.movs}
                      >
                        {formatUrl(project.movs)}
                      </a>
                    ) : (
                      project.movs
                    )}
                  </TableCell>
                  <TableCell className='whitespace-nowrap'>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant='ghost' size='icon'>
                                <MoreVertical className='h-4 w-4' />
                              </Button>
                            </DropdownMenuTrigger>
                          </DropdownMenu>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Manage activity</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
