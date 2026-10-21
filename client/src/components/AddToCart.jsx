function AddToCart() {
  const [cartItems, setCartItems] = useState([]);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  setCartItems((prev) => {
    const existing = prev.find((item) => item.id === tier.id);

    if (!existing) {
      return delta > 0 ? [...prev, { ...tier, quantity: 1 }] : prev;
    }

    const newQuantity = Math.min(existing.quantity + delta, MAX_QUANTITY);
    if (newQuantity <= 0) {
      return prev.filter((item) => item.id !== tier.id);
    }
    return prev.map((item) =>
      item.id === tier.id ? { ...item, quantity: newQuantity } : item,
    );
  });

  const MAX_QUANTITY = 10;

  



  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Send data to an API or process it further
  };

 

    <div
        className="w-full border-black/35 rounded-lg flex flex-col relative gap-3 p-6 border-2 bg-card 
          transition-[border-color,box-shadow,opacity,filter] duration-200"
      >
        <h2 className="font-service-card text-2xl font-bold text-center">
          Your Cart
        </h2>
        {cartItems.length === 0 ? (
          <Paragraph>Cart is empty</Paragraph>
        ) : (
          <>
            <ul>
              {cartItems.map((item) => (
                <li key={item.id}>
                  <Paragraph>
                    {item.title}: £{item.price} x {item.quantity}
                  </Paragraph>
                </li>
              ))}
            </ul>
            <Paragraph>Total items: {totalItems}</Paragraph>
            <Paragraph>Total: £{totalPrice.toFixed(2)}</Paragraph>
          </>
        )}
      </div>
  );
}

export default AddToCart;
