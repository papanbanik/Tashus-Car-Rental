'use client';

import 'react-phone-input-2/lib/semantic-ui.css';
import { FormEvent } from 'react';

type CommonFormProps = {
  handleFunction: (event: FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
};

const CommonForm = ({ handleFunction, children }: CommonFormProps) => {
  return (
    <div>
      <form autoComplete="off" onSubmit={handleFunction}>
        {children}
      </form>
    </div>
  );
};

export default CommonForm;
