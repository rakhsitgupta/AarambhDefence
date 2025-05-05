import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { FaRupeeSign } from 'react-icons/fa'
import { MdOutlinePayment } from 'react-icons/md'

import { sendMentorshipRequest } from '../../../services/operations/mentorshipAPI'
import { setLoading } from '../../../slices/authSlice'

const MentorshipForm = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { token } = useSelector((state) => state.auth)
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        examPreparingFor: "",
        currentQualification: "",
        message: "",
        paymentScreenshot: null,
    })

    const handleOnChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFormData((prev) => ({
                ...prev,
                paymentScreenshot: file,
            }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // Validate form data
        if (!formData.firstName || !formData.lastName || !formData.email || 
            !formData.phoneNumber || !formData.examPreparingFor || 
            !formData.currentQualification || !formData.message || 
            !formData.paymentScreenshot) {
            toast.error("Please fill all fields")
            return
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            toast.error("Please enter a valid email address")
            return
        }

        // Validate phone number
        const phoneRegex = /^[0-9]{10}$/
        if (!phoneRegex.test(formData.phoneNumber)) {
            toast.error("Please enter a valid 10-digit phone number")
            return
        }

        try {
            dispatch(setLoading(true))
            const formDataToSend = new FormData()
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key])
            })

            const response = await sendMentorshipRequest(formDataToSend, token)
            
            if (response.success) {
                toast.success("Mentorship request submitted successfully!")
                navigate("/dashboard/my-mentorship")
            } else {
                toast.error(response.message || "Something went wrong")
            }
        } catch (error) {
            toast.error("Failed to submit mentorship request")
            console.error(error)
        } finally {
            dispatch(setLoading(false))
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-7"
        >
            <div className="flex flex-col gap-5 lg:flex-row">
                <div className="flex flex-col gap-2 lg:w-[48%]">
                    <label htmlFor="firstName" className="lable-style">
                        First Name
                    </label>
                    <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        placeholder="Enter first name"
                        value={formData.firstName}
                        onChange={handleOnChange}
                        className="form-style"
                    />
                </div>
                <div className="flex flex-col gap-2 lg:w-[48%]">
                    <label htmlFor="lastName" className="lable-style">
                        Last Name
                    </label>
                    <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        placeholder="Enter last name"
                        value={formData.lastName}
                        onChange={handleOnChange}
                        className="form-style"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="email" className="lable-style">
                    Email Address
                </label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleOnChange}
                    className="form-style"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="phoneNumber" className="lable-style">
                    Phone Number
                </label>
                <input
                    type="tel"
                    name="phoneNumber"
                    id="phoneNumber"
                    placeholder="Enter phone number"
                    value={formData.phoneNumber}
                    onChange={handleOnChange}
                    className="form-style"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="examPreparingFor" className="lable-style">
                    Exam You're Preparing For
                </label>
                <select
                    name="examPreparingFor"
                    id="examPreparingFor"
                    value={formData.examPreparingFor}
                    onChange={handleOnChange}
                    className="form-style"
                >
                    <option value="">Select Exam</option>
                    <option value="SSB">SSB</option>
                    <option value="AFCAT">AFCAT</option>
                    <option value="NDA">NDA</option>
                    <option value="CDS">CDS</option>
                </select>
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="currentQualification" className="lable-style">
                    Current Qualification
                </label>
                <input
                    type="text"
                    name="currentQualification"
                    id="currentQualification"
                    placeholder="Enter your current qualification"
                    value={formData.currentQualification}
                    onChange={handleOnChange}
                    className="form-style"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="message" className="lable-style">
                    Why do you want mentorship? (Minimum 100 words)
                </label>
                <textarea
                    name="message"
                    id="message"
                    cols="30"
                    rows="7"
                    placeholder="Enter your message"
                    value={formData.message}
                    onChange={handleOnChange}
                    className="form-style"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="paymentScreenshot" className="lable-style">
                    Payment Screenshot (₹1000)
                </label>
                <div className="flex items-center gap-4">
                    <input
                        type="file"
                        name="paymentScreenshot"
                        id="paymentScreenshot"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="form-style"
                    />
                    <button
                        type="button"
                        onClick={() => window.open('upi://pay?pa=your-upi-id@bank&pn=Your%20Name&am=1000&cu=INR', '_blank')}
                        className="flex items-center gap-2 px-4 py-2 text-richblack-5 bg-yellow-50 rounded-lg hover:bg-yellow-25 transition-all duration-200"
                    >
                        <MdOutlinePayment className="text-xl" />
                        <span>Pay Now</span>
                    </button>
                </div>
                {formData.paymentScreenshot && (
                    <p className="text-richblack-5 text-sm mt-2">
                        Selected file: {formData.paymentScreenshot.name}
                    </p>
                )}
            </div>

            <button
                type="submit"
                className="rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] transition-all duration-200 hover:scale-95 hover:shadow-none"
            >
                Submit Request
            </button>
        </form>
    )
}

export default MentorshipForm 