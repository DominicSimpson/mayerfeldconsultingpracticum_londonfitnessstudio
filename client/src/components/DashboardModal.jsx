import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function DashboardModal({ onClose }) {
  const dialogRef = useRef(null);
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Open the dashboard when the component mounts
  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (!dialog.open) {
      dialog.showModal();
    }
  }, []);

  // Retrieve the logged-in user's orders
  useEffect(() => {
    const controller = new AbortController();

    async function fetchOrders() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/orders/my-orders", {
          credentials: "include",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to retrieve your orders");
        }

        const data = await response.json();

        if (!Array.isArray(data.orders)) {
          throw new Error("Unexpected order data received");
        }

        if (!controller.signal.aborted) {
          setOrders(data.orders);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message || "Something went wrong");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchOrders();

    return () => controller.abort();
  }, []);

  // Format monetary values as GBP
  const formatPrice = (value) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(Number(value));

  // Format order creation timestamps
  const formatDate = (value) =>
    new Date(value).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Europe/London",
    });

  // Format booking calendar dates without timezone shifts
  const formatBookingDate = (value) => {
    const date = String(value).slice(0, 10);
    const [year, month, day] = date.split("-").map(Number);

    return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="dashboard-title"
      className="m-auto w-full max-w-2xl max-h-[85vh]
        overflow-y-auto rounded-xl bg-white p-6 text-black
        shadow-xl border border-gray-300 backdrop:bg-black/60"
    >
      {/* Dashboard heading */}
      <div className="flex items-center justify-between mb-6">
        <h2 id="dashboard-title" className="text-2xl font-bold font-p-text">
          My Dashboard
        </h2>

        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          aria-label="Close dashboard"
          className="text-2xl hover:text-gray-500"
        >
          ×
        </button>
      </div>

      {/* Account details */}
      <section className="rounded-lg bg-gray-100 p-4 font-p-text">
        <h3 className="text-lg font-semibold mb-3">Account Details</h3>

        <p>
          <strong>Name:</strong> {user?.name}
        </p>

        <p>
          <strong>Email:</strong> {user?.email}
        </p>
      </section>

      {/* Order history */}
      <section className="mt-6 font-p-text">
        <h3 className="text-lg font-semibold mb-3">Order History</h3>

        {/* Loading state */}
        {loading && <p className="text-gray-600">Loading your orders...</p>}

        {/* Error state */}
        {error && (
          <p role="alert" className="text-red-600">
            {error}
          </p>
        )}
  
        {/* No orders */}
        {!loading && !error && orders.length === 0 && (
          <p className="text-gray-600">You haven't placed any orders yet.</p>
        )}

        {/* Display previous orders */}
        {!loading && !error && orders.length > 0 && (
          <>
            <p className="mb-4 text-gray-600">Total orders: {orders.length}</p>

            <div className="space-y-4">
              {orders.map((order) => (
                <article
                  key={order.id}
                  className="rounded-lg border border-gray-300 p-4"
                >
                  {/* Order summary */}
                  <div className="flex flex-wrap justify-between gap-4">
                    <div>
                      <h4 className="font-semibold">Order #{order.id}</h4>

                      <p className="text-sm text-gray-500">
                        Placed on {formatDate(order.created_at)}
                      </p>
                    </div>

                    <p className="font-bold">
                      {formatPrice(order.total_price)}
                    </p>
                  </div>

                  {/* Items belonging to this order */}
                  <ul className="mt-4 space-y-3">
                    {Array.isArray(order.items) &&
                      order.items.map((item, index) => (
                        <li
                          key={`${order.id}-${index}`}
                          className="border-t border-gray-200 pt-3"
                        >
                          <p className="font-medium">{item.productName}</p>

                          <p>Quantity: {item.quantity}</p>

                          <p>Unit price: {formatPrice(item.unitPrice)}</p>

                          {item.date && (
                            <p>Booking date: {formatBookingDate(item.date)}</p>
                          )}

                          {item.hour && <p>Time: {item.hour}</p>}
                        </li>
                      ))}
                  </ul>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </dialog>
  );
}
