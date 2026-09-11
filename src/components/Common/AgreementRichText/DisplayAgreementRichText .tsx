import React from 'react';
import './DisplayAgreementRichText .css';

interface EditorProp {
  content: string;
}

const DisplayAgreementRichText = ({ content }: EditorProp) => {
  return <span className="rich-text-container" dangerouslySetInnerHTML={{ __html: content }} />;
};

export default DisplayAgreementRichText;
