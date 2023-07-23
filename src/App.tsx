import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "./layout/HomePage/HomePage";
import { SearchBooksPage } from "./layout/SearchBooksPage/SearchBooksPage";
import { RootLayout } from "./layout/Root";
import { BookCheckoutPage } from "./layout/BookCheckoutPage/BookCheckoutPage";
import LoginWidget from "./Auth/LoginWidget";
import { oktaConfig } from "./lib/oktaConfig";
import { LoginCallback } from "@okta/okta-react";
import { ReviewListPage } from "./layout/BookCheckoutPage/ReviewListPage/ReviewListPage";
import { ShelfPage } from "./layout/ShelfPage/ShelfPage";
import { MessagesPage } from "./layout/MessagePage/MessagesPage";
import { MangeLibraryPage } from "./layout/ManageLibraryPage/ManageLibraryPage";
import { PaymentPage } from "./layout/PaymentPage/PaymentPage";

export const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/home",
          element: <HomePage />,
        },
        {
          path: "/search",
          element: <SearchBooksPage />,
        },
        {
          path: "/reviewList/:bookId",
          element: <ReviewListPage />,
        },
        {
          path: "/checkout/:bookId",
          element: <BookCheckoutPage />,
        },
        {
          path: "/login",
          element: <LoginWidget config={oktaConfig} />,
        },
        {
          path: "/login/callback",
          element: <LoginCallback />,
        },
        {
          path: "/shelf",
          element: <ShelfPage />,
        },
        {
          path: "/messages",
          element: <MessagesPage />,
        },
        {
          path: "/admin",
          element: <MangeLibraryPage />,
        },
        {
          path: "/fees",
          element: <PaymentPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};
