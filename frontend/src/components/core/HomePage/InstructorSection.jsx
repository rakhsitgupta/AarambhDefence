import React, { Suspense } from 'react'
import HighlightText from './HighlightText'
import CTAButton from "../HomePage/Button"
import { FaArrowRight } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { scaleUp } from './../../common/motionFrameVarients';

// Lazy load the image component
const Img = React.lazy(() => import('./../../common/Img'));

const InstructorSection = () => {
  return (
    <div>
      <div className='flex flex-col-reverse lg:flex-row gap-10 lg:gap-20 items-center'>
        <motion.div
          variants={scaleUp}
          initial='hidden'
          whileInView={'show'}
          viewport={{ once: false, amount: 0.1 }}
          className='lg:w-[50%] '>
          <Suspense fallback={<div className="w-full h-[300px] bg-richblack-800 animate-pulse rounded-3xl" />}>
            <Img
              src="/assets/Images/teacher3.png"
              alt="Instructor"
              className='shadow-white rounded-3xl'
              loading="lazy"
            />
          </Suspense>
        </motion.div>

        <div className='lg:w-[50%] flex flex-col'>
          <div className='text-3xl lg:text-4xl font-semobold w-[50%] mb-2'>
            Become an
            <HighlightText text={"Instructor"} />
          </div>

          <p className='font-medium text-[16px] w-[80%] text-richblack-300 mb-12'>
            Instructors from around the world teach millions of students on Aarambh. We provide the tools and skills to teach what you love.
          </p>

          <div className='w-fit'>
            <CTAButton active={true} linkto={"/signup"}>
              <div className='flex flex-row gap-2 items-center'>
                Start Learning Today
                <FaArrowRight />
              </div>
            </CTAButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InstructorSection
