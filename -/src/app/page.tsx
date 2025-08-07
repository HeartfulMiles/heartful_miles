"use client";
import axios from "axios";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";

import { useState, useEffect } from "react";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [inputs, setInputs] = useState({
    name: "",
    phone: "",
    email: "",
    baseLocation: "",
    tripDestination: "",
    numberOfTravelers: "",
    budget: "",
    startDate: "",
    endDate: "",
    specialRequirements: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    email: "",
    baseLocation: "",
    tripDestination: "",
    numberOfTravelers: "",
    budget: "",
    startDate: "",
    endDate: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const slides = [
    {
      image: "/assets/cliff.webp",
      title: "Explore the World",
      subtitle: "Your journey starts here"
    },
    {
      image: "/assets/moutain.webp",
      title: "Adventure Awaits",
      subtitle: "Discover new horizons"
    },
    {
      image: "/assets/safari.jpg",
      title: "Unforgettable Experiences",
      subtitle: "Create memories that last"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { id, value } = e.target;
    setInputs({ ...inputs, [id]: value });

    // Clear error when user starts typing
    if (errors[id as keyof typeof errors]) {
      setErrors({ ...errors, [id]: "" });
    }
  }

  const validateForm = () => {
    const newErrors = {
      name: "",
      phone: "",
      email: "",
      baseLocation: "",
      tripDestination: "",
      numberOfTravelers: "",
      budget: "",
      startDate: "",
      endDate: "",
    };

    // Name validation
    if (!inputs.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (inputs.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    }

    // Phone validation
    if (!inputs.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(inputs.phone.replace(/\s/g, ''))) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Email validation
    if (!inputs.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputs.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Base location validation
    if (!inputs.baseLocation.trim()) {
      newErrors.baseLocation = "Base location is required";
    }

    // Trip destination validation
    if (!inputs.tripDestination.trim()) {
      newErrors.tripDestination = "Trip destination is required";
    }

    // Number of travelers validation
    if (!inputs.numberOfTravelers.trim()) {
      newErrors.numberOfTravelers = "Number of travelers is required";
    } else if (!/^\d+$/.test(inputs.numberOfTravelers) || parseInt(inputs.numberOfTravelers) < 1) {
      newErrors.numberOfTravelers = "Please enter a valid number of travelers";
    }

    // Budget validation
    if (!inputs.budget.trim()) {
      newErrors.budget = "Budget range is required";
    }

    // Start date validation
    if (!inputs.startDate) {
      newErrors.startDate = "Start date is required";
    } else {
      const startDate = new Date(inputs.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (startDate < today) {
        newErrors.startDate = "Start date cannot be in the past";
      }
    }

    // End date validation
    if (!inputs.endDate) {
      newErrors.endDate = "End date is required";
    } else if (inputs.startDate && inputs.endDate) {
      const startDate = new Date(inputs.startDate);
      const endDate = new Date(inputs.endDate);
      if (endDate <= startDate) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post("/api/sample", {
        name: inputs.name,
        email: inputs.email,
        phone: inputs.phone,
        baseLocation: inputs.baseLocation,
        tripDestination: inputs.tripDestination,
        numberOfTravelers: inputs.numberOfTravelers,
        budget: inputs.budget,
        startDate: inputs.startDate,
        endDate: inputs.endDate,
        specialRequirements: inputs.specialRequirements,
      });

      if (response.status === 200) {
        toast.success("Your request has been submitted successfully! Our team will get back to you shortly.");
        // Reset form
        setInputs({
          name: "",
          phone: "",
          email: "",
          baseLocation: "",
          tripDestination: "",
          numberOfTravelers: "",
          budget: "",
          startDate: "",
          endDate: "",
          specialRequirements: "",
        });
        setErrors({
          name: "",
          phone: "",
          email: "",
          baseLocation: "",
          tripDestination: "",
          numberOfTravelers: "",
          budget: "",
          startDate: "",
          endDate: "",
        });
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
      {/* Navigation */}
      <nav className="fixed top-4 left-4 right-4 md:left-1/2 md:transform md:-translate-x-1/2 md:w-auto bg-white/30 backdrop-blur-xl z-50 rounded-3xl border border-white/30 shadow-2xl">
        <div className="px-8 py-2 md:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full mr-3 shadow-lg"></div>
                <h1 className="text-2xl font-bold text-gray-900">Heartful Miles</h1>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-8 flex items-baseline space-x-4">
                <a href="#home" className="text-gray-900 hover:text-teal-600 px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white/50">Home</a>
                <a href="#services" className="text-gray-900 hover:text-teal-600 px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white/50">Services</a>
                <a href="#about" className="text-gray-900 hover:text-teal-600 px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white/50">About</a>
                <a href="#contact" className="text-gray-900 hover:text-teal-600 px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white/50">Contact</a>
              </div>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-900 hover:text-teal-600 p-2 rounded-full hover:bg-white/50 transition-all duration-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden overflow-hidden transition-all duration-700 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
            <div className="flex flex-col space-y-2 pb-4">
              <a href="#home" onClick={() => { setIsMobileMenuOpen(!isMobileMenuOpen) }} className="text-gray-900 hover:text-teal-600 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white/50 transform hover:scale-105">Home</a>
              <a href="#services" onClick={() => { setIsMobileMenuOpen(!isMobileMenuOpen) }} className="text-gray-900 hover:text-teal-600 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white/50 transform hover:scale-105">Services</a>
              <a href="#about" onClick={() => { setIsMobileMenuOpen(!isMobileMenuOpen) }} className="text-gray-900 hover:text-teal-600 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white/50 transform hover:scale-105">About</a>
              <a href="#contact" onClick={() => { setIsMobileMenuOpen(!isMobileMenuOpen) }} className="text-gray-900 hover:text-teal-600 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white/50 transform hover:scale-105">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Your Dream
                <span className="text-teal-600 block">Vacation Awaits</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                We plan personalized, affordable trips based on your location, number of days, and budget.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {/* <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl">
                  Start Planning
                </button> */}
                <a href="#contact" className="border-2 border-teal-600 text-teal-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-teal-600 hover:text-white transition-colors">
                  Start Planning
                </a>
              </div>
            </div>
            <div className="relative mt-16">
              {/* Slideshow Container */}
              <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                {/* Slides */}
                {slides.map((slide, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                      }`}
                  >
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/50"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white z-10">
                        <h3 className="text-3xl lg:text-4xl font-bold mb-2">{slide.title}</h3>
                        <p className="text-lg lg:text-xl opacity-90">{slide.subtitle}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Navigation Arrows */}
                {/* <button
                  // onClick={prevSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
                  aria-label="Previous slide"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  // onClick={nextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
                  aria-label="Next slide"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button> */}

                {/* Dots Indicator */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      // onClick={() => goToSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                        ? 'bg-white scale-125'
                        : 'bg-white/50 hover:bg-white/75'
                        }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We offer comprehensive travel planning services to make your journey seamless and unforgettable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service Card 1 */}
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-teal-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Custom Itineraries</h3>
              <p className="text-gray-600 leading-relaxed">
                Personalized travel plans designed around your interests, budget, and schedule. Every detail crafted just for you.
              </p>
            </div>

            {/* Service Card 2 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Affordable Experiences</h3>
              <p className="text-gray-600 leading-relaxed">
                Access to exclusive hotels, private tours, with Budget friendly experiences that make your trip truly extraordinary.
              </p>
            </div>

            {/* Service Card 3 */}
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-teal-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">24/7 Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Round-the-clock assistance throughout your journey. We're here to help with any questions or changes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                About Heartful Miles
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                We're excited to launch our travel planning business with a fresh approach to personalized travel experiences.
                Our passion for exploration and attention to detail drives us to create unforgettable journeys
                tailored to your dreams and preferences.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-600">FREE</div>
                  <div className="text-gray-600">Consultation</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-600">FREE</div>
                  <div className="text-gray-600">Itinerary Planning</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-600">100%</div>
                  <div className="text-gray-600">Personalized</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-600">24/7</div>
                  <div className="text-gray-600">Support</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-teal-400 to-cyan-600 p-8 rounded-2xl text-white">
                <h3 className="text-2xl font-bold mb-4">Why Choose Us?</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Free consultation & itinerary planning
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Personalized travel experiences
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Access to Exclusive Scenery
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Access to quality accommodations
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Dedicated support throughout your journey
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Contact Section */}
      <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-teal-600 to-cyan-700">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-teal-100 max-w-3xl mx-auto">
              Let's create the perfect travel experience for you. Contact us today to begin planning your dream vacation.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm p-6 lg:p-8 rounded-2xl shadow-xl">
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <input
                        onChange={(e) => { onChange(e) }}
                        id="name"
                        type="text"
                        placeholder="Full Name"
                        value={inputs.name}
                        className={`w-full px-4 py-3 rounded-lg bg-white/20 border text-white placeholder-teal-100 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 ${errors.name ? 'border-red-400' : 'border-white/30'}`}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg className="w-4 h-4 text-teal-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div className="relative">
                      <input
                        onChange={(e) => { onChange(e) }}
                        id="phone"
                        type="tel"
                        placeholder="Phone Number"
                        value={inputs.phone}
                        className={`w-full px-4 py-3 rounded-lg bg-white/20 border text-white placeholder-teal-100 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 ${errors.phone ? 'border-red-400' : 'border-white/30'}`}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg className="w-4 h-4 text-teal-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                    <div className="relative md:col-span-2">
                      <input
                        onChange={(e) => { onChange(e) }}
                        id="email"
                        type="email"
                        placeholder="Email Address"
                        value={inputs.email}
                        className={`w-full px-4 py-3 rounded-lg bg-white/20 border text-white placeholder-teal-100 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 ${errors.email ? 'border-red-400' : 'border-white/30'}`}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg className="w-4 h-4 text-teal-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                  </div>
                </div>

                {/* Trip Details */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Trip Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <input
                        onChange={(e) => { onChange(e) }}
                        id="baseLocation"
                        type="text"
                        placeholder="Base Location"
                        value={inputs.baseLocation}
                        className={`w-full px-4 py-3 rounded-lg bg-white/20 border text-white placeholder-teal-100 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 ${errors.baseLocation ? 'border-red-400' : 'border-white/30'}`}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg className="w-4 h-4 text-teal-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      {errors.baseLocation && <p className="text-red-500 text-sm mt-1">{errors.baseLocation}</p>}
                    </div>
                    <div className="relative">
                      <input
                        onChange={(e) => { onChange(e) }}
                        id="tripDestination"
                        type="text"
                        placeholder="Trip Destination"
                        value={inputs.tripDestination}
                        className={`w-full px-4 py-3 rounded-lg bg-white/20 border text-white placeholder-teal-100 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 ${errors.tripDestination ? 'border-red-400' : 'border-white/30'}`}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg className="w-4 h-4 text-teal-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      {errors.tripDestination && <p className="text-red-500 text-sm mt-1">{errors.tripDestination}</p>}
                    </div>
                    <div className="relative">

                      <input
                        onChange={(e) => { onChange(e) }}
                        id="numberOfTravelers"
                        type="text"
                        placeholder="Number of Travelers"
                        value={inputs.numberOfTravelers}
                        className={`w-full px-4 py-3 rounded-lg bg-white/20 border text-white placeholder-teal-100 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 ${errors.numberOfTravelers ? 'border-red-400' : 'border-white/30'}`}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg className="w-4 h-4 text-teal-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      {errors.numberOfTravelers && <p className="text-red-500 text-sm mt-1">{errors.numberOfTravelers}</p>}
                    </div>
                    <div className="relative">
                      <input
                        onChange={(e) => { onChange(e) }}
                        id="budget"
                        type="text"
                        placeholder="Budget Range"
                        value={inputs.budget}
                        className={`w-full px-4 py-3 rounded-lg bg-white/20 border text-white placeholder-teal-100 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 ${errors.budget ? 'border-red-400' : 'border-white/30'}`}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg className="w-4 h-4 text-teal-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
                    </div>
                  </div>
                </div>

                {/* Travel Dates */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Travel Dates
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Start Date</label>
                      <input
                        onChange={(e) => { onChange(e) }}
                        id="startDate"
                        type="date"
                        value={inputs.startDate}
                        className={`w-full px-4 py-3 rounded-lg bg-white/20 border text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 ${errors.startDate ? 'border-red-400' : 'border-white/30'}`}
                      />
                      {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                    </div>
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">End Date</label>
                      <input
                        onChange={(e) => { onChange(e) }}
                        id="endDate"
                        type="date"
                        value={inputs.endDate}
                        className={`w-full px-4 py-3 rounded-lg bg-white/20 border text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 ${errors.endDate ? 'border-red-400' : 'border-white/30'}`}
                      />
                      {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                    </div>
                  </div>
                </div>

                {/* Special Requirements */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Special Requirements
                  </h3>
                  <textarea
                    onChange={(e) => { onChange(e) }}
                    id="specialRequirements"
                    placeholder="Tell us about your travel preferences..."
                    value={inputs.specialRequirements}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-teal-100 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-4 rounded-lg text-lg font-bold hover:from-teal-600 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    {isSubmitting ? "Submitting..." : "Get Your Custom Trip Plan"}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-teal-400 mb-4">Heartful Miles</h3>
              <p className="text-gray-400">
                Crafting you with unforgettable memories.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Custom Itineraries</li>
                <li>Affordable Travel</li>
                <li>Group Tours</li>
                <li>Corporate Travel</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Destinations</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Tamil Nadu</li>
                <li>Kerala</li>
                <li>Andhra Pradesh</li>
                <li>Karnataka</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/heartfulmiles?igsh=ZDIxNnUxNGlydjI3" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="mailto:heartfulmiles@gmail.com" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h20.728c.904 0 1.636.732 1.636 1.636zM12 13.091L2.182 6.545h19.636L12 13.091z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Heartful Miles. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <Toaster position="bottom-center" />
    </div>
  );
}
