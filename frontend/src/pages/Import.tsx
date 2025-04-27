import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUp, FileText, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Import = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setUploadStatus('idle');
        setErrorMessage('');
      } else {
        setFile(null);
        setUploadStatus('error');
        setErrorMessage('Only PDF files are supported.');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadStatus('idle');

    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful upload
      setUploadStatus('success');
    } catch (error) {
      setUploadStatus('error');
      setErrorMessage('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 dark:text-gray-200">
      <h1 className="text-2xl font-bold tracking-tight">Import Expenses</h1>
      <p className="text-muted-foreground">
        Import your expenses from PDF statements to track your spending.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Upload PDF Statement</CardTitle>
          <CardDescription>
            Upload your bank statement or credit card statement in PDF format.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg dark:border-gray-700">
            <FileUp className="w-10 h-10 mb-4 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">PDF (MAX. 10MB)</p>
            
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".pdf"
              onChange={handleFileChange}
            />
          </div>

          {file && (
            <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center">
              <FileText className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
              <span className="text-sm truncate flex-1">{file.name}</span>
              <Button 
                onClick={handleUpload} 
                disabled={isUploading}
                size="sm"
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          )}

          {uploadStatus === 'success' && (
            <Alert className="mt-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertTitle className="text-green-600 dark:text-green-400">Upload successful</AlertTitle>
              <AlertDescription className="text-green-600/90 dark:text-green-400/90">
                Your file has been uploaded and is being processed.
              </AlertDescription>
            </Alert>
          )}

          {uploadStatus === 'error' && (
            <Alert className="mt-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertTitle className="text-red-600 dark:text-red-400">Error</AlertTitle>
              <AlertDescription className="text-red-600/90 dark:text-red-400/90">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Import Instructions</CardTitle>
          <CardDescription>
            Follow these steps to import your expenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            <li>Download your statement from your bank or credit card provider in PDF format</li>
            <li>Upload the PDF file using the form above</li>
            <li>Review the imported transactions</li>
            <li>Confirm the import to add these transactions to your account</li>
          </ol>
          <p className="mt-4 text-sm text-muted-foreground">
            Note: We currently support statements from major banks and credit card providers. 
            If your statement format is not recognized, please contact support.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Import;
