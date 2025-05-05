import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

export default function EnrolledMockTests() {
  const [mockTests, setMockTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEnrolledMockTests();
  }, []);

  const fetchEnrolledMockTests = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/v1/mocktests/enrolled", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMockTests(data.data);
      }
    } catch (error) {
      console.error("Error fetching enrolled mock tests:", error);
      toast.error("Failed to fetch enrolled mock tests");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (testId) => {
    navigate(`/dashboard/mocktest/${testId}`);
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="text-white p-8">
      <h1 className="text-3xl font-medium mb-8">My Mock Tests</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTests.map((test) => (
          <div key={test._id} className="bg-richblack-700 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-medium">{test.title}</h2>
            <p className="text-richblack-300 line-clamp-2">{test.description}</p>
            
            <button
              onClick={() => handleView(test._id)}
              className="w-full px-4 py-2 bg-yellow-50 text-richblack-900 rounded-lg hover:bg-yellow-25"
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 