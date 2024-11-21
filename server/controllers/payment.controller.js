import Stripe from "stripe";
const stripe = new Stripe("sk_test_51QKuZ6JP5PSOJeLvlw9h1KRWFWpUhIYXd2t7BbrTw44Z3ouHfB63g6Ve4HaFMP9JiWEXfqjNkhPJnz57KoCP9Flt00ICMuu6Ye");

const makePayment = async (req, res) => {
    console.log(req.body);
    
  const { token, product } = req.body;

  try {
    const charge = await stripe.charges.create({
      amount: product.price * 100, // Convert to cents
      currency: "usd",
      source: token.id, // Use token from client
      description: product.description,
      receipt_email: token.email,
    });

    res.status(200).json({ success: true, charge });
  } catch (error) {
    console.error("Stripe Payment Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export default makePayment;
