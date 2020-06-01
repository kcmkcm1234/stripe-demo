import Layout from "../components/layout";
import CartItem from "../components/cartitem";
import { useState, useEffect, useReducer } from "react";
import api from "../services/gyfted-api";

const USER_ID = 1;

const initialState = {
    id: USER_ID,
    products: null,
    payment: null,
    gifter: null,
    giftee: null,
    metadata: null
}

const ShoppingCart = () => {

    const [cart, setCart] = useState(initialState);

    const renderStyle = () => (
        <style jsx="true">{`
        /* Global settings */
        
        .product-image {
        float: left;
        width: 20%;
        }
        
        .product-details {
        float: left;
        width: 37%;
        }
        
        .product-price {
        float: left;
        width: 12%;
        }
        
        .product-quantity {
        float: left;
        width: 10%;
        }
        
        .product-removal {
        float: left;
        width: 9%;
        }
        
        .product-line-price {
        float: left;
        width: 12%;
        text-align: right;
        }
        
        /* This is used as the traditional .clearfix class */
        .group:before, .shopping-cart:before, .column-labels:before, .product:before, .totals-item:before,
        .group:after,
        .shopping-cart:after,
        .column-labels:after,
        .product:after,
        .totals-item:after {
        content: '';
        display: table;
        }
        
        .group:after, .shopping-cart:after, .column-labels:after, .product:after, .totals-item:after {
        clear: both;
        }
        
        .group, .shopping-cart, .column-labels, .product, .totals-item {
        zoom: 1;
        }
        
        /* Apply clearfix in a few places */
        /* Apply dollar signs */
        .product .product-price:before, .product .product-line-price:before, .totals-value:before {
        content: '$';
        }
        
        /* Body/Header stuff */
        body {
        padding: 0px 30px 30px 20px;
        font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-weight: 100;
        }
        
        h1 {
        font-weight: 100;
        }
        
        label {
        color: #aaa;
        }
        
        .shopping-cart {
        margin-top: -45px;
        }
        
        /* Column headers */
        .column-labels label {
        padding-bottom: 15px;
        margin-bottom: 15px;
        border-bottom: 1px solid #eee;
        }
        .column-labels .product-image, .column-labels .product-details, .column-labels .product-removal {
        text-indent: -9999px;
        }
        
        /* Product entries */
        .product {
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
        }
        .product .product-image {
        text-align: center;
        }
        .product .product-image img {
        width: 100px;
        }
        .product .product-details .product-title {
        margin-right: 20px;
        font-family: "HelveticaNeue-Medium", "Helvetica Neue Medium";
        }
        .product .product-details .product-description {
        margin: 5px 20px 5px 0;
        line-height: 1.4em;
        }
        .product .product-quantity input {
        width: 40px;
        }
        .product .remove-product {
        border: 0;
        padding: 4px 8px;
        background-color: #c66;
        color: #fff;
        font-family: "HelveticaNeue-Medium", "Helvetica Neue Medium";
        font-size: 12px;
        border-radius: 3px;
        }
        .product .remove-product:hover {
        background-color: #a44;
        }
        
        /* Totals section */
        .totals .totals-item {
        float: right;
        clear: both;
        width: 100%;
        margin-bottom: 10px;
        }
        .totals .totals-item label {
        float: left;
        clear: both;
        width: 79%;
        text-align: right;
        }
        .totals .totals-item .totals-value {
        float: right;
        width: 21%;
        text-align: right;
        }
        .totals .totals-item-total {
        font-family: "HelveticaNeue-Medium", "Helvetica Neue Medium";
        }
        
        .checkout {
        float: right;
        border: 0;
        margin-top: 20px;
        padding: 6px 25px;
        background-color: #6b6;
        color: #fff;
        font-size: 25px;
        border-radius: 3px;
        }
        
        .checkout:hover {
        background-color: #494;
        }
        
        /* Make adjustments for tablet */
        @media screen and (max-width: 650px) {
        .shopping-cart {
            margin: 0;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }
        
        .column-labels {
            display: none;
        }
        
        .product-image {
            float: right;
            width: auto;
        }
        .product-image img {
            margin: 0 0 10px 10px;
        }
        
        .product-details {
            float: none;
            margin-bottom: 10px;
            width: auto;
        }
        
        .product-price {
            clear: both;
            width: 70px;
        }
        
        .product-quantity {
            width: 100px;
        }
        .product-quantity input {
            margin-left: 20px;
        }
        
        .product-quantity:before {
            content: 'x';
        }
        
        .product-removal {
            width: auto;
        }
        
        .product-line-price {
            float: right;
            width: 70px;
        }
        }
        /* Make more adjustments for phone */
        @media screen and (max-width: 350px) {
        .product-removal {
            float: right;
        }
        
        .product-line-price {
            float: right;
            clear: left;
            width: auto;
            margin-top: 10px;
        }
        
        .product .product-line-price:before {
            content: 'Item Total: $';
        }
        
        .totals .totals-item label {
            width: 60%;
        }
        .totals .totals-item .totals-value {
            width: 40%;
        }
        }
    `}</style>
    );

    const load = async () => {
        console.log("load user cart");
        const data = await api.getCart(USER_ID);
        if (data.id) {
            setCart(data);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const renderItems = () => {
        if (cart && cart.products) {
            return cart.products.items.map(it => <CartItem key={it.id} />);
        }
        return (<div><p>No hay productos</p></div>)
    };

    return (
        <Layout>
            <div>
                <h3>Cart</h3>
                <div className="shopping-cart">
                    <div className="column-labels">
                        <label className="product-image">Image</label>
                        <label className="product-details">Product</label>
                        <label className="product-price">Price</label>
                        <label className="product-quantity">Quantity</label>
                        <label className="product-removal">Remove</label>
                        <label className="product-line-price">Total</label>
                    </div>
                    {renderItems()}

                    <div className="totals">
                        <div className="totals-item">
                            <label>Subtotal</label>
                            <div className="totals-value" id="cart-subtotal">71.97</div>
                        </div>
                        <div className="totals-item">
                            <label>Tax (5%)</label>
                            <div className="totals-value" id="cart-tax">3.60</div>
                        </div>
                        <div className="totals-item">
                            <label>Shipping</label>
                            <div className="totals-value" id="cart-shipping">15.00</div>
                        </div>
                        <div className="totals-item totals-item-total">
                            <label>Grand Total</label>
                            <div className="totals-value" id="cart-total">90.57</div>
                        </div>
                    </div>

                    <button className="checkout">Checkout</button>

                </div>
                {renderStyle()}
            </div>
        </Layout>
    );
};

export default ShoppingCart;