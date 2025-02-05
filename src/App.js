import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [messaggi, setMessaggi] = useState([]);
  const [nuovoMessaggio, setNuovoMessaggio] = useState('');

  useEffect(() => {
    fetchMessaggi();
  }, []);

  const fetchMessaggi = async () => {
    const response = await axios.get('https://danielemonti81-github-io.vercel.app');
    setMessaggi(response.data);
  };

  const inviaMessaggio = async () => {
    if (nuovoMessaggio.trim() === '') return;

    const messaggio = {
      testo: nuovoMessaggio,
      data: new Date().toLocaleString(),
    };

    await axios.post('https://danielemonti81-github-io.vercel.app', messaggio);
    setNuovoMessaggio('');
    fetchMessaggi();
  };

  return (
    <div style={styles.container}>
      <h1>Leave your message</h1>
      <div style={styles.form}>
        <input
          type="text"
          value={nuovoMessaggio}
          onChange={(e) => setNuovoMessaggio(e.target.value)}
          placeholder="Write a message..."
          style={styles.input}
        />
        <button onClick={inviaMessaggio} style={styles.button}>
          Send
        </button>
      </div>
      <div style={styles.bacheca}>
        {messaggi.map((msg, index) => (
          <div key={index} style={styles.messaggio}>
            <p>{msg.testo}</p>
            <small>{msg.data}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  form: {
    display: 'flex',
    marginBottom: '20px',
  },
  input: {
    flex: '1',
    padding: '10px',
    fontSize: '16px',
    marginRight: '10px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
  bacheca: {
    border: '1px solid #ccc',
    padding: '20px',
    borderRadius: '5px',
  },
  messaggio: {
    marginBottom: '15px',
    padding: '10px',
    borderBottom: '1px solid #eee',
  },
};

export default App;