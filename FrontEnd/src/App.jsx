import React, {useState} from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';

import Navbar from './components/Narbar/Navbar';
import Home from './components/Home/Home';
import Books from './pages/Books/Books.jsx';
import Login from './components/SignUpLogin/Login.jsx';
import Signup from './components/SignUpLogin/SignUp.jsx';
import ReadBook from './pages/Books/BookRead.jsx';
import ReadingHistory from './pages/Books/ReadignHistory.jsx';
import SearchBooks from './components/Search/SearchBooks.jsx';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard.jsx';
import PurchaseRequests from './pages/AdminDashboard/ManagePurchase/PurchaseRequests.jsx';
import TrackBook from './pages/Books/TrackBook.jsx';
import ManageUsers from './pages/AdminDashboard/ManageUser.jsx';
import ManageAuthors from './pages/AdminDashboard/ManageAuthor/ManageAuthor';
import ManageCategories from './pages/AdminDashboard/ManageCategory/ManageCategory.jsx';
import CategoryForm from './pages/AdminDashboard/ManageCategory/CategoryForm.jsx';
import ManageBooks from './pages/AdminDashboard/ManageBooks/ManageBook.jsx';
import CartAndPurchase from './pages/Cart/CartAndPurchase.jsx';
import BookForm from './pages/AdminDashboard/ManageBooks/BookForm.jsx';
import AuthorForm from './pages/AdminDashboard/ManageAuthor/AuthorForm.jsx';
import SeeAllPurchases from './pages/AdminDashboard/ManagePurchase/SeeAllPurchases.jsx';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/routeGuard/ProtectedRoutes.jsx';
import UserDashboard from './components/userDashboard/UserDashboard.jsx';

// import AddProduct from './pages/Products/AddProduct.jsx';
import AllInvoices from './pages/Products/SaleProduct/PrintSaleInvoices/AllInvoices.jsx';
import SaleConsolidateInvoice from './pages/Products/SaleProduct/PrintSaleInvoices/SaleConsolidateInvoice.jsx';
import SellProduct from './pages/Products/SaleProduct/Sale/SellProduct.jsx';
import AllProducts from './pages/Products/SaleProduct/Sale/AllProducts.jsx';
import AddProductToList from './pages/Products/SaleProduct/Sale/AddProductsToList.jsx';
import PurchaseList from './pages/Products/PurchaseProduct/Purchase/PurchaseList.jsx';
import AssignTasks from './pages/Products/AssignTasks/AssignTasks.jsx';
import Products from './pages/Products/PurchaseProduct/Purchase/Products.jsx';
import FinzalizeOrder from './pages/Products/PurchaseProduct/Purchase/FinzalizeOrder.jsx';
import PreviewInvoice from './pages/Products/SaleProduct/PrintSaleInvoices/PreviewInvoice.jsx';
import AllPurchaseInvoices from './pages/Products/PurchaseProduct/PrintPurchaseInvoice/AllPurchaseInvoice.jsx';
import PreviewPurchaseInvoice from './pages/Products/PurchaseProduct/PrintPurchaseInvoice/PreviewPurchaseInvoice.jsx';
import ViewAllProducts from './pages/Products/AllProducts//ViewProducts/ViewAllProducts.jsx';
import AddNewProduct from './pages/Products/AllProducts/AddItems/AddNewProduct.jsx';
import AddNewCategory from './pages/Products/AllProducts/AddItems/AddNewCategory.jsx';
import AddNewColor from './pages/Products/AllProducts/AddItems/AddNewColor.jsx';
import AddNewTask from './pages/Products/AllProducts/AddItems/AddNewTask.jsx';
// import AdminHome from './pages/AdminHome.jsx';
import 'leaflet/dist/leaflet.css';


const AppLayout = ({ children }) => {
  const location = useLocation()
  const hideNavbarPaths = ["/login", "/signup", "/track/:bookId"]
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname)

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      {children}
    </>
  )
}

const App = () => {
  return (
    <Router>
      <AppLayout>
      <Toaster />
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* User Routes */}
        <Route
          path="/book"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <Books />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book/:bookId"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <ReadBook />
            </ProtectedRoute>
          }
        />
        <Route
          path="/track/:bookId"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <TrackBook />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <SearchBooks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <CartAndPurchase />
            </ProtectedRoute>
          }
        />
        <Route
          path="/readingHistory"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <ReadingHistory />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/admin/home"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminHome />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/assign-tasks"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AssignTasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-products"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ViewAllProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Add-product"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AddNewProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Add-category"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AddNewCategory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Add-task"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AddNewTask />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Add-color"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AddNewColor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/purchase-requests"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <PurchaseRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/print-invoices"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AllInvoices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/all-purchase-invoice"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AllPurchaseInvoices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/consolidate-invoices"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <SaleConsolidateInvoice />
            </ProtectedRoute>
          }
        />
        <Route
          path="/preview-purchase-invoice/:id"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <PreviewPurchaseInvoice />
            </ProtectedRoute>
          }
        />
        <Route
          path="/preview-invoice/:id"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <PreviewInvoice />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/sell-product"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <SellProduct  />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/all-products"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AllProducts  />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/generate-sale"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AddProductToList  />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Purchase-List"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <PurchaseList  />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Products"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Products  />
            </ProtectedRoute>
          }
        />
        <Route
          path="/finalize-purchase"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <FinzalizeOrder  />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/books"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageBooks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-book"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <BookForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-book/:id"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <BookForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageCategories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories/add"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <CategoryForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories/edit/:id"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <CategoryForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/authors"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageAuthors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-author"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AuthorForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-author/:authorId"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AuthorForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/purchases"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <SeeAllPurchases />
            </ProtectedRoute>
          }
        />
      </Routes>
      </AppLayout>
    </Router>
  );
};

export default App;
