import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { slug } = useParams();

  return (
    <main className="min-h-screen px-4 py-8">
      <h1 className="text-3xl font-semibold">Product Detail</h1>
      <p className="mt-4 text-slate-600 dark:text-slate-300">Viewing product: {slug}</p>
    </main>
  );
};

export default ProductDetail;
