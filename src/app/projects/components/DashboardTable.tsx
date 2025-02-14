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
import { useEffect, useRef, useState, useTransition } from 'react';
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
import { Trash2 } from 'lucide-react';
import { Download } from 'lucide-react';
import { Pencil } from 'lucide-react';
import { AddProjectModal } from './AddProjectModal';

type Props = {
  projects: Activity[];
};
// Add new imports at the top
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export function DashboardTable({ projects }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sortedProjects, setSortedProjects] = useState<Activity[]>(projects);
  const [isDeleting, startTransition] = useTransition();
  // Add new state for time filter
  const [timeFilter, setTimeFilter] = useState<string>('all');

  // Add filter function
  const filterByTime = (projects: Activity[]) => {
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
  };

  useEffect(() => {
    setSortedProjects(filterByTime(projects));
  }, [projects, timeFilter]);

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
  const uniqueProjects = Array.from(new Set(projects.map(p => p.project)));

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
      Beneficiary: project.beneficiary,
      'Number of Participants': project.numberOfParticipants,
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
      <header className='flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b gap-4'>
        <h1 className='text-xl font-semibold'>2025 Activities Monitoring</h1>
        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto'>
          <div className='flex gap-4'>
            <Select onValueChange={handleSort}>
              <SelectTrigger className='w-full sm:w-[180px]'>
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
                <Button variant='outline' className='w-[180px]'>
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

          {/* // Update the buttons section in the header */}
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
            <TableHeader>
              <TableRow>
                <TableCell className='bg-gray-100 align-bottom' rowSpan={2}>
                  Year
                </TableCell>
                <TableCell className='bg-gray-100 align-bottom' rowSpan={2}>
                  Month
                </TableCell>
                <TableCell className='bg-gray-100 align-bottom' rowSpan={2}>
                  Project
                </TableCell>
                <TableCell className='bg-gray-100 align-bottom' rowSpan={2}>
                  Inclusive Dates
                </TableCell>
                <TableCell className='bg-gray-100 align-bottom' rowSpan={2}>
                  Activity Name
                </TableCell>
                <TableCell className='bg-gray-100 align-bottom' rowSpan={2}>
                  Nature of Activity
                </TableCell>
                <TableCell className='bg-gray-100 align-bottom' rowSpan={2}>
                  No. of Hours
                </TableCell>
                <TableCell className='bg-gray-100 align-bottom' rowSpan={2}>
                  Initiated By
                </TableCell>
                <TableCell className='bg-gray-100 align-bottom' rowSpan={2}>
                  Status
                </TableCell>
                <TableCell className='bg-gray-100 align-bottom' rowSpan={2}>
                  Remarks
                </TableCell>
                <TableCell
                  colSpan={4}
                  className='text-center bg-blue-100 font-medium'
                >
                  Actual Accomplishments
                </TableCell>
                <TableCell className='bg-gray-100 align-bottom' rowSpan={2}>
                  Actions
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Partnered Institutions</TableCell>
                <TableCell>Beneficiary</TableCell>
                <TableCell>No. of Participants</TableCell>
                <TableCell>MOVs</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProjects.map(project => (
                <TableRow key={project.id}>
                  <TableCell>{project.year}</TableCell>
                  <TableCell>{project.month}</TableCell>
                  <TableCell>{project.project}</TableCell>
                  <TableCell>{project.inclusiveDates}</TableCell>
                  <TableCell>{project.activityName}</TableCell>
                  <TableCell>{project.natureOfActivity}</TableCell>
                  <TableCell>{project.numberOfHours}</TableCell>
                  <TableCell>{project.initiatedBy}</TableCell>
                  <TableCell>{project.status}</TableCell>
                  <TableCell>{project.remarks}</TableCell>
                  <TableCell>{project.partneredInstitutions}</TableCell>
                  <TableCell>{project.beneficiary}</TableCell>
                  <TableCell>{project.numberOfParticipants}</TableCell>
                  <TableCell>{project.movs}</TableCell>
                  <TableCell className='flex items-center gap-x-3'>
                    <AddActivityModal
                      onActivityAdded={() => window.location.reload()}
                      isEditing={true}
                      initialData={project}
                    />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='hover:bg-destructive/20'
                        >
                          <Trash2 className='h-4 w-4 text-destructive' />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Activity</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this activity? This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            disabled={isDeleting}
                            onClick={() => handleDelete(project.id)}
                            className='bg-destructive hover:bg-destructive/90'
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
