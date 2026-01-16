//  Test Commit by Sanjaya Citra 
// Test Commit by Jordan

import { useState, useEffect } from 'react';
import axios from 'axios'; // <-- 1. Impor axios
import './App.css';

// Tentukan URL API backend Anda
const API_URL = 'http://localhost:4000/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [inputText, setInputText] = useState('');
  const [editingId, setEditingId] = useState(null);

  // --- EFEK (READ) ---
  useEffect(() => {
    fetchTasks();
  }, []);

  /**
   * [READ] - Menggunakan axios.get
   * Data respons ada di 'response.data'
   */
  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data); // <-- 2. Langsung dapat data (tidak perlu .json())
    } catch (error) {
      console.error('Gagal mengambil tugas:', error);
    }
  };

  // --- HANDLERS (LOGIKA CRUD) ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (editingId !== null) {
      // --- UPDATE ---
      try {
        /**
         * [UPDATE] - Menggunakan axios.put
         * Parameter kedua adalah data (body)
         */
        const response = await axios.put(`${API_URL}/${editingId}`, {
          text: inputText, // <-- 3. Axios otomatis 'stringify' jadi JSON
        });
        const updatedTask = response.data; // <-- Langsung dapat data

        setTasks(
          tasks.map((task) =>
            task.id === editingId ? updatedTask : task
          )
        );
        setEditingId(null);
      } catch (error) {
        console.error('Gagal mengupdate tugas:', error);
      }
    } else {
      // --- CREATE ---
      try {
        /**
         * [CREATE] - Menggunakan axios.post
         * Parameter kedua adalah data (body)
         */
        const response = await axios.post(API_URL, {
          text: inputText, // <-- 3. Axios otomatis 'stringify' jadi JSON
        });
        const newTask = response.data; // <-- Langsung dapat data

        setTasks([...tasks, newTask]);
      } catch (error) {
        console.error('Gagal menambah tugas:', error);
      }
    }
    setInputText('');
  };

  const handleEdit = (task) => {
    setEditingId(task.id);
    setInputText(task.text);
  };

  /**
   * [DELETE] - Menggunakan axios.delete
   */
  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
      try {
        await axios.delete(`${API_URL}/${id}`); // <-- 4. Sintaks delete sederhana

        setTasks(tasks.filter((task) => task.id !== id));

        if (id === editingId) {
          setEditingId(null);
          setInputText('');
        }
      } catch (error) {
        console.error('Gagal menghapus tugas:', error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setInputText('');
  };

  // --- RENDER (VIEW) ---
  // Bagian JSX (return) tidak ada perubahan sama sekali
  return (
    <div className="app-container">
      <h1>testing (Full Stack CRUD)</h1>
      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="text"
          placeholder="Masukkan tugas baru..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button type="submit">
          {editingId !== null ? 'Update' : 'Tambah'}
        </button>
        {editingId !== null && (
          <button type="button" onClick={handleCancelEdit} className="cancel-btn">
            Batal
          </button>
        )}
      </form>
      <ul className="task-list">
        {tasks.length === 0 && (
          <p style={{ textAlign: 'center', color: '#888' }}>
            Belum ada tugas...
          </p>
        )}
        {tasks.map((task) => (
          <li key={task.id}>
            <span>{task.text}</span>
            <div className="task-buttons">
              <button onClick={() => handleEdit(task)} className="edit-btn">
                Edit
              </button>
              <button onClick={() => handleDelete(task.id)} className="delete-btn">
                Hapus
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;