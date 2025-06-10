import React from "react";
import { Link } from "react-router-dom";

// import your local images
import ChickenBiryani from "../../../assets/images/ChickenBiryani.jpg";
import ChickenKarahi from "../../../assets/images/ChickenKarahi.jpg";
import ChickenAlfredo from "../../../assets/images/ChickenAlfredo.jpg";
import Sushi from "../../../assets/images/Sushi.jpg";
import Pizza from "../../../assets/images/Pizza.jpg";
import ZingerBurger from "../../../assets/images/ZingerBurger.png";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center text-gray-300 mb-8">
        Welcome to - Foodie Hub -
      </h1>

      <div className="flex justify-center mb-8">
        <Link
          to="/user/restaurants"
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg text-lg font-semibold"
        >
          Order Now
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="rounded-lg overflow-hidden shadow-lg">
          <img
            src={ChickenBiryani}
            alt="Chicken Biryani"
            className="w-full h-64 object-cover"
          />
        </div>
        <div className="rounded-lg overflow-hidden shadow-lg">
          <img
            src={ChickenKarahi}
            alt="Chicken Karahi"
            className="w-full h-64 object-cover"
          />
        </div>
        <div className="rounded-lg overflow-hidden shadow-lg">
          <img
            src={ChickenAlfredo}
            alt="Chicken Alfredo"
            className="w-full h-64 object-cover"
          />
        </div>
        <div className="rounded-lg overflow-hidden shadow-lg">
          <img
            src={Sushi}
            alt="Sushi"
            className="w-full h-56 object-cover"
          />
        </div>
        <div className="rounded-lg overflow-hidden shadow-lg">
          <img
            src={Pizza}
            alt="Pizza"
            className="w-full h-56 object-cover"
          />
        </div>
        <div className="rounded-lg overflow-hidden shadow-lg">
          <img
            src={ZingerBurger}
            alt="Zinger Burger"
            className="w-full h-56 object-cover"
          />
        </div>
      </div>
    </div>
  );
}
