import React, { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Img from './Img';  // Ensure this is correctly implemented for your image handling

const manualReviews = [
  {
    user: {
      firstName: "Anshit",
      lastName: "Sharma",
      image: "/Assets/images/founder-anshit.jpg",
      designation: "Founder & CEO"
    },
    review:
      "At Aarambh Defence, we don't just prepare you for exams — we prepare you for life in uniform. It's not about coaching, it's about mentorship, clarity, and purpose.",
  },
  {
    user: {
      firstName: "Aaryan",
      lastName: "Passi",
      image: "/Assets/images/founder-aaryan.jpg",
      designation: "Founder & CEO"
    },
    review:
      "I've walked the same path as our aspirants. Aarambh is built to provide what I never had—personalized, affordable, and mission-driven guidance for defense dreams.",
  },
  {
    user: {
      firstName: "Ritika",
      lastName: "Verma",
      image: "/Assets/images/ritika.jpg",
      designation: "Mentee"
    },
    review:
      "I used to feel lost in my preparation. Aarambh gave me the right direction and constant motivation. The mentorship feels personal and powerful.",
  },
  {
    user: {
      firstName: "Karan",
      lastName: "Singh",
      image: "/Assets/images/karan.jpg",
      designation: "Mentee"
    },
    review:
      "Affordable, honest, and full of value — Aarambh helped me improve not just in studies but as a person. The SSB sessions were a game-changer.",
  },
  {
    user: {
      firstName: "Megha",
      lastName: "Rawat",
      image: "/Assets/images/megha.jpg",
      designation: "Mentee"
    },
    review:
      "The mentors are very approachable. Their feedback is honest and constructive. I feel much more confident facing the SSB now.",
  },
];

const ReviewSlider = () => {
  return (
    <div className="text-white">
      <div className="my-[50px] max-w-maxContentTab lg:max-w-maxContent">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={25}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
          className="w-full"
        >
          {manualReviews.map((review, i) => (
            <SwiperSlide key={i}>
              <div className="flex flex-col gap-4 bg-richblack-800 p-5 rounded-lg shadow-md text-[14px] text-richblack-25 min-h-[250px] max-h-[320px] hover:scale-105 transition-transform duration-200 ease-in-out">
                <div className="flex items-center gap-4">
                  <Img
                    src={review.user.image || `https://api.dicebear.com/5.x/initials/svg?seed=${review.user.firstName} ${review.user.lastName}`}
                    alt={`${review.user.firstName} ${review.user.lastName}`}
                    className="h-12 w-12 rounded-full object-cover shadow-md"
                  />
                  <div className="flex flex-col">
                    <h1 className="font-semibold text-richblack-5 capitalize">{`${review.user.firstName} ${review.user.lastName}`}</h1>
                    <h2 className="text-sm font-medium text-richblack-300">{review.user.designation}</h2>
                  </div>
                </div>

                <p className="font-medium text-richblack-25">{review.review}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ReviewSlider;
