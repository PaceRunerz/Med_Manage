const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/medmanage');

// Define Schema
const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  batch: { type: String, required: true },
  manufacturer: { type: String, required: true },
  expiry: { type: Date, required: true },
  stock: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 }
});

// Create Model
const Medicine = mongoose.model('Medicine', medicineSchema);

// Sample Data
const medicines = [
  {
    name: "Paracetamol",
    batch: "BATCH001",
    manufacturer: "ABC Pharma",
    expiry: new Date("2025-12-31"),
    stock: 100,
    price: 10.00
  },
  {
    name: "Ibuprofen",
    batch: "BATCH002",
    manufacturer: "XYZ Pharma",
    expiry: new Date("2024-10-15"),
    stock: 75,
    price: 15.50
  }
];

// Insert Function
async function insertMedicines() {
  try {
    await Medicine.deleteMany({}); // Clear existing
    await Medicine.insertMany(medicines);
    console.log("Medicines inserted successfully!");
    const count = await Medicine.countDocuments();
    console.log(`Total medicines: ${count}`);
  } catch (err) {
    console.error("Error inserting medicines:", err);
  } finally {
    mongoose.connection.close();
  }
}

insertMedicines();
