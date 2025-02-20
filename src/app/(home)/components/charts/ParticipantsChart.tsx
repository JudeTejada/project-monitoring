'use client';

import { Project } from '@prisma/client';
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#16468F', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'];

export function ParticipantsChart({ projects }: { projects: Project[] }) {
  const chartData = projects.map(project => ({
    name: project.name,
    participants: project.activities.reduce(
      (sum, activity) => sum + activity.numberOfParticipants,
      0
    )
  }));

  return (
    <div className='h-[400px] w-full'>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '8px'
            }}
          />
          <Bar dataKey="participants" fill="#16468F">
            {projects.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}