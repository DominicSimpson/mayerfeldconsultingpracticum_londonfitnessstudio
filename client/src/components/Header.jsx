import { useState } from "react";
import logo from "../assets/logo/lfs_logo.png";
import { useCart } from "./CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import AuthModal from "./AuthModal.jsx";

function Header() {
  const { totalItems, setIsCartOpen } = useCart();
  const { user, loading, logout } = useAuth();

  const [authMode, setAuthMode] = useState(null);
  const [logoutError, setLogoutError] = useState("");
  const [signingOut, setSigningOut] = useState(false);

  async function handleLogout() {
    if (signingOut) return;

    setLogoutError("");
    setSigningOut(true);

    try {
      await logout();
    } catch (error) {
      setLogoutError(error.message || "Unable to sign out");
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <>
      <header
        className="grid grid-cols-[auto_minmax(0,1fr)_auto] 
      items-center gap-y-4 p-4 bg-header-footer
      [grid-template-areas:'logo_title_controls'_'nav_nav_nav']
      sm:grid-cols-[1fr_auto_1fr]"
      >
        <a
          href={import.meta.env.BASE_URL}
          className="[grid-area:logo] justify-self-start p-2.5 sm:p-5"
        >
          <img
            className="h-20 w-auto block"
            src={logo}
            alt="London Fitness Studio Logo"
          />
        </a>

        <h1
          className="[grid-area:title] font-heading text-left 
        text-[clamp(1.5rem,7vw,2rem)] 
        sm:text-center sm:text-[clamp(2rem,6vw,5rem)]
         text-white"
        >
          LONDON FITNESS STUDIO
        </h1>

        <div
          className="[grid-area:controls] justify-self-end 
      flex flex-wrap items-center justify-end gap-3"
        >
          {!loading &&
            (user ? (
              <div className="flex flex-col gap-2 text-white font-p-text">
                <span className="text-sm">Hi, {user.name}</span>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={signingOut}
                  aria-label="Sign out"
                  className="rounded-md border border-white
                    px-3 py-2 hover:bg-white hover:text-black
                    disabled:opacity-50 font-p-text"
                >
                  {signingOut ? "Signing out..." : "Sign out"}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 text-white font-p-text">
                <button
                  type="button"
                  onClick={() => {
                    console.log("Sign in clicked");
                    setAuthMode("login");
                  }}
                  className="rounded-md border border-white
                    px-3 py-2 hover:bg-white hover:text-black font-p-text"
                >
                  Sign in
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMode("signup")}
                  className="rounded-md bg-white text-black                   
                  px-3 py-2 hover:bg-gray-200 font-p-text"
                >
                  Sign up
                </button>
              </div>
            ))}

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            aria-label={`Open cart, ${totalItems} items`}
            title={`View cart (${totalItems} ${
              totalItems === 1 ? "item" : "items"
            })`}
            className="text-2xl size-16 text-white font-p-text"
          >
            🛒
            {totalItems > 0 && (
              <span className="text-base font-bold font-p-text">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        {logoutError && (
          <p
            role="alert"
            className="col-span-full text-red-200 text-sm text-right font-p-text"
          >
            {logoutError}
          </p>
        )}
      </header>

      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => {
            console.log("AuthModal onClose triggered");
            setAuthMode(null);
          }}
          onSwitchMode={setAuthMode}
        />
      )}
    </>
  );
}

export default Header;
