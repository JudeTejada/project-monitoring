import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { project: projectName, numberOfHours, numberOfParticipants, ...activityData } = data;

    // First, find or create the project
    let project = await prisma.project.findUnique({
      where: {
        name: projectName,
      },
    });

    if (!project) {
      project = await prisma.project.create({
        data: {
          name: projectName,
        },
      });
    }

    // Create the activity with the project relation
    const activity = await prisma.activity.create({
      data: {
        ...activityData,
        numberOfHours: Number(numberOfHours),
        numberOfParticipants: Number(numberOfParticipants),
        project: projectName,
        projectId: project.id,
      },
    });

    return NextResponse.json(activity);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to create activity:', error.message);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create activity' },
      { status: 500 }
    );
  }
}