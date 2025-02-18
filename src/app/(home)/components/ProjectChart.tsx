'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Project } from '@prisma/client';

const COLORS = ['#16468F', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'];

export function ProjectChart({ projects }: { projects: Project[] }) {
  const chartData = projects.map(project => ({
    name: project.name,
    value: project._count.activities,
    participants: project.activities.reduce(
      (sum, activity) => sum + activity.numberOfParticipants,
      0
    )
  }));

  return (
    <div className='h-[400px] w-full'>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={160}
            paddingAngle={5}
            label={entry => entry.name}
            labelLine={{ stroke: '#666666', strokeWidth: 1 }}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="#ffffff"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, entry) => [
              `Activities: ${value}, Participants: ${entry.payload.participants}`,
              entry.payload.name
            ]}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '8px'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
