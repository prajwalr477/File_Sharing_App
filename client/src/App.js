import React, { useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import HomePage from './pages/Home';
import Auth from './pages/loginsignup/auth';
import SenderApp from './FileShare/FileShare';
import ReceiverApp from './FileShare/Receiver';
import { socket } from './socket';
import ProtectedRoute from './ProtectedRoute'; // Import ProtectedRoute
import LinkShare from './LinkShare/LinkShare';
import Contact from './pages/Contact';
import About from './pages/AboutUs';
import FAQ from './pages/FAQ';
import PP from './pages/Privacy';
import Privacy from './pages/Privacy';
import Home from './pages/Home';
//import Receiver from './FileShare/Receiver';

const App = () => {
  // Define the routes
  const routes = [
    { path: '/', element: <Auth /> }, 
    { path: '/home', element: <ProtectedRoute><HomePage /></ProtectedRoute> }, 
    {
      path: '/file-share', 
      element: <ProtectedRoute><SenderApp /></ProtectedRoute> // Protected route for FileShare
    },
    {path:"/receiver" ,
      element:<ReceiverApp />
    },
    {path:"/share-link" ,
      element:<LinkShare />
    },
    {path:"/home" ,
      element:<Home />
    },
    {path:"/contact" ,
      element:<Contact />
    },
    {path:"/about" ,
      element:<About />
    },
    {path:"/faq" ,
      element:<FAQ />
    },
    {path:"/Privacy" ,
      element:<Privacy />
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