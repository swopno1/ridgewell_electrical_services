'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Download,
  FileDown,
  Search,
  Loader2,
  Calendar as CalendarIcon,
  ChevronLeft,
  AlertCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  FileQuestion
} from 'lucide-react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { exportToCSV } from '@/actions/report';
import Link from 'next/link';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'sonner';

interface ReportClientProps {
  title: string;
  description: string;
  fetchAction: (startDate: Date, endDate: Date) => Promise<{ success?: boolean; data?: any[]; error?: string }>;
}

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
} | null;

export function ReportClient({ title, description, fetchAction }: ReportClientProps) {
  const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState<'CSV' | 'PDF' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchAction(new Date(startDate), new Date(endDate));
      if (result.success && result.data) {
        setData(result.data);
      } else {
        const errorMsg = result.error || 'Failed to fetch report data';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg = 'An unexpected error occurred while loading data';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, fetchAction]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleExportCSV = async () => {
    if (data.length === 0) return;
    setExporting('CSV');
    try {
      const result = await exportToCSV(data);
      if (result.success && result.data) {
        const blob = new Blob([result.data], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${title.toLowerCase().replace(/\s+/g, '_')}_${startDate}_${endDate}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('CSV exported successfully');
      } else {
        toast.error(result.error || 'Failed to export CSV');
      }
    } catch (err) {
      console.error('CSV Export error:', err);
      toast.error('An unexpected error occurred during CSV export');
    } finally {
      setExporting(null);
    }
  };

  const handleExportPDF = async () => {
    if (data.length === 0) return;
    setExporting('PDF');
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text(title, 14, 22);
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Period: ${startDate} to ${endDate}`, 14, 30);

      const tableColumn = Object.keys(data[0]);
      const tableRows = data.map(item => Object.values(item));

      // @ts-ignore
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 40,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [37, 99, 235] }
      });

      doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}_${startDate}_${endDate}.pdf`);
      toast.success('PDF exported successfully');
    } catch (err) {
      console.error('PDF Export error:', err);
      toast.error('An unexpected error occurred during PDF export');
    } finally {
      setExporting(null);
    }
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Filter
    if (searchTerm) {
      result = result.filter((item) =>
        Object.values(item).some(
          (val) => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Sort
    if (sortConfig) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        // Handle numeric strings
        const aNum = parseFloat(aVal);
        const bNum = parseFloat(bVal);

        if (!isNaN(aNum) && !isNaN(bNum)) {
          return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
        }

        // Default string sort
        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();

        if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, sortConfig]);

  const TableSkeleton = () => (
    <div className="space-y-4 p-6">
      <div className="flex space-x-4 border-b border-slate-100 dark:divide-slate-800/50 pb-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-4 w-24" />
        ))}
      </div>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
        <div key={row} className="flex space-x-4 py-2">
          {[1, 2, 3, 4, 5].map((col) => (
            <Skeleton key={col} className="h-8 w-full" />
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-2 -ml-2 text-slate-500 hover:text-slate-900 dark:hover:text-white"
            render={<Link href="/reports" />}
            aria-label="Back to reports page"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Reports
          </Button>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
          <p className="text-slate-500">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            disabled={loading || data.length === 0 || !!exporting}
            className="flex-1 sm:flex-none"
            aria-label="Export report as CSV"
          >
            {exporting === 'CSV' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
            Export CSV
          </Button>
          <Button
            variant="default"
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white flex-1 sm:flex-none"
            onClick={handleExportPDF}
            disabled={loading || data.length === 0 || !!exporting}
            aria-label="Export report as PDF"
          >
            {exporting === 'PDF' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileDown className="h-4 w-4 mr-2" />}
            Export PDF
          </Button>
        </div>
      </div>

      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">Report Filters</CardTitle>
          <CardDescription>Adjust the date range and search to refine your results.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-10"
                  aria-label="Filter by start date"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-10"
                  aria-label="Filter by end date"
                />
              </div>
            </div>
            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
              <Label htmlFor="search">Quick Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  id="search"
                  placeholder="Search in results..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  aria-label="Search within the report data"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <TableSkeleton />
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded-full mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Failed to load report</h3>
              <p className="text-slate-500 max-w-xs mb-6">{error}</p>
              <Button variant="outline" onClick={loadData}>
                <Loader2 className="mr-2 h-4 w-4" id="retry-loader" style={{ display: 'none' }} />
                Try Again
              </Button>
            </div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-full mb-4">
                <FileQuestion className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">No data found</h3>
              <p className="text-slate-500 max-w-xs">There are no records for the selected period.</p>
            </div>
          ) : filteredAndSortedData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-full mb-4">
                <Search className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">No matches found</h3>
              <p className="text-slate-500 max-w-xs">No records match your search term "{searchTerm}".</p>
              <Button variant="ghost" className="mt-4 text-blue-600" onClick={() => setSearchTerm('')}>
                Clear search
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
                  <tr>
                    {Object.keys(data[0]).map((header) => (
                      <th
                        key={header}
                        scope="col"
                        className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group select-none"
                        onClick={() => handleSort(header)}
                      >
                        <div className="flex items-center">
                          {header}
                          <span className="ml-2">
                            {sortConfig?.key === header ? (
                              sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3 text-blue-600" /> : <ArrowDown className="h-3 w-3 text-blue-600" />
                            ) : (
                              <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-slate-400" />
                            )}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {filteredAndSortedData.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-900/25 transition-colors group"
                    >
                      {Object.values(row).map((val: any, cellIdx) => (
                        <td key={cellIdx} className="px-6 py-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="text-xs text-slate-400 flex items-center justify-between">
        <p>Showing {filteredAndSortedData.length} of {data.length} records</p>
        <p>Sorted by {sortConfig ? `${sortConfig.key} (${sortConfig.direction})` : 'none'}</p>
      </div>
    </div>
  );
}
