import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Context
import { ThemeProvider } from "./contexts/ThemeContext.tsx";

// Components
import Login from "./components/pages/Login.jsx";
import DashboardLayout from "./components/layout/DashboardLayout.tsx";
import ExecutiveSummaryDashboard from "./components/pages/ExecutiveSummaryDashboard.tsx";
import AnalyticsDashboard from "./components/pages/AnalyticsDashboard.tsx";
import { Settings } from "./components/pages/Settings.tsx";
import Cashflow from "./components/pages/Cashflow.tsx";
import ClientDistributionDashboard from "./components/pages/ClientDistributionDashboard.tsx";
import ExceptionDashboard from "./components/pages/ExceptionDashboard.tsx";
import FinancialOverviewDashboard from "./components/pages/FinancialOverviewDashboard.tsx";
import GeoMixDashboard from "./components/pages/GeoMixDashboard.tsx"; 
import InvestmentDashboard from "./components/pages/InvestmentDashboard.tsx"; 
import KpiRatioDashboard from "./components/pages/KpiRatioDashboard.tsx"; 
import SalesInsightDashboard from "./components/pages/SalesInsightDashboard.tsx"; 
import UtilizationDashboard from "./components/pages/UtilizationDashboard.tsx"; 
import './index.css';



export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Login */}
          <Route path="/" element={<Login />} />

          {/* Executive Summary */}
          <Route
            path="/dashboard"
            element={
              <DashboardLayout>
                <ExecutiveSummaryDashboard />
              </DashboardLayout>
            }
          />

          {/* Analytics */}
          <Route
            path="/analytics"
            element={
              <DashboardLayout>
                <AnalyticsDashboard />
              </DashboardLayout>
            }
          />

          {/* Financial Overview */}
          <Route
            path="/financial"
            element={
              <DashboardLayout>
                <FinancialOverviewDashboard />
              </DashboardLayout>
            }
          />

          {/* Geographic Distribution */}
          <Route
            path="/geo"
            element={
              <DashboardLayout>
                <GeoMixDashboard />
              </DashboardLayout>
            }
          />

          {/* Client Distribution */}
          <Route
            path="/clients"
            element={
              <DashboardLayout>
                <ClientDistributionDashboard />
              </DashboardLayout>
            }
          />

          {/* Cashflow */}
          <Route
            path="/cashflow"
            element={
              <DashboardLayout>
                <Cashflow />
              </DashboardLayout>
            }
          />

          {/* Exception Dashboard */}
          <Route
            path="/exception"
            element={
              <DashboardLayout>
                <ExceptionDashboard />
              </DashboardLayout>
            }
          />

          {/* Investment Dashboard */}
          <Route
            path="/investment"
            element={
              <DashboardLayout>
                <InvestmentDashboard />
              </DashboardLayout>
            }
          />


          {/* Client Distribution */}
          <Route
            path="/kpi"
            element={
              <DashboardLayout>
                <KpiRatioDashboard />
              </DashboardLayout>
            }
          />

         {/*Sales Insight */}
          <Route
            path="/sales"
            element={
              <DashboardLayout>
                <SalesInsightDashboard />
              </DashboardLayout>
            }
          />

         {/* Utilization Dashboard*/}
          <Route
            path="/Utilization"
            element={
              <DashboardLayout>
                <UtilizationDashboard />
              </DashboardLayout>
            }
          />
          

          {/* Settings */}
          <Route
            path="/settings"
            element={
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}