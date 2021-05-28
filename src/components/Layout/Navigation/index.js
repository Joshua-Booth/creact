import React, { useState, useEffect } from "react";

// Components
import SideNavigation from "./Side";
import BottomNavigation from "./Bottom";

// Utilities
import { isMobile } from "utils/device";

/**
 * Component container for displaying the app navigation.
 *
 * @example
 * return (
 *   <Navigation />
 * )
 * @returns {React.Component} The navigation component
 */
function Navigation() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(window.innerWidth);
    window.addEventListener("resize", handleWindowSizeChange);

    // returned function will be called on component unmount
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };

  if (isMobile(width)) {
    return <BottomNavigation />;
  } else {
    return <SideNavigation />;
  }
}

export default Navigation;
