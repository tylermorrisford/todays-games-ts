import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('When viewing the App', () => {
  it('should render expected dashboard elements', () => {
    render(<App />);
    const nhlLogo = screen.getByAltText(/NHL Logo/i);
    const standings = screen.getByRole('table');
    // const leaders = screen.getByText(/Stats Leaders/i);
    // const goalLeaders = screen.getByText(/goals leaders/i);
    const nextButton = screen.getByRole('button', { name: /next/i });

    expect(nhlLogo).toBeInTheDocument();
    expect(standings).toBeInTheDocument();
    // expect(leaders).toBeInTheDocument();
    // expect(goalLeaders).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });
});
