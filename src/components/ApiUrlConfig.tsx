
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// This component is only for development and testing
// It allows setting the API URL without hard-coding it

const API_URL_KEY = "https://job-tracker-backend-ry8d.onrender.com";

export const getApiUrl = (): string => {
  if (typeof window === "undefined") return "";
  
  // Try to get from localStorage first
  const saved = localStorage.getItem(API_URL_KEY);
  if (saved) return saved;
  
  // Default URL - replace with your production backend URL when deploying
  return "https://job-tracker-backend-ry8d.onrender.com/api/jobs";
};

export const setApiUrl = (url: string): void => {
  localStorage.setItem(API_URL_KEY, url);
};

interface ApiUrlConfigProps {
  onSave: (url: string) => void;
}

const ApiUrlConfig: React.FC<ApiUrlConfigProps> = ({ onSave }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState(getApiUrl());

  const handleSave = () => {
    setApiUrl(url);
    onSave(url);
    setIsOpen(false);
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="fixed bottom-4 right-4 bg-white shadow-md"
        onClick={() => setIsOpen(true)}
      >
        Configure API
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Backend API URL</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-500">
              Enter your deployed backend URL (including /api/jobs path)
            </p>
            
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-backend-url.onrender.com/api/jobs"
            />
            
            <p className="text-xs text-gray-400">
              This will be saved in your browser's localStorage
            </p>
          </div>
          
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save & Use This URL
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApiUrlConfig;
