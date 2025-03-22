"use client";
import { AtomIcon, Edit, Share2 } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";

function Hero() {
  const textArray = ["In Seconds Not in Hours"];
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const divRefs = [useRef(null), useRef(null), useRef(null)];
  const [visible, setVisible] = useState([false, false, false]);

  // Typewriter Effect
  useEffect(() => {
    const typingSpeed = isDeleting ? 50 : 100;

    const handleTyping = () => {
      if (!isDeleting && subIndex === textArray[index].length) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && subIndex === 0) {
        setIsDeleting(false);
      }

      setText(textArray[index].substring(0, subIndex));
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [subIndex, isDeleting, index]);

  // Scroll Animation for Divs
  useEffect(() => {
    const handleScroll = () => {
      divRefs.forEach((ref, i) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            setVisible((prev) => {
              const newVisible = [...prev];
              newVisible[i] = true;
              return newVisible;
            });
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="min-h-100 bg-[url('/grid.svg')]">
      <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl font-extrabold sm:text-5xl">
            Create your Form
            <strong className="font-extrabold text-primary sm:block">
              {text}
            </strong>
          </h1>

          <p className="mt-4 sm:text-xl/relaxed text-gray-500">
            Generate, publish and share your form right away with AI. Dive into
            insightful results, charts and analytics.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              className="block w-full rounded bg-primary px-12 py-3 text-sm font-medium text-white shadow hover:bg-purple-600 focus:outline-none focus:ring active:bg-red-500 sm:w-auto"
              href="/dashboard"
            >
              + Create AI Form
            </a>

          </div>
        </div>
      </div>

      <section className="h-[500px] bg-[url('/grid.svg')] bg-cover bg-center">
        <section className="bg-gray-50 py-24">
          <div className="mx-auto max-w-screen-xl px-6 text-center">
            <h2 className="text-4xl font-bold">How it Works</h2>
            <p className="mt-4 text-gray-500 max-w-lg mx-auto">
              Effortlessly create, customize, and share AI-powered forms with
              just a few clicks.
            </p>
            <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div
                ref={divRefs[0]}
                className={`block rounded-xl border border-gray-300 p-8 shadow-md bg-white transition-all duration-700 ease-out ${
                  visible[0] ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                }  hover:shadow-2xl hover:scale-105 cursor-pointer`}
              >
                <AtomIcon className="h-10 w-10 text-primary mx-auto" />
                <h2 className="mt-6 text-xl font-semibold text-gray-900">
                  Write a Prompt for Your Form
                </h2>
                <p className="mt-2 text-gray-600">
                  Describe your form and let AI generate it instantly.
                </p>
              </div>

              <div
                ref={divRefs[1]}
                className={`block rounded-xl border border-gray-300 p-8 shadow-md bg-white transition-all duration-700 ease-out ${
                  visible[1] ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                }  hover:shadow-2xl hover:scale-105 cursor-pointer`}
              >
                <Edit className="h-10 w-10 text-primary mx-auto" />
                <h2 className="mt-6 text-xl font-semibold text-gray-900">
                  Edit Your Form
                </h2>
                <p className="mt-2 text-gray-600">
                  Customize the fields, layout, and settings as needed.
                </p>
              </div>

              <div
                ref={divRefs[2]}
                className={`block rounded-xl border border-gray-300 p-8 shadow-md bg-white transition-all duration-700 ease-out ${
                  visible[2] ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                }  hover:shadow-2xl hover:scale-105 cursor-pointer`}
              >
                <Share2 className="h-10 w-10 text-primary mx-auto" />
                <h2 className="mt-6 text-xl font-semibold text-gray-900">
                  Share & Accept Responses
                </h2>
                <p className="mt-2 text-gray-600">
                  Publish your form and start collecting responses instantly.
                </p>
              </div>
            </div>
            <div className="mt-12">
              <a
                href="/sign-in"
                className="inline-block rounded bg-primary px-12 py-3 text-lg font-medium text-white transition hover:bg-purple-700 animate-bounce"
              >
                Get Started Today
              </a>
            </div>
          </div>
        </section>
      </section>
    </section>
  );
}

export default Hero;
