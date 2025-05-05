import React, { useEffect, useState, Suspense, lazy } from 'react'
import { Link } from "react-router-dom"
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import ErrorBoundary from '../components/common/ErrorBoundary';

// Lazy load components
const HighlightText = lazy(() => import('../components/core/HomePage/HighlightText'));
const CTAButton = lazy(() => import("../components/core/HomePage/Button"));
const CodeBlocks = lazy(() => import("../components/core/HomePage/CodeBlocks"));
const TimelineSection = lazy(() => import('../components/core/HomePage/TimelineSection'));
const InstructorSection = lazy(() => import('../components/core/HomePage/InstructorSection'));
const Footer = lazy(() => import('../components/common/Footer'));
const ExploreMore = lazy(() => import('../components/core/HomePage/ExploreMore'));
const ReviewSlider = lazy(() => import('../components/common/ReviewSlider'));
const Course_Slider = lazy(() => import('../components/core/Catalog/Course_Slider'));

import { getCatalogPageData } from '../services/operations/pageAndComponentData'
import { MdOutlineRateReview } from 'react-icons/md'
import { FaArrowRight } from "react-icons/fa"
import { motion } from 'framer-motion'
import { fadeIn } from './../components/common/motionFrameVarients';

// Preload background images
const backgroundImages = [
  '/assets/Images/random bg img/coding bg1.jpg',
  '/assets/Images/random bg img/coding bg2.jpg',
  '/assets/Images/random bg img/coding bg3.jpg',
  '/assets/Images/random bg img/coding bg4.jpg',
  '/assets/Images/random bg img/coding bg5.jpg',
  '/assets/Images/random bg img/coding bg6.jpg',
  '/assets/Images/random bg img/coding bg7.jpg',
  '/assets/Images/random bg img/coding bg8.jpg',
  '/assets/Images/random bg img/coding bg9.jpg',
  '/assets/Images/random bg img/coding bg10.jpg',
  '/assets/Images/random bg img/coding bg11.jpg',
];

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-50"></div>
  </div>
);

