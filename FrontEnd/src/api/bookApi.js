import axiosInstance from '../axios/axiosInstance';
import { toast } from "react-hot-toast";

export const fetchAllBooks = async () => {
  try {
    const response = await axiosInstance.get('/book');
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
};


// Fetch all books and cart count
export const fetchBooksData = async () => {
  const response = await axiosInstance.get("/book");
  const cartResponse = await axiosInstance.get(`/cart?userId=${localStorage.getItem("userID")}`);
  return {
    books: response.data,
    cartCount: cartResponse.data.length,
  };
};

// Fetch the user's purchase statuses and handle notifications
export const fetchPurchaseStatuses = async (userId) => {
  const purchasedResponse = await axiosInstance.get(`/purchase/${userId}`);
  const purchasedBooks = purchasedResponse.data;
  const statusMap = {};

  purchasedBooks.forEach((purchase) => {
    statusMap[purchase.bookID._id] = purchase.status;

    const notificationKey = `notified_${userId}_${purchase.bookID._id}`;
    if (!localStorage.getItem(notificationKey)) {
      if (purchase.status === "Approved") {
        toast.success(`Your purchase request for "${purchase.bookID.title}" has been approved! You can now read this book.`);
        localStorage.setItem(notificationKey, true); // Mark as notified
      } else if (purchase.status === "Rejected") {
        toast.error(`Your purchase request for "${purchase.bookID.title}" was rejected.`);
        localStorage.setItem(notificationKey, true); // Mark as notified
      }
    }
  });

  return {
    bookIds: purchasedBooks.map((purchase) => purchase.bookID._id),
    statusMap,
  };
};

// Fetch the user's reading history
export const fetchReadingHistory = async (userId) => {
  const historyResponse = await axiosInstance.get(`/readinghistory/${userId}`);
  const historyMap = {};
  historyResponse.data.forEach((entry) => {
    historyMap[entry.bookID._id] = entry;
  });

  return { historyMap };
};

// Add a book to the cart
export const addToCart = async (bookId) => {
  const userId = localStorage.getItem("userID");
  await axiosInstance.post("/cart", { userId, bookId });
  toast.success("Book added to cart successfully.");
};
