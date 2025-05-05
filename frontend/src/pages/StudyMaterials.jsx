import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { apiConnector } from "../services/apiConnector";
import { FaFilePdf, FaRupeeSign } from "react-icons/fa";

export default function StudyMaterials() {
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudyMaterials();
  }, []);

  const fetchStudyMaterials = async () => {
    try {
      setLoading(true);
      const response = await apiConnector("GET", "/study-materials");
      
      if (response.success) {
        setStudyMaterials(response.data);
      } else {
        toast.error(response.message || "Failed to fetch study materials");
      }
    } catch (error) {
      console.error("Error fetching study materials:", error);
      toast.error("Failed to fetch study materials");
    } finally {
      setLoading(false);
    }
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handleBuyNow = async (material) => {
    if (!token) {
      toast.error("Please login to purchase");
      navigate("/login");
      return;
    }

    try {
      // Load Razorpay script
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!res) {
        toast.error("Razorpay SDK failed to load");
        return;
      }

      // Get order details from backend
      const orderResponse = await apiConnector("POST", "/study-materials/create-order", {
        materialId: material._id,
      });

      if (!orderResponse.success) {
        toast.error(orderResponse.message || "Failed to create order");
        return;
      }

      const { orderId, amount, currency } = orderResponse.data;

      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_APP_RAZORPAY_KEY,
        amount: amount,
        currency: currency,
        name: "Aarambh",
        description: `Purchase of ${material.title}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verifyResponse = await apiConnector("POST", "/study-materials/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              materialId: material._id,
            });

            if (verifyResponse.success) {
              toast.success("Payment successful! You can now access the study material.");
              navigate("/dashboard/enrolled-study-materials");
            } else {
              toast.error(verifyResponse.message || "Payment verification failed");
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: user?.firstName + " " + user?.lastName,
          email: user?.email,
        },
        theme: {
          color: "#F59E0B",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error("Failed to initiate payment");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-50"></div>
      </div>
    );
  }

  return (
    <div className="text-white p-8 min-h-screen bg-richblack-900">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-medium mb-8">Study Materials</h1>
        
        {studyMaterials.length === 0 ? (
          <div className="text-center py-12 bg-richblack-800 rounded-lg">
            <p className="text-xl mb-4">No study materials found</p>
            {user?.accountType === "Instructor" && (
              <button
                onClick={() => navigate("/dashboard/add-study-material")}
                className="px-4 py-2 bg-yellow-50 text-richblack-900 rounded-lg hover:bg-yellow-25 transition-all duration-200"
              >
                Create Study Material
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studyMaterials.map((material) => (
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
                  <div className="absolute top-2 right-2 bg-richblack-900 bg-opacity-75 px-2 py-1 rounded text-sm">
                    <FaRupeeSign className="inline mr-1" />
                    {material.price}
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <h2 className="text-xl font-medium truncate">{material.title}</h2>
                  <p className="text-richblack-300 line-clamp-2">{material.description}</p>
                  
                  {/* Show Buy Now button for all users except instructors */}
                  {user?.accountType !== "Instructor" && (
                    <button
                      onClick={() => {
                        if (!token) {
                          toast.error("Please login to purchase");
                          navigate("/login");
                          return;
                        }
                        if (user?.accountType === "Student") {
                          handleBuyNow(material);
                        } else {
                          toast.error("Only students can purchase study materials");
                        }
                      }}
                      className="w-full px-4 py-2 bg-yellow-50 text-richblack-900 rounded-lg hover:bg-yellow-25 transition-all duration-200"
                    >
                      {!token ? "Login to Purchase" : "Buy Now"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 