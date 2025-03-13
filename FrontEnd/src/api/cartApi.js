// cartFunctions.js
import Swal from 'sweetalert2';
import axiosInstance from '../axios/axiosInstance';
import toast from 'react-hot-toast';

export const fetchCartItems = async (setCartItems, setTotalPrice, userId) => {
  try {
    const response = await axiosInstance.get(`/cart?userId=${userId}`);
    setCartItems(response.data);
    const price = response.data.reduce((total, item) => total + item.bookID.price, 0);
    setTotalPrice(price);
  } catch (error) {
    toast.error('Error fetching cart items');
  }
};

export const handleRemoveFromCart = async (cartItemId, cartItems, setCartItems, setTotalPrice) => {
 
    const result = await Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!',
    });

    if (result.isConfirmed) {
      const response = await axiosInstance.delete(`/cart/${cartItemId}`);
      setCartItems(cartItems.filter((item) => item._id !== cartItemId));
      setTotalPrice(totalPrice - cartItems.find((item) => item._id === cartItemId).bookID.price);

      Swal.fire({
        title: 'Removed!',
        text: 'Book removed from cart successfully.',
        icon: 'success',
      });
    }
  
};

export const handlePurchase = async (userId, cardInfo, cardHolderName, cartItems, navigate) => {
  try {
    await axiosInstance.post('/purchase', { userId, cardInfo, cardHolderName, cartItems });
    toast.success('Purchase request sent successfully! Please wait for admin approval.');
    navigate('/book');
  } catch (error) {
    toast.error('Error processing purchase');
  }
};
