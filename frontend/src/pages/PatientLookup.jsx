import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, ArrowLeft, FileSearch } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/label';

export function PatientLookup() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Clean the query by removing slashes, dashes, spaces, and leading zeros
    const cleanSearch = searchQuery.trim().replace(/[\/\-\s]/g, '').replace(/^0+/, '');
    
    // In a real application, this would search the database
    alert(`Searching for: ${cleanSearch}\n\nThis is a demonstration. In production, this would query the patient database.`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6">
            
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <h1 className="text-3xl font-semibold text-[#0F172A] mb-2">
            Patient Record Lookup
          </h1>
          <p className="text-muted-foreground">
            Search for existing patient records by System ID or Hospital Number
          </p>
        </div>

        <Card className="p-8 mb-6">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="search" className="flex items-center gap-2">
                <FileSearch className="w-4 h-4 text-[#E91E63]" />
                System ID or Hospital Number
              </Label>
              <div className="flex gap-3">
                <Input
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g., KCMH-HN1234-A7X2 or HN123456"
                  required
                  className="h-12 text-lg flex-1" />
                
                <Button
                  type="submit"
                  className="h-12 px-8 bg-[#E91E63] hover:bg-[#E91E63]/90 text-white">
                  
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Enter the complete System ID or Hospital Number to retrieve patient information
              </p>
            </div>
          </form>
        </Card>

        <div className="p-6 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
          <div className="text-sm">
            <div className="font-semibold text-blue-900 mb-2">Search Guidelines:</div>
            <ul className="text-blue-800 space-y-1 list-disc list-inside">
              <li>System IDs are in the format: HOSPITAL-HN-CODE (e.g., KCMH-HN1234-A7X2)</li>
              <li>Hospital Numbers typically begin with "HN" followed by digits</li>
              <li>Search results will display full patient enrollment details and current status</li>
              <li>For data protection, only authorized personnel can access patient records</li>
            </ul>
          </div>
        </div>
      </div>
    </div>);

}