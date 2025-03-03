'use client';

import { Activity, Project } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import html2canvas from 'html2canvas';

interface ReportExporterProps {
  projects: Project[];
  filteredActivities: Activity[];
  totalParticipants: number;
  genderDataByProject: Array<{ male: number; female: number }>;
}

export function ReportExporter({
  projects,
  filteredActivities,
  totalParticipants,
  genderDataByProject
}: ReportExporterProps) {
  const generatePDF = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    let y = page.getHeight() - 50;
    const addText = (text: string, size: number) => {
      page.drawText(text, { x: 50, y, size, font });
      y -= size + 10;
    };

    // Report Header
    addText('Project Monitoring Executive Report', 18);
    addText(`Generated: ${new Date().toLocaleDateString()}`, 12);
    y -= 30;

    // Project Summary
    addText('Project Overview:', 14);
    addText(`- Total Projects: ${projects.length}`, 12);
    addText(`- Total Activities: ${filteredActivities.length}`, 12);
    addText(`- Total Participants: ${totalParticipants}`, 12);
    y -= 20;

    // Gender Statistics
    addText('Gender Distribution:', 14);
    genderDataByProject.forEach(({ male, female }, index) => {
      addText(`Project ${index + 1}: Male ${male} - Female ${female}`, 12);
    });
    y -= 20;

    // Activity Hours
    addText('Activity Hours Breakdown:', 14);
    filteredActivities.forEach(activity => {
      addText(`${activity.activityName}: ${activity.numberOfHours} hours`, 12);
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'project-report.pdf';
    link.click();
  };

  const generateCSV = () => {
    const csvContent = [
      ['Metric', 'Value'],
      ['Total Projects', projects.length],
      ['Total Activities', filteredActivities.length],
      ['Total Participants', totalParticipants],
      [],
      ['Project', 'Male', 'Female']
    ];

    genderDataByProject.forEach(({ male, female }, index) => {
      csvContent.push([
        `Project ${index + 1}`,
        male.toString(),
        female.toString()
      ]);
    });

    csvContent.push([], ['Activity Name', 'Hours', 'Participants', 'Status']);

    filteredActivities.forEach(activity => {
      csvContent.push([
        activity.activityName,
        activity.numberOfHours.toString(),
        activity.numberOfParticipants.toString(),
        activity.status
      ]);
    });

    const csvString = csvContent.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'project-data.csv';
    link.click();
  };

  const handleExport = async () => {
    const element = document.getElementById('bento-grid');
    if (!element) return;

    try {
      const canvas = await html2canvas(element);
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'dashboard.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className='flex gap-4 flex-col md:flex-row w-full'>
      <Button onClick={generatePDF} variant='outline'>
        <Download className='mr-2 h-4 w-4' />
        PDF Report
      </Button>
      <Button onClick={generateCSV} variant='outline'>
        <Download className='mr-2 h-4 w-4' />
        CSV Data
      </Button>

      <Button onClick={handleExport} variant='outline'>
        <Download className='mr-2 h-4 w-4' />
        Export Dashboard
      </Button>
    </div>
  );
}
