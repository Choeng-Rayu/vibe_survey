import React from 'react';

/**
 * Hidden honeypot input used for fraud detection.
 * The field is rendered in the DOM but not visible to users.
 */
interface HoneypotFieldProps {
  name: string;
  register: (name: string) => ReturnType<unknown>;
}

const HoneypotField: React.FC<HoneypotFieldProps> = ({ name, register }) => (
  <input
    type="text"
    {...register(name)}
    style={{ display: 'none' }}
    tabIndex={-1}
    aria-hidden="true"
  />
);

export default HoneypotField;
