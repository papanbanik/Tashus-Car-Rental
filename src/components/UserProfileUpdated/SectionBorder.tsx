import { ReactNode } from 'react';

const SectionBorder = ({ children }: { children: ReactNode }) => {
  return <div className="border border-solid border-accent rounded-lg h-full p-4">{children}</div>;
};

export default SectionBorder;
