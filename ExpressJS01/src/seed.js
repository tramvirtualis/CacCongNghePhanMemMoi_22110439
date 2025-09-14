require('dotenv').config();
const mongoose = require("mongoose");
const Product = require("./models/product");
const Category = require("./models/category");

mongoose.connect(process.env.MONGO_DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    console.log("✅ DB connected");

    await Product.deleteMany({});
    await Category.deleteMany({});

    const categoriesData = [
      { name: "Sách thiếu nhi", slug: "sach-thieu-nhi" },
      { name: "Văn học", slug: "van-hoc" },
      { name: "Công nghệ", slug: "cong-nghe" },
      { name: "Kinh doanh", slug: "kinh-doanh" },
    ];
    await Category.insertMany(categoriesData);

    const categories = await Category.find({});
    const categoryMap = categories.reduce((acc, c) => {
      acc[c.slug] = c._id;
      return acc;
    }, {});

    const productsData = [
      {
        name: "Lập trình JavaScript cơ bản",
        slug: "lap-trinh-javascript-co-ban",
        description: "Giới thiệu JavaScript từ cơ bản đến nâng cao, kèm ví dụ thực hành.",
        price: 150000,
        salePrice: 99000,
        stock: 50,
        views: 120,
        sold: 30,
        imageUrls: [
          "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop",
        ],
        category: categoryMap["cong-nghe"],
      },
      {
        name: "Dữ liệu & Giải thuật",
        slug: "du-lieu-giai-thuat",
        description: "Cấu trúc dữ liệu và các giải thuật phổ biến, áp dụng phỏng vấn.",
        price: 220000,
        salePrice: 0,
        stock: 20,
        views: 300,
        sold: 120,
        imageUrls: [
          "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop",
        ],
        category: categoryMap["cong-nghe"],
      },
      {
        name: "Tuổi thơ dữ dội",
        slug: "tuoi-tho-du-doi",
        description: "Tác phẩm văn học nổi tiếng về tuổi thơ và chiến tranh.",
        price: 120000,
        salePrice: 99000,
        stock: 100,
        views: 500,
        sold: 300,
        imageUrls: [
          "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=800&auto=format&fit=crop",
        ],
        category: categoryMap["van-hoc"],
      },
      {
        name: "Kinh doanh 4.0",
        slug: "kinh-doanh-4-0",
        description: "Xu hướng kinh doanh thời đại số, chiến lược và case-study.",
        price: 180000,
        salePrice: 129000,
        stock: 60,
        views: 200,
        sold: 80,
        imageUrls: [
          "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop",
        ],
        category: categoryMap["kinh-doanh"],
      },
      {
        name: "Câu chuyện thiếu nhi",
        slug: "cau-chuyen-thieu-nhi",
        description: "Tổng hợp truyện ngắn dành cho thiếu nhi giàu tính giáo dục.",
        price: 90000,
        salePrice: 69000,
        stock: 150,
        views: 80,
        sold: 20,
        imageUrls: [
          "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop",
        ],
        category: categoryMap["sach-thieu-nhi"],
      },
      {
        name: "Thuật toán nâng cao",
        slug: "thuat-toan-nang-cao",
        description: "Các thuật toán nâng cao, tối ưu và bài tập thực hành.",
        price: 300000,
        salePrice: 249000,
        stock: 35,
        views: 700,
        sold: 260,
        imageUrls: [
          "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop",
        ],
        category: categoryMap["cong-nghe"],
      },
      {
        name: "Văn học kinh điển",
        slug: "van-hoc-kinh-dien",
        description: "Tuyển tập các tác phẩm văn học kinh điển thế giới.",
        price: 250000,
        salePrice: 0,
        stock: 40,
        views: 420,
        sold: 150,
        imageUrls: [
          "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=800&auto=format&fit=crop",
        ],
        category: categoryMap["van-hoc"],
      },
      {
        name: "Khởi nghiệp thông minh",
        slug: "khoi-nghiep-thong-minh",
        description: "Từ ý tưởng đến sản phẩm, quản trị tăng trưởng hiệu quả.",
        price: 190000,
        salePrice: 149000,
        stock: 55,
        views: 260,
        sold: 110,
        imageUrls: [
          "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop",
        ],
        category: categoryMap["kinh-doanh"],
      },
            {
        name: "Kỹ năng giao tiếp hiệu quả",
        slug: "ky-nang-giao-tiep-hieu-qua",
        description: "Sách dạy cách giao tiếp, thuyết trình và đàm phán trong công việc.",
        price: 160000,
        salePrice: 129000,
        stock: 70,
        views: 180,
        sold: 75,
        imageUrls: [
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1521790797524-b2497295b8a0?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1515165562835-c3b8a3f7ee8c?q=80&w=800&auto=format&fit=crop",
        ],
        category: categoryMap["kinh-doanh"],
      },
      {
        name: "Python cho người mới bắt đầu",
        slug: "python-cho-nguoi-moi-bat-dau",
        description: "Giới thiệu lập trình Python, cú pháp, ví dụ và dự án thực tế.",
        price: 200000,
        salePrice: 159000,
        stock: 80,
        views: 400,
        sold: 210,
        imageUrls: [
          "https://miro.medium.com/v2/resize:fit:1024/1*oYydYZYGm2dlK7-uLIiedQ.png",
        ],
        category: categoryMap["cong-nghe"],
      },
      {
        name: "Alice ở xứ sở diệu kỳ",
        slug: "alice-o-xu-so-dieu-ky",
        description: "Câu chuyện cổ tích kinh điển với hình minh họa đẹp mắt.",
        price: 95000,
        salePrice: 75000,
        stock: 120,
        views: 250,
        sold: 95,
        imageUrls: [
          "https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop",
        ],
        category: categoryMap["sach-thieu-nhi"],
      },
      {
        name: "Lập trình Web với Node.js",
        slug: "lap-trinh-web-voi-nodejs",
        description: "Xây dựng ứng dụng web thực tế bằng Node.js và Express.",
        price: 270000,
        salePrice: 229000,
        stock: 45,
        views: 500,
        sold: 200,
        imageUrls: [
          "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop",
        ],
        category: categoryMap["cong-nghe"],
      },
      {
        name: "Chiến lược đại dương xanh",
        slug: "chien-luoc-dai-duong-xanh",
        description: "Cuốn sách nổi tiếng về đổi mới mô hình kinh doanh.",
        price: 210000,
        salePrice: 175000,
        stock: 65,
        views: 320,
        sold: 140,
        imageUrls: [
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop",
        ],
        category: categoryMap["kinh-doanh"],
      },
      {
        name: "Những tấm lòng cao cả",
        slug: "nhung-tam-long-cao-ca",
        description: "Tác phẩm nổi tiếng giáo dục nhân cách trẻ em.",
        price: 110000,
        salePrice: 89000,
        stock: 90,
        views: 410,
        sold: 180,
        imageUrls: [
          "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=800&auto=format&fit=crop",
        ],
        category: categoryMap["sach-thieu-nhi"],
      },
      {
        name: "Tội ác và hình phạt",
        slug: "toi-ac-va-hinh-phat",
        description: "Tiểu thuyết kinh điển của Dostoyevsky về tâm lý con người.",
        price: 280000,
        salePrice: 0,
        stock: 30,
        views: 350,
        sold: 140,
        imageUrls: [
          "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=800&auto=format&fit=crop",
        ],
        category: categoryMap["van-hoc"],
      },
      {
        name: "Trí tuệ nhân tạo",
        slug: "tri-tue-nhan-tao",
        description: "Khái niệm AI, machine learning và ứng dụng thực tế.",
        price: 350000,
        salePrice: 299000,
        stock: 40,
        views: 600,
        sold: 250,
        imageUrls: [
          "https://tekfy.vn/wp-content/uploads/2023/04/Thiet-ke-chua-co-ten-1.png",
        ],
        category: categoryMap["cong-nghe"],
      },
      {
    name: "Truyện cổ tích Việt Nam",
    slug: "truyen-co-tich-viet-nam",
    description: "Tuyển tập truyện cổ tích nổi tiếng, gần gũi với thiếu nhi.",
    price: 80000,
    salePrice: 59000,
    stock: 200,
    views: 150,
    sold: 60,
    imageUrls: [
      "https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=800&auto=format&fit=crop",
    ],
    category: categoryMap["sach-thieu-nhi"],
  },
  {
    name: "Kinh tế học cơ bản",
    slug: "kinh-te-hoc-co-ban",
    description: "Giúp bạn hiểu những nguyên lý cơ bản của kinh tế học.",
    price: 210000,
    salePrice: 179000,
    stock: 90,
    views: 220,
    sold: 100,
    imageUrls: [
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    ],
    category: categoryMap["kinh-doanh"],
  },
  {
    name: "Những người khốn khổ",
    slug: "nhung-nguoi-khon-kho",
    description: "Kiệt tác văn học Pháp của Victor Hugo.",
    price: 300000,
    salePrice: 259000,
    stock: 40,
    views: 400,
    sold: 180,
    imageUrls: [
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=800&auto=format&fit=crop",
    ],
    category: categoryMap["van-hoc"],
  },
  {
    name: "Machine Learning cơ bản",
    slug: "machine-learning-co-ban",
    description: "Hướng dẫn nhập môn học máy với Python và Scikit-Learn.",
    price: 350000,
    salePrice: 299000,
    stock: 45,
    views: 500,
    sold: 220,
    imageUrls: [
      "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop",
    ],
    category: categoryMap["cong-nghe"],
  },
  {
    name: "Tư duy tích cực",
    slug: "tu-duy-tich-cuc",
    description: "Phương pháp phát triển bản thân, thay đổi thói quen tư duy.",
    price: 160000,
    salePrice: 119000,
    stock: 75,
    views: 310,
    sold: 140,
    imageUrls: [
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800&auto=format&fit=crop",
    ],
    category: categoryMap["kinh-doanh"],
  },

    ];

    await Product.insertMany(productsData);
    console.log("✅ Seed xong dữ liệu Category/Product");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed lỗi:", err);
    process.exit(1);
  }
}

run();