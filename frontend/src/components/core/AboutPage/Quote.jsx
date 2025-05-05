import React from 'react';
import HighlightText from '../HomePage/HighlightText';

const Quote = () => {
  return (
    <div className="text-xl md:text-4xl font-semibold mx-auto py-5 pb-20 text-center text-white">
      At Aarambh Defence, we’re not just preparing for exams — we’re
      <HighlightText text={"shaping individuals"} />,{" "}
      <span className="bg-gradient-to-b from-[#FF512F] to-[#F09819] text-transparent bg-clip-text font-bold">
        empowering aspirations
      </span>
      , and building a
      <span className="bg-gradient-to-b from-[#E65C00] to-[#F9D423] text-transparent bg-clip-text font-bold">
        {" "}community of future defense leaders.
      </span>
    </div>
  );
};

export default Quote;
