import FoundingStory from "../assets/Images/FoundingStory.jpg";
import BannerImage1 from "../assets/Images/aboutus1.jpg";
import BannerImage2 from "../assets/Images/aboutus2.jpg";
import BannerImage3 from "../assets/Images/aboutus3.jpg";
import Footer from "../components/common/Footer";
import LearningGrid from "../components/core/AboutPage/LearningGrid";
import Quote from "../components/core/AboutPage/Quote";
import HighlightText from "../components/core/HomePage/HighlightText";
import Img from "../components/common/Img";
import ReviewSlider from './../components/common/ReviewSlider';
import MentorshipForm from '../components/core/Contact/MentorshipForm';
import { motion } from 'framer-motion';
import { fadeIn } from "../components/common/motionFrameVarients";

const About = () => {
    return (
        <div>
            <section className="bg-richblack-700">
                <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-center text-white">
                    <motion.header className="mx-auto py-20 text-4xl font-semibold lg:w-[70%]">
                        <motion.p
                            variants={fadeIn('down', 0.1)}
                            initial='hidden'
                            whileInView={'show'}
                            viewport={{ once: false, amount: 0.1 }}
                        >
                            Empowering Defense Aspirants for a
                            <HighlightText text={"Brighter Future"} />
                        </motion.p>
                        <motion.p
                            variants={fadeIn('up', 0.1)}
                            initial='hidden'
                            whileInView={'show'}
                            viewport={{ once: false, amount: 0.1 }}
                            className="mx-auto mt-3 text-center text-base font-medium text-richblack-300 lg:w-[95%]">
                            Aarambh Defence is at the forefront of defense exam preparation. We're passionate about creating a brighter future by offering expert mentorship, comprehensive training, and nurturing a vibrant community of defense aspirants.
                        </motion.p>
                    </motion.header>

                    <div className="sm:h-[70px] lg:h-[150px]"></div>

                    <div className="absolute bottom-0 left-[50%] grid w-[100%] translate-x-[-50%] translate-y-[30%] grid-cols-3 gap-3 lg:gap-5">
                        <Img src={BannerImage1} alt="" className="w-full h-[200px] object-cover rounded-md" />
                        <Img src={BannerImage2} alt="" className="w-full h-[200px] object-cover rounded-md" />
                        <Img src={BannerImage3} alt="" className="w-full h-[200px] object-cover rounded-md" />
                    </div>
                </div>
            </section>

            <section className="border-b border-richblack-700 mt-[200px]">
                <div className="mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-richblack-500">
                    {/* <div className="h-[px]"></div> */}
                    <Quote />
                </div>
            </section>
<section>
                <div className="mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-richblack-500">
                    <div className="flex flex-col items-center gap-10 lg:flex-row justify-between">
                        <motion.div
                            variants={fadeIn('right', 0.1)}
                            initial='hidden'
                            whileInView={'show'}
                            viewport={{ once: false, amount: 0.1 }}
                            className="my-24 flex lg:w-[50%] flex-col gap-10"
                        >
                            <h1 className="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%]">
                                Our Founding Story
                            </h1>
                            <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                                Aarambh Defence was born from the shared vision of two successful defense aspirants, 
                                <a href="/about-founders" className="text-[#FCB045] hover:underline font-semibold">
                                    Anshit Sharma
                                </a> and 
                                <a href="/about-mentors" className="text-[#FCB045] hover:underline font-semibold">
                                     Aaryan Passi
                                </a>. With firsthand experience of the challenges in defense exam preparation, they recognized the need for accessible, high-quality mentorship.
                            </p>
                            <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                                <a href="/about-founders" className="text-[#FCB045] hover:underline font-semibold">
                                    Anshit Sharma
                                </a>, having cleared 9 written examinations, brings deep insights into the preparation process, while 
                                <a href="/about-mentors" className="text-[#FCB045] hover:underline font-semibold">
                                     Aaryan Passi
                                </a>, with his extensive experience in the defense sector, aims to provide affordable and holistic mentorship. Together, they created Aarambh to empower aspirants from all walks of life and help them achieve their dreams of serving the nation.
                            </p>
                        </motion.div>

                        <motion.div
                            variants={fadeIn('left', 0.1)}
                            initial='hidden'
                            whileInView={'show'}
                            viewport={{ once: false, amount: 0.1 }}
                            className="lg:w-[50%]"
                        >
                            <img
                                src={FoundingStory}
                                alt="Founding Story"
                                className="w-full h-[350px] object-cover rounded-md shadow-md border-2 border-[#FCB045] hover:scale-102 transition-all duration-300 hover:shadow-lg relative before:content-[''] before:absolute before:inset-0 before:rounded-md before:border-2 before:border-[#FCB045] before:animate-[glow_2s_ease-in-out_infinite] before:opacity-0 hover:before:opacity-100"
                            />
                        </motion.div>
                    </div>

                    <div className="flex flex-col items-center lg:gap-10 lg:flex-row justify-between">
                        <div className="my-24 flex lg:w-[40%] flex-col gap-10">
                            <h1 className="bg-gradient-to-b from-[#FF512F] to-[#F09819] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%] ">
                                Our Vision
                            </h1>
                            <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                                At Aarambh Defence, we believe defense preparation goes beyond academics—it's about shaping the whole individual. Our vision is to empower aspirants by providing not only the academic skills required for defense exams but also the leadership, personality, and life skills needed to succeed. Founded by Anshit Sharma and Aaryan Passi, our approach combines written mentorship, SSB coaching, personality development, and life preparation, ensuring every aspirant is ready for both the exam and the challenges of serving in the defense forces. We aim to make defense preparation more accessible and impactful, helping aspirants reach their fullest potential.
                            </p>
                        </div>

                        <div className="my-24 flex lg:w-[40%] flex-col gap-10">
                            <h1 className="bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text text-4xl font-semibold lg:w-[70%] ">
                                Our Mission
                            </h1>
                            <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                                At Aarambh Defence, our mission is to provide affordable, high-quality mentorship that prepares aspirants not only for defense exams but for life as a defense officer. We are committed to creating a supportive, aspirant-focused community where every individual receives personalized guidance. Our mission is to break down barriers—whether financial or geographical—by offering holistic mentorship that includes written guidance, SSB coaching, personality development, and life skills. We believe in fostering success through a community built on mutual support, understanding, and the shared goal of serving the nation.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white">
                <LearningGrid />

                <div className="flex flex-col gap-10 lg:flex-row">
                    <motion.div
                        variants={fadeIn("right", 0.2)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: false, amount: 0.1 }}
                        className="lg:w-[50%]"
                    >
                        <div className="flex flex-col gap-6">
                            <h2 className="text-3xl font-bold">
                            <HighlightText text={"Start Your Journey"} />
                            </h2>
                            <p className="text-richblack-300">
                                Ready to take the first step towards your defense career? Apply for our mentorship program today and get personalized guidance from our Mentors.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={fadeIn("left", 0.2)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: false, amount: 0.1 }}
                        className="lg:w-[50%]"
                    >
                        <div className="flex flex-col gap-6 rounded-xl bg-richblack-800 p-6">
                            <MentorshipForm />
                        </div>
                    </motion.div>
                </div>
            </section>

            <div className=" my-20 px-5 text-white ">
                <h1 className="text-center text-4xl font-semibold mt-8">
                    Reviews from other learners
                </h1>
                <ReviewSlider />
            </div>

            <Footer />
        </div>
    );
};

export default About;
