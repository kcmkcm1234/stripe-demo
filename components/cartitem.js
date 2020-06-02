import { useState, useCallback } from "react";
import api from '../services/gyfted-api';

const USER_ID = 1;

const CartItem = (props) => {
    const [item, setItem] = useState(props.item);
    const parentCallback = props.onUpdate ? props.onUpdate : () => { };

    const removeItem = async () => {
        const response = await api.deleteCartItem({
            user: USER_ID,
            item: item.id
        });
        if (response.id) {
            console.log('delete succeeded, calling onUpdate handler');
            parentCallback(item.id, true);
        } else {
            console.log('delete failed, calling onUpdate handler');
            parentCallback(item.id, false);
        }
    }

    const updateQuantity = async (count) => {
        const response = await api.addToCart({
            user: USER_ID,
            product: item.id,
            qty: count
        });
        if (response.id) {
            console.log('update succeeded, calling onUpdate handler');
            const { id, name, price } = item;
            setItem({ id, name, price, quantity: count });
            parentCallback(item.id, true);
        } else {
            console.log('update failed, calling onUpdate handler');
            parentCallback(item.id, false);
        }
    };

    return (
        <div className="product">
            <div className="product-image">
                <img src="http://placehold.it/120x80" />
            </div>
            <div className="product-details">
                <div className="product-title">{item.name}</div>
                <p className="sr-only product-description">TDB</p>
            </div>
            <div className="product-price">{item.price.amount}</div>
            <div className="product-quantity">
                <input type="number" value={item.quantity} onChange={evt => updateQuantity(evt.target.value)} min="1" />
            </div>
            <div className="product-removal">
                <button className="remove-product" onClick={removeItem}>Remove</button>
            </div>
            <div className="product-line-price">{Math.round((item.price.amount * item.quantity + Number.EPSILON) * 100) / 100}</div>
        </div>
    );
};

export default CartItem;