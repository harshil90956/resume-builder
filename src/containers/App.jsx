// App.jsx
import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools"
import HomeScreen from '../pages/HomeScreen';  // Default import
import Authentication from '../pages/Authentication';  // Default import
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const App = () => {
  const queryClient = new QueryClient();

  
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading....</div>}>
        <Routes>
          <Route path="/*" element={<HomeScreen />} />
          <Route path="/auth" element={<Authentication />} />
        </Routes>
      </Suspense>
      <ToastContainer position='top-right' theme='dark'/>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;  // Default export
