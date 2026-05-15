import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { I18nProvider } from "./contexts/I18nContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

// User pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BlogDetails from "./pages/BlogDetails";
import CreateBlog from "./pages/CreateBlog";
import EditBlog from "./pages/EditBlog";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageBlogs from "./pages/admin/ManageBlogs";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path={"/"} component={Home} />
      <Route path={"/login"} component={Login} />
      <Route path={"/register"} component={Register} />
      <Route path={"/blog/:id"} component={BlogDetails} />
      <Route path={"/profile/:id"} component={Profile} />

      {/* Protected user routes */}
      <Route path={"/create"}>
        {() => (
          <ProtectedRoute>
            <CreateBlog />
          </ProtectedRoute>
        )}
      </Route>
      <Route path={"/edit/:id"}>
        {() => (
          <ProtectedRoute>
            <EditBlog />
          </ProtectedRoute>
        )}
      </Route>
      <Route path={"/dashboard"}>
        {() => (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )}
      </Route>

      {/* Protected admin routes */}
      <Route path={"/admin"}>
        {() => (
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        )}
      </Route>
      <Route path={"/admin/users"}>
        {() => (
          <ProtectedRoute requiredRole="admin">
            <ManageUsers />
          </ProtectedRoute>
        )}
      </Route>
      <Route path={"/admin/blogs"}>
        {() => (
          <ProtectedRoute requiredRole="admin">
            <ManageBlogs />
          </ProtectedRoute>
        )}
      </Route>
      <Route path={"/admin/reports"}>
        {() => (
          <ProtectedRoute requiredRole="admin">
            <Reports />
          </ProtectedRoute>
        )}
      </Route>
      <Route path={"/admin/settings"}>
        {() => (
          <ProtectedRoute requiredRole="admin">
            <Settings />
          </ProtectedRoute>
        )}
      </Route>

      {/* 404 fallback */}
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        switchable
      >
        <I18nProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </AuthProvider>
        </I18nProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
