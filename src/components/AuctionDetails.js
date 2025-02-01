import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchItemDetails } from '../api';
import { io } from 'socket.io-client';
import moment from 'moment';
import BidForm from './BidForm';

const AuctionDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [auctionEnded, setAuctionEnded] = useState(false);

  console.log('Item ID:', id);

  useEffect(() => {
    const loadItem = async () => {
      try {
        const data = await fetchItemDetails(id);
        setItem(data);
        console.log('Item Details:', data);
        // Check if the auction has ended
        if (moment(data.auction_duration).isBefore(moment())) {
          setAuctionEnded(true);
        }
      } catch (error) {
        alert('Failed to load item details. Please try again.');
      }
    };
    loadItem();
  }, [id]);

  useEffect(() => {
    const socket = io(process.env.WS_URL, {
      transports: ["websocket"],
    
    });

    socket.on('bidUpdate', (data) => {
      if (data.item_id === parseInt(id)) {
        setItem((prev) => ({
          ...prev,
          current_highest_bid: data.amount,
        }));
      }
    });

    return () => socket.disconnect();
  }, [id]);
 
  if (!item) return <p>Loading...</p>;

  return (
    <div>
      <h2>{item.name}</h2>
      <p>{item.description}</p>
      <p>Starting Price: ${item.starting_price}</p>
      <p>Current Highest Bid: ${item.current_highest_bid || 'No bids yet'}</p>
      <p>Time Left: {auctionEnded ? 'Auction has ended' : moment(item.auction_duration).fromNow()}</p>

      {/* Add the BidForm component and disable it if the auction has ended */}
      {!auctionEnded ? <BidForm itemId={item.id} /> : <p>The auction has ended. You can no longer place bids.</p>}
    </div>
  );
};

export default AuctionDetails;