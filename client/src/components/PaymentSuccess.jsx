import { useEffect, useState } from "react";
import { useCart } from "./CartContext.jsx";

const MAX_ATTEMPTS = 5;
const RETRY_DELAY = 1500;

export default function PaymentSuccess() {
    const { clearCart } = useCart();

    const [status, setStatus] = useState("checking");
    const [order, setOrder] = useState(null);
    const [error, setError] = useState("");

    const sessionId = new URLSearchParams(window.location.search).get(
        "session_id"
    );

    useEffect(() => {
        if (!sessionId) {
            setStatus("error");
            setError("No Stripe Checkout Session ID was provided");
            return;
        }

        let cancelled = false;
        let timeoutId;

        async function checkPayment() {
            for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
                if (cancelled) return;

                try {
                    const response = await fetch(
                        `/api/orders/checkout-session/${encodeURIComponent(sessionId)}`,
                        {
                            credentials: "include",
                        }
                    );

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.error || "Unable to verify payment");
                    }

                    if (cancelled) return;

                    if (data.order.payment_status === "paid") {
                        setOrder(data.order);
                        setStatus("paid");
                        clearCart();
                        return;
                    }

                    if (data.order.payment_status !== "pending_payment") {
                        setStatus(error);
                        setError("This order does not have a pending payment");
                        return;
                    }

                    if (attempt < MAX_ATTEMPTS) {
                        await new Promise((resolve) => {
                            timeoutId = setTimeout(resolve, RETRY_DELAY);
                        });
                    }
                } catch (error) {
                    if (cancelled) return;

                    setStatus("error");
                    setError(err.message);
                    return;
                }
            }

            if (!cancelled) {
                setStatus("pending");
            }
        }

        checkPayment();

        return () => {
            cancelled = true;
            clearTimeout(timeoutId);
        };
    }, [sessionId, clearCart]);

    if (status === "checking") {
        return (
            <section role="status" className="p-8 text-center">
                <h2 className="text-2xl font-bold">Checking your payment...</h2>
                    <p>Please wait while we confirm your order</p>
            </section>
        );
    }

    if (status === "paid") {
        return (
            <section className="p-8 text-center">
                <h2 className="text-2xl font-bold">Payment successful</h2>

                <p className="mt-4">
                    Thank you! Your order number is <strong>{order.id}</strong>
                </p>

                <p className="mt-2">
                    Total paid: £{Number(order.total_price).toFixed(2)}
                </p>

                <p className="mt-4">
                    You can view your order in the My Dashboard section
                </p>
            </section>
        );
    }

    if (status === "pending") {
        return (
            <section role="status" className="p-8 text-center">
                <h2 className="text-2xl font-bold">
                    Payment confirmation is taking longer than expected
                </h2>

                <p className="mt-4">
                    Your order has not yet been confirmed. Please check the My Dashboard section shortly
                </p>
            </section>
        );
    }

    return (
        <section role="alert" className="p-8 text-center">
            <h2 className="text-2xl font-bold">
                Unable to verify payment
            </h2>

            <p className="mt-4">{error}</p>
        </section>
    );
}