import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BidForm from './BidForm';

// Mock the placeBid API function
jest.mock('../api', () => ({
  placeBid: jest.fn(),
}));

describe('BidForm Component', () => {
  const mockPlaceBid = require('../api').placeBid;
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    mockPlaceBid.mockReset();
    mockOnSuccess.mockReset();
  });

  it('renders the form correctly', () => {
    render(<BidForm itemId={1} currentHighestBid={500} onSuccess={mockOnSuccess} />);

    // Check if the form elements are rendered
    expect(screen.getByText(/Place a Bid/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter bid amount/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit Bid/i })).toBeInTheDocument();
  });

  it('displays an error message when the bid amount is invalid', async () => {
    render(<BidForm itemId={1} currentHighestBid={500} onSuccess={mockOnSuccess} />);

    // Enter an invalid bid amount
    const input = screen.getByPlaceholderText(/Enter bid amount/i);
    await userEvent.type(input, '400');
    const submitButton = screen.getByRole('button', { name: /Submit Bid/i });
    await userEvent.click(submitButton);

    // Check if the error message is displayed
    expect(await screen.findByText(/Bid must be higher than the current highest bid./i)).toBeInTheDocument();
  });

  

  it('displays an error message when the API call fails', async () => {
    // Mock a failed API response
    mockPlaceBid.mockRejectedValue(new Error('API error'));

    render(<BidForm itemId={1} currentHighestBid={500} onSuccess={mockOnSuccess} />);

    // Enter a valid bid amount
    const input = screen.getByPlaceholderText(/Enter bid amount/i);
    await userEvent.type(input, '600');
    const submitButton = screen.getByRole('button', { name: /Submit Bid/i });
    await userEvent.click(submitButton);

    // Wait for the API call to fail
    await waitFor(() => expect(mockPlaceBid).toHaveBeenCalledWith(1, 1, 600));

    // Check if the error message is displayed
    expect(await screen.findByText(/Failed to place bid. Please try again./i)).toBeInTheDocument();
  });
});