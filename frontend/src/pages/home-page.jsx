import React from "react";
import { Carousel } from 'react-responsive-carousel'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FaCheckCircle, FaChartBar, FaUserFriends } from "react-icons/fa";
import { useSelector } from "react-redux";
import LazyLoad from '../components/lazyImage'

const Home = () => {
  const { user } = useSelector(state => state.user)

  return (
    <div className="relative md:h-screen h-[93vh] w-full pt-16">
      <Carousel autoPlay infiniteLoop interval={5000} transitionTime={1000} showThumbs={false} showArrows={false} className="absolute inset-0 z-0 max-md:top-16">
        {user?.siteId?.images && user?.siteId?.images?.map((image, index) => (
          <div key={index} className="relative">
            <LazyLoad height="md:h-screen h-[56vh]" src={image}/>
            <div className="absolute inset-0 bg-teal-900/20 z-10"></div>
          </div>
        ))}
      </Carousel>


      {/* Text content */}
      <div className="relative z-20 flex items-end justify-center max-md:pt-[53vh] md:h-screen md:pb-20 pb-8 md:px-4">
        <div className="md:bg-teal-700/50 bg-teal-700/80 backdrop-blur-lg md:p-6 p-3 rounded-md shadow-lg max-w-2xl w-full text-center text-white">
          <h1 className="md:text-4xl text-2xl font-bold text-white md:mb-4 mb-2 drop-shadow capitalize">
            Assalomu Aleykum {user?.username}. <br /> {user?.siteId?.title}ga xush kelibsan!
          </h1>
          <p className="md:text-lg text-white md:mb-6 drop-shadow">
            Bilimingizni sinang, yutuqlaringizni ko‘ring va boshqalar bilan raqobat qiling!
          </p>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="flex flex-col items-center">
              <FaCheckCircle className="md:text-3xl text-2xl text-teal-200 mb-2" />
              <span className="font-semibold max-md:text-center">Aniq Natijalar</span>
            </div>
            <div className="flex flex-col items-center">
              <FaChartBar className="md:text-3xl text-2xl text-teal-200 mb-2" />
              <span className="font-semibold max-md:text-center">Statistika</span>
            </div>
            <div className="flex flex-col items-center">
              <FaUserFriends className="md:text-3xl text-2xl text-teal-200 mb-2" />
              <span className="font-semibold max-md:text-center">Raqobatlashing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
