import { useState, useEffect } from "react";
import { FormattedNumber, IntlProvider } from 'react-intl';
import GyftedApi from "../services/gyfted-api";
import { useStripe, CardElement, useElements } from "@stripe/react-stripe-js";
import axios from 'axios';

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

const ProductDetails = (props) => {
    const [product, setProduct] = useState({
        id: null,
        name: null,
        description: null,
        images: [],
        price: {
            amount: 0,
            currency: "USD"
        }
    });
    const [succeeded, setSucceeded] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState(null);

    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        async function loadProductData() {
            console.log('item_id: ' + props.itemId)
            const data = await GyftedApi.instance().getProductDetails(props.itemId);
            setProduct({
                id: data.id,
                name: data.name,
                description: data.desc[0].desc,
                images: data.assets.images.map((img, idx) => { return { id: idx, url: img.source, active: idx === 0 } }),
                price: {
                    amount: data.price.amount,
                    currency: data.price.currency
                }
            });
        }
        if (props.itemId)
            loadProductData();
    }, [props.itemId])

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

    const renderStyles = () => (
        <style jsx="true">{`
            img {
                max-width: 100%;
            }

            .preview {
                display: -webkit-box;
                display: -webkit-flex;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-orient: vertical;
                -webkit-box-direction: normal;
                -webkit-flex-direction: column;
                -ms-flex-direction: column;
                flex-direction: column;
            }

            @media screen and (max-width: 996px) {
                .preview {
                    margin-bottom: 20px;
                }
            }

            .preview-pic {
                -webkit-box-flex: 1;
                -webkit-flex-grow: 1;
                -ms-flex-positive: 1;
                flex-grow: 1;
            }

            .preview-thumbnail.nav-tabs {
                border: none;
                margin-top: 15px;
            }

            .preview-thumbnail.nav-tabs li {
                width: 18%;
                margin-right: 2.5%;
            }

            .preview-thumbnail.nav-tabs li img {
                max-width: 100%;
                display: block;
            }

            .preview-thumbnail.nav-tabs li a {
                padding: 0;
                margin: 0;
            }

            .preview-thumbnail.nav-tabs li:last-of-type {
                margin-right: 0;
            }

            .tab-content {
                overflow: hidden;
            }

            .tab-content img {
                width: 100%;
                -webkit-animation-name: opacity;
                animation-name: opacity;
                -webkit-animation-duration: .3s;
                animation-duration: .3s;
            }

            .card {
                margin-top: 50px;
                background: #eee;
                padding: 3em;
                line-height: 1.5em;
            }

            @media screen and (min-width: 997px) {
                .wrapper {
                    display: -webkit-box;
                    display: -webkit-flex;
                    display: -ms-flexbox;
                    display: flex;
                }
            }

            .details {
                display: -webkit-box;
                display: -webkit-flex;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-orient: vertical;
                -webkit-box-direction: normal;
                -webkit-flex-direction: column;
                -ms-flex-direction: column;
                flex-direction: column;
            }

            .colors {
                -webkit-box-flex: 1;
                -webkit-flex-grow: 1;
                -ms-flex-positive: 1;
                flex-grow: 1;
            }

            .product-title, .price, .sizes, .colors {
                text-transform: UPPERCASE;
                font-weight: bold;
            }

            .checked, .price span {
                color: #ff9f1a;
            }

            .product-title, .rating, .product-description, .price, .vote, .sizes {
                margin-bottom: 15px;
            }

            .product-title {
                margin-top: 0;
            }

            .size {
                margin-right: 10px;
            }

            .size:first-of-type {
                margin-left: 40px;
            }

            .color {
                display: inline-block;
                vertical-align: middle;
                margin-right: 10px;
                height: 2em;
                width: 2em;
                border-radius: 2px;
            }

            .color:first-of-type {
                margin-left: 20px;
            }

            .add-to-cart, .like {
                background: #ff9f1a;
                padding: 1.2em 1.5em;
                border: none;
                text-transform: UPPERCASE;
                font-weight: bold;
                color: #fff;
                -webkit-transition: background .3s ease;
                transition: background .3s ease;
                margin-top: 10px;
            }

            .add-to-cart:hover, .like:hover {
                background: #b36800;
                color: #fff;
            }

            .not-available {
                text-align: center;
                line-height: 2em;
            }

            .not-available:before {
                font-family: fontawesome;
                content: "\f00d";
                color: #fff;
            }

            .orange {
                background: #ff9f1a;
            }

            .green {
                background: #85ad00;
            }

            .blue {
                background: #0076ad;
            }

            .tooltip-inner {
                padding: 1.3em;
            }

            @-webkit-keyframes opacity {
                0% {
                    opacity: 0;
                    -webkit-transform: scale(3);
                    transform: scale(3);
                }
                100% {
                    opacity: 1;
                    -webkit-transform: scale(1);
                    transform: scale(1);
                }
            }

            @keyframes opacity {
                0% {
                    opacity: 0;
                    -webkit-transform: scale(3);
                    transform: scale(3);
                }
                100% {
                    opacity: 1;
                    -webkit-transform: scale(1);
                    transform: scale(1);
                }
            }

            .action * {
                font-size: 16px;
                font-weight: 500;
            }

            .action fieldset {
                margin: 0 15px 20px;
                padding: 0;
                border-style: none;
                background-color: #7795f8;
                box-shadow: 0 6px 9px rgba(50, 50, 93, 0.06), 0 2px 5px rgba(0, 0, 0, 0.08),
                    inset 0 1px 0 #829fff;
                border-radius: 4px;
            }

            .action .row {
                display: -ms-flexbox;
                display: flex;
                -ms-flex-align: center;
                align-items: center;
                margin-left: 15px;
            }

            .action .row + .row {
                border-top: 1px solid #819efc;
            }

            .action label {
                width: 15%;
                min-width: 70px;
                padding: 11px 0;
                color: #c4f0ff;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .action input, .action button {
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                outline: none;
                border-style: none;
            }

            .action input:-webkit-autofill {
                -webkit-text-fill-color: #fce883;
                transition: background-color 100000000s;
                -webkit-animation: 1ms void-animation-out;
            }

            .action .StripeElement--webkit-autofill {
                background: transparent !important;
            }

            .action .StripeElement {
                width: 100%;
                padding: 11px 15px 11px 0;
            }

            .action input {
                width: 100%;
                padding: 11px 15px 11px 0;
                color: #fff;
                background-color: transparent;
                -webkit-animation: 1ms void-animation-out;
            }

            .action input::-webkit-input-placeholder {
                color: #87bbfd;
            }

            .action input::-moz-placeholder {
                color: #87bbfd;
            }

            .action input:-ms-input-placeholder {
                color: #87bbfd;
            }

            .action button {
                display: block;
                width: calc(100% - 30px);
                margin: 40px 15px 0;
                box-shadow: 0 6px 9px rgba(50, 50, 93, 0.06), 0 2px 5px rgba(0, 0, 0, 0.08),
                    inset 0 1px 0 #ffb9f6;
                border-radius: 4px;
                background: #ff9f1a;
                color: #fff;
                font-weight: 600;
                cursor: pointer;
            }

            .action button:active {
                background-color: #d782d9;
                box-shadow: 0 6px 9px rgba(50, 50, 93, 0.06), 0 2px 5px rgba(0, 0, 0, 0.08),
                    inset 0 1px 0 #e298d8;
            }

            .action .error svg .base {
                fill: #fff;
            }

            .action .error svg .glyph {
                fill: #6772e5;
            }

            .action .error .message {
                color: #fff;
            }

            .action .success .icon .border {
                stroke: #87bbfd;
            }

            .action .success .icon .checkmark {
                stroke: #fff;
            }

            .action .success .title {
                color: #fff;
            }

            .action .success .message {
                color: #9cdbff;
            }

            .action .success .reset path {
                fill: #fff;
            }

        `}</style>
    );

    const renderForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="action">
                <CardElement options={options} />
                <button className="add-to-cart btn btn-default" type="submit" disabled={processing || !stripe}>
                    {processing ? "Processing…" : "Buy now"}
                </button>
            </div>
            {renderStyles()}
        </form>
    );

    const renderPaymentSuccess = () => (
        <div className="action">
            <h4>Your payment succeeded</h4>
            <pre>{JSON.stringify(result, null, 2)}</pre>
            {renderStyles()}
        </div >
    );

    return (
        <div>
            <div className="card">
                <div className="container-fliud">
                    <div className="wrapper row">
                        <div className="preview col-md-6">
                            <div className="preview-pic tab-content">
                                {product.images.map(img => <div key={'v-' + img.id} className={`tab-pane ${img.active ? "active" : ""}`} id={'pic-' + img.id}><img src={img.url} /></div>)}
                            </div>
                            <ul className="preview-thumbnail nav nav-tabs">
                                {product.images.map(img => <li key={'p-' + img.id} className={`${img.active ? "active" : ""}`}><a data-target={'#pic-' + img.id} data-toggle="tab"><img src={img.url} /></a></li>)}
                            </ul>
                        </div>
                        <div className="details col-md-6">
                            <h3 className="product-title">{product.name}</h3>
                            <p className="product-description">{product.description}</p>
                            <h4 className="price">
                                <span>
                                    <IntlProvider locale='en'>
                                        <FormattedNumber
                                            value={product.price.amount}
                                            style="currency"
                                            currency={product.price.currency} />
                                    </IntlProvider>
                                </span>
                            </h4>
                            {succeeded ? renderPaymentSuccess() : renderForm()}
                        </div>
                    </div>
                </div>
            </div>
            {renderStyles()}
        </div>
    );
}

export default ProductDetails;