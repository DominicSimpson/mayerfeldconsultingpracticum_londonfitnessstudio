import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext.jsx";

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
}
