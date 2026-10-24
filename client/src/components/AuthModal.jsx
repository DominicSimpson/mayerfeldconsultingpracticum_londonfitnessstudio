import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";

function AuthModal({ modal, onClose, onSwitchMode }) {
  const { login, signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.showModal();

    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  useEffect(() => {
    setError("");
    setPassword("");
  }, [mode]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;

    setError("");
    setSubmitting(true);

    try {
      if (mode === "signup") {
        await signup(name, email, password);
      }
      await login(email, password);
      onClose();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  function handleSwitch() {
    if (submitting) return;

    onSwitchMode(mode === "login" ? "signup" : "login");
  }

  return (
    // JSX here
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onCancel={(event) => {
        if (submitting) event.preventDefault();
      }}
      className="fixed inset-0 m-auto w-[min(90vw,28rem)]
        max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6
        text-gray-900 shadow-xl
        backdrop:bg-black/60"
      aria-labelledby="auth-modal-title"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 id="auth-modal-title" className="text-2xl font-bold">
          {mode === "login" ? "Sign in" : "Create an account"}
        </h2>

        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          aria-label="Close dialog"
          className="text-2xl hover:text-gray-500"
        >
          x
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {mode == "signup" && (
          <label className="flex flex-col gap-1">
            <span className="font-medium">Full name</span>
            <input
              type="text"
              autoComplete="name"
              required
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-md p-2"
            />
          </label>
        )}

        <label className="flex flex-col gap-1">
          <span className="font-medium">Email address</span>
          <input
            type="email"
            autoComplete="email"
            required
            maxLength={255}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-md p-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium">Password</span>
          <input
            type="password"
            autoComplete={
              mode === "signup" ? "new-password" : "current-password"
            }
            required
            minLength={mode === "signup" ? 12 : undefined}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-md p-2"
          />
          {mode === "signup" && (
            <span className="text-sm text-gray-600">
              At least 12 characters
            </span>
          )}
        </label>

        {error && (
          <p role="alert" className="text-red-700 text-sm">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-gray-900 text-white
            px-4 py-3 font-semibold hover:bg-gray-700
            disabled:opacity-50"
        >
          {submitting
            ? "Please wait..."
            : mode === "login"
              ? "Sign in"
              : "Create account"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <span>
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}
        </span>

        <button
          type="button"
          onClick={handleSwitch}
          disabled={submitting}
          className="ml-2 font-semibold underline"
        >
          {mode === "login" ? "Sign up" : "Sign in"}
        </button>
      </div>
    </dialog>
  );
}

export default AuthModal;
