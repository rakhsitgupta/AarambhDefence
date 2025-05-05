import React, { useState } from "react";
import HighlightText from "../../../components/core/HomePage/HighlightText";
import CTAButton from "../../../components/core/HomePage/Button";

const LearningGridArray = [
  {
    order: -1,
    heading: "Comprehensive Mentorship for",
    highlightText: "Future Officers",
    description:
      "At Aarambh Defence, we provide holistic preparation that goes beyond textbooks. From written exams to life readiness—we’ve got you covered.",
    BtnText: "Join Now",
    BtnLink: "/signup",
  },
  {
    order: 1,
    heading: "Written Mentorship",
    description:
      "Receive expert guidance tailored to written defense examinations, complete with personalized study plans and doubt-solving sessions.",
  },
  {
    order: 2,
    heading: "SSB Preparation",
    description:
      "Master the SSB process through mock interviews, psychological tests, and group tasks led by experienced mentors.",
  },
  {
    order: 3,
    heading: "Personality Development",
    description:
      "Enhance your communication, confidence, and leadership—essential qualities for a future officer.",
  },
  {
    order: 4,
    heading: "Life Skills Training",
    description:
      "Prepare mentally and emotionally for the demands of defense life—from handling stress to managing time effectively.",
  },
  {
    order: 5,
    heading: "Affordable & Accessible",
    description:
      "High-quality mentorship made budget-friendly. We’re committed to ensuring that financial constraints don’t block your path to the forces.",
  },
];

const LearningGrid = () => {
  const [activeCard, setActiveCard] = useState(null);

  const handleCardClick = (index) => {
    setActiveCard(index === activeCard ? null : index);
  };

  return (
    <div className="grid mx-auto w-[350px] lg:w-fit grid-cols-1 lg:grid-cols-4 mb-12">
      {LearningGridArray.map((card, i) => {
        const isActive = activeCard === i;

        return (
          <div
            key={i}
            onClick={() => handleCardClick(i)}
            className={`
              cursor-pointer transition-all duration-300 ease-in-out 
              ${i === 0 ? "lg:col-span-2 lg:h-[294px]" : ""}
              ${card.order % 2 === 1 ? "bg-richblack-700" : card.order % 2 === 0 ? "bg-richblack-800" : "bg-transparent"}
              ${card.order === 3 ? "lg:col-start-2" : ""}
              ${isActive ? "ring-2 ring-yellow-400 shadow-yellow-500 shadow-lg scale-105" : ""}
              hover:ring-2 hover:ring-yellow-300 hover:shadow-yellow-400 hover:shadow-md hover:scale-[1.02] 
              h-[294px] rounded-lg p-4
            `}
          >
            {card.order < 0 ? (
              <div className="lg:w-[90%] flex flex-col gap-3 pb-10 lg:pb-0">
                <div className="text-4xl font-semibold">
                  {card.heading}
                  <HighlightText text={card.highlightText} />
                </div>
                <p className="text-richblack-300 font-medium">
                  {card.description}
                </p>
                <div className="w-fit mt-2">
                  <CTAButton active={true} linkto={card.BtnLink}>
                    {card.BtnText}
                  </CTAButton>
                </div>
              </div>
            ) : (
              <div className="p-4 flex flex-col gap-6 h-full justify-center">
                <h1 className="text-richblack-5 text-lg font-semibold">
                  {card.heading}
                </h1>
                <p className="text-richblack-300 font-medium text-sm">
                  {card.description}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LearningGrid;
