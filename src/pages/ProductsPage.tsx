import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Product, Category } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [categoryId]);

  const loadCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('created_at');
    if (data) setCategories(data);
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      let query = supabase.from('products').select('*').eq('is_active', true);

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data } = await query.order('created_at', { ascending: false });
      if (data) setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    alert('已加入購物車！');
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="container">
        <div className="page-header">
          <h1>商品列表</h1>
        </div>

        <div className="category-filter">
          <Link to="/products" className={!categoryId ? 'active' : ''}>
            全部
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className={categoryId === category.id ? 'active' : ''}
            >
              {category.name}
            </Link>
          ))}
        </div>

        {products.length === 0 ? (
          <div className="empty-state">
            <p>目前沒有商品</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <Link to={`/products/${product.id}`}>
                  <img src={product.image_url} alt={product.name} />
                </Link>
                <div className="product-info">
                  <h3>
                    <Link to={`/products/${product.id}`}>{product.name}</Link>
                  </h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-footer">
                    <p className="product-price">
                      NT$ {product.price.toLocaleString()}
                    </p>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="btn btn-primary"
                      disabled={product.stock === 0}
                    >
                      {product.stock === 0 ? '已售完' : '加入購物車'}
                    </button>
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
