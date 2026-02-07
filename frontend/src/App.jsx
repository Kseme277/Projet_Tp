import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users,
  Table as TableIcon,
  LayoutGrid,
  UserPlus,
  Printer,
  FileDown,
  X,
  Mail,
  Phone,
  Building2,
  Globe
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './App.css';

const API_URL = 'http://localhost:5000/api/users';

function App() {
  const [users, setUsers] = useState([]);
  const [view, setView] = useState('table'); // 'table' or 'grid'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    entreprise: '',
    site_url: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Erreur lors de la récupération des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, formData);
      setIsModalOpen(false);
      setFormData({
        nom: '',
        email: '',
        telephone: '',
        entreprise: '',
        site_url: ''
      });
      fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Erreur lors de l\'ajout de l\'utilisateur');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Liste des Utilisateurs', 14, 15);

    const tableColumn = ["Nom", "Email", "Téléphone", "Entreprise", "Site Web"];
    const tableRows = users.map(user => [
      user.nom,
      user.email,
      user.telephone || '-',
      user.entreprise || '-',
      user.site_url || '-'
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save('utilisateurs.pdf');
  };

  return (
    <div className="container">
      <h1>Gestion des Utilisateurs</h1>

      <div className="view-controls">
        <div className="view-btn-group">
          <button
            className={view === 'table' ? 'active' : ''}
            onClick={() => setView('table')}
          >
            <TableIcon size={18} /> Vue Tableau
          </button>
          <button
            className={view === 'grid' ? 'active' : ''}
            onClick={() => setView('grid')}
          >
            <LayoutGrid size={18} /> Vue Grille
          </button>
        </div>

        <div className="export-controls">
          <button id="add-user-btn" onClick={() => setIsModalOpen(true)}>
            <UserPlus size={18} /> Ajouter
          </button>
          <button onClick={handlePrint}>
            <Printer size={18} /> Imprimer
          </button>
          <button onClick={handleExportPDF}>
            <FileDown size={18} /> Exporter PDF
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Chargement...</div>
      ) : view === 'table' ? (
        <div className="user-table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Entreprise</th>
                <th>Site Web</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>Aucun utilisateur trouvé</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td style={{ fontWeight: 600 }}>{user.nom}</td>
                    <td>{user.email}</td>
                    <td>{user.telephone || '-'}</td>
                    <td>{user.entreprise || '-'}</td>
                    <td>
                      {user.site_url ? (
                        <a href={user.site_url} target="_blank" rel="noopener noreferrer">
                          {user.site_url}
                        </a>
                      ) : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="user-grid">
          {users.map((user) => (
            <div key={user.id} className="user-card">
              <h3>{user.nom}</h3>
              <div className="info-item">
                <Mail size={14} /> <span>{user.email}</span>
              </div>
              {user.telephone && (
                <div className="info-item">
                  <Phone size={14} /> <span>{user.telephone}</span>
                </div>
              )}
              {user.entreprise && (
                <div className="info-item">
                  <Building2 size={14} /> <span>{user.entreprise}</span>
                </div>
              )}
              {user.site_url && (
                <div className="info-item">
                  <Globe size={14} />
                  <a href={user.site_url} target="_blank" rel="noopener noreferrer">Site Web</a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Ajouter un utilisateur</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nom</label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  placeholder="Nom complet"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@exemple.com"
                  required
                />
              </div>
              <div className="form-group">
                <label>Téléphone</label>
                <input
                  type="text"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  placeholder="Numéro de téléphone"
                />
              </div>
              <div className="form-group">
                <label>Entreprise</label>
                <input
                  type="text"
                  value={formData.entreprise}
                  onChange={(e) => setFormData({ ...formData, entreprise: e.target.value })}
                  placeholder="Nom de l'entreprise"
                />
              </div>
              <div className="form-group">
                <label>Site Web</label>
                <input
                  type="url"
                  value={formData.site_url}
                  onChange={(e) => setFormData({ ...formData, site_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <button className="modal-button" type="submit">
                Ajouter l'utilisateur
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
