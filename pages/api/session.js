import { Stripe } from "stripe";

const stripe = new Stripe("sk_test_FyTYWO2KpzUfLFmUvSYONlqk00hXQrjUrm")

export default async (req, res) => {
    const { card, product } = req.body;
    try {
        console.log('card token: ' + card);
        const payment = await stripe.paymentIntents.create({
            payment_method: card,
            amount: product.price.amount * 100,
            currency: product.price.currency,
            description: product.name,
            confirm: true
        });
        console.log(payment);
        return res.status(200).json({
            confirmed: payment.status === 'succeeded'
        })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}