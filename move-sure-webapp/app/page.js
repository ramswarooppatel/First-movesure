"use client";
import { useState, useEffect } from 'react';
import Hero from "@/components/common/Hero";
import FeaturesSection from "@/components/common/FeaturesSection";
import Footer from "@/components/common/Footer";
import Loader from "@/components/common/Loader";
import useLoader from "@/hooks/useLoader";

export default function Home() {
  const { isLoading } = useLoader(4000); // 4 second minimum load time

  return (
    <>
      <Loader isLoading={isLoading} />
      {!isLoading && (
        <div className="min-h-screen bg-white animate-fade-in-up">
          <Hero />
          <FeaturesSection />
          <Footer />
        </div>
      )}
    </>
  );
}
