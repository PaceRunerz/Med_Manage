const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/medmanage')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Root endpoint
app.get('/', (req, res) => {
  res.send(`
    <h1>MedManage Backend Server</h1>
    <p>API Endpoints:</p>
    <ul>
      <li>GET /api/medicines - List all medicines</li>
      <li>POST /api/medicines - Add new medicine</li>
      <li>GET /api/orders - List all orders</li>
      <li>POST /api/orders - Create new order</li>
    </ul>
  `);
});

// Define Schemas
const medicineSchema = new mongoose.Schema({
  name: String,
  batch: String,
  manufacturer: String,
  expiry: Date,
  stock: Number,
  price: Number
});

const orderItemSchema = new mongoose.Schema({
  medicineId: mongoose.Schema.Types.ObjectId,
  name: String,
  batch: String,
  price: Number,
  quantity: Number
});

const customerSchema = new mongoose.Schema({
  name: String,
  phone: String,
  address: String
});

const orderSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  customer: customerSchema,
  items: [orderItemSchema],
  status: { type: String, default: 'Pending' }
});

// Create Models
const Medicine = mongoose.model('Medicine', medicineSchema);
const Order = mongoose.model('Order', orderSchema);

// API Routes

// Medicine Routes
app.get('/api/medicines', async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/medicines', async (req, res) => {
  const medicine = new Medicine({
    name: req.body.name,
    batch: req.body.batch,
    manufacturer: req.body.manufacturer,
    expiry: req.body.expiry,
    stock: req.body.stock,
    price: req.body.price
  });

  try {
    const newMedicine = await medicine.save();
    res.status(201).json(newMedicine);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/api/medicines/:id', async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    res.json(medicine);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/medicines/:id', async (req, res) => {
  try {
    const updatedMedicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedMedicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    res.json(updatedMedicine);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/medicines/:id', async (req, res) => {
  try {
    const deletedMedicine = await Medicine.findByIdAndDelete(req.params.id);
    if (!deletedMedicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    res.json({ message: 'Medicine deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Order Routes
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  const order = new Order({
    customer: req.body.customer,
    items: req.body.items,
    status: req.body.status || 'Pending'
  });

  try {
    // Update medicine stocks
    for (const item of order.items) {
      await Medicine.findByIdAndUpdate(
        item.medicineId,
        { $inc: { stock: -item.quantity } }
      );
    }
    
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Dashboard Route
app.get('/api/dashboard', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const totalMedicines = await Medicine.countDocuments();
    const todayOrders = await Order.countDocuments({ date: { $gte: today } });
    
    const allOrders = await Order.find();
    const totalRevenue = allOrders.reduce((sum, order) => {
      return sum + order.items.reduce((orderSum, item) => 
        orderSum + (item.price * item.quantity), 0);
    }, 0);
    
    res.json({
      totalMedicines,
      todayOrders,
      totalRevenue,
      recentOrders: allOrders.slice(0, 5)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