const Home = () => {
  const [backgroundImg, setBackgroundImg] = useState(null);
  const [CatalogPageData, setCatalogPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const categoryID = "6506c9dff191d7ffdb4a3fe2";
  const dispatch = useDispatch();

  useEffect(() => {
    // Preload background images
    backgroundImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });

    const bg = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
    setBackgroundImg(bg);
  }, []);

  useEffect(() => {
    const fetchCatalogPageData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await getCatalogPageData(categoryID, dispatch);
        setCatalogPageData(result);
      } catch (error) {
        console.error("Error fetching catalog data:", error);
        setError("Failed to load course data. Please try again later.");
        toast.error("Failed to load course data");
      } finally {
        setIsLoading(false);
      }
    }
    
    if (categoryID) {
      fetchCatalogPageData();
    }
  }, [categoryID, dispatch]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <React.Fragment>
        {/* background random image */}
        <div>
          <div className="w-full h-[450px] md:h-[650px] absolute top-0 left-0 opacity-[0.3] overflow-hidden object-cover">
            <img 
              src={backgroundImg} 
              alt="Background"
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute left-0 bottom-0 w-full h-[250px] opacity_layer_bg"></div>
          </div>
        </div>

        <div className=' '>
          {/*Section1  */}
          <div className='relative h-[450px] md:h-[550px] justify-center mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white '>

            <Link to={"/contact"}>
              <div className='z-0 group p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200
                              transition-all duration-200 hover:scale-95 w-fit'>
                <div className='flex flex-row items-center gap-2 rounded-full px-10 py-[5px]
                              transition-all duration-200 group-hover:bg-richblack-900'>
                  <p>Book a Mentorship Session</p>
                  <FaArrowRight />
                </div>
              </div>

            </Link>

            <motion.div
              variants={fadeIn('left', 0.1)}
              initial='hidden'
              whileInView={'show'}
              viewport={{ once: false, amount: 0.1 }}
              className='text-center text-3xl lg:text-4xl font-semibold mt-7  '
            >
              
              <HighlightText text={"Aarambh"} /> your first step towards <HighlightText text={"Uniformed Glory"} />
            </motion.div>

            <motion.div
              variants={fadeIn('right', 0.1)}
              initial='hidden'
              whileInView={'show'}
              viewport={{ once: false, amount: 0.1 }}
              className=' mt-4 w-[90%] text-center text-base lg:text-lg font-bold text-richblack-300'
            >
               With Aarambh, prepare for your defence journey with the right mentorship, strategic guidance and a community that
               breathes discipline and determination. From personalised sessions to motivational support - we don't just train
               aspirants we shape warriors.
            </motion.div>


            <div className='flex flex-row gap-7 mt-8'>
              <CTAButton active={true} linkto={"/signup"}>
                Join Us
              </CTAButton>

              {/* <CTAButton active={false} linkto={"/login"}>
                  
              </CTAButton> */}
            </div>
          </div>

          {/* animated code */}
          <div className='relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between'>
            {/* Code block 1 */}
            <div className=''>
              <CodeBlocks
                position={"lg:flex-row"}
                heading={
                  <div className='text-3xl lg:text-4xl font-semibold'>
                    Begin your journey to 
                    <HighlightText text={"Serve the Nation "} />
                    with our Expert Mentorship.
                  </div>
                }
                subheading={
                  "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                }
                ctabtn1={{
                  btnText: "try it yourself",
                  linkto: "/signup",
                  active: true,
                }}
                ctabtn2={{
                  btnText: "learn more",
                  linkto: "/login",
                  active: false,
                }}
                codeblock={`<<!DOCTYPE html>\n<html>\n<head><title>Example</title>\n</head>\n<body>\n<h1><ahref="/">Header</a>\n</h1>\n<nav><ahref="one/">One</a><ahref="two/">Two</a><ahref="three/">Three</a>\n</nav>`}
                codeColor={"text-yellow-25"}
                backgroundGradient={"code-block1-grad"}
              />
            </div>


            {/* Code block 2 */}
            <div>
              <CodeBlocks
                position={"lg:flex-row-reverse"}
                heading={
                  <div className="w-[100%] text-3xl lg:text-4xl font-semibold lg:w-[50%]">
                    Start
                    <HighlightText text={"coding in seconds"} />
                  </div>
                }
                subheading={
                  "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
                }
                ctabtn1={{
                  btnText: "Continue Lesson",
                  linkto: "/signup",
                  active: true,
                }}
                ctabtn2={{
                  btnText: "Learn More",
                  linkto: "/signup",
                  active: false,
                }}
                codeColor={"text-white"}
                codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
                backgroundGradient={"code-block2-grad"}
              />
            </div>

            {/* course slider */}
            <div className='mx-auto box-content w-full max-w-maxContentTab px- py-12 lg:max-w-maxContent'>
              <h2 className='text-white mb-6 text-2xl '>
                Popular Picks for You 🏆
              </h2>
              {isLoading ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-50"></div>
                </div>
              ) : (
                <Course_Slider Courses={CatalogPageData?.selectedCategory?.courses || []} />
              )}
            </div>
            <div className=' mx-auto box-content w-full max-w-maxContentTab px- py-12 lg:max-w-maxContent'>
              <h2 className='text-white mb-6 text-2xl '>
                Top Enrollments Today 🔥
              </h2>
              {isLoading ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-50"></div>
                </div>
              ) : (
                <Course_Slider Courses={CatalogPageData?.mostSellingCourses || []} />
              )}
            </div>


            <ExploreMore />
          </div>

          {/*Section 2  */}
          <div className='bg-pure-greys-5 text-richblack-700 '>
            <div className='homepage_bg h-[310px]'>
              <div className='w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-5 mx-auto'>
                <div className='h-[150px]'></div>
                <div className='flex flex-row gap-7 text-white '>
                  <CTAButton active={true} linkto={"/signup"}>
                    <div className='flex items-center gap-3' >
                      Explore Full Catalog
                      <FaArrowRight />
                    </div>
                  </CTAButton>
                  <CTAButton active={false} linkto={"/signup"}>
                    <div>
                      Learn more
                    </div>
                  </CTAButton>
                </div>
              </div>
            </div>

            <div className='mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7'>
              <div className='flex flex-col lg:flex-row gap-5 mb-10 mt-[95px]'>
                <div className='text-3xl lg:text-4xl font-semibold w-full lg:w-[45%]'>
                  Get the Skills you need for a
                  <HighlightText text={"Job that is in demand"} />
                </div>

                <div className='flex flex-col gap-10 w-full lg:w-[40%] items-start'>
                  <div className='text-[16px]'>
                    The modern Aarambh is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
                  </div>
                  <CTAButton active={true} linkto={"/signup"}>
                    <div>
                      Learn more
                    </div>
                  </CTAButton>
                </div>
              </div>


              {/* leadership */}
              <TimelineSection />

              {/* <LearningLanguageSection /> */}

            </div>

          </div>


          {/*Section 3 */}
          <div className='mt-14 w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8 first-letter bg-richblack-900 text-white'>
            <InstructorSection />

            {/* Reviws from Other Learner */}
            <h1 className="text-center text-3xl lg:text-4xl font-semibold mt-8 flex justify-center items-center gap-x-3">
              Reviews from other learners <MdOutlineRateReview className='text-yellow-25' />
            </h1>
            <ReviewSlider />
          </div>

          {/*Footer */}
          <Footer />
        </div >
      </React.Fragment>
    </Suspense>
  )
}

// Wrap the export with ErrorBoundary
export default function HomeWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <Home />
    </ErrorBoundary>
  );
}