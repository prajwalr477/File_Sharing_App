import React, { useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import HomePage from './pages/Home';
import Auth from './pages/loginsignup/auth';
import SenderApp from './FileShare/FileShare';
import ReceiverApp from './FileShare/Receiver';
import UserPrompt from './FileShare/UserPrompt';
import { socket } from './socket';
import ProtectedRoute from './ProtectedRoute'; // Import ProtectedRoute
import LinkShare from './LinkShare/LinkShare';
import Contact from './pages/Contact';
import AboutUs from './pages/AboutUs';
import Faq from './pages/Faq';
//import Receiver from './FileShare/Receiver';

const App = () => {
  // Define the routes
  const routes = [
    { path: '/', element: <Auth /> }, // Login page
    { path: '/home', element: <HomePage /> }, // Home page
    {
      path: '/file-share', 
      element: <ProtectedRoute><SenderApp /></ProtectedRoute> // Protected route for FileShare
    },
    {
      path: '/user-prompt', 
      element: <ProtectedRoute><UserPrompt /></ProtectedRoute> // Protected route for UserPrompt
    },
    {path:"/receiver" ,
      element:<ReceiverApp />
    },
    {path:"/share-link" ,
      element:<LinkShare />
    },
    {path:"/contact" ,
      element:<Contact />
    },
    {path:"/aboutus" ,
      element:<AboutUs />
    },
    {path:"/faq" ,
      element:<Faq />
    },
    // Fallback route for unmatched paths
    { path: '*', element: <div>Page Not Found</div> }
  ];

  // Get the elements for the routes
  const element = useRoutes(routes);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect(); // Ensure socket connection
    }

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  return (
    <div>
      {element} {/* Render the routes directly */}
    </div>
  );
};

export default App;
