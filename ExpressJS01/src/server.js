require('dotenv').config();

const express = require('express'); 
const cors = require('cors');
const configViewEngine = require('./config/viewEngine');
const apiRoutes = require('./routes/api');
const connection = require('./config/database');
const Product = require('./models/product');
const Category = require('./models/category');
//const { getHomepage } = require('./controllers/homeController');
const app = express(); 

const port = process.env.PORT || 8888;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

configViewEngine(app);

const webApp = express.Router();
//webApp.get('/', getHomepage);
app.use('/', webApp);

app.use('/v1/api', apiRoutes);

(async () => {
    try {
        await connection();
        app.listen(port, () => {
            console.log(`Backend Nodejs App listening on port ${port}`);
        });
    } catch (error) {
        console.log('>>> Error connect to DB: ', error);
    }
})();

app.get("/products", async (req, res) => {
    const page = parseInt(req.query.page) || 1;   // mặc định trang 1
    const limit = parseInt(req.query.limit) || 10; // mặc định 10 sp / trang
    const q = (req.query.q || "").trim();
    const category = (req.query.category || "").trim(); // category id or slug
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
    const onSale = req.query.onSale === 'true' || req.query.onSale === true;
    const skip = (page - 1) * limit;

    try {
      const filter = {};

      if (q) {
        filter.$or = [
          { name: { $regex: q, $options: 'i' } },
          { slug: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
        ];
      }

      if (category) {
        // allow either ObjectId or slug
        if (category.match(/^[0-9a-fA-F]{24}$/)) {
          filter.category = category;
        } else {
          const cat = await Category.findOne({ slug: category }).select('_id');
          if (cat) filter.category = cat._id;
          else filter.category = null; // force empty
        }
      }

      // Price range: match either effective salePrice or base price
      const priceRange = {};
      if (minPrice !== undefined) priceRange.$gte = minPrice;
      if (maxPrice !== undefined) priceRange.$lte = maxPrice;
      if (Object.keys(priceRange).length) {
        filter.$or = (filter.$or || []).concat([
          { salePrice: { ...priceRange, $gt: 0 } },
          { $and: [ { $or: [ { salePrice: { $exists: false } }, { salePrice: 0 } ] }, { price: priceRange } ] }
        ]);
      }

      if (onSale) {
        filter.salePrice = { $gt: 0 };
      }

      const [products, total] = await Promise.all([
        Product.find(filter).skip(skip).limit(limit),
        Product.countDocuments(filter),
      ]);

      res.json({
        EC: 0,
        DT: {
          products,
          total,
          currentPage: page,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      res.status(500).json({ EC: -1, EM: "Server error" });
    }
  });

// List categories for filters
app.get('/categories', async (_req, res) => {
  try {
    const categories = await Category.find({}).select('_id name slug');
    res.json({ EC: 0, DT: categories });
  } catch (e) {
    res.status(500).json({ EC: -1, EM: 'Server error' });
  }
});
