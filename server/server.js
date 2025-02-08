const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = 5000;

// Connessione a MongoDB
mongoose.connect('mongodb+srv://daniele19xx:Stocazzo1981@cluster0.zx1ij.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/worldmap_messages', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Modello per i messaggi
const MessageSchema = new mongoose.Schema({
    content: String,
    date: { type: Date, default: Date.now },
    ip: String,
    location: {
        lat: Number,
        lng: Number,
    },
});

const Message = mongoose.model('Message', MessageSchema);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Endpoint per inviare un messaggio
app.post('/api/messages', async (req, res) => {
    const { content, ip } = req.body;

    // Ottieni la posizione dall'IP
    const locationResponse = await axios.get(`http://ip-api.com/json/${ip}`);
    const { lat, lon } = locationResponse.data;

    const newMessage = new Message({
        content,
        ip,
        location: { lat, lng: lon },
    });

    await newMessage.save();
    res.status(201).json(newMessage);
});

// Endpoint per ottenere tutti i messaggi
app.get('/api/messages', async (req, res) => {
    const messages = await Message.find();
    res.json(messages);
});

// Avvia il server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});