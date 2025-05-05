import { apiConnector } from "../apiConnector"
import { endpoints } from "../apis"

const { MENTORSHIP_API } = endpoints

export const sendMentorshipRequest = async (formData, token) => {
    try {
        const response = await apiConnector("POST", MENTORSHIP_API, formData, {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        })
        return response.data
    } catch (error) {
        console.error("MENTORSHIP_API ERROR............", error)
        throw error
    }
} 