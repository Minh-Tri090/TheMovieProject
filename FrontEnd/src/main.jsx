import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { FavoriteProvider } from './context/FavoriteContext.jsx';

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<AuthProvider>
			<FavoriteProvider>
				<App />
			</FavoriteProvider>
		</AuthProvider>
	</StrictMode>
);
