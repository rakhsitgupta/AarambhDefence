import React from 'react'
import { motion } from 'framer-motion'
import { fadeIn } from '../components/common/motionFrameVarients'
import MentorshipForm from '../components/core/Contact/MentorshipForm'
import Footer from "../components/common/Footer"
import ReviewSlider from './../components/common/ReviewSlider';

const Contact = () => {
    return (
        <div>
            <div className="mx-auto mt-20 w-11/12 max-w-maxContent flex flex-col justify-between gap-10 text-white lg:flex-row">
                {/* Contact Info */}
                <motion.div
                    variants={fadeIn("right", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: false, amount: 0.1 }}
                    className="lg:w-[40%]"
                >
                    <div className="flex flex-col gap-6">
                        <h1 className="text-4xl font-bold">
                            Get in Touch
                        </h1>
                        <p className="text-richblack-300">
                            Have questions about our mentorship program? We're here to help you take the first step towards your defense career.
                        </p>
                        <div className="flex flex-col gap-3">
                            <p className="text-richblack-300">
                                <span className="font-semibold">Email:</span> support@aarambhdefence.com
                            </p>
                            <p className="text-richblack-300">
                                <span className="font-semibold">Phone:</span> +91 98765 43210
                            </p>
                            <p className="text-richblack-300">
                                <span className="font-semibold">Address:</span> 123 Defense Avenue, New Delhi, India
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Mentorship Form */}
                <motion.div
                    variants={fadeIn("left", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: false, amount: 0.1 }}
                    className="lg:w-[60%]"
                >
                    <div className="flex flex-col gap-6 rounded-xl bg-richblack-800 p-6">
                        <h2 className="text-3xl font-bold">
                            Apply for Mentorship
                        </h2>
                        <p className="text-richblack-300">
                            Fill out the form below to apply for our mentorship program. Our team will review your application and get back to you shortly.
                        </p>
                        <MentorshipForm />
                    </div>
                </motion.div>
            </div>

            {/* Reviws from Other Learner */}
            <div className=" my-20 px-5 text-white ">
                <h1 className="text-center text-4xl font-semibold mt-8">
                    Reviews from other learners
                </h1>
                <ReviewSlider />
            </div>

            {/* footer */}
            <Footer />
        </div>
    )
}

export default Contact