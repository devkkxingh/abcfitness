import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./components/Layout/Layout";
import ClassesPage from "./pages/Classes/ClassesPage";
import CreateClassPage from "./pages/Classes/CreateClassPage";
import ClassDetailPage from "./pages/Classes/ClassDetailPage";
import BookClassPage from "./pages/Classes/BookClassPage";
import BookingsPage from "./pages/Bookings/BookingsPage";
import NotFoundPage from "./pages/NotFoundPage";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<ClassesPage />} />
            <Route path="/create-class" element={<CreateClassPage />} />
            <Route path="/classes/:classId" element={<ClassDetailPage />} />
            <Route path="/book-class/:classId" element={<BookClassPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
