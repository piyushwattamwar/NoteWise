import React from "react";
import {
  FaStickyNote,
  FaBolt,
  FaCloudUploadAlt,
  FaLock,
  FaMobileAlt,
  FaTags,
  FaStar,
  FaUserShield,
  FaEdit,
  FaDownload,
} from "react-icons/fa";

const About = () => {
  return (
    <div className="p-8 bg-gray-100 dark:bg-gray-900 dark:text-white min-h-screen">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
       
        <div className="flex items-center gap-3 mb-6">
          <FaStickyNote className="text-yellow-500 text-3xl" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            About NoteWise
          </h1>
        </div>

        
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
          <span className="font-semibold text-gray-800 dark:text-white">
            NoteWise
          </span>{" "}
          is a full-featured web application to help you manage and organize
          your notes securely. From authentication to personal note
          categorization, NoteWise is built to be powerful yet simple for
          students, developers, and professionals.
        </p>

       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureCard
            icon={<FaBolt className="text-blue-500 text-2xl mt-1" />}
            title="Fast & Simple"
            desc="Quickly add, edit, delete, pin, or share notes with ease."
          />

          <FeatureCard
            icon={<FaCloudUploadAlt className="text-green-500 text-2xl mt-1" />}
            title="Cloud Storage"
            desc="All notes are stored securely in MongoDB — accessible anytime, anywhere."
          />

          <FeatureCard
            icon={<FaUserShield className="text-purple-500 text-2xl mt-1" />}
            title="Authentication & Profiles"
            desc="Login to access your notes and view your activity stats on your profile."
          />

          <FeatureCard
            icon={<FaTags className="text-pink-500 text-2xl mt-1" />}
            title="Categories & Filtering"
            desc="Organize notes by category like Work, Ideas, or Personal and filter easily."
          />

          <FeatureCard
            icon={<FaStar className="text-yellow-500 text-2xl mt-1" />}
            title="Pin & Prioritize"
            desc="Star important notes to pin them at the top for quicker access."
          />

          <FeatureCard
            icon={<FaEdit className="text-blue-600 text-2xl mt-1" />}
            title="Edit Notes"
            desc="Update your notes anytime via a dedicated edit page."
          />

          <FeatureCard
            icon={<FaDownload className="text-green-700 text-2xl mt-1" />}
            title="Download Notes"
            desc="Download all notes as a ZIP file with one click for offline access."
          />

          <FeatureCard
            icon={<FaMobileAlt className="text-red-500 text-2xl mt-1" />}
            title="Responsive UI"
            desc="Optimized for desktops, tablets, and smartphones."
          />
        </div>

        
        <p className="text-center text-gray-700 dark:text-gray-300 mt-8 text-sm">
          Start using{" "}
          <span className="font-bold text-yellow-600">NoteWise</span> today to
          take control of your ideas — fast, safe, and organized.
        </p>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="flex items-start gap-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border hover:shadow transition">
    {icon}
    <div>
      <h3 className="font-semibold text-lg text-gray-700 dark:text-white">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">{desc}</p>
    </div>
  </div>
);

export default About;
