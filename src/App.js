import React, { useState, useEffect, useMemo} from 'react';
import './App.css';

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

function getTodayKey() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function App() {
  const [quotes, setQuotes] = useState([]);

  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('list');
  const [error, setError] = useState('');

  const loadQuotes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/quotes`);
      const data = await response.json();
      setQuotes(data);
    } catch (error) {
      console.error('Error loading quotes', error);
    }
  };

  useEffect(() => {
    loadQuotes();
  }, []);

  const quoteOfTheDay = useMemo(() => {
    if (!quotes.length) return null;
    const todayKey = getTodayKey();
    const saved = window.localStorage.getItem('quoteOfTheDay');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.date === todayKey) {
          const existing = quotes.find((q) => q.id === parsed.id);
          if (existing) return existing;
        }
      } catch (e) {
        // αν χαλάσει το JSON, απλά αγνοούμε
      }
    }
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    window.localStorage.setItem(
      'quoteOfTheDay',
      JSON.stringify({ date: todayKey, id: random.id })
    );
    return random;
  }, [quotes]);

  const handleAddQuote = async (event) => {
    event.preventDefault();
    const trimmedText = text.trim();
    const trimmedAuthor = author.trim();
    // Βασικό validation
    if (!trimmedText) {
      setError('Text is required.');
      return;
    }
    if (trimmedText.length < 3) {
      setError('Text should be at least 3 characters.');
      return;
    }
    // Author είναι optional – απλώς το καθαρίζουμε
    const payload = {
      author: trimmedAuthor || null,
      text: trimmedText,
    };
    try {
      setError(''); // καθαρίζουμε παλιό error
      if (editingId === null) {
        // Δημιουργία νέου quote (POST)
        const response = await fetch(`${API_BASE_URL}/api/quotes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        if (response.status === 409) {
          setError('A quote with the same text already exists.');
          return;
        }
        if (!response.ok) {
          setError('Failed to add quote. Please try again.');
          return;
        }
      } else {
        // Ενημέρωση υπάρχοντος quote (PUT)
        const response = await fetch(
          `${API_BASE_URL}/api/quotes/${editingId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          }
        );
        if (!response.ok) {
          setError('Failed to update quote. Please try again.');
          return;
        }
      }
      await loadQuotes();
      setAuthor('');
      setText('');
      setEditingId(null);
    } catch (error) {
      console.error('Error saving quote', error);
      setError('Unexpected error while saving quote.');
    }
  };


  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/quotes/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        console.error('Error deleting quote', response.status);
        return;
      }
      await loadQuotes();
    } catch (error) {
      console.error('Error deleting quote', error);
    }
  };
  const handleEdit = (quote) => {
    setAuthor(quote.author || '');
    setText(quote.text || '');
    setEditingId(quote.id);
  };

  return (
    <div className="App">
      <div className="app-container">
        <div className="app-header">
          <div>
            <div className="app-title">Quotes Manager</div>
            <div className="app-subtitle">Manage your favorite quotes</div>
          </div>
      </div>
      <div className="tabs">
        <button
          type="button"
          className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          Quotes
        </button>
        <button
          type="button"
          className={`tab-button ${activeTab === 'daily' ? 'active' : ''}`}
          onClick={() => setActiveTab('daily')}
        >
          Quote of the Day
        </button>
      </div>

      {activeTab === 'list' && (
        <>
          {error && (
            <p style={{ color: '#d32f2f', fontSize: '0.9rem', marginBottom: 8 }}>
              {error}
            </p>
          )}
          <h2>Add a quote</h2>
          <form onSubmit={handleAddQuote}>
            <div>
              <label>
                Author (optional):{' '}
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </label>
            </div>
            <div>
              <label>
                Text (required):{' '}
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </label>
            </div>
            <button type="submit">Add quote</button>
          </form>
          <h2>Saved Quotes</h2>
          <ul>
            {quotes.map((quote) => (
              <li key={quote.id}>
                <span>
                  <strong>{quote.author}:</strong> "{quote.text}"
                </span>
                <button 
                  type="button"
                  className="secondary"
                  onClick={() => handleEdit(quote)}>
                  Edit
                </button>{' '}
                <button 
                  type="button" 
                  className="danger"
                  onClick={() => handleDelete(quote.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {activeTab === 'daily' && (
        <>
          <h2>Quote of the Day</h2>
          <div className="daily-card">
            {!quotes.length ? (
              <p>No quotes available. Please add at least one.</p>
            ) : !quoteOfTheDay ? (
              <p>Could not calculate quote of the day.</p>
            ) : (
              <p>
                "<strong>{quoteOfTheDay.text}</strong>"
                {quoteOfTheDay.author && (
                  <> — <em>{quoteOfTheDay.author}</em></>
                )}
              </p>
            )}
          </div>
        </>
      )}
    </div>
    </div>
  );
}

export default App;
