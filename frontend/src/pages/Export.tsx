import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown, FileText, File, FileType2, Check, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Export = () => {
  const [exportType, setExportType] = useState<'pdf' | 'excel'>('pdf');
  const [dateRange, setDateRange] = useState('current-month');
  const [contentType, setContentType] = useState('transactions');
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleExport = async () => {
    setIsExporting(true);
    setExportStatus('idle');

    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful export
      setExportStatus('success');
    } catch (error) {
      setExportStatus('error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 dark:text-gray-200">
      <h1 className="text-2xl font-bold tracking-tight">Export Data</h1>
      <p className="text-muted-foreground">
        Export your financial data for record keeping or analysis.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Export Options</CardTitle>
          <CardDescription>
            Choose what data you want to export and in which format.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="format">Format</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="space-y-4 pt-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">What would you like to export?</h3>
                <RadioGroup 
                  defaultValue="transactions" 
                  value={contentType}
                  onValueChange={(value) => setContentType(value)}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                    <RadioGroupItem value="transactions" id="transactions" />
                    <Label htmlFor="transactions" className="flex items-center cursor-pointer">
                      <FileText className="w-4 h-4 mr-2" />
                      Transactions
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                    <RadioGroupItem value="income" id="income" />
                    <Label htmlFor="income" className="flex items-center cursor-pointer">
                      <FileText className="w-4 h-4 mr-2" />
                      Income
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                    <RadioGroupItem value="expenses" id="expenses" />
                    <Label htmlFor="expenses" className="flex items-center cursor-pointer">
                      <FileText className="w-4 h-4 mr-2" />
                      Expenses
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                    <RadioGroupItem value="charts" id="charts" />
                    <Label htmlFor="charts" className="flex items-center cursor-pointer">
                      <FileText className="w-4 h-4 mr-2" />
                      Charts & Reports
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-4 pt-4">
                <h3 className="text-sm font-medium">Time period</h3>
                <Select 
                  value={dateRange}
                  onValueChange={setDateRange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current-month">Current Month</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                    <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                    <SelectItem value="current-year">Current Year</SelectItem>
                    <SelectItem value="last-year">Last Year</SelectItem>
                    <SelectItem value="all-time">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            
            <TabsContent value="format" className="space-y-4 pt-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Export format</h3>
                <RadioGroup 
                  defaultValue="pdf" 
                  value={exportType}
                  onValueChange={(value: 'pdf' | 'excel') => setExportType(value)}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                    <RadioGroupItem value="pdf" id="pdf" />
                    <Label htmlFor="pdf" className="flex items-center cursor-pointer">
                      <File className="w-4 h-4 mr-2 text-red-500" />
                      PDF Document
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                    <RadioGroupItem value="excel" id="excel" />
                    <Label htmlFor="excel" className="flex items-center cursor-pointer">
                      <FileType2 className="w-4 h-4 mr-2 text-green-500" />
                      Excel Spreadsheet
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 flex justify-end">
            <Button 
              onClick={handleExport} 
              disabled={isExporting}
              className="flex items-center"
            >
              <FileDown className="w-4 h-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Export Data'}
            </Button>
          </div>
          
          {exportStatus === 'success' && (
            <Alert className="mt-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertTitle className="text-green-600 dark:text-green-400">Export successful</AlertTitle>
              <AlertDescription className="text-green-600/90 dark:text-green-400/90">
                Your data has been exported successfully. The download should start automatically.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Export History</CardTitle>
          <CardDescription>
            Your recent exports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center">
                {exportType === 'pdf' ? (
                  <File className="w-5 h-5 mr-3 text-red-500" />
                ) : (
                  <FileType2 className="w-5 h-5 mr-3 text-green-500" />
                )}
                <div>
                  <p className="font-medium">Transactions Export</p>
                  <p className="text-sm text-muted-foreground">Current Month</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
            
            <p className="text-sm text-center text-muted-foreground">
              No previous exports found.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Export;
