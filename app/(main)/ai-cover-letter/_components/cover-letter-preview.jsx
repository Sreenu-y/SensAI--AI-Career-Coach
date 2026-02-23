"use client";

import React from "react";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const CoverLetterPreview = ({ content }) => {
  return (
    <div className="py-4" data-color-mode="light">
      <MDEditor.Markdown
        source={content}
        style={{
          padding: 24,
          minHeight: 700,
          backgroundColor: "transparent",
          color: "inherit",
        }}
      />
    </div>
  );
};

export default CoverLetterPreview;
