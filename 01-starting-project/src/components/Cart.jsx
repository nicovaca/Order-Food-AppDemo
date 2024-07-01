import Modal from "./UI/Modal.jsx";
import {useContext} from "react";
import CartContext from "../store/CartContext.jsx";
import {currecyFormatter} from "../util/formatting.js";
import Button from "./UI/Button.jsx";
import UserProgressContext from "../store/UserProgressContext.js";
import CartItem from "./CartItem.jsx";

export default function Cart() {
    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext);

    const cartTotal = cartCtx.items.reduce(
        (totalPrice, item) => {
           return totalPrice + item.quantity * item.price
        }, 0
    )
    function handleCloseCart() {
        userProgressCtx.hideCart();
    }
    function handleCheckout() {
        userProgressCtx.showCheckout();
    }


    return (
        <Modal className="cart"
               open={userProgressCtx.progress === 'cart'}
               onClose={userProgressCtx.progress === 'cart' ? handleCloseCart : null}
        >
            <h2>Your Cart</h2>
            <ul>
                {cartCtx.items.map(
                    (item) =>
                        <CartItem
                            key={item.id}
                            item={item}
                            onIncrease={() => cartCtx.addItem(item)}
                            onDecrease={() => cartCtx.removeItem(item.id)}
                        />
                )}
            </ul>
            <p className="cart-total">{currecyFormatter.format(cartTotal)}</p>
            <p>
                <Button textOnly onClick={handleCloseCart}>Close</Button>
                {cartCtx.items.length > 0 &&
                    <Button onClick={handleCheckout}> Go to Checkout</Button>}
            </p>
        </Modal>
    );
}