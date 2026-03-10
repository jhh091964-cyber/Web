import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <h1>購物商城</h1>
        </Link>
        <nav className="nav">
          <Link to="/">首頁</Link>
          <Link to="/products">商品</Link>
          <Link to="/admin">訂單管理</Link>
          <Link to="/cart" className="cart-link">
            購物車
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
}
