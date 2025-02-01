import React, { useState } from 'react';
import { placeBid } from '../api';

const BidForm = ({ itemId, currentHighestBid, onSuccess }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bidAmount || parseFloat(bidAmount) <= currentHighestBid) {
      setError('Bid must be higher than the current highest bid.');
      return;
    }
    try {
      const response = await placeBid(itemId, 1, parseFloat(bidAmount)); // Hardcoded user ID for simplicity
      console.log('Bid response:', response); // Log the response for debugging
      setBidAmount('');
      setError('');

    } catch (error) {
      console.error('Error placing bid:', error); // Log the error for debugging
      setError('Failed to place bid. Please try again.' + error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <h3>Place a Bid</h3>
      <input
        type="number"
        placeholder="Enter bid amount"
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
        required
      />
      <button type="submit">Submit Bid</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default BidForm;