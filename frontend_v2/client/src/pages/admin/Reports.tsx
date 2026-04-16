import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { DataTable, Column, Action } from '@/components/DataTable';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { adminAPI } from '@/services/api';

interface Report {
  id: string;
  contentType: 'blog' | 'comment';
  contentTitle: string;
  reportedBy: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminAPI.getReports()
      .then((res) => setReports(res.data.reports || []))
      .catch(() => toast.error('Failed to load reports'))
      .finally(() => setIsLoading(false));
  }, []);

  const handleResolve = async (report: Report) => {
    try {
      await adminAPI.resolveReport(report.id, 'resolved');
      setReports((prev) => prev.map((r) => r.id === report.id ? { ...r, status: 'resolved' } : r));
      toast.success('Report marked as resolved');
    } catch { toast.error('Failed to resolve report'); }
  };

  const handleDismiss = async (report: Report) => {
    try {
      await adminAPI.resolveReport(report.id, 'dismissed');
      setReports((prev) => prev.map((r) => r.id === report.id ? { ...r, status: 'dismissed' } : r));
      toast.success('Report dismissed');
    } catch { toast.error('Failed to dismiss report'); }
  };

  const columns: Column<Report>[] = [
    {
      key: 'contentTitle',
      label: 'Content',
      render: (value, row) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-xs text-muted-foreground">
            {row.contentType.charAt(0).toUpperCase() + row.contentType.slice(1)}
          </p>
        </div>
      ),
      width: '25%',
    },
    {
      key: 'reason',
      label: 'Reason',
      render: (value) => <span className="text-sm">{value}</span>,
      width: '25%',
    },
    {
      key: 'reportedBy',
      label: 'Reported By',
      render: (value) => <span className="text-sm">{value}</span>,
      width: '15%',
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
          value === 'pending'
            ? 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300'
            : value === 'resolved'
            ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300'
            : 'bg-gray-100 dark:bg-gray-950 text-gray-700 dark:text-gray-300'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
      width: '15%',
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (value) => (
        <span className="text-sm">
          {new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      ),
      width: '12%',
    },
  ];

  const actions: Action<Report>[] = [
    { label: 'Resolve', onClick: handleResolve },
    { label: 'Dismiss', onClick: handleDismiss },
  ];

  const pendingCount = reports.filter((r) => r.status === 'pending').length;

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto ml-64">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Content Reports</h1>
            <p className="text-muted-foreground mt-1">Review and manage flagged content</p>
          </div>

          {pendingCount > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6 flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-900 dark:text-yellow-100">
                  {pendingCount} pending report{pendingCount !== 1 ? 's' : ''}
                </p>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Please review and take action on pending reports
                </p>
              </div>
            </div>
          )}

          <div className="bg-card border border-border rounded-lg p-6">
            <DataTable
              columns={columns}
              data={reports}
              actions={actions}
              loading={isLoading}
              pagination={{ page: currentPage, total: reports.length, pageSize: 10, onPageChange: setCurrentPage }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
