import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const AdminJobsTable = () => {
  const { companies, searchCompanyByText } = useSelector(
    (store) => store.company
  );
  const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);
  const navigate = useNavigate();

  const [filterJobs, setFilterJobs] = useState(allAdminJobs);

  useEffect(() => {
    const filteredJobs =
      allAdminJobs.length >= 0 &&
      allAdminJobs.filter((job) => {
        if (!searchJobByText) {
          return true;
        }
        return (
          job.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
          job?.company?.name
            .toLowerCase()
            .includes(searchJobByText.toLowerCase())
        );
      });
    setFilterJobs(filteredJobs);
  }, [allAdminJobs, searchJobByText]);

  console.log("COMPANIES", companies);
  if (!companies) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Table>
        <TableCaption>Your recent Posted Jobs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filterJobs.length === 0 ? (
            <span>No Job Added</span>
          ) : (
            filterJobs?.map((job) => (
              <TableRow key={job.id}>
                <TableCell>{job?.company?.name}</TableCell>
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.createdAt ? job.createdAt.split("T")[0] : "N/A"}</TableCell>
                <TableCell className="text-right cursor-pointer">
                  <Popover>
                    <PopoverTrigger>
                      <MoreHorizontal />
                    </PopoverTrigger>
                    <PopoverContent className="w-32">

                      {/* <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => navigate(`/admin/jobs/${job._id}`)}
                      >
                        <Edit2 className="w-4" />
                        <span>Edit</span>
                      </div> */}

                      <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                      >
                        <Eye className="w-4" />
                        <span>Applicants</span>
                      </div>

                      <div
                        className="flex items-center gap-2 cursor-pointer text-red-600"
                        onClick={() => deleteJobHandler(job._id)}
                      >
                        <Trash2 className="w-4" />
                        <span>Delete</span>
                      </div>

                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
const deleteJobHandler = async (jobId) => {
  try {
    const res = await axios.delete(
      `http://localhost:5011/api/v1/job/delete/${jobId}`,
      {
        withCredentials: true,
      }
    );

    if (res.data.success) {
      toast.success(res.data.message);

      window.location.reload();
    }

  } catch (error) {
    toast.error(error.response?.data?.message || "Delete failed");
  }
};

export default AdminJobsTable;
