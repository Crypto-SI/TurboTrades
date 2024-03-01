import React from "react";
import dynamic from "next/dynamic";

const Header = dynamic(() => import("@/components/liquidity/header"), { 
  ssr: false,
  // loading: () => <SiderLoader/> 
});
const Layout: React.FC<{children: React.ReactNode}> = ({children}: {children: React.ReactNode}) => {

  return (
    <div className="grow w-full md:pl-3">
      <Header/>
      { children }
    </div>
  );
};

export default Layout;
