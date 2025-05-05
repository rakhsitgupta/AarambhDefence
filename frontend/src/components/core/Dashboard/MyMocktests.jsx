import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { apiConnector } from "../../../services/apiConnector";

export default function MyMocktests() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mocktests, setMocktests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMocktests();
  }, []);

  const fetchMocktests = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to view mocktests");
        navigate("/login");
        return;
      }

      const response = await apiConnector("GET", "/mocktests/instructor");
      
      if (response.success) {
        setMocktests(response.data);
      } else {
        toast.error(response.message || "Failed to fetch mocktests");
      }
    } catch (error) {
      console.error("Error fetching mocktests:", error);
      toast.error("Failed to fetch mocktests");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to delete mocktest");
        navigate("/login");
        return;
      }

      const response = await apiConnector("DELETE", `/mocktests/${id}`);
      
      if (response.success) {
        toast.success("Mocktest deleted successfully");
        // Update the UI immediately
        setMocktests(mocktests.filter(mocktest => mocktest._id !== id));
      } else {
        toast.error(response.message || "Failed to delete mocktest");
      }
    } catch (error) {
      console.error("Error deleting mocktest:", error);
      toast.error(error.message || "Failed to delete mocktest");
    }
  };

  const handleView = (id) => {
    navigate(`/dashboard/mocktest/${id}`);
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-medium">My Mocktests</h1>
        <button
          onClick={() => navigate("/dashboard/add-mocktest")}
          className="px-4 py-2 bg-yellow-50 text-richblack-900 rounded-lg hover:bg-yellow-25"
        >
          Add New Mocktest
        </button>
      </div>

      {mocktests.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-xl">No mocktests found</p>
          <button
            onClick={() => navigate("/dashboard/add-mocktest")}
            className="mt-4 px-4 py-2 bg-yellow-50 text-richblack-900 rounded-lg hover:bg-yellow-25"
          >
            Create Your First Mocktest
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mocktests.map((mocktest) => (
            <div
              key={mocktest._id}
              className="bg-richblack-700 rounded-lg p-6 space-y-4"
            >
              {mocktest.thumbnail && (
                <img
                  src={`http://localhost:5000${mocktest.thumbnail}`}
                  alt={mocktest.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
              <h2 className="text-xl font-medium">{mocktest.title}</h2>
              <p className="text-richblack-300">{mocktest.description}</p>
              <p className="text-yellow-50">₹{mocktest.price}</p>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleView(mocktest._id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  View PDF
                </button>
                <button
                  onClick={() => handleDelete(mocktest._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 