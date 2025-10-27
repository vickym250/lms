import React from 'react'
import Navbar from '../component/Header'
import Hero from '../component/section'
import FeaturedCourses from '../component/FetureCourse'
import Footer from '../component/footer'

export default function HomePage() {
  return (
       <>
   <Navbar/>
   <Hero/>
   <FeaturedCourses/>
   <Footer/>
    </>
  )
}
