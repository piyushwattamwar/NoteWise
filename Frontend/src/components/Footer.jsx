import React from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-12 py-6 shadow-inner">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm">
        <div className="text-center md:text-left mb-4 md:mb-0">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold">Notes Saver</span>. All rights
          reserved.
        </div>

        <div className="flex gap-6 text-lg">
          <a
            href="https://github.com/piyushwattamwar"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-300 transition-colors duration-300 flex items-center gap-2"
          >
            <FaGithub /> <span className="hidden sm:inline">GitHub</span>
          </a>

          <a
            href="https://www.linkedin.com/in/piyush-wattamwar-5b959a251/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-300 transition-colors duration-300 flex items-center gap-2"
          >
            <FaLinkedin /> <span className="hidden sm:inline">LinkedIn</span>
          </a>

          <a
            href="piyush31wattamwar@gmail.com"
            className="hover:text-yellow-300 transition-colors duration-300 flex items-center gap-2"
          >
            <FaEnvelope /> <span className="hidden sm:inline">Contact</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
