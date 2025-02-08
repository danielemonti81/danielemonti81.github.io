const map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
}).addTo(map);

const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// Funzione per ottenere l'IP dell'utente
async function getIP() {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
}

// Funzione per inviare un messaggio
sendButton.addEventListener('click', async () => {
    const content = messageInput.value.trim();
    if (!content) return;

    const ip = await getIP();
    const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, ip }),
    });

    const newMessage = await response.json();
    addMarkerToMap(newMessage);
    messageInput.value = '';
});

// Funzione per aggiungere un marker alla mappa
function addMarkerToMap(message) {
    const { lat, lng } = message.location;
    const marker = L.marker([lat, lng]).addTo(map);

    marker.bindPopup(`
        <div>
            <p>${message.content}</p>
            <button onclick="replyToMessage('${message._id}')">Rispondi</button>
            <span onclick="this.parentElement.style.display='none'" style="cursor:pointer;float:right;">X</span>
        </div>
    `);
}

// Funzione per caricare i messaggi esistenti
async function loadMessages() {
    const response = await fetch('/api/messages');
    const messages = await response.json();
    messages.forEach(addMarkerToMap);
}

loadMessages();