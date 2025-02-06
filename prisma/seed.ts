import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const sampleProjects = [
    {
      year: '2024',
      month: 'January',
      project: 'Digital Literacy Program',
      inclusiveDates: 'Jan 1-15, 2024',
      activityName: 'Basic Computer Training',
      natureOfActivity: 'Training',
      numberOfHours: 40,
      initiatedBy: 'DICT Region 1',
      status: 'Completed',
      remarks: 'Successfully conducted',
      partneredInstitutions: 'Local University',
      beneficiary: 'Senior Citizens',
      numberOfParticipants: 30,
      movs: 'Photos, Attendance Sheets'
    }
    // Add more sample data as needed
  ];

  for (const project of sampleProjects) {
    await prisma.project.create({
      data: project
    });
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
