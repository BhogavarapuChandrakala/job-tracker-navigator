
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Job, JobStatus } from "@/types/job";
import { 
  Calendar, 
  Link as LinkIcon, 
  Building, 
  Briefcase, 
  Trash2, 
  Edit 
} from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatDistanceToNow } from "date-fns";

interface JobCardProps {
  job: Job;
  onDelete: (id: string) => void;
  onEdit: (job: Job) => void;
  onStatusChange: (id: string, newStatus: JobStatus) => void;
}

const statusColors: Record<JobStatus, string> = {
  Applied: "bg-status-applied",
  Interview: "bg-status-interview",
  Offer: "bg-status-offer",
  Rejected: "bg-status-rejected"
};

const statusOptions: JobStatus[] = ["Applied", "Interview", "Offer", "Rejected"];

const JobCard: React.FC<JobCardProps> = ({ job, onDelete, onEdit, onStatusChange }) => {
  const formattedDate = job.date 
    ? formatDistanceToNow(new Date(job.date), { addSuffix: true })
    : "Unknown date";

  return (
    <Card className="w-full max-w-md shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{job.role}</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <Building className="h-4 w-4" />
              {job.company}
            </CardDescription>
          </div>
          <Badge className={`${statusColors[job.status]} text-white`}>
            {job.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Applied {formattedDate}</span>
          </div>
          
          {job.link && (
            <div className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-blue-500" />
              <a 
                href={job.link.startsWith("http") ? job.link : `https://${job.link}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-500 hover:underline truncate max-w-[90%]"
              >
                Job Link
              </a>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col gap-2 pt-2">
        <div className="flex justify-between w-full items-center">
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => onEdit(job)}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete your job application for {job.role} at {job.company}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => job._id && onDelete(job._id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        <div className="w-full mt-2">
          <div className="text-sm mb-1">Update status:</div>
          <div className="flex gap-1 flex-wrap">
            {statusOptions.map(status => (
              <Button
                key={status}
                size="sm"
                variant={job.status === status ? "default" : "outline"}
                className={job.status === status ? `${statusColors[status]} hover:${statusColors[status]}` : ""}
                onClick={() => job._id && onStatusChange(job._id, status)}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
