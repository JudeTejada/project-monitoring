'use client';

import dynamic from 'next/dynamic';
const ForceGraph3D = dynamic(
  () => import('react-force-graph').then(mod => mod.ForceGraph3D),
  { ssr: false }
);
import { Project } from '@prisma/client';
import { Card } from '@/components/ui/card';
import Script from 'next/script';
import { useState, useEffect } from 'react';

type Node = {
  id: string;
  name: string;
  type: 'project' | 'institution';
  val: number;
};

interface PartnershipNetworkProps {
  projects: Project[];
}

export function PartnershipNetwork({ projects }: PartnershipNetworkProps) {
  console.log("🚀 ~ PartnershipNetwork ~ projects:", projects)
  const [graphData, setGraphData] = useState<{
    nodes: Node[];
    links: { source: string; target: string; value: number }[];
  }>({ nodes: [], links: [] });

  // useEffect(() => {
  //   const nodes: Node[] = [];
  //   const links: { source: string; target: string; value: number }[] = [];
  //   const institutionCounts = new Map<string, number>();

  //   projects.forEach(project => {
  //     // Add project node
  //     const projectNode = {
  //       id: project.id,
  //       name: project.name,
  //       type: 'project' as const,
  //       val: 5
  //     };
  //     nodes.push(projectNode);

  //     // Process institutions
  //     project.partneredInstitutions.forEach(institution => {
  //       const count = institutionCounts.get(institution) || 0;
  //       institutionCounts.set(institution, count + 1);

  //       const institutionNode = nodes.find(n => n.name === institution);
  //       if (!institutionNode) {
  //         nodes.push({
  //           id: institution,
  //           name: institution,
  //           type: 'institution' as const,
  //           val: 8
  //         });
  //       }

  //       links.push({
  //         source: project.id,
  //         target: institution,
  //         value: 1
  //       });
  //     });
  //   });

  //   setGraphData({ nodes, links });
  // }, [projects]);
return null
  return (
    <Card className="p-6">
      <Script src="https://aframe.io/releases/1.2.0/aframe.min.js" strategy="afterInteractive" />
      <h3 className="text-lg font-semibold mb-4">Institutional Partnerships</h3>
      <div className="h-[400px] relative">
        <ForceGraph3D
          graphData={graphData}
          nodeLabel={node => `${node.name}\n${node.type}`}
          nodeAutoColorBy="type"
          linkDirectionalArrowLength={3.5}
          linkDirectionalArrowRelPos={1}
          linkCurvature={0.25}
        />
      </div>
    </Card>
  );
}