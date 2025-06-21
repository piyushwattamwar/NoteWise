import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const ViewPaste = () => {
  const { id } = useParams();
  const allpastes = useSelector((state) => state.paste.pastes);
  const [paste, setPaste] = useState(null);

  useEffect(() => {
    const foundPaste = allpastes.find((p) => p._id === id);
    setPaste(foundPaste);
  }, [id, allpastes]);

  if (!paste) {
    return (
      <div className="text-center mt-10 text-gray-500">Paste not found.</div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-row gap-7 justify-between">
        <input
          className="p-2 rounded-xl mt-2 w-[66%] pl-4 border border-gray-400"
          type="text"
          value={paste.title}
          disabled
        />
      </div>

      <div className="mt-8">
        <textarea
          className="rounded-xl mt-4 min-w-[500px] p-4 w-full border border-gray-300"
          value={paste.content}
          disabled
          rows={20}
        />
      </div>

      <div className="text-sm text-gray-500 mt-2">
        Created At: {new Date(paste.createdAt).toLocaleString()}
      </div>
    </div>
  );
};

export default ViewPaste;
