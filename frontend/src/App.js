import Footer from './components/Footer';
import AdminRoute from './components/AdminRoute';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import AboutScreen from './screens/AboutScreen';
import CartScreen from './screens/CartScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import OrderScreen from './screens/OrderScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import ProfileScreen from './screens/ProfileScreen';
import ProductScreen from './screens/ProductScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShippingScreen from './screens/ShippingScreen';
import WishlistScreen from './screens/WishlistScreen';
import OrderListScreen from './screens/admin/OrderListScreen';
import ProductCreateScreen from './screens/admin/ProductCreateScreen';
import ProductEditScreen from './screens/admin/ProductEditScreen';
import ProductListScreen from './screens/admin/ProductListScreen';
import UserEditScreen from './screens/admin/UserEditScreen';
import UserListScreen from './screens/admin/UserListScreen';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/bootstrap-custom.css';
import './styles/App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/about" element={<AboutScreen />} />
        <Route path="/product/:id" element={<ProductScreen />} />
        <Route path="/cart" element={<CartScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="" element={<PrivateRoute />}>
          <Route path="/shipping" element={<ShippingScreen />} />
          <Route path="/payment" element={<PaymentScreen />} />
          <Route path="/placeorder" element={<PlaceOrderScreen />} />
          <Route path="/order/:id" element={<OrderScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/wishlist" element={<WishlistScreen />} />
          <Route path="/orderhistory" element={<OrderHistoryScreen />} />
        </Route>
        <Route path="" element={<AdminRoute />}>
          <Route path="/admin/orderlist" element={<OrderListScreen />} />
          <Route path="/admin/productlist" element={<ProductListScreen />} />
          <Route path="/admin/product/create" element={<ProductCreateScreen />} />
          <Route path="/admin/product/:id/edit" element={<ProductEditScreen />} />
          <Route path="/admin/userlist" element={<UserListScreen />} />
          <Route path="/admin/user/:id/edit" element={<UserEditScreen />} />
        </Route>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
