import React from 'react';

const AboutUs = () => {
  return (
    <div className="text-white p-8">
      <h1 className="text-3xl font-medium mb-8">About Us</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-richblack-300">
            At Aarambh, we are dedicated to providing high-quality educational resources and mentorship 
            to help students excel in their academic and professional journeys. Our platform connects 
            students with experienced mentors and provides comprehensive study materials to enhance learning.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
          <ul className="list-disc list-inside space-y-2 text-richblack-300">
            <li>Comprehensive study materials for various subjects</li>
            <li>Expert mentorship from industry professionals</li>
            <li>Interactive learning experiences</li>
            <li>Personalized guidance and support</li>
            <li>Regular assessments and feedback</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-richblack-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Excellence</h3>
              <p className="text-richblack-300">
                We strive for excellence in everything we do, from the quality of our content to the 
                support we provide to our students.
              </p>
            </div>
            <div className="bg-richblack-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-richblack-300">
                We continuously innovate our teaching methods and content to provide the best learning 
                experience possible.
              </p>
            </div>
            <div className="bg-richblack-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Accessibility</h3>
              <p className="text-richblack-300">
                We believe in making quality education accessible to everyone, regardless of their 
                background or circumstances.
              </p>
            </div>
            <div className="bg-richblack-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-richblack-300">
                We foster a supportive community where students can learn, grow, and achieve their goals 
                together.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs; 