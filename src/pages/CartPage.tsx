import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalAmount } = useCart();

  if (items.length === 0) {
    return (
      <div className="container">
        <div className="empty-state">
          <h2>購物車是空的</h2>
          <p>快去選購商品吧！</p>
          <Link to="/products" className="btn btn-primary">
            開始購物
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>購物車</h1>

        <div className="cart-content">
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.product.id} className="cart-item">
                <img src={item.product.image_url} alt={item.product.name} />
                <div className="item-details">
                  <h3>{item.product.name}</h3>
                  <p className="item-price">NT$ {item.product.price.toLocaleString()}</p>
                </div>
                <div className="item-quantity">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="btn-quantity"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="btn-quantity"
                    disabled={item.quantity >= item.product.stock}
                  >
                    +
                  </button>
                </div>
                <div className="item-subtotal">
                  NT$ {(item.product.price * item.quantity).toLocaleString()}
                </div>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="btn-remove"
                >
                  移除
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>訂單摘要</h3>
            <div className="summary-row">
              <span>小計</span>
              <span>NT$ {totalAmount.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>運費</span>
              <span>NT$ 0</span>
            </div>
            <div className="summary-row total">
              <span>總計</span>
              <span>NT$ {totalAmount.toLocaleString()}</span>
            </div>
            <Link to="/checkout" className="btn btn-primary btn-large">
              前往結帳
            </Link>
            <Link to="/products" className="btn btn-secondary">
              繼續購物
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
