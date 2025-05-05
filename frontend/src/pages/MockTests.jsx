import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { apiConnector } from "../services/apiConnector";
import { FaFilePdf, FaRupeeSign, FaUserGraduate } from "react-icons/fa";

export default function MockTests() {
  const [mockTests, setMockTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMockTests();
  }, []);

  const fetchMockTests = async () => {
    try {
      setLoading(true);
      const response = await apiConnector("GET", "/mocktests");
      
      if (response.mockTests) {
        setMockTests(response.mockTests);
      } else {
        toast.error(response.message || "Failed to fetch mock tests");
      }
    } catch (error) {
      console.error("Error fetching mock tests:", error);
      toast.error("Failed to fetch mock tests");
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async (testId) => {
    if (!token) {
      toast.error("Please login to purchase");
      navigate("/login");
      return;
    }

    try {
      const response = await apiConnector("POST", `/mocktests/${testId}/enroll`);
      
      if (response.message) {
        toast.success("Successfully enrolled in mock test");
        navigate("/dashboard/enrolled-mock-tests");
      } else {
        toast.error(response.message || "Failed to enroll");
      }
    } catch (error) {
      console.error("Error enrolling in mock test:", error);
      toast.error("Failed to enroll");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-50"></div>
      </div>
    );
  }

  return (
    <div className="text-white p-8 min-h-screen bg-richblack-900">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-medium mb-8">Mock Tests</h1>
        
        {mockTests.length === 0 ? (
          <div className="text-center py-12 bg-richblack-800 rounded-lg">
            <p className="text-xl mb-4">No mock tests found</p>
            {user?.accountType === "Instructor" && (
              <button
                onClick={() => navigate("/dashboard/add-mock-test")}
                className="px-4 py-2 bg-yellow-50 text-richblack-900 rounded-lg hover:bg-yellow-25 transition-all duration-200"
              >
                Create Mock Test
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTests.map((test) => (
              <div
                key={test._id}
                className="bg-richblack-700 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200"
              >
                <div className="aspect-video bg-richblack-600 relative">
                  {test.thumbnailUrl ? (
                    <img
                      src={`http://localhost:5000${test.thumbnailUrl}`}
                      alt={test.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-richblack-300">
                      <FaFilePdf className="text-4xl" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-richblack-900 bg-opacity-75 px-2 py-1 rounded text-sm">
                    <FaRupeeSign className="inline mr-1" />
                    {test.price}
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <h2 className="text-xl font-medium truncate">{test.title}</h2>
                  <p className="text-richblack-300 line-clamp-2">{test.description}</p>
                  
                  <div className="flex items-center text-sm text-richblack-300">
                    <FaUserGraduate className="mr-2" />
                    <span>{test.enrolledStudents?.length || 0} students enrolled</span>
                  </div>
                  
                  {user?.accountType === "Student" && (
                    <button
                      onClick={() => handleBuyNow(test._id)}
                      className="w-full px-4 py-2 bg-yellow-50 text-richblack-900 rounded-lg hover:bg-yellow-25 transition-all duration-200"
                    >
                      Buy Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 