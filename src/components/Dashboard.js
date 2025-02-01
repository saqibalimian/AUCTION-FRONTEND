import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchItems } from '../api';
import moment from 'moment';

const Dashboard = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await fetchItems();
        setItems(data);
      } catch (error) {
        alert('Failed to load items. Please try again.');
      }
    };
    loadItems();
  }, []);

  const calculateRemainingTime = (auctionDuration) => {
    const now = moment();
    const endTime = moment(auctionDuration);
    const diff = endTime.diff(now);

    if (diff <= 0) return 'Auction Ended';
    return moment.duration(diff).humanize();
  };

  return (
    <div>
      <h2>Auction Dashboard</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <Link to={`/items/${item.id}`}>
              <strong>{item.name}</strong>: {item.description}
              <br />
              Starting Price: ${item.starting_price}
              <br />
              Current Highest Bid: ${item.current_highest_bid || 'No bids yet'}
              <br />
              Time Left: {calculateRemainingTime(item.auction_duration)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;