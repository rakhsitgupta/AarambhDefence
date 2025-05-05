import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { apiConnector } from "../../../services/apiConnector";

export default function AddMocktest() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    pdfFile: null,
    thumbnail: null
  });

  const handleChange = (e) => {
    if (e.target.name === "pdfFile" || e.target.name === "thumbnail") {
      setFormData({
        ...formData,
        [e.target.name]: e.target.files[0]
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to create a mocktest");
        navigate("/login");
        return;
      }

      // Validate form data
      if (!formData.title || !formData.description || !formData.price || !formData.pdfFile) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Validate file types
      if (formData.pdfFile && !formData.pdfFile.type.includes('pdf')) {
        toast.error("Only PDF files are allowed");
        return;
      }

      if (formData.thumbnail && !formData.thumbnail.type.includes('image')) {
        toast.error("Only image files are allowed for thumbnail");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      
      if (formData.pdfFile) {
        formDataToSend.append("pdfFile", formData.pdfFile);
      }
      
      if (formData.thumbnail) {
        formDataToSend.append("thumbnail", formData.thumbnail);
      }

      const response = await apiConnector("POST", "/mocktests", formDataToSend, {
        "Content-Type": "multipart/form-data",
      });

      if (response.mockTest) {
        toast.success("Mocktest created successfully");
        navigate("/dashboard/my-mocktests");
      } else {
        toast.error(response.message || "Failed to create mocktest");
      }
    } catch (error) {
      console.error("Error creating mocktest:", error);
      toast.error(error.message || "Failed to create mocktest");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white">
      <h1 className="text-3xl font-medium mb-8">Add Mocktest</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter mocktest title"
            className="w-full px-4 py-2 rounded-lg bg-richblack-700 border border-richblack-600 focus:outline-none focus:ring-2 focus:ring-yellow-50"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter mocktest description"
            className="w-full px-4 py-2 rounded-lg bg-richblack-700 border border-richblack-600 focus:outline-none focus:ring-2 focus:ring-yellow-50 min-h-[150px]"
            required
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-2">
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter price"
            className="w-full px-4 py-2 rounded-lg bg-richblack-700 border border-richblack-600 focus:outline-none focus:ring-2 focus:ring-yellow-50"
            required
            min="0"
          />
        </div>

        <div>
          <label htmlFor="pdfFile" className="block text-sm font-medium mb-2">
            PDF File
          </label>
          <input
            type="file"
            id="pdfFile"
            name="pdfFile"
            onChange={handleChange}
            accept=".pdf"
            className="w-full px-4 py-2 rounded-lg bg-richblack-700 border border-richblack-600 focus:outline-none focus:ring-2 focus:ring-yellow-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-richblack-900 hover:file:bg-yellow-25"
            required
          />
          {formData.pdfFile && (
            <p className="mt-2 text-sm text-richblack-300">
              Selected file: {formData.pdfFile.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="thumbnail" className="block text-sm font-medium mb-2">
            Thumbnail (Optional)
          </label>
          <input
            type="file"
            id="thumbnail"
            name="thumbnail"
            onChange={handleChange}
            accept="image/*"
            className="w-full px-4 py-2 rounded-lg bg-richblack-700 border border-richblack-600 focus:outline-none focus:ring-2 focus:ring-yellow-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-richblack-900 hover:file:bg-yellow-25"
          />
          {formData.thumbnail && (
            <div className="mt-2">
              <p className="text-sm text-richblack-300 mb-2">
                Selected thumbnail: {formData.thumbnail.name}
              </p>
              <img
                src={URL.createObjectURL(formData.thumbnail)}
                alt="Thumbnail preview"
                className="max-w-xs rounded-lg"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 rounded-lg bg-yellow-50 text-richblack-900 font-medium hover:bg-yellow-25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating..." : "Create Mocktest"}
        </button>
      </form>
    </div>
  );
} 