import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";

import { Button } from "../ui/button";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../ui/avatar";

import { LogOut, User2 } from "lucide-react";
import { setUser } from "@/redux/authSlice";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  console.log("USER =", user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(setUser(null));
    navigate("/login");
  };

  return (
    <div className="bg-white border-b">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16">

        {/* Logo */}
        <div>
          <Link to="/">
            <h1 className="text-2xl font-bold">
              Job <span className="text-[#022bf8]">Portal</span>
            </h1>
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-10">

          {/* Navigation */}
          <ul className="flex items-center gap-6 font-medium">
            {user && user.role === "Recruiter" ? (
              <>
                <li>
                  <Link to="/admin/companies" className="hover:text-blue-600">
                    Companies
                  </Link>
                </li>

                <li>
                  <Link to="/admin/jobs" className="hover:text-blue-600">
                    Admin Jobs
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/" className="hover:text-blue-600">
                    Home
                  </Link>
                </li>

                <li>
                  <Link to="/browse" className="hover:text-blue-600">
                    Browse
                  </Link>
                </li>

                <li>
                  <Link to="/jobs" className="hover:text-blue-600">
                    Jobs
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Not Logged In */}
          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>

              <Link to="/register">
                <Button className="bg-red-600 hover:bg-red-700">
                  Register
                </Button>
              </Link>
            </div>
          ) : (
            /* Logged In */
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={
                      user?.profile?.profilePhoto ||
                      "https://github.com/shadcn.png"
                    }
                    alt="profile"
                  />
                  <AvatarFallback>
                    {user?.fullname?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>

              <PopoverContent className="w-80">
                <div className="space-y-4">

                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage
                        src={
                          user?.profile?.profilePhoto ||
                          "https://github.com/shadcn.png"
                        }
                      />
                      <AvatarFallback>
                        {user?.fullname?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <h3 className="font-medium">
                        {user?.fullname}
                      </h3>

                      <p className="text-sm text-muted-foreground">
                        {user?.profile?.bio ||
                          "Welcome to Job Portal"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 text-gray-600">

                    {user?.role === "Student" && (
                      <Link to="/profile">
                        <div className="flex items-center gap-2 cursor-pointer">
                          <User2 size={18} />
                          <Button variant="link">Profile</Button>
                        </div>
                      </Link>
                    )}

                    <div
                      onClick={logoutHandler}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut size={18} />
                      <Button variant="link" onClick={logoutHandler}>
                        Logout
                      </Button>
                    </div>

                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;