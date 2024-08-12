import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // for more matchers
import Spinner from './Spinner';

test('Spinner renders correctly when on is true', () => {
  render(<Spinner on={true} />);
  const spinnerElement = screen.getByTestId('spinner'); // Assuming you have a data-testid in Spinner component
  expect(spinnerElement).toBeInTheDocument();
  expect(spinnerElement).toHaveClass('spinner-on'); // Example className, adjust according to your Spinner component
});

test('Spinner does not render when on is false', () => {
  render(<Spinner on={false} />);
  const spinnerElement = screen.queryByTestId('spinner');
  expect(spinnerElement).not.toBeInTheDocument();
});
