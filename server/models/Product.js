import mongoose from 'mongoose';
import slugify from 'slugify';

const dimensionsSchema = new mongoose.Schema({
  width: { type: Number, required: true, min: 0 },
  height: { type: Number, required: true, min: 0 },
  depth: { type: Number, required: true, min: 0 },
}, { _id: false });

const ratingSchema = new mongoose.Schema({
  average: { type: Number, default: 0, min: 0, max: 5 },
  count: { type: Number, default: 0, min: 0 },
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 200 },
  slug: { type: String, unique: true, index: true },
  description: { type: String, required: true, maxlength: 2000 },
  richDescription: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  comparePrice: { type: Number, min: 0, default: 0 },
  images: [{ type: String, required: true }],
  thumbnail: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: { type: String, trim: true, maxlength: 100 },
  tags: [{ type: String, trim: true }],
  stock: { type: Number, default: 0, min: 0 },
  sku: { type: String, trim: true, maxlength: 100, index: true },
  weight: { type: Number, min: 0, default: 0 },
  dimensions: { type: dimensionsSchema, required: true },
  ratings: { type: ratingSchema, default: () => ({}) },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  isFeatured: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: false },
  countInStock: { type: Number, default: 0, min: 0 },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

productSchema.virtual('discount').get(function getDiscount() {
  if (!this.comparePrice || this.comparePrice <= this.price) {
    return 0;
  }
  return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
});

productSchema.pre('save', function preSave(next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true, trim: true });
  }
  next();
});

productSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });

export default mongoose.model('Product', productSchema);
