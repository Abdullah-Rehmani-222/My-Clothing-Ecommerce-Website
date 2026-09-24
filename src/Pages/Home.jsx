import Navbar from "../componenets/Navbar.jsx";
import Sidebar from "../componenets/Sidebar.jsx";
import Hero from "../componenets/Hero.jsx";
import Product from "../componenets/ProductLayout.jsx";
import Footer from "../componenets/Footer.jsx";
import Toast from "../componenets/ToastNotification.jsx";

const Home = ({
  count,
  isCount,
  isMenuOpen,
  toggleMenu,
  toastOn,
  toastClose,
  isToast,
  toastMessage,
  addToCart,
}) => {
  return (
    <>
      <Navbar toggleMenu={toggleMenu} count={count} isCount={isCount} />
      <Sidebar isOpen={isMenuOpen} toggleMenu={toggleMenu} />
      <Hero />
      <Product toastOn={toastOn} addToCart={addToCart} />
      <Footer />
      <Toast
        isActive={isToast}
        close={toastClose}
        message={toastMessage || "Product added to cart!"}
      />
    </>
  );
};

export default Home;
