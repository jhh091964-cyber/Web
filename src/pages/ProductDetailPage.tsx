import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Product } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      alert('已加入購物車！');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container">
        <div className="empty-state">
          <p>找不到此商品</p>
          <Link to="/products" className="btn btn-primary">
            返回商品列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        <Link to="/products" className="back-link">
          ← 返回商品列表
        </Link>

        <div className="product-detail">
          <div className="product-image">
            <img src={product.image_url} alt={product.name} />
          </div>

          <div className="product-details">
            <h1>{product.name}</h1>
            <p className="product-price">NT$ {product.price.toLocaleString()}</p>
            <p className="product-description">{product.description}</p>

            <div className="product-stock">
              <p>庫存：{product.stock} 件</p>
            </div>

            <div className="quantity-selector">
              <label>數量：</label>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="btn-quantity"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max={product.stock}
              />
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="btn-quantity"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="btn btn-primary btn-large"
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? '已售完' : '加入購物車'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
