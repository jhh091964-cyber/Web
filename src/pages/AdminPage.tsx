import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Order, OrderItem } from '../lib/supabase';

type OrderWithItems = Order & {
  items?: OrderItem[];
};

export default function AdminPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      if (ordersData) {
        const ordersWithItems = await Promise.all(
          ordersData.map(async (order) => {
            const { data: items } = await supabase
              .from('order_items')
              .select('*')
              .eq('order_id', order.id);

            return { ...order, items: items || [] };
          })
        );

        setOrders(ordersWithItems);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );

      alert('訂單狀態已更新');
    } catch (error) {
      console.error('Error updating order:', error);
      alert('更新失敗');
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: '待處理',
      processing: '處理中',
      shipped: '已出貨',
      delivered: '已送達',
      cancelled: '已取消',
    };
    return labels[status] || status;
  };

  const getStatusClass = (status: string) => {
    const classes: Record<string, string> = {
      pending: 'status-pending',
      processing: 'status-processing',
      shipped: 'status-shipped',
      delivered: 'status-delivered',
      cancelled: 'status-cancelled',
    };
    return classes[status] || '';
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container">
        <h1>訂單管理</h1>

        {orders.length === 0 ? (
          <div className="empty-state">
            <p>目前沒有訂單</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>訂單編號：{order.id.slice(0, 8)}</h3>
                    <p className="order-date">
                      {new Date(order.created_at).toLocaleString('zh-TW')}
                    </p>
                  </div>
                  <span className={`order-status ${getStatusClass(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                <div className="order-customer">
                  <div className="customer-info">
                    <p>
                      <strong>客戶：</strong>
                      {order.customer_name}
                    </p>
                    <p>
                      <strong>電話：</strong>
                      {order.customer_phone}
                    </p>
                    <p>
                      <strong>Email：</strong>
                      {order.customer_email}
                    </p>
                    <p>
                      <strong>地址：</strong>
                      {order.shipping_address}
                    </p>
                    {order.notes && (
                      <p>
                        <strong>備註：</strong>
                        {order.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="order-items">
                  <h4>訂單商品</h4>
                  {order.items?.map((item) => (
                    <div key={item.id} className="order-item">
                      <span>{item.product_name}</span>
                      <span>x{item.quantity}</span>
                      <span>NT$ {Number(item.subtotal).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <strong>總金額：NT$ {Number(order.total_amount).toLocaleString()}</strong>
                  </div>
                  <div className="order-actions">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="pending">待處理</option>
                      <option value="processing">處理中</option>
                      <option value="shipped">已出貨</option>
                      <option value="delivered">已送達</option>
                      <option value="cancelled">已取消</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
