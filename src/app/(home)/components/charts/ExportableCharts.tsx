'use client';

import { Project } from '@prisma/client';
import { useCallback } from 'react';
import html2canvas from 'html2canvas';
import { ActivitiesChart } from './ActivitiesChart';
import { ParticipantsChart } from './ParticipantsChart';
import { ProjectChart } from './ProjectChart';

export function ExportableCharts({ projects }: { projects: Project[] }) {
  const handleExport = useCallback(async () => {
    const chartsContainer = document.getElementById('charts-container');
    if (!chartsContainer) return;

    try {
      const canvas = await html2canvas(chartsContainer, {
        scale: 2, // Increase quality
        backgroundColor: '#ffffff',
      });

      // Convert to blob
      canvas.toBlob((blob) => {
        if (!blob) return;

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'project-charts.png';
        link.href = url;
        link.click();

        // Cleanup
        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch (error) {
      console.error('Error exporting charts:', error);
    }
  }, []);

  return (
    <div className="space-y-6">
      <button
        onClick={handleExport}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Export Charts as PNG
      </button>

      <div id="charts-container" className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white p-8 rounded-lg">
        <div>
          <h2 className="text-xl font-semibold mb-4">Project Distribution</h2>
          <ProjectChart projects={projects} />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Participants per Project</h2>
          <ParticipantsChart projects={projects} />
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Activities per Project</h2>
          <ActivitiesChart projects={projects} />
        </div>
      </div>
    </div>
  );
}