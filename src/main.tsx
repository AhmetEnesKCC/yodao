import * as React from "react";
import "./style.css";
import * as ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import Layout from "./components/Layout";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Layout>
    <RouterProvider router={router} />
  </Layout>
);
