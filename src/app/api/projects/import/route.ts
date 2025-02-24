import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (file.type !== 'text/csv') {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a CSV file.' },
        { status: 400 }
      );
    }

    const csvContent = await file.text();
    const records = parse(csvContent, {
      columns: headers => {
        return headers
          .filter(header => header !== '')
          .map(header => {
            switch (header) {
              case 'ACTUAL ACCOMPLISHMENTS':
                return 'project';
              case 'No of Hours':
                return 'numberOfHours';
              case 'No. of Participants':
                return 'numberOfParticipants';
              case 'MOVs':
                return 'movs';
              case 'Inclusive Dates':
                return 'inclusiveDates';
              case 'Activity Name':
                return 'activityName';
              case 'Nature of Activity':
                return 'natureOfActivity';
              case 'Initiated by':
                return 'initiatedBy';
              case 'Partnered Institutions':
                return 'partneredInstitutions';
              case 'Component':
                return 'component';
              default:
                return header.toLowerCase();
            }
          });
      },
      skip_empty_lines: true,
      trim: true,
      from_line: 2
    });

    // Get unique project names from records, excluding empty strings
    const projectNames = [
      ...new Set(
        records.map(record => record.project).filter(name => name.trim() !== '')
      )
    ] as string[];

    // Create projects for each unique project name
    const projectPromises = projectNames.map(projectName =>
      prisma.project.upsert({
        where: { name: projectName },
        update: {},
        create: { name: projectName }
      })
    );

    const createdProjects = await Promise.all(projectPromises);
    const projectMap = new Map(createdProjects.map(p => [p.name, p.id]));

    // Validate and transform the data, filtering out records with missing required fields
    const validatedRecords = records
      .filter(record => {
        const hasRequiredFields =
          record.year?.trim() !== '' &&
          record.month?.trim() !== '' &&
          record.project?.trim() !== '';
        return hasRequiredFields;
      })
      .map(record => ({
        year: record.year || new Date().getFullYear().toString(),
        month: record.month || '',
        project: record.project || '',
        inclusiveDates: record.inclusiveDates || '',
        activityName: record.activityName || '',
        natureOfActivity: record.natureOfActivity || '',
        numberOfHours:
          typeof record.numberOfHours === 'string'
            ? parseInt(record.numberOfHours) || 0
            : 0,
        initiatedBy: record.initiatedBy || '',
        status: record.status || 'PENDING',
        remarks: record.remarks || '',
        partneredInstitutions: record.partneredInstitutions || '',
        beneficiary: record.beneficiary || '',
        numberOfParticipants:
          typeof record.numberOfParticipants === 'string'
            ? parseInt(record.numberOfParticipants) || 0
            : 0,
        male: typeof record.male === 'string' ? parseInt(record.male) || 0 : 0,
        female: typeof record.female === 'string' ? parseInt(record.female) || 0 : 0,
        component: record.component || '',
        movs: record.movs || '',
        projectId: projectMap.get(record.project) // Link each activity to its corresponding project
      }));

    const activities = await prisma.activity.createMany({
      data: validatedRecords
    });

    return NextResponse.json({
      success: true,
      count: activities.count,
      projects: createdProjects.length
    });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: 'Failed to import activities' },
      { status: 500 }
    );
  }
}
