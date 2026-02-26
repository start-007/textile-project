import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import SplashCursor from './SplashCursor'


const Layout: React.FC = () => {
  return (
    <>
    <SplashCursor />
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};


export default Layout;