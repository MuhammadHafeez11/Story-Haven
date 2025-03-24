const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectMongoDb } = require('./config/connection');
require('dotenv').config();
const path = require('path')

const UserRouter = require('./routes/userRoute');
const BookRouter = require('./routes/bookRoute');
const BookMarkRouter = require('./routes/bookmarkRoute');
const ReadingHistoryRouter = require('./routes/readinghistoryRoute');
const AuthorRouter = require('./routes/authorRoute');
const CategoryRouter = require('./routes/categoryRoute');
const ProductCategoryRouter = require('./routes/productCategoryRoute');
const FindBookRouter = require('./routes/findbookRoute');
const CartRouter = require('./routes/cartRoute');
const ProductRoute = require('./routes/product');
const ProductPurchase = require('./routes/purchaseProduct');
const LocationRoute = require('./routes/location');
const RoleRouter = require('./routes/role');
const ColorRouter = require('./routes/colorRoute');
const TasksRouter = require('./routes/tasks');
const SaleRouter = require('./routes/sale');
const assignedTasksRoutes = require('./routes/assignedTasks');
const PurchaseRouter = require('./routes/purchaseRoute');
const AdminDataRouter = require('./routes/admindataRoute');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "https://story-haven-9fty70rwp-muhammad-hafeezs-projects-edceeb97.vercel.app/"], // Replace with your client URL
    credentials: true // Allow credentials
}));

app.use(express.json());
app.use(cookieParser());

//Connection 
connectMongoDb(process.env.DB_URI);

// middlware
app.use('/uploads', express.static(path.join(__dirname,  '../Uploads')));

// Serve the PDF worker file with the correct extension
// app.use('/pdf.worker.min.mjs', express.static(path.join(__dirname,  'node_modules/pdfjs-dist/build/pdf.worker.min.mjs')));

app.use('/pdfjs', express.static(path.join(__dirname, 'node_modules/pdfjs-dist/build')));

//Routes
app.use('/user', UserRouter);
app.use('/book', BookRouter);
app.use('/bookmark', BookMarkRouter);
app.use('/readinghistory', ReadingHistoryRouter);
app.use('/author', AuthorRouter);
app.use('/category', CategoryRouter);
app.use('/ProductCategory', ProductCategoryRouter);
app.use('/search', FindBookRouter);
app.use('/cart', CartRouter);
app.use('/purchase', PurchaseRouter);
app.use('/Product', ProductRoute);
app.use('/ProductPurchase', ProductPurchase);
app.use('/Sale', SaleRouter);
app.use('/Color', ColorRouter);
app.use('/Role', RoleRouter);
app.use('/Task', TasksRouter);
app.use('/AssignedTasks', assignedTasksRoutes);
app.use('/Location', LocationRoute);
app.use('/adminData', AdminDataRouter);

app.use(errorHandler);

app.listen(process.env.PORT , () => console.log(`Server Started at PORT :${process.env.PORT}`));