import React from 'react'

import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg"
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg"
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg"
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg"
import timelineImage from '../../../assets/Images/TimelineImage.png'

import Img from './../../common/Img';

import { motion } from 'framer-motion'
import { fadeIn } from '../../common/motionFrameVarients';



const timeline = [
    {
        Logo: Logo1,
        heading: "Leadership",
        Description: "We instill leadership qualities that prepare you for the challenges of defense and beyond.",
    },
    {
        Logo: Logo2,
        heading: "Responsibility",
        Description: "We prioritize the growth and success of our aspirants, ensuring they are always our focus.",
    },
    {
        Logo: Logo3,
        heading: "Discipline",
        Description: "A strong foundation of discipline is key to success in both the defense exams and life.",
    },
    {
        Logo: Logo4,
        heading: "Problem-Solving",
        Description: "We equip you with the problem-solving mindset needed to excel in your defense preparation and interviews.",
    },
];

const TimelineSection = () => {
    return (
        <div>
            <div className='flex flex-col lg:flex-row gap-15 items-center'>

                <motion.div
                    variants={fadeIn('right', 0.1)}
                    initial='hidden'
                    whileInView={'show'}
                    viewport={{ once: false, amount: 0.1 }}
                    className='w-full lg:w-[45%] flex flex-col gap-5'>
                    {
                        timeline.map((element, index) => {
                            return (
                                <div className='flex flex-row gap-6' key={index}>

                                    <div className='w-[50px] h-[50px] rounded-full bg-richblue-500 flex justify-center items-center'>
                                        <img src={element.Logo} />
                                    </div>

                                    <div>
                                        <h2 className='font-semibold text-[18px]'>{element.heading}</h2>
                                        <p className='text-base'>{element.Description}</p>
                                    </div>

                                </div>
                            )
                        })
                    }
                </motion.div>

                <motion.div
                    variants={fadeIn('left', 0.1)}
                    initial='hidden'
                    whileInView={'show'}
                    viewport={{ once: false, amount: 0.1 }}
                    className='relative shadow-blue-200'>

                    <Img src={timelineImage}
                        alt="timelineImage"
                        className='shadow-white object-cover h-fit scale-x-[-1] w-[550px] '
                    />

                    <div className=' absolute bg-caribbeangreen-700 flex flex-row text-white uppercase py-7
                            left-[50%] translate-x-[-50%] translate-y-[-70%] rounded-3xl'>
                        <div className='flex flex-row gap-5 items-center border-r border-caribbeangreen-300 px-7'>
                            <p className='text-2xl lg:text-3xl font-bold'>10</p>
                            <p className='text-caribbeangreen-300 text-xs lg:text-sm'>Years of Experience</p>
                        </div>

                        <div className='flex gap-5 items-center px-7'>
                            <p className='text-2xl lg:text-3xl font-bold'>250</p>
                            <p className='text-caribbeangreen-300 text-xs lg:text-sm'>TYpe of Courses</p>
                        </div>

                    </div>

                </motion.div>
            </div>
        </div>
    )
}

export default TimelineSection
