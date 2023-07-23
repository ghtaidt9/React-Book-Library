import { Outlet, useNavigate } from "react-router-dom";
import { Navbar } from "./NavbarAndFooter/Navbar";
import { Footer } from "./NavbarAndFooter/Footer";
import { oktaConfig } from "./../lib/oktaConfig";
import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";
import { Security } from "@okta/okta-react";

const oktaAuth = new OktaAuth(oktaConfig);

export const RootLayout = () => {
  const navigate = useNavigate();

  const customAuthHandler = () => {
    navigate("/login");
  };

  const restoreOriginalUri = async (_oktaAuth: any, originalUri: any) => {
    navigate(toRelativeUrl(originalUri || "/", window.location.origin), {
      replace: true,
    });
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Security
        oktaAuth={oktaAuth}
        restoreOriginalUri={restoreOriginalUri}
        onAuthRequired={customAuthHandler}
      >
        <Navbar />
        <main className="flex-grow-1">
          <Outlet />
        </main>
        <Footer />
      </Security>
    </div>
  );
};
