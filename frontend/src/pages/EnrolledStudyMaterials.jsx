import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { apiConnector } from "../services/apiConnector";
import { FaFilePdf } from "react-icons/fa";
import { toast } from "react-hot-toast";

export default function EnrolledStudyMaterials() {
  const [enrolledMaterials, setEnrolledMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log("Token from Redux:", token);
    console.log("Token from localStorage:", localStorage.getItem('token'));
    fetchEnrolledMaterials();
  }, []);

  const fetchEnrolledMaterials = async () => {
    try {
      setLoading(true);
      const response = await apiConnector("GET", "/study-materials/enrolled");
      console.log("API Response:", response);

      if (response.success) {
        console.log("Enrolled Materials Data:", response.data);
        setEnrolledMaterials(response.data);
      } else {
        toast.error(response.message || "Failed to fetch enrolled materials");
      }
    } catch (error) {
      console.error("Error fetching enrolled materials:", error);
      toast.error("Failed to fetch enrolled materials");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-50"></div>
      </div>
    );
  }

  console.log("Rendering with enrolledMaterials:", enrolledMaterials);

  return (
    <div className="text-white p-8 min-h-screen bg-richblack-900">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-medium mb-8">My Study Materials</h1>
        
        {enrolledMaterials.length === 0 ? (
          <div className="text-center py-12 bg-richblack-800 rounded-lg">
            <p className="text-xl mb-4">You haven't enrolled in any study materials yet</p>
            <p className="text-richblack-300">Browse our study materials and start learning!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledMaterials.map((material) => {
              console.log("Rendering material:", material);
              return (
                <div
                  key={material._id}
                  className="bg-richblack-700 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200"
                >
                  <div className="aspect-video bg-richblack-600 relative">
                    {material.thumbnailUrl ? (
                      <img
                        src={`http://localhost:5000${material.thumbnailUrl}`}
                        alt={material.title}
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
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <h2 className="text-xl font-medium truncate">{material.title}</h2>
                    <p className="text-richblack-300 line-clamp-2">{material.description}</p>
                    
                    <a
                      href={`http://localhost:5000${material.pdfUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full px-4 py-2 bg-yellow-50 text-richblack-900 rounded-lg hover:bg-yellow-25 transition-all duration-200 text-center"
                    >
                      View PDF
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 