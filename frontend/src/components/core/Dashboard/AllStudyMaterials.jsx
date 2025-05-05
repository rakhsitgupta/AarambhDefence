import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function AllStudyMaterials() {
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudyMaterials();
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

  const fetchStudyMaterials = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const cleanToken = token.replace(/['"]+/g, '').trim();
      const response = await fetch("http://localhost:5000/api/v1/study-materials", {
        headers: {
          Authorization: `Bearer ${cleanToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStudyMaterials(data.data);
      }
    } catch (error) {
      console.error("Error fetching study materials:", error);
      toast.error("Failed to fetch study materials");
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async (studyMaterialId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const cleanToken = token.replace(/['"]+/g, '').trim();
      const response = await fetch(`http://localhost:5000/api/v1/study-materials/${studyMaterialId}/enroll`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cleanToken}`,
        },
      });

      if (response.ok) {
        toast.success("Successfully enrolled in study material");
        navigate("/dashboard/enrolled-study-materials");
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to enroll");
      }
    } catch (error) {
      console.error("Error enrolling in study material:", error);
      toast.error("Failed to enroll");
    }
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="text-white p-8">
      <h1 className="text-3xl font-medium mb-8">All Study Materials</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {studyMaterials.map((material) => (
          <div key={material._id} className="bg-richblack-700 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-medium">{material.title}</h2>
            <p className="text-richblack-300 line-clamp-2">{material.description}</p>
            <p className="text-yellow-50">₹{material.price}</p>
            
            {userRole === "student" && (
              <button
                onClick={() => handleBuyNow(material._id)}
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