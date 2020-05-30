import { useState, useEffect } from "react";
import { useStripe, CardElement, useElements } from "@stripe/react-stripe-js";
import Product from "../components/product";
import axios from "axios";

const CheckoutForm = (props) => {
    const [product, setProduct] = useState({
        id: null,
        image: null,
        name: null,
        description: null,
        price: 0,
        currency: "USD",
    });
    const [succeeded, setSucceeded] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState(null);

    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        const data = props.product;
        setProduct({
            id: data.id,
            image: data.assets.images[0].source,
            name: data.name,
            description: data.desc[0].desc,
            price: data.price.amount,
            currency: data.price.currency,
        });
    }, []);

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        setProcessing(true);
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement)
        });

        if (!error) {
            const { id } = paymentMethod;

            try {
                const { data } = await axios.post("/api/session", { card: id, product: product })
                setSucceeded(data.confirmed);
                setResult(data)
            } catch (ex) {
                console.error(ex)
            }
            setProcessing(false);
        }
    };

    const renderForm = () => {
        const options = {
            style: {
                base: {
                    color: "#32325d",
                    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                    fontSmoothing: "antialiased",
                    fontSize: "16px",
                    "::placeholder": {
                        color: "#aab7c4"
                    }
                },
                invalid: {
                    color: "#fa755a",
                    iconColor: "#fa755a"
                }
            }
        };

        if (product.id === null) {
            return (<p>nothing yet!!</p>);
        }
        return (
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-sm">
                        <Product data={product} />
                    </div>
                    <div className="col-sm">
                        <CardElement options={options} />
                        <button className="btn btn-primary" disabled={processing || !stripe}>
                            {processing ? "Processing…" : "Pay"}
                        </button>
                    </div>
                </div>
            </form>
        );
    };

    const renderSuccess = () => (
        <div>
            <div className="row">
                <p className="h4">Your test payment succeeded</p>
            </div>
            <div className="row">
                <p><samp>{JSON.stringify(result, null, 2)}</samp></p>
            </div>
        </div >
    );

    return succeeded ? renderSuccess() : renderForm();

};

export default CheckoutForm;