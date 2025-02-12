import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Get the activity first to know its project
    const activity = await prisma.activity.findUnique({
      where: { id },
      include: { project_relation: true },
    });

    if (!activity) {
      return NextResponse.json(
        { error: 'Activity not found' },
        { status: 404 }
      );
    }

    // Delete the activity
    await prisma.activity.delete({
      where: { id },
    });

    // Get remaining activities count
    const remainingActivities = await prisma.activity.count({
      where: { projectId: activity.projectId },
    });

    return NextResponse.json({
      message: 'Activity deleted successfully',
      remainingActivities
    });
  } catch (error) {
    console.error('Failed to delete activity:', error);
    return NextResponse.json(
      { error: 'Failed to delete activity' },
      { status: 500 }
    );
  }
}
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const json = await request.json();

    const updatedActivity = await prisma.activity.update({
      where: { id },
      data: json
    });

    return NextResponse.json(updatedActivity);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update activity' },
      { status: 500 }
    );
  }
}
