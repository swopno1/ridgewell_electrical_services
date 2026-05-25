'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, FileDown, Search, Loader2, Calendar as CalendarIcon, ChevronLeft } from 'lucide-react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { exportToCSV } from '@/actions/report';
import Link from 'next/link';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface ReportClientProps {
  title: string;
  description: string;
  fetchAction: (startDate: Date, endDate: Date) => Promise<{ success?: boolean; data?: any[]; error?: string }>;
}

export function ReportClient({ title, description, fetchAction }: ReportClientProps) {
  const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState<'CSV' | 'PDF' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchAction(new Date(startDate), new Date(endDate));
      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.error || 'Failed to fetch report data');
      }
    } catch (err) {
      setError('An unexpected error occurred');
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
      }
    } catch (err) {
      console.error('CSV Export error:', err);
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
    } catch (err) {
      console.error('PDF Export error:', err);
    } finally {
      setExporting(null);
    }
  };

  const filteredData = data.filter((item) =>
    Object.values(item).some(
      (val) => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" className="mb-2 -ml-2 text-slate-500" render={<Link href="/reports" />}>
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
          >
            {exporting === 'CSV' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
            Export CSV
          </Button>
          <Button
            variant="default"
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleExportPDF}
            disabled={loading || data.length === 0 || !!exporting}
          >
            {exporting === 'PDF' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileDown className="h-4 w-4 mr-2" />}
            Export PDF
          </Button>
        </div>
      </div>

      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">Report Filters</CardTitle>
          <CardDescription>Adjust the date range and search to refine your results.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="search">Quick Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  id="search"
                  placeholder="Search in results..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 dark:border-slate-800 overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              <p className="text-slate-500 font-medium">Generating report data...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-500 font-medium">{error}</p>
              <Button variant="outline" className="mt-4" onClick={loadData}>Try Again</Button>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="p-20 text-center text-slate-500">
              {data.length === 0 ? 'No data found for the selected period.' : 'No matches found for your search term.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    {Object.keys(data[0]).map((header) => (
                      <th key={header} scope="col" className="px-6 py-4 font-semibold">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {filteredData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/25 transition-colors">
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
    </div>
  );
}
