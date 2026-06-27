import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Job1 from "./Job1";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import FilterCard from "./FilterCard";

const Browse = () => {
  useGetAllJobs();
  const { allJobs } = useSelector((store) => store.job);
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
    };
  }, []);
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto my-10">
        <h1 className="font-bold text-xl my-10">
          Search Results ({allJobs.length})
        </h1>

        <div className="flex gap-8 items-start">
          {/* Left Sidebar */}
          <div className="sticky top-20">
            <FilterCard />
          </div>

          {/* Right Jobs */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allJobs.map((job) => (
                <Job1 key={job._id} job={job} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browse;
