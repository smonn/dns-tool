/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { ReactNode } from "react";
import "./Layout.css";


const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main>{children}</main>
  )
}

export default Layout
