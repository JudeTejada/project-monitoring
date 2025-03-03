export const getStatusColor = (status: string) => {
  const statusMap: Record<string, { color: string; background: string }> = {
    Ongoing: { color: 'text-blue-700', background: 'bg-blue-100' },
    Completed: { color: 'text-green-700', background: 'bg-green-100' },
    Cancelled: { color: 'text-red-700', background: 'bg-red-100' },
    TENTATIVE: { color: 'text-red-700', background: 'bg-red-100' },
    PENDING: { color: 'text-red-700', background: 'bg-red-100' },
    Postponed: { color: 'text-yellow-700', background: 'bg-yellow-100' },
    Rescheduled: { color: 'text-purple-700', background: 'bg-purple-100' }
  };
  return (
    statusMap[status] || { color: 'text-gray-700', background: 'bg-gray-100' }
  );
};
