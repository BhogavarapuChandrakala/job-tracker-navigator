
import { useState, useEffect } from "react";
import { Job, JobFormData, JobStatus } from "@/types/job";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface JobFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (job: JobFormData) => Promise<void>;
  editJob?: Job;
}

const initialFormData: JobFormData = {
  company: "",
  role: "",
  status: "Applied",
  date: new Date().toISOString().split("T")[0],
  link: "",
};

const statusOptions: JobStatus[] = ["Applied", "Interview", "Offer", "Rejected"];

const JobForm: React.FC<JobFormProps> = ({ open, onClose, onSubmit, editJob }) => {
  const [formData, setFormData] = useState<JobFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (editJob) {
      setFormData({
        company: editJob.company,
        role: editJob.role,
        status: editJob.status,
        date: new Date(editJob.date).toISOString().split("T")[0],
        link: editJob.link,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editJob, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStatusChange = (value: JobStatus) => {
    setFormData({ ...formData, status: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      toast({
        title: editJob ? "Job Updated" : "Job Added",
        description: editJob 
          ? `${formData.role} at ${formData.company} has been updated.` 
          : `${formData.role} at ${formData.company} has been added.`,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editJob ? "update" : "add"} job application.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{editJob ? "Edit Job Application" : "Add New Job Application"}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Company name"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Job title"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleStatusChange(value as JobStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="date">Application Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="link">Job Link (optional)</Label>
              <Input
                id="link"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="https://example.com/job"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : editJob ? "Update Job" : "Add Job"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JobForm;
