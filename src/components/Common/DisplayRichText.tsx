import React from 'react';
import './DisplayRichText.css';

interface EditorProp {
  content: string;
}

const DisplayRichText = ({ content }: EditorProp) => {
  return <span className="rich-text-container" dangerouslySetInnerHTML={{ __html: content }} />;
};

export default DisplayRichText;
