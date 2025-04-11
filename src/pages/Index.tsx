
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Job, JobStatus, JobFormData } from "@/types/job";
import { fetchJobs, createJob, updateJob, deleteJob } from "@/services/api";
import JobCard from "@/components/JobCard";
import JobForm from "@/components/JobForm";
import JobFilter from "@/components/JobFilter";
import Header from "@/components/Header";
import EmptyState from "@/components/EmptyState";
import ApiUrlConfig from "@/components/ApiUrlConfig";
import { Loader2 } from "lucide-react";

// Status counters component
const StatusCounters = ({ jobs }: { jobs: Job[] }) => {
  const counts = {
    Applied: jobs.filter(job => job.status === "Applied").length,
    Interview: jobs.filter(job => job.status === "Interview").length,
    Offer: jobs.filter(job => job.status === "Offer").length,
    Rejected: jobs.filter(job => job.status === "Rejected").length,
  };

  const statusColors = {
    Applied: "bg-status-applied",
    Interview: "bg-status-interview",
    Offer: "bg-status-offer",
    Rejected: "bg-status-rejected"
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      {Object.entries(counts).map(([status, count]) => (
        <div key={status} className="bg-white rounded-lg shadow p-4 text-center">
          <div className="flex justify-center">
            <div className={`${statusColors[status as JobStatus]} w-3 h-3 rounded-full mt-1 mr-2`}></div>
            <h3 className="font-medium">{status}</h3>
          </div>
          <p className="text-2xl font-bold">{count}</p>
        </div>
      ))}
    </div>
  );
};

const Dashboard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingJob, setEditingJob] = useState<Job | undefined>(undefined);
  const [filters, setFilters] = useState<{
    status?: JobStatus;
    dateSort?: string;
  }>({
    dateSort: "newest",
  });
  
  const { toast } = useToast();

  // Fetch jobs from API
  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await fetchJobs();
      setJobs(data);
      setError(null);
    } catch (err) {
      setError("Failed to load jobs. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to load jobs. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load jobs on component mount
  useEffect(() => {
    loadJobs();
  }, []);

  // Filter and sort jobs when jobs or filters change
  useEffect(() => {
    let result = [...jobs];
    
    // Apply status filter
    if (filters.status) {
      result = result.filter(job => job.status === filters.status);
    }
    
    // Apply date sort
    if (filters.dateSort) {
      result.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return filters.dateSort === "newest" ? dateB - dateA : dateA - dateB;
      });
    }
    
    setFilteredJobs(result);
  }, [jobs, filters]);

  // Handle job submission (create or update)
  const handleJobSubmit = async (formData: JobFormData) => {
    try {
      if (editingJob && editingJob._id) {
        const updated = await updateJob(editingJob._id, formData);
        setJobs(jobs.map(job => job._id === editingJob._id ? updated : job));
      } else {
        const newJob = await createJob(formData);
        setJobs([...jobs, newJob]);
      }
      setEditingJob(undefined);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // Handle job deletion
  const handleDeleteJob = async (id: string) => {
    try {
      await deleteJob(id);
      setJobs(jobs.filter(job => job._id !== id));
      toast({
        title: "Job Deleted",
        description: "The job application has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete job application.",
        variant: "destructive",
      });
    }
  };

  // Handle status change
  const handleStatusChange = async (id: string, newStatus: JobStatus) => {
    try {
      const updated = await updateJob(id, { status: newStatus });
      setJobs(jobs.map(job => job._id === id ? updated : job));
      toast({
        title: "Status Updated",
        description: `Job status updated to ${newStatus}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update job status.",
        variant: "destructive",
      });
    }
  };

  // Open form for editing a job
  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setIsFormOpen(true);
  };

  // Handle API URL change
  const handleApiUrlChange = () => {
    loadJobs();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAddJobClick={() => {
        setEditingJob(undefined);
        setIsFormOpen(true);
      }} />
      
      <main className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 my-8">
            <p>{error}</p>
            <button 
              onClick={loadJobs}
              className="mt-4 text-purple-600 hover:text-purple-800 underline"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {jobs.length > 0 ? (
              <>
                <StatusCounters jobs={jobs} />
                
                <JobFilter 
                  onFilterChange={setFilters}
                />

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredJobs.map((job) => (
                    <JobCard
                      key={job._id}
                      job={job}
                      onDelete={handleDeleteJob}
                      onEdit={handleEditJob}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>

                {filteredJobs.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No matching job applications found.</p>
                  </div>
                )}
              </>
            ) : (
              <div className="flex justify-center items-center min-h-[400px]">
                <EmptyState onAddJobClick={() => setIsFormOpen(true)} />
              </div>
            )}
          </>
        )}

        <JobForm
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleJobSubmit}
          editJob={editingJob}
        />
        
        {/* API URL Configuration component */}
        <ApiUrlConfig onSave={handleApiUrlChange} />
      </main>
    </div>
  );
};

export default Dashboard;
