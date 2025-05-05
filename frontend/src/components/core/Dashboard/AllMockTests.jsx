import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function AllMockTests() {
  const [mockTests, setMockTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMockTests();
    fetchUserRole();
  }, []);

  const fetchUserRole = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const cleanToken = token.replace(/['"]+/g, '').trim();
      const response = await fetch("http://localhost:5000/api/v1/auth/me", {
        headers: {
          Authorization: `Bearer ${cleanToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserRole(data.data.role);
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const fetchMockTests = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const cleanToken = token.replace(/['"]+/g, '').trim();
      const response = await fetch("http://localhost:5000/api/v1/mocktests", {
        headers: {
          Authorization: `Bearer ${cleanToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMockTests(data.data);
      }
    } catch (error) {
      console.error("Error fetching mock tests:", error);
      toast.error("Failed to fetch mock tests");
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async (mockTestId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const cleanToken = token.replace(/['"]+/g, '').trim();
      const response = await fetch(`http://localhost:5000/api/v1/mocktests/${mockTestId}/enroll`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cleanToken}`,
        },
      });

      if (response.ok) {
        toast.success("Successfully enrolled in mock test");
        navigate("/dashboard/enrolled-mock-tests");
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to enroll");
      }
    } catch (error) {
      console.error("Error enrolling in mock test:", error);
      toast.error("Failed to enroll");
    }
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="text-white p-8">
      <h1 className="text-3xl font-medium mb-8">All Mock Tests</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTests.map((test) => (
          <div key={test._id} className="bg-richblack-700 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-medium">{test.title}</h2>
            <p className="text-richblack-300 line-clamp-2">{test.description}</p>
            <p className="text-yellow-50">₹{test.price}</p>
            
            {userRole === "student" && (
              <button
                onClick={() => handleBuyNow(test._id)}
                className="w-full px-4 py-2 bg-yellow-50 text-richblack-900 rounded-lg hover:bg-yellow-25"
              >
                Buy Now
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 