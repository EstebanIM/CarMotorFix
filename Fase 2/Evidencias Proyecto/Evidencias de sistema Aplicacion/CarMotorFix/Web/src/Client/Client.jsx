import { useEffect, useState } from 'react';
import { fetcher } from '../lib/strApi';
import { getTokenFromLocalCookie } from '../lib/cookies';

function Client() {
  const [vehiculos, setVehiculos] = useState([]);
  const [isAdding, setIsAdding] = useState(false); // Estado para manejar el formulario de agregar auto
  const [newVehiculo, setNewVehiculo] = useState({
    modelo: '',
    patente: '',
    anio: '',
    kilometraje: '',
    motor: '',
    color: ''
  });
  const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

  useEffect(() => {
    const fetchVehiculos = async () => {
      const jwt = getTokenFromLocalCookie();
      if (jwt) {
        try {
          const response = await fetcher(`${STRAPI_URL}/api/users/me?populate=vehiculo_ids`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwt}`,          
            },
          });

          
          const vehiculoIds = response.vehiculo_ids || [];
            setVehiculos(vehiculoIds);
          
        } catch (error) {
          console.error('Error fetching vehicles:', error);
        }
      }
    };

    fetchVehiculos();
  }, [STRAPI_URL]);

  const handleChange = (e) => {
    setNewVehiculo({ ...newVehiculo, [e.target.name.toLowerCase()]: e.target.value });
  };  

  const handleAddVehiculo = async (e) => {
    e.preventDefault();
    const jwt = getTokenFromLocalCookie();
    if (jwt) {
      try {
        // Convierte el año a un formato de fecha ISO
        const formattedAnio = new Date(newVehiculo.anio).toISOString();
        const vehiculoData = {
          data: {
            modelo: newVehiculo.modelo,
            patente: newVehiculo.patente,
            anio: formattedAnio,
            kilometraje: Number(newVehiculo.kilometraje),
            motor: newVehiculo.motor,
            color: newVehiculo.color
          }
        };
  
        const response2 = await fetcher(`${STRAPI_URL}/api/vehiculos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify(vehiculoData),
        });
  
        // Actualiza la lista de vehículos
        setVehiculos([...vehiculos, response2.data]);
        // Resetea el formulario
        setNewVehiculo({ modelo: '', patente: '', kilometraje: '', motor: '', color: '', anio: '' });
        setIsAdding(false); // Cierra el formulario
  
        console.log('Vehicle added:', response2.data);
      } catch (error) {
        console.error('Error adding vehicle:', error);
      }
    }
  };
  

  // Función para formatear la patente
  const formatPatente = (patente) => {
    const letras = patente.substring(0, 4);
    const numeros = patente.substring(4);

    if (letras.length === 4 && numeros.length === 2) {
      return `${letras}-${numeros}`; // Formato YYYY-YY
    } else if (letras.length === 2 && numeros.length === 4) {
      return `${numeros}-${letras}`; // Formato YY-YYYY
    } else {
      return patente; // Retorna patente original si no cumple con los formatos
    }
  };

  // Función para formatear el año
  const formatAnio = (anio) => {
    return new Date(anio).getFullYear(); // Asegura que se obtenga solo el año
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Mantenimiento de Autos</h1>

      <div className='grid gap-4 md:grid-cols-2'>
        {/* Sección de Mis Autos */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">Mis Autos</h3>
            <button 
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700" 
              onClick={() => setIsAdding(!isAdding)}
            >
              {isAdding ? 'Cancelar' : 'Agregar'}
            </button>
          </div>

          {/* Mensaje cuando no hay vehículos */}
          {vehiculos.length === 0 ? (
            <div className="text-center text-gray-500 mt-4">
              <h4 className="text-xl">No tienes vehículos registrados.</h4>
            </div>
          ) : (
            <div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Marca - Modelo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patente - Año
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vehiculos.map((vehiculo) => (
                    <tr key={vehiculo.id} className="cursor-pointer hover:bg-gray-100">
                      <td className="px-6 py-4 whitespace-nowrap">
                      {vehiculo.modelo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatPatente(vehiculo.patente)} - {formatAnio(vehiculo.anio)}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        <button className="text-blue-600 hover:underline">Ver</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Formulario para agregar vehículo */}
          {isAdding && (
            <form onSubmit={handleAddVehiculo} className="mt-4">
              <div className="grid gap-4">
                <input 
                  type="text" 
                  name="modelo" 
                  placeholder="Modelo" 
                  value={newVehiculo.modelo}
                  onChange={handleChange}
                  required
                  className="p-2 border rounded"
                />
                <input 
                  type="text" 
                  name="patente" 
                  placeholder="Patente" 
                  value={newVehiculo.patente}
                  onChange={handleChange}
                  required
                  className="p-2 border rounded"
                />
                <input 
                  type="date" 
                  name="anio" 
                  placeholder="Año" 
                  value={newVehiculo.anio}
                  onChange={handleChange}
                  required
                  className="p-2 border rounded"
                />
                <input 
                  type="number" 
                  name="kilometraje" 
                  placeholder="Kilometraje" 
                  value={newVehiculo.kilometraje}
                  onChange={handleChange}
                  required
                  className="p-2 border rounded"
                />
                <input 
                  type="text" 
                  name="motor" 
                  placeholder="motor" 
                  value={newVehiculo.motor}
                  onChange={handleChange}
                  required
                  className="p-2 border rounded"
                />
                <input 
                  type="text" 
                  name="color" 
                  placeholder="color" 
                  value={newVehiculo.color}
                  onChange={handleChange}
                  required
                  className="p-2 border rounded"
                />
              </div>
              <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">
                Agregar Vehículo
              </button>
            </form>
          )}
        </div>

        {/* Sección de Mis Cotizaciones */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">Mis Cotizaciones</h3>
            <button className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700">
              Solicitar
            </button>
          </div>

          <div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Servicio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="cursor-pointer hover:bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap">Mantenimiento General</td>
                  <td className="px-6 py-4 whitespace-nowrap">99.990</td>
                  <td className="px-6 py-4 font-medium">
                    <button className="text-blue-600 hover:underline">Ver</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Client;