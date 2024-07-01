import Modal from "./UI/Modal.jsx";
import {useContext} from "react";
import CartContext from "../store/CartContext.jsx";
import {currecyFormatter} from "../util/formatting.js";
import Input from "./UI/Input.jsx";
import Button from "./UI/Button.jsx";
import UserProgressContext from "../store/UserProgressContext.js";
import useHttp from "../hooks/useHttp.js";
import Error from "./Error.jsx";

const requestConfig = {
    method: 'POST',
    headers: {
        'Content-type': 'application/json'
    }
};

export default function Checkout() {
    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext);

    const {
        data,
        isLoading: isSending,
        error,
        sendRequest,
        clearData
    } = useHttp('http://localhost:3000/orders', requestConfig)

    const cartTotal = cartCtx.items.reduce(
        (totalPrice, item) => {
            return totalPrice + item.quantity * item.price
        }, 0
    )
    function handleClose() {
            userProgressCtx.hideCheckout();
    }
    function handleFinish() {
        userProgressCtx.hideCheckout();
        cartCtx.clearCart();
        clearData();
    }
    function handleSubmit(event) {
        event.preventDefault();
        const form = new FormData(event.target);
        const customerData = Object.fromEntries(form.entries());

        sendRequest(
            JSON.stringify({
                order: {
                    items: cartCtx.items,
                    customer: customerData
                }
            })
        );
    }
    let actions = (
        <>
            <Button type="button" textOnly onClick={handleClose}>Close</Button>
            <Button>Submit Order</Button>
        </>
    );
    if (isSending) {
        actions = <span>Sending data...</span>
    }
    if (data && !error) {
        return <Modal open={userProgressCtx.progress === 'checkout'}
        onClose={handleFinish}>
            <h2>Success!</h2>
            <p>Your order was submitted successfully!</p>
            <p className="modal-actions">
                <Button onClick={handleFinish}>Ok</Button>
            </p>
        </Modal>
    }

    return (
        <Modal open={userProgressCtx.progress === "checkout"}
               onClose={handleClose}
        >
            <form onSubmit={handleSubmit}>
                <h2>Checkout</h2>
                <p>Total Amount: {currecyFormatter.format(cartTotal)}</p>
                <Input label="Full Name" type="text" id="name"/>
                <Input label="Email" type="email" id="email"/>
                <Input label="Street" type="text" id="street"/>
                <div className="control-row">
                    <Input label="Postal Code" type="text" id="postal-code"/>
                    <Input label="City" type="text" id="city"/>
                </div>
                {error && <Error title={"Failed to submit order"} message={error}/>}
                <p className="modal-actions">
                    {actions}
                </p>
            </form>
        </Modal>
    );
}