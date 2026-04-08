import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItem } from '../../store/cartSlice.js';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.thumbnail,
    }));
  };

  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <Link to={`/product/${product.slug}`} className="block">
        <img src={product.thumbnail} alt={product.name} className="h-56 w-full object-cover transition duration-300 group-hover:scale-105" />
      </Link>
      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{product.name}</h2>
          {product.discount > 0 && (
            <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200">-{product.discount}%</span>
          )}
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">${product.price.toFixed(2)}</span>
            {product.comparePrice > product.price && (
              <span className="ml-2 text-sm text-slate-500 line-through dark:text-slate-400">${product.comparePrice.toFixed(2)}</span>
            )}
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Add
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
