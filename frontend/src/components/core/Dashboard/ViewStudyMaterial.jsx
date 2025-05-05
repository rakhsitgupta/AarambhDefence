import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

export default function ViewStudyMaterial() {
  const [studyMaterial, setStudyMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudyMaterial();
  }, [id]);

  const fetchStudyMaterial = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/study-materials/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStudyMaterial(data.data);
      } else {
        const data = await response.json();
        if (data.message === "Access denied") {
          toast.error("Please purchase this study material to view it");
          navigate("/study-materials");
        }
      }
    } catch (error) {
      console.error("Error fetching study material:", error);
      toast.error("Failed to fetch study material");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  if (!studyMaterial) {
    return <div className="text-white">Study material not found</div>;
  }

  return (
    <div className="text-white p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-medium mb-4">{studyMaterial.title}</h1>
        <p className="text-richblack-300">{studyMaterial.description}</p>
      </div>

      {studyMaterial.pdfUrl && (
        <div className="w-full h-[80vh]">
          <iframe
            src={studyMaterial.pdfUrl}
            className="w-full h-full"
            title={studyMaterial.title}
          />
        </div>
      )}
    </div>
  );
} 