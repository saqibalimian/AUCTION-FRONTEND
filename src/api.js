import axios from 'axios';

const API_URL = 'https://auction-backend-pvth.onrender.com'; // Replace with your Render backend URL

// Fetch all items
export const fetchItems = async () => {
  try {
    const response = await axios.get(`${API_URL}/items`);
    return response.data;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

// Fetch details of a specific item
export const fetchItemDetails = async (itemId) => {
  try {
    const response = await axios.get(`${API_URL}/items/${itemId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching item detail:', error);
    throw error;
  }
};

// Place a bid
export const placeBid = async (item_id, user_id, amount) => {
  try {
    const response = await axios.post(`${API_URL}/bids`, { item_id, user_id, amount });
    console.log('Response Message:', response.data.message);
   
    return response.data;
  } catch (error) {
    //console.error('Error fetching item details:', error);
   // throw error;
    console.error('Error placing bid:', error.response ? error.response.data.message : error.message);
    throw new Error(error.response ? error.response.data.message : 'Error placing bid');
  }
};