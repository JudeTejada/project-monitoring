import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Navbar } from '../../components/common/Navbar';

type Request = {
  requestCode: string;
  stakeholderDate: string;
  project: string;
  actionItems: string;
  status: string;
  remarks: string;
};

export default function RequestPage() {
  const requests: Request[] = [
    {
      requestCode: 'REQ-001',
      stakeholderDate: '2024-01-15',
      project: 'Digital Literacy Program',
      actionItems: 'Review curriculum',
      status: 'Pending',
      remarks: 'Awaiting stakeholder feedback'
    }
    // Add more sample data as needed
  ];

  return (
    <div className='container mx-auto py-10'>
      <Navbar />

      <Table>
        <TableCaption>List of Project Requests</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Request Code</TableHead>
            <TableHead>Stakeholder Date</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Action Items</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Remarks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map(request => (
            <TableRow key={request.requestCode}>
              <TableCell>{request.requestCode}</TableCell>
              <TableCell>{request.stakeholderDate}</TableCell>
              <TableCell>{request.project}</TableCell>
              <TableCell>{request.actionItems}</TableCell>
              <TableCell>{request.status}</TableCell>
              <TableCell>{request.remarks}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
