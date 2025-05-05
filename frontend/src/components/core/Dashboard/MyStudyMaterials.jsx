import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { apiConnector } from "../../../services/apiConnector";

export default function MyStudyMaterials() {
  const navigate = useNavigate();
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudyMaterials();
  }, []);

  const fetchStudyMaterials = async () => {
    try {
      setLoading(true);
      const response = await apiConnector("GET", "/study-materials/instructor");
      console.log('Study materials response:', response); // Debug log
      
      if (response.studyMaterials) {
        setStudyMaterials(response.studyMaterials || []);
      } else {
        toast.error(response.message || "Failed to fetch study materials");
        setStudyMaterials([]);
      }
    } catch (error) {
      console.error("Error fetching study materials:", error);
      toast.error(error.message || "Failed to fetch study materials");
      setStudyMaterials([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await apiConnector("DELETE", `/study-materials/${id}`);
      
      if (response.message) {
        toast.success("Study material deleted successfully");
        setStudyMaterials(prev => prev.filter(material => material._id !== id));
      } else {
        toast.error(response.message || "Failed to delete study material");
      }
    } catch (error) {
      console.error("Error deleting study material:", error);
      toast.error(error.message || "Failed to delete study material");
    }
  };

  const handleView = (material) => {
    if (material.pdfUrl) {
      const pdfUrl = `http://localhost:5000${material.pdfUrl}`;
      console.log('Opening PDF:', pdfUrl); // Debug log
      
      // Create a modal to display the PDF
      const modal = document.createElement('div');
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100%';
      modal.style.height = '100%';
      modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
      modal.style.zIndex = '1000';
      modal.style.display = 'flex';
      modal.style.flexDirection = 'column';
      modal.style.alignItems = 'center';
      modal.style.justifyContent = 'center';
      
      // Create close button
      const closeButton = document.createElement('button');
      closeButton.textContent = 'Close';
      closeButton.style.position = 'absolute';
      closeButton.style.top = '20px';
      closeButton.style.right = '20px';
      closeButton.style.padding = '10px 20px';
      closeButton.style.backgroundColor = 'red';
      closeButton.style.color = 'white';
      closeButton.style.border = 'none';
      closeButton.style.borderRadius = '5px';
      closeButton.style.cursor = 'pointer';
      closeButton.onclick = () => {
        document.body.removeChild(modal);
      };
      
      // Create iframe for PDF
      const iframe = document.createElement('iframe');
      iframe.src = pdfUrl;
      iframe.style.width = '80%';
      iframe.style.height = '80%';
      iframe.style.border = 'none';
      iframe.style.borderRadius = '10px';
      
      // Add elements to modal
      modal.appendChild(closeButton);
      modal.appendChild(iframe);
      
      // Add modal to body
      document.body.appendChild(modal);
    } else {
      toast.error('PDF URL not found');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="text-white p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-medium">My Study Materials</h1>
        <button
          onClick={() => navigate("/dashboard/add-study-material")}
          className="px-4 py-2 bg-yellow-50 text-richblack-900 rounded-lg hover:bg-yellow-25 transition-all duration-200"
        >
          Add New Study Material
        </button>
      </div>

      {studyMaterials.length === 0 ? (
        <div className="text-center py-12 bg-richblack-800 rounded-lg">
          <p className="text-xl mb-4">No study materials found</p>
          <button
            onClick={() => navigate("/dashboard/add-study-material")}
            className="px-4 py-2 bg-yellow-50 text-richblack-900 rounded-lg hover:bg-yellow-25 transition-all duration-200"
          >
            Create Your First Study Material
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studyMaterials.map((material) => (
            <div
              key={material._id}
              className="bg-richblack-700 rounded-lg p-6 space-y-4 hover:shadow-lg transition-all duration-200"
            >
              <div className="aspect-video bg-richblack-600 rounded-lg overflow-hidden">
                {material.thumbnailUrl ? (
                  <img
                    src={material.thumbnailUrl}
                    alt={material.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Error loading image:', e);
                      e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-richblack-300">
                    No Thumbnail
                  </div>
                )}
              </div>
              <h2 className="text-xl font-medium truncate">{material.title}</h2>
              <p className="text-richblack-300 line-clamp-2">{material.description}</p>
              <p className="text-yellow-50 font-medium">₹{material.price}</p>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleView(material)}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
                >
                  View PDF
                </button>
                <button
                  onClick={() => handleDelete(material._id)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
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