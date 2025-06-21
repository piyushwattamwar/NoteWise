import React, { useState } from "react";
import { FaQuestionCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";

const faqs = [
  {
    category: "Getting Started",
    question: "How do I create a new note in NoteWise?",
    answer:
      "Go to the Home page, enter your note title, content, select a category, and click 'Create Note'.",
  },
  {
    category: "Features",
    question: "What is the 'Suggest Title' button?",
    answer:
      "It uses AI to automatically generate a relevant title based on your note content.",
  },
  {
    category: "Features",
    question: "How does 'Suggest Category' work?",
    answer:
      "Clicking it will use AI to classify your note into a suitable category like Work, Ideas, or Personal.",
  },
  {
    category: "Features",
    question: "What does the 'Summarize' button do?",
    answer:
      "It uses AI to generate a short summary of your note to give you a quick overview.",
  },
  {
    category: "Notes",
    question: "Can I pin or star important notes?",
    answer:
      "Yes. Click the star icon on a note to pin it to the top for quick access.",
  },
  {
    category: "Notes",
    question: "How can I download or share a note?",
    answer:
      "You can download any note as a text file or copy a shareable link using the buttons provided on each note.",
  },
  {
    category: "Account",
    question: "How do I log out of my account?",
    answer:
      "Click your name in the navbar and select 'Logout' from the dropdown menu.",
  },
  {
    category: "Troubleshooting",
    question: "Why are my notes not saving?",
    answer:
      "Ensure you're logged in and check your internet connection. If the issue persists, contact support.",
  },
];

const Help = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <div className="p-8 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <FaQuestionCircle className="text-yellow-500 text-3xl" />
          <h1 className="text-3xl font-bold">Help & Support</h1>
        </div>

        <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
          Find answers to the most common questions about using{" "}
          <span className="font-semibold text-yellow-600">NoteWise</span>.
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="flex justify-between items-center w-full p-4 text-left text-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <span>{faq.question}</span>
                {openIndex === index ? (
                  <FaChevronUp className="text-yellow-500" />
                ) : (
                  <FaChevronDown className="text-yellow-500" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-4 pb-4 text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-gray-600 dark:text-gray-400">
          Still need help? Contact us at{" "}
          <span className="text-yellow-600 font-semibold">
            support@notewise.app
          </span>
        </p>
      </div>
    </div>
  );
};

export default Help;
