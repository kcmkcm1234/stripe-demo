
export default class CartItem extends React.Component {

    render() {
        return (
            <div className="product">
                <div className="product-image">
                    <img src="http://placehold.it/120x80" />
                </div>
                <div className="product-details">
                    <div className="product-title">Nike Flex Form TR Women's Sneaker</div>
                    <p className="product-description"> It has a lightweight, breathable mesh upper with forefoot cables for a locked-down fit.</p>
                </div>
                <div className="product-price">12.99</div>
                <div className="product-quantity">
                    <input type="number" value="2" min="1" />
                </div>
                <div className="product-removal">
                    <button className="remove-product">Remove</button>
                </div>
                <div className="product-line-price">25.98</div>
            </div>
        );
    }
};
