import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { apiConnector } from "../../../services/apiConnector";

export default function ViewMocktest() {
  const [mockTest, setMockTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMockTest();
  }, [id]);

  const fetchMockTest = async () => {
    try {
      const response = await apiConnector("GET", `/mocktests/${id}`);
      
      if (response.success) {
        setMockTest(response.data);
      } else {
        if (response.message === "Access denied") {
          toast.error("Please purchase this mock test to view it");
          navigate("/mock-tests");
        } else {
          toast.error(response.message || "Failed to fetch mock test");
        }
      }
    } catch (error) {
      console.error("Error fetching mock test:", error);
      toast.error("Failed to fetch mock test");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  if (!mockTest) {
    return <div className="text-white">Mock test not found</div>;
  }

  return (
    <div className="text-white p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-medium mb-4">{mockTest.title}</h1>
        <p className="text-richblack-300">{mockTest.description}</p>
      </div>

      {mockTest.pdfUrl && (
        <div className="w-full h-[80vh]">
          <iframe
            src={`http://localhost:5000${mockTest.pdfUrl}`}
            className="w-full h-full"
            title={mockTest.title}
          />
        </div>
      )}
    </div>
  );
} 