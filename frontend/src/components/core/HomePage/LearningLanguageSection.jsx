import React from 'react';
import HighlightText from './HighlightText';
import know_your_progress from "../../../assets/Images/Know_your_progress.png";
import compare_with_others from "../../../assets/Images/Compare_with_others.png";
import plan_your_lesson from "../../../assets/Images/Plan_your_lessons.png";
import CTAButton from "../HomePage/Button";

const LearningPathSection = () => {
    return (
        <div className='mt-[130px] mb-10'>
            <div className='flex flex-col gap-5 items-center'>

                <div className='text-3xl lg:text-4xl font-semibold text-center'>
                    Your Swiss Knife for
                    <HighlightText text={" defence preparation"} />
                </div>

                <div className='lg:text-center text-richblack-600 mx-auto text-base font-medium lg:w-[70%]'>
                    Aarambh Defence provides a comprehensive mentorship program designed to guide you through every stage of your defense preparation journey. Track your progress, compare with peers, and follow a custom study plan to excel.
                </div>

                <div className='flex flex-col lg:flex-row items-center justify-center mt-5'>
                    {/* <img
                        src={know_your_progress}
                        alt="Know Your Progress"
                        className='object-contain lg:-mr-32'
                    /> */}
                    <img
                        src={compare_with_others}
                        alt="Compare With Others"
                        className='object-contain'
                    />
                    <img
                        src={plan_your_lesson}
                        alt="Plan Your Lessons"
                        className='object-contain lg:-ml-36'
                    />
                </div>

                <div className='w-fit'>
                    <CTAButton active={true} linkto={"/signup"}>
                        <div>
                            Start Your Journey
                        </div>
                    </CTAButton>
                </div>

            </div>
        </div>
    );
}

export default LearningPathSection;
