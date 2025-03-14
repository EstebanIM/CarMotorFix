import { Car } from "lucide-react";
import { useEffect, useState, useContext } from "react";
import { DarkModeContext } from '../../context/DarkModeContext';

export default function LoadingComponent() {
  const [dots, setDots] = useState('.');
  const { darkMode } = useContext(DarkModeContext);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length < 3 ? prev + '.' : '.'));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className="text-4xl font-bold mb-4">Cargando</div>
      <div className="animate-bounce">
        <Car className={`w-16 h-16 ${darkMode ? 'text-white' : 'text-black'} animate-pulse`} />
      </div>
      <div className="text-xl mt-4">
        Por favor, espere{dots}
      </div>
    </div>
  );
}
