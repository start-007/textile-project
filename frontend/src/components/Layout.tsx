import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import SplashCursor from './SplashCursor'

import Footer from "./footer";
const Layout: React.FC = () => {
  return (
    <>
    <SplashCursor />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />

    </>
  );
};


export default Layout;