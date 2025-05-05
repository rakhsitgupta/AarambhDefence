import { useEffect, useState } from "react";
import { Route, Routes, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import AboutFounders from "./pages/AboutFounders";
import Contact from "./pages/Contact";
import PageNotFound from "./pages/PageNotFound";
import CourseDetails from './pages/CourseDetails';
import Catalog from './pages/Catalog';

import Navbar from "./components/common/Navbar"

import OpenRoute from "./components/core/Auth/OpenRoute"
import ProtectedRoute from "./components/core/Auth/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import MyProfile from "./components/core/Dashboard/MyProfile";
import Settings from "./components/core/Dashboard/Settings/Settings";
import MyCourses from './components/core/Dashboard/MyCourses';
import EditCourse from './components/core/Dashboard/EditCourse/EditCourse';
import Instructor from './components/core/Dashboard/Instructor';
import TaskPlanner from './pages/Dashboard/TaskPlanner';

import Cart from "./components/core/Dashboard/Cart/Cart";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import AddCourse from "./components/core/Dashboard/AddCourse/AddCourse";

import ViewCourse from "./pages/ViewCourse";
import VideoDetails from './components/core/ViewCourse/VideoDetails';

import { ACCOUNT_TYPE } from './utils/constants';

import { HiArrowNarrowUp } from "react-icons/hi"
import CreateCategory from "./components/core/Dashboard/CreateCategory";
import AllStudents from './components/core/Dashboard/AllStudents';
import AllInstructors from './components/core/Dashboard/AllInstructors';
import AddMocktest from "./components/core/Dashboard/AddMocktest";
import MyMocktests from "./components/core/Dashboard/MyMocktests";
import ViewMocktest from "./components/core/Dashboard/ViewMocktest";
import AddStudyMaterial from "./components/core/Dashboard/AddStudyMaterial";
import MyStudyMaterials from "./components/core/Dashboard/MyStudyMaterials";
import ViewStudyMaterial from "./components/core/Dashboard/ViewStudyMaterial";
import AllStudyMaterials from "./components/core/Dashboard/AllStudyMaterials";
import AllMockTests from "./components/core/Dashboard/AllMockTests";
import MockTests from "./pages/MockTests";
import StudyMaterials from "./pages/StudyMaterials";
import EnrolledStudyMaterials from "./pages/EnrolledStudyMaterials";
import EnrolledMockTests from "./components/core/Dashboard/EnrolledMockTests";


function App() {

  const { user } = useSelector((state) => state.profile)

  // Scroll to the top of the page when the component mounts
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname])

  useEffect(() => {
    scrollTo(0, 0);
  }, [location])

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])


  // Go upward arrow - show , unshow
  const [showArrow, setShowArrow] = useState(false)

  const handleArrow = () => {
    if (window.scrollY > 500) {
      setShowArrow(true)
    } else setShowArrow(false)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleArrow);
    return () => {
      window.removeEventListener('scroll', handleArrow);
    }
  }, [showArrow])


  return (
    <AuthProvider>
      <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
        <Navbar />

        {/* go upward arrow */}
        <button onClick={() => window.scrollTo(0, 0)}
          className={`bg-yellow-25 hover:bg-yellow-50 hover:scale-110 p-3 text-lg text-black rounded-2xl fixed right-3 z-10 duration-500 ease-in-out ${showArrow ? 'bottom-6' : '-bottom-24'} `} >
          <HiArrowNarrowUp />
        </button>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/about-founders" element={<AboutFounders />} />
          <Route path="catalog/:catalogName" element={<Catalog />} />
          <Route path="courses/:courseId" element={<CourseDetails />} />

          {/* Open Route - for Only Non Logged in User */}
          <Route
            path="signup" element={
              <OpenRoute>
                <Signup />
              </OpenRoute>
            }
          />

          <Route
            path="login" element={
              <OpenRoute>
                <Login />
              </OpenRoute>
            }
          />

          <Route
            path="forgot-password" element={
              <OpenRoute>
                <ForgotPassword />
              </OpenRoute>
            }
          />

          <Route
            path="verify-email" element={
              <OpenRoute>
                <VerifyEmail />
              </OpenRoute>
            }
          />

          <Route
            path="update-password/:id" element={
              <OpenRoute>
                <UpdatePassword />
              </OpenRoute>
            }
          />




          {/* Protected Route - for Only Logged in User */}
          {/* Dashboard */}
          <Route element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
          >
            <Route path="dashboard/my-profile" element={<MyProfile />} />
            <Route path="dashboard/settings" element={<Settings />} />
            <Route path="dashboard/instructor" element={<Instructor />} />
            <Route path="dashboard/my-courses" element={<MyCourses />} />
            <Route path="dashboard/add-course" element={<AddCourse />} />
            <Route path="dashboard/add-mocktest" element={<AddMocktest />} />
            <Route path="dashboard/my-mocktests" element={<MyMocktests />} />
            <Route path="dashboard/my-study-materials" element={<MyStudyMaterials />} />
            <Route path="dashboard/edit-course/:courseId" element={<EditCourse />} />
            <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />
            <Route path="dashboard/cart" element={<Cart />} />
            <Route path="dashboard/task-planner" element={<TaskPlanner />} />
            <Route path="dashboard/categories" element={<CreateCategory />} />
            <Route path="dashboard/all-students" element={<AllStudents />} />
            <Route path="dashboard/all-instructors" element={<AllInstructors />} />
            <Route path="dashboard/mocktest/:id" element={<ViewMocktest />} />
            <Route path="dashboard/add-study-material" element={
              <ProtectedRoute>
                <AddStudyMaterial />
              </ProtectedRoute>
            } />
            <Route path="dashboard/study-material/:id" element={
              <ProtectedRoute>
                <ViewStudyMaterial />
              </ProtectedRoute>
            } />
            <Route path="dashboard/all-study-materials" element={<AllStudyMaterials />} />
            <Route path="dashboard/all-mock-tests" element={<AllMockTests />} />
            <Route path="dashboard/enrolled-study-materials" element={
              <ProtectedRoute>
                <EnrolledStudyMaterials />
              </ProtectedRoute>
            } />
            <Route path="dashboard/enrolled-mock-tests" element={<EnrolledMockTests />} />
          </Route>


          {/* For the watching course lectures */}
          <Route
            element={
              <ProtectedRoute>
                <ViewCourse />
              </ProtectedRoute>
            }
          >
            {user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <Route
                path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                element={<VideoDetails />}
              />
            )}
          </Route>

          {/* Public routes for viewing all study materials and mock tests */}
          <Route path="/study-materials" element={<StudyMaterials />} />
          <Route path="/mock-tests" element={<MockTests />} />

          {/* Page Not Found (404 Page ) */}
          <Route path="*" element={<PageNotFound />} />

        </Routes>

      </div>
    </AuthProvider>
  );
}

export default App;
