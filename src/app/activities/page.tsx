import DashboardView from './components/DashboardView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
  return <DashboardView />;
}
