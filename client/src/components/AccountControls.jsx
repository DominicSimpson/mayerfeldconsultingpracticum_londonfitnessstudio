import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import AuthModal from "./AuthModal";
import DashboardModal from "./DashboardModal";

function AccountControls() {
  const { user, loading, logout } = useAuth();

  const [authMode, setAuthMode] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const [signingOut, setSigningOut] = useState(false);

  async function handleLogout() {
    if (signingOut) return;

    setLogoutError("");
    setSigningOut(true);

    try {
      await logout();
      setDashboardOpen(false);
    } catch (error) {
      setLogoutError(error.message || "Unable to sign out");
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <>
      {!loading &&
        (user ? (
          <div class="flex flex-col gap-2 text-white font-p-text">
            <span className="text-sm">Hi, {user.name}</span>

            <button
              type="button"
              onClick={() => setDashboardOpen(true)}
              className="rounded-md border border-white
                    px-3 py-2 hover:bg-white hover:text-black"
            >
              My Dashboard
            </button>

            <button
              type="button"
              onClick={handleLogout}
              disabled={signingOut}
              aria-label="Sign out"
              className="rounded-md border border-white
                px-3 py-2 hover:bg-white hover:text-black
                disabled:opacity-50"
            >
              {signingOut ? "Signing out..." : "Sign out"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 text-white font-p-text">
            <button
              type="button"
              onClick={() => setAuthMode("login")}
              className="rounded-md border border-white px-3 py-2 hover:bg-white hover:text-black"
            >
              Sign in
            </button>

            <button
              type="button"
              onClick={() => setAuthMode("signup")}
              className="rounded-md bg-white text-black
            px-3 py-2 hover:bg-gray-200"
            >
              Sign up
            </button>
          </div>
        ))}

      {logoutError && (
        <p role="alert" className="text-red-200 text-sm font-p-text">
          {logoutError}
        </p>
      )}

      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onSwitchMode={setAuthMode}
        />
      )}

      {dashboardOpen && user && (
        <DashboardModal onClose={() => setDashboardOpen(false)} />
      )}
    </>
  );
}

export default AccountControls;
