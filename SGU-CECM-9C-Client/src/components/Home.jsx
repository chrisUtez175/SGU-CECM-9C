import React, { useState, useEffect, useCallback } from 'react';
const ENV = import.meta.env;


// URLs de la API
/*
const API_READ_URL = 'http://localhost:8090/person/listAll'; 
const API_SAVE_URL = 'http://localhost:8090/person/save'; 
const API_UPDATE_URL = 'http://localhost:8090/person/updatePerson'; 
const API_DELETE_BASE_URL = 'http://localhost:8090/person/delete'; 
*/
const API_URL = `http://${ENV.VITE_API_HOST}:${ENV.VITE_API_PORT}${ENV.VITE_API_BASE}`;


const Home = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isLoading, setIsLoading] = useState(false); 
  
  const [isEditing, setIsEditing] = useState(false); 
  const [currentEditId, setCurrentEditId] = useState(null); 

  const [formData, setFormData] = useState({
    nombreCompleto: '',
    correo: '',
    telefono: '',
  });

  // --- Lógica de Carga de Datos (GET) con FILTRADO ---
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL+'/listAll');
      if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
      const apiData = await response.json();

      const dataArray = Array.isArray(apiData.result) ? apiData.result : [];
      
      // 🚨 CAMBIO CLAVE: Filtramos los datos para que SOLO se muestren los que tienen estado: true
      const activeData = dataArray.filter(user => user.estado === true);
      
      const formattedData = activeData.map((user) => ({
        id: user.id,
        nombreCompleto: user.nombreCompleto,
        correo: user.correo,
        telefono: user.telefono,
        // No necesitamos mapear el 'estado' si no se muestra en la tabla
      }));
        
      setData(formattedData);
    } catch (err) {
      console.error("Error al obtener los datos:", err);
    } finally {
      setIsLoading(false);
    }
  }, []); // Dependencia vacía para que se ejecute solo al montar

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Manejadores del Formulario ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAdd = () => {
    setFormData({ nombreCompleto: '', correo: '', telefono: '' });
    setIsEditing(false); 
    setCurrentEditId(null);
    setIsModalOpen(true);
  };
  
  const handleEdit = (id) => {
    const itemToEdit = data.find(item => item.id === id);
    if (itemToEdit) {
      setFormData({
        nombreCompleto: itemToEdit.nombreCompleto,
        correo: itemToEdit.correo,
        telefono: itemToEdit.telefono,
      });
      setIsEditing(true); 
      setCurrentEditId(id);
      setIsModalOpen(true);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? API_URL+'/updatePerson' : API_URL+'/save';
    
    // Asumimos que el backend establece 'estado: true' por defecto al guardar (POST) 
    // y lo mantiene igual al actualizar (PUT), ya que no se pide modificarlo en la UI.
    const payload = isEditing ? 
      { id: currentEditId, ...formData } : 
      { ...formData }; 

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error al ${isEditing ? 'actualizar' : 'guardar'}: ${response.status}`);
      }

      alert(`Registro ${isEditing ? 'actualizado' : 'guardado'} con éxito!`);
      setIsModalOpen(false); 
      await fetchData(); 

    } catch (err) {
      console.error(`Error al ${isEditing ? 'actualizar' : 'guardar'} el formulario:`, err);
      alert(`Error al ${isEditing ? 'actualizar' : 'guardar'} el registro. Detalle: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Funciones de Acciones (Eliminar) ---
  const handleDelete = async (id) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el registro con ID: ${id}? Esta acción es irreversible.`)) {
      setIsLoading(true);
      try {
        const url = `${API_URL}/delete/${id}`; 
        
        const response = await fetch(url, {
          method: 'PUT',
        });

        if (!response.ok) {
          throw new Error(`Error al eliminar: ${response.status}`);
        }
        
        alert(`Registro con ID ${id} eliminado con éxito!`);
        await fetchData(); // Recargar la tabla

      } catch (err) {
        console.error("Error al eliminar el registro:", err);
        alert(`Error al eliminar el registro. Detalle: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // ----------------------------------------------------
  // Renderizado Principal
  // ----------------------------------------------------
  
  return (
    <div style={{ padding: '20px' }}>
      <div style={headerContainerStyle}>
        <h1>Listado de Usuarios</h1>
        <button 
          onClick={handleAdd} 
          disabled={isLoading}
          style={{ ...buttonStyle, backgroundColor: '#28a745' }}> 
          {isLoading ? 'Cargando...' : 'Agregar Nuevo'}
        </button>
      </div>
      
      {isLoading && <div style={{ marginBottom: '10px', color: '#007bff' }}>Cargando datos...</div>}
      
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Nombre Completo</th>
            <th style={thStyle}>Correo</th>
            <th style={thStyle}>Teléfono</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td style={tdStyle}>{item.nombreCompleto}</td>
              <td style={tdStyle}>{item.correo}</td>
              <td style={tdStyle}>{item.telefono}</td>
              <td style={tdStyle}>
                <button 
                  onClick={() => handleEdit(item.id)} 
                  disabled={isLoading}
                  style={{ ...actionButtonStyle, backgroundColor: '#007bff' }}>
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(item.id)} 
                  disabled={isLoading}
                  style={{ ...actionButtonStyle, backgroundColor: '#dc3545', marginLeft: '8px' }}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* ---------------------------------------------------- */}
      {/* COMPONENTE MODAL */}
      {/* ---------------------------------------------------- */}
      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2>{isEditing ? 'Editar Registro' : 'Agregar Nuevo Registro'}</h2>
            <form onSubmit={handleSubmit}>
              
              <div style={formGroupStyle}>
                <label htmlFor="nombreCompleto">Nombre Completo:</label>
                <input
                  type="text"
                  id="nombreCompleto"
                  name="nombreCompleto"
                  value={formData.nombreCompleto}
                  onChange={handleInputChange}
                  required
                  style={inputStyle}
                />
              </div>

              <div style={formGroupStyle}>
                <label htmlFor="correo">Correo:</label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleInputChange}
                  required
                  style={inputStyle}
                />
              </div>

              <div style={formGroupStyle}>
                <label htmlFor="telefono">Teléfono:</label>
                <input
                  type="text"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  required
                  style={inputStyle}
                />
              </div>
              
              <div style={buttonGroupStyle}>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  style={{ ...buttonStyle, backgroundColor: isEditing ? '#ffc107' : '#28a745', marginRight: '10px', color: isEditing ? '#212529' : 'white' }}>
                  {isLoading ? 'Procesando...' : (isEditing ? 'Guardar Cambios' : 'Guardar Nuevo')}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  disabled={isLoading}
                  style={{ ...buttonStyle, backgroundColor: '#6c757d' }}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Estilos ---
const headerContainerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' };
const thStyle = { border: '1px solid #ddd', padding: '12px', textAlign: 'left', backgroundColor: '#f2f2f2', fontWeight: 'bold' };
const tdStyle = { border: '1px solid #ddd', padding: '12px', textAlign: 'left', verticalAlign: 'middle' };
const actionButtonStyle = { color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };
const buttonStyle = { ...actionButtonStyle, padding: '10px 15px', fontSize: '16px' };

const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContentStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '90%', maxWidth: '500px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.25)', animation: 'fadeIn 0.3s' };
const formGroupStyle = { marginBottom: '15px' };
const inputStyle = { width: '100%', padding: '10px', marginTop: '5px', marginBottom: '5px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' };
const buttonGroupStyle = { marginTop: '20px', textAlign: 'right' };

export default Home;