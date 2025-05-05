import { Link, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { ACCOUNT_TYPE } from "../../../utils/constants";

export default function Dashboard() {
  const { user } = useSelector((state) => state.profile);

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-[250px] bg-richblack-800 py-10">
        <div className="flex flex-col gap-3">
          <Link
            to="/dashboard/my-profile"
            className="text-richblack-300 hover:text-yellow-50 transition-all duration-200 px-8 py-2"
          >
            My Profile
          </Link>
          
          {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Link
                to="/dashboard/add-course"
                className="text-richblack-300 hover:text-yellow-50 transition-all duration-200 px-8 py-2"
              >
                Add Course
              </Link>
              <Link
                to="/dashboard/my-courses"
                className="text-richblack-300 hover:text-yellow-50 transition-all duration-200 px-8 py-2"
              >
                My Courses
              </Link>
              <Link
                to="/dashboard/add-mocktest"
                className="text-richblack-300 hover:text-yellow-50 transition-all duration-200 px-8 py-2"
              >
                Add Mock Test
              </Link>
              <Link
                to="/dashboard/my-mocktests"
                className="text-richblack-300 hover:text-yellow-50 transition-all duration-200 px-8 py-2"
              >
                My Mock Tests
              </Link>
              <Link
                to="/dashboard/add-study-material"
                className="text-richblack-300 hover:text-yellow-50 transition-all duration-200 px-8 py-2"
              >
                Add Study Material
              </Link>
              <Link
                to="/dashboard/my-study-materials"
                className="text-richblack-300 hover:text-yellow-50 transition-all duration-200 px-8 py-2"
              >
                My Study Materials
              </Link>
            </>
          )}

          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Link
                to="/dashboard/enrolled-courses"
                className="text-richblack-300 hover:text-yellow-50 transition-all duration-200 px-8 py-2"
              >
                Enrolled Courses
              </Link>
              <Link
                to="/dashboard/enrolled-mock-tests"
                className="text-richblack-300 hover:text-yellow-50 transition-all duration-200 px-8 py-2"
              >
                Enrolled Mock Tests
              </Link>
              <Link
                to="/dashboard/enrolled-study-materials"
                className="text-richblack-300 hover:text-yellow-50 transition-all duration-200 px-8 py-2"
              >
                Enrolled Study Materials
              </Link>
            </>
          )}

          {/* Common links for all users */}
          <Link
            to="/dashboard/all-study-materials"
            className="text-richblack-300 hover:text-yellow-50 transition-all duration-200 px-8 py-2"
          >
            Study Materials
          </Link>
          <Link
            to="/dashboard/all-mock-tests"
            className="text-richblack-300 hover:text-yellow-50 transition-all duration-200 px-8 py-2"
          >
            Mock Tests
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
} 