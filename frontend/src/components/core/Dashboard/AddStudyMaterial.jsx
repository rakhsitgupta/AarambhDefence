import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { apiConnector } from "../../../services/apiConnector";

export default function AddStudyMaterial() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.profile);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    content: "",
    pdfFile: null,
    thumbnail: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user || !user._id) {
        toast.error("User information not found");
        return;
      }

      // Validate required fields
      if (!formData.title || !formData.description || !formData.price || 
          !formData.category || !formData.content || !formData.pdfFile) {
        toast.error("All fields are required");
        return;
      }

      const formDataToSend = new FormData();
      
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("content", formData.content);
      
      if (formData.pdfFile) {
        formDataToSend.append("pdfFile", formData.pdfFile);
      }
      if (formData.thumbnail) {
        formDataToSend.append("thumbnail", formData.thumbnail);
      }

      const response = await apiConnector("POST", "/study-materials", formDataToSend, {
        "Content-Type": "multipart/form-data",
      });

      if (response.data?.success) {
        toast.success("Study material created successfully");
        navigate("/dashboard/my-study-materials");
      } else {
        toast.error(response.data?.message || "Failed to create study material");
      }
    } catch (error) {
      console.error("Error creating study material:", error);
      toast.error(error.response?.data?.message || "Failed to create study material");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white p-8">
      <h1 className="text-3xl font-medium mb-8">Add New Study Material</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-richblack-700 text-white border border-richblack-500 focus:outline-none focus:border-yellow-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full px-4 py-2 rounded-lg bg-richblack-700 text-white border border-richblack-500 focus:outline-none focus:border-yellow-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-richblack-700 text-white border border-richblack-500 focus:outline-none focus:border-yellow-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows="4"
            className="w-full px-4 py-2 rounded-lg bg-richblack-700 text-white border border-richblack-500 focus:outline-none focus:border-yellow-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Price (₹)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-4 py-2 rounded-lg bg-richblack-700 text-white border border-richblack-500 focus:outline-none focus:border-yellow-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">PDF File</label>
          <input
            type="file"
            name="pdfFile"
            onChange={handleFileChange}
            accept=".pdf"
            required
            className="w-full px-4 py-2 rounded-lg bg-richblack-700 text-white border border-richblack-500 focus:outline-none focus:border-yellow-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Thumbnail (Optional)</label>
          <input
            type="file"
            name="thumbnail"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full px-4 py-2 rounded-lg bg-richblack-700 text-white border border-richblack-500 focus:outline-none focus:border-yellow-50"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2 bg-richblack-700 text-white rounded-lg hover:bg-richblack-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-yellow-50 text-richblack-900 rounded-lg hover:bg-yellow-25 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Study Material"}
          </button>
        </div>
      </form>
    </div>
  );
} 