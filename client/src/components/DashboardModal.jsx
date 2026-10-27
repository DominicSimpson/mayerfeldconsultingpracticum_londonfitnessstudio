import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function DashboardModal({ isOpen, onClose }) {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || !user) return;

    const controller = new AbortController();

    async function fetchOrders() {
      setLoading(true);
      setError("");
      setOrders([]);

      try {
        const response = await fetch("/api/orders/my-orders", {
          credentials: "include",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();

        if (!controller.signal.aborted) {
          setOrders(data.orders);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchOrders();

    return () => controller.abort();
  }, [isOpen, user]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        arial-labelledby="dashboard-title"
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 id="dashboard-title" className="text-2xl font-bold text-gray-900">
            My Dashboard
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dashboard"
            className="text-2xl text-gray-500 hover:text-gray-900"
          >
            &times;
          </button>
        </div>

        <p className="mb-6 text-gray-700">Welcome back, {user.name}</p>

        <h3 className="mb-4 text-xl font-semibold text-gray-900">My Orders</h3>

        {loading && <p>Loading your orders...</p>}

        {error && (
          <p role="alert" className="text-red-600">
            {error}
          </p>
        )}

        {!loading && !error && orders.length === 0 && (
          <p className="text-gray-600">You haven't placed any orders yet.</p>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-lg border border-gray-200 p-4"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="font-semibold text-gray-900">
                      Order #{order.id}
                    </p>

                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString("en-GB")}
                    </p>
                  </div>

                  <span className="text-sm font-medium text-gray-700">
                    {order.status}
                  </span>
                </div>

                <p className="mt-3 font-semibold text-gray-900">
                  £{(Number(order.total_amount) / 100).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
