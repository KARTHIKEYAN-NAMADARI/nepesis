import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  it('renders landing page by default', () => {
    render(<App />);
    expect(screen.getByText('Your Personal Health Ecosystem')).toBeInTheDocument();
    expect(screen.getByText('Get Started Now')).toBeInTheDocument();
  });
});
