import { Activity } from '@prisma/client';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type ExportFormat = 'csv' | 'excel' | 'pdf';
type SortOrder = 'asc' | 'desc';

const monthOrder = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12
};

export const sortByMonth = (data: Activity[], order: SortOrder = 'asc') => {
  return [...data].sort((a, b) => {
    const monthA = monthOrder[a.month.toLowerCase()];
    const monthB = monthOrder[b.month.toLowerCase()];
    return order === 'asc' ? monthA - monthB : monthB - monthA;
  });
};

const formatDataForExport = (activities: Activity[]) => {
  return activities.map(activity => ({
    Year: activity.year,
    Month: activity.month,
    Project: activity.project,
    'Inclusive Dates': activity.inclusiveDates,
    'Activity Name': activity.activityName,
    'Nature of Activity': activity.natureOfActivity,
    'Number of Hours': activity.numberOfHours,
    'Initiated By': activity.initiatedBy,
    Status: activity.status,
    Remarks: activity.remarks,
    'Partnered Institutions': activity.partneredInstitutions,
    'Number of Participants': activity.numberOfParticipants,
    Male: activity.male,
    Female: activity.female,
    Component: activity.component,
    MOVs: activity.movs
  }));
};

export const exportToCSV = (data: Activity[], sortOrder: SortOrder = 'asc') => {
  const sortedData = sortByMonth(data, sortOrder);
  const formattedData = formatDataForExport(sortedData);

  const headers = Object.keys(formattedData[0]);
  const csvContent = [
    headers.join(','),
    ...formattedData.map(row =>
      headers
        .map(
          header =>
            `"${
              row[header as keyof typeof row]?.toString().replace(/"/g, '""') ||
              ''
            }"`
        )
        .join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  return {
    blob,
    filename: `activities_report_${new Date().toISOString().split('T')[0]}.csv`
  };
};

export const exportToExcel = async (
  data: Activity[],
  sortOrder: SortOrder = 'asc'
) => {
  const sortedData = sortByMonth(data, sortOrder);
  const formattedData = formatDataForExport(sortedData);

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Activities');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  return {
    blob,
    filename: `activities_report_${new Date().toISOString().split('T')[0]}.xlsx`
  };
};

export const exportToPDF = async (data: Activity[], sortOrder: SortOrder = 'asc') => {
  const sortedData = sortByMonth(data, sortOrder);
  const formattedData = formatDataForExport(sortedData);

  const doc = new jsPDF('landscape');
  const headers = Object.keys(formattedData[0]);
  const rows = formattedData.map(row =>
    headers.map(header => row[header as keyof typeof row]?.toString() || '')
  );

  // Add header section
  doc.setFillColor(41, 128, 185); // Professional blue color
  doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('Activities Report', 14, 25);

  // Add timestamp
  doc.setFontSize(10);
  doc.text(
    `Generated on: ${new Date().toLocaleString()}`,
    doc.internal.pageSize.width - 14,
    25,
    { align: 'right' }
  );

  // Calculate optimal column widths based on content
  const pageWidth = doc.internal.pageSize.width - 20; // Account for margins
  const totalColumns = headers.length;
  const baseColumnWidth = Math.floor(pageWidth / totalColumns);

  const columnWidths: { [key: number]: { cellWidth: number } } = {};
  headers.forEach((_, index) => {
    columnWidths[index] = { cellWidth: baseColumnWidth };
  });

  // Adjust specific column widths based on content type
  columnWidths[0] = { cellWidth: 15 }; // Year
  columnWidths[1] = { cellWidth: 20 }; // Month
  columnWidths[6] = { cellWidth: 15 }; // Number of Hours
  columnWidths[11] = { cellWidth: 20 }; // Number of Participants
  columnWidths[12] = { cellWidth: 15 }; // Male
  columnWidths[13] = { cellWidth: 15 }; // Female

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 50,
    margin: { top: 50, right: 10, bottom: 20, left: 10 },
    styles: {
      fontSize: 7,
      cellPadding: 2,
      lineColor: [200, 200, 200],
      lineWidth: 0.1,
      overflow: 'linebreak',
      cellWidth: 'wrap'
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle'
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    columnStyles: columnWidths,
    didDrawPage: function(data) {
      // Redraw header on each page
      doc.setFillColor(41, 128, 185);
      doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.text('Activities Report', 14, 25);

      // Add timestamp
      doc.setFontSize(10);
      doc.text(
        `Generated on: ${new Date().toLocaleString()}`,
        doc.internal.pageSize.width - 14,
        25,
        { align: 'right' }
      );

      // Add page number
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${doc.internal.getNumberOfPages()}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }
  });

  const pdfBuffer = doc.output('arraybuffer');
  const blob = new Blob([pdfBuffer], { type: 'application/pdf' });

  return {
    blob,
    filename: `activities_report_${new Date().toISOString().split('T')[0]}.pdf`
  };
};

export const handleExport = async (
  data: Activity[],
  format: ExportFormat,
  sortOrder: SortOrder
) => {
  let result;

  switch (format) {
    case 'csv':
      result = exportToCSV(data, sortOrder);
      break;
    case 'excel':
      result = await exportToExcel(data, sortOrder);
      break;
    case 'pdf':
      result = await exportToPDF(data, sortOrder);
      break;
    default:
      throw new Error('Unsupported export format');
  }

  const link = document.createElement('a');
  const url = URL.createObjectURL(result.blob);
  link.setAttribute('href', url);
  link.setAttribute('download', result.filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
