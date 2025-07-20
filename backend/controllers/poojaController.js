const Pooja = require('../models/Pooja');

// GET all poojas
const getAllPoojas = async (req, res) => {
  try {
    const poojas = await Pooja.find();
    res.json({ success: true, data: poojas });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching poojas' });
  }
};

// POST a new pooja
const createPooja = async (req, res) => {
  try {
    const { name, description, price, duration, requirements } = req.body;

    const newPooja = new Pooja({
      name,
      description,
      price,
      duration,
      requirements,
    });

    await newPooja.save();
    res.status(201).json({ success: true, data: newPooja });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating pooja' });
  }
};

const deletePooja = async (req, res) => {
  try {
    const deleted = await Pooja.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ msg: 'Pooja not found' });
    }
    res.json({ msg: 'Pooja deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};



module.exports = { getAllPoojas, createPooja ,deletePooja };
