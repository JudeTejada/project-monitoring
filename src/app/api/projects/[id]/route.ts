import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Delete all activities associated with the project
    await prisma.activity.deleteMany({
      where: {
        projectId: params.id
      }
    });

    // Delete the project
    await prisma.project.delete({
      where: {
        id: params.id
      }
    });

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, image } = await req.json();

    const project = await prisma.project.update({
      where: {
        id: params.id
      },
      data: {
        name,
        image
      }
    });

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}