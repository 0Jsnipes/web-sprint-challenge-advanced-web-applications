import React from 'react';
import { render, screen } from '@testing-library/react';
import Spinner from './Spinner';

describe('Spinner Component', () => {
  test('does not render spinner when "on" is false', () => {
    render(<Spinner on={false} />);
    const spinnerElement = screen.queryByText(/please wait/i);
    expect(spinnerElement).toBeNull();  // The spinner should not be in the document
  });
});
