import React from "react"
import { motion } from 'framer-motion'
import { fadeIn } from "../components/common/motionFrameVarients"
import Footer from "../components/common/Footer"
import HighlightText from "../components/core/HomePage/HighlightText"
import Img from "../components/common/Img"
import AaryanImage from "../assets/Images/founder-aaryan.jpg";
import AnshitImage from "../assets/Images/founder-anshit.jpg";

const AboutFounders = () => {
  const founders = [
    {
      name: "Aaryan Passi",
      role: "Founder & CEO",
      image: AaryanImage,
      description: (
        <>
          After securing an <HighlightText text={"All India Rank of 66"} /> in the UPSC CDS exam, I chose to walk away from a secure government path to pursue something far more personal: building a bridge between <HighlightText text={"aspiration and access"} /> in India's small towns.
          <br /><br />
          During my own preparation, I experienced the lack of mentorship, guidance, and affordable resources in my city. Most good coaching options were either in distant metros or unaffordable for the average student. That's when I founded <HighlightText text={"Aarambh Academy"} />—a grassroots initiative offering full-fledged exam coaching for as low as ₹1000/month.
          <br /><br />
          My mission is to <HighlightText text={"democratize high-quality education"} />, inspire youth from non-metro cities, and build a movement of impact-driven learning. I now mentor students for UPSC, CDS, AFCAT, and other competitive exams—focusing on conceptual clarity, mindset, and affordability. I'm open to collaboration, speaking opportunities, and scaling this mission across India.
        </>
      )
    },
    {
      name: "Anshit Sharma",
      role: "Founder & CEO",
      image: AnshitImage,
      description: "Jane is a technology innovator with a passion for creating scalable learning solutions. With a background in computer science and education, she has developed cutting-edge learning platforms that have transformed how students engage with educational content. Her technical expertise ensures our platform remains at the forefront of educational technology."
    }
  ];

  return (
    <div>
      <section className="bg-richblack-700">
        <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-center text-white">
          <motion.header
            className="mx-auto py-20 text-4xl font-semibold lg:w-[70%]"
            variants={fadeIn('down', 0.1)}
            initial='hidden'
            whileInView={'show'}
            viewport={{ once: false, amount: 0.1 }}
          >
            <motion.p>
              Meet Our Visionary
              <HighlightText text={"Founders"} />
            </motion.p>
          </motion.header>
        </div>
      </section>

      <section className="mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-32 text-richblack-500">
        {founders.map((founder, index) => (
          <motion.div
            key={index}
            variants={fadeIn('up', 0.1)}
            initial='hidden'
            whileInView={'show'}
            viewport={{ once: false, amount: 0.1 }}
            className="flex flex-row items-center gap-16 bg-richblack-800 p-12 rounded-xl"
          >
            <div className="w-[40%]">
              <img
                src={founder.image}
                alt={founder.name}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
            <div className="w-[60%]">
              <h2 className="text-3xl font-semibold text-richblack-5 mb-4">
                {founder.name}
              </h2>
              <p className="text-yellow-25 text-xl mb-6">{founder.role}</p>
              <p className="text-richblack-300 text-lg leading-relaxed">
                {founder.description}
              </p>
            </div>
          </motion.div>
        ))}
      </section>

      <div className="mt-32">
        <Footer />
      </div>
    </div>
  )
}

export default AboutFounders 