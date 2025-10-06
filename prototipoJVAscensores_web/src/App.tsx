import React from "react";
import { Sidebar } from "./components/sidebar";
import { Header } from "./components/header";
import { MaintenanceTable } from "./components/maintenance-table";
import { EmployeeTracking } from "./components/employee-tracking";
import { AlertsPanel } from "./components/alerts-panel";
import { MapView } from "./components/map-view";
import { Tabs, Tab } from "@heroui/react";

// Import router components
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

// Import pages
import { DashboardPage } from "./pages/dashboard";
import { MaintenancePage } from "./pages/maintenance";
import { EmployeesPage } from "./pages/employees";
import { AlertsPage } from "./pages/alerts";
import { MapPage } from "./pages/map";
import { SettingsPage } from "./pages/settings";
import { ClientsPage } from "./pages/clients";
import { ReportsPage } from "./pages/reports";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} />

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header toggleSidebar={toggleSidebar} />

          {/* Content Area */}
          <main className="flex-1 overflow-auto p-4">
            <div className="max-w-7xl mx-auto">
              <Switch>
                <Route path="/dashboard" component={DashboardPage} />
                <Route path="/maintenance" component={MaintenancePage} />
                <Route path="/employees" component={EmployeesPage} />
                <Route path="/alerts" component={AlertsPage} />
                <Route path="/map" component={MapPage} />
                <Route path="/settings" component={SettingsPage} />
                <Route path="/clients" component={ClientsPage} />
                <Route path="/reports" component={ReportsPage} />
                <Redirect from="/" to="/dashboard" />
              </Switch>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}