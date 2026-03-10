import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../lib/supabase';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalAmount, clearCart } = useCart();

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          ...formData,
          total_amount: totalAmount,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        unit_price: item.product.price,
        subtotal: item.product.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      for (const item of items) {
        await supabase
          .from('products')
          .update({ stock: item.product.stock - item.quantity })
          .eq('id', item.product.id);
      }

      clearCart();
      alert('訂單已成功送出！');
      navigate('/');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('訂單建立失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container">
        <div className="empty-state">
          <h2>購物車是空的</h2>
          <p>請先加入商品到購物車</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>結帳</h1>

        <div className="checkout-content">
          <form onSubmit={handleSubmit} className="checkout-form">
            <h2>配送資訊</h2>

            <div className="form-group">
              <label>姓名 *</label>
              <input
                type="text"
                value={formData.customer_name}
                onChange={(e) =>
                  setFormData({ ...formData, customer_name: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>電子郵件 *</label>
              <input
                type="email"
                value={formData.customer_email}
                onChange={(e) =>
                  setFormData({ ...formData, customer_email: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>電話 *</label>
              <input
                type="tel"
                value={formData.customer_phone}
                onChange={(e) =>
                  setFormData({ ...formData, customer_phone: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>配送地址 *</label>
              <textarea
                value={formData.shipping_address}
                onChange={(e) =>
                  setFormData({ ...formData, shipping_address: e.target.value })
                }
                rows={3}
                required
              />
            </div>

            <div className="form-group">
              <label>備註</label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={2}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
              {loading ? '處理中...' : '確認訂單'}
            </button>
          </form>

          <div className="order-summary">
            <h2>訂單摘要</h2>
            <div className="order-items">
              {items.map((item) => (
                <div key={item.product.id} className="order-item">
                  <img src={item.product.image_url} alt={item.product.name} />
                  <div className="item-info">
                    <p>{item.product.name}</p>
                    <p>
                      NT$ {item.product.price.toLocaleString()} x {item.quantity}
                    </p>
                  </div>
                  <div className="item-total">
                    NT$ {(item.product.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <div className="summary-total">
              <span>總計</span>
              <span>NT$ {totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
