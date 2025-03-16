const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectMongoDb } = require('./BackEnd/config/connection');
require('dotenv').config();
const path = require('path')

const UserRouter = require('./BackEnd/routes/userRoute');
const BookRouter = require('./BackEnd/routes/bookRoute');
const BookMarkRouter = require('./BackEnd/routes/bookmarkRoute');
const ReadingHistoryRouter = require('./BackEnd/routes/readinghistoryRoute');
const AuthorRouter = require('./BackEnd/routes/authorRoute');
const CategoryRouter = require('./BackEnd/routes/categoryRoute');
const ProductCategoryRouter = require('./BackEnd/routes/productCategoryRoute');
const FindBookRouter = require('./BackEnd/routes/findbookRoute');
const CartRouter = require('./BackEnd/routes/cartRoute');
const ProductRoute = require('./BackEnd/routes/product');
const ProductPurchase = require('./BackEnd/routes/purchaseProduct');
const LocationRoute = require('./BackEnd/routes/location');
const RoleRouter = require('./BackEnd/routes/role');
const ColorRouter = require('./BackEnd/routes/colorRoute');
const TasksRouter = require('./BackEnd/routes/tasks');
const SaleRouter = require('./BackEnd/routes/sale');
const assignedTasksRoutes = require('./BackEnd/routes/assignedTasks');
const PurchaseRouter = require('./BackEnd/routes/purchaseRoute');
const AdminDataRouter = require('./BackEnd/routes/admindataRoute');
const errorHandler = require('./BackEnd/middlewares/errorHandler');

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
app.use('/uploads', express.static(path.join(__dirname,  'Uploads')));

// Serve the PDF worker file with the correct extension
app.use('/pdf.worker.min.mjs', express.static(path.join(__dirname,  'node_modules/pdfjs-dist/build/pdf.worker.min.mjs')));


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