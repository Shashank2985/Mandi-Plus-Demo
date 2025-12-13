import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { adminAuthAPI, adminUsersAPI, adminInsuranceAPI } from '../api/admin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminLogin from '../pages/admin/AdminLogin';
import UsersTable from '../pages/admin/UsersTable';
import InsuranceFormsTable from '../pages/admin/InsuranceFormsTable';

// Protected route component
const ProtectedRoute = ({ children }) => {
    if (!adminAuthAPI.isAuthenticated()) {
        return <Navigate to="/admin/login" replace />;
    }
    return children || <Outlet />;
};

// Public route component (only for non-authenticated users)
const PublicRoute = ({ children }) => {
    if (adminAuthAPI.isAuthenticated()) {
        return <Navigate to="/admin/dashboard" replace />;
    }
    return children;
};

const AdminRoutes = () => {
    const [dashboardData, setDashboardData] = useState({
        usersCount: 0,
        formsCount: 0,
        loading: true,
        error: null
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [usersResponse, formsResponse] = await Promise.all([
                    adminUsersAPI.getAllUsers(),
                    adminInsuranceAPI.getAllForms()
                ]);

                setDashboardData({
                    usersCount: usersResponse.data?.length || 0,
                    formsCount: formsResponse.data?.length || 0,
                    loading: false,
                    error: null
                });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setDashboardData(prev => ({
                    ...prev,
                    loading: false,
                    error: 'Failed to load dashboard data'
                }));
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <Routes>
            <Route path="login" element={
                <PublicRoute>
                    <AdminLogin />
                </PublicRoute>
            } />

            <Route path="/" element={
                <ProtectedRoute>
                    <AdminDashboard />
                </ProtectedRoute>
            }>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
                                {dashboardData.loading ? (
                                    <p className="text-3xl font-bold text-indigo-600">Loading...</p>
                                ) : dashboardData.error ? (
                                    <p className="text-red-500">Error</p>
                                ) : (
                                    <p className="text-3xl font-bold text-indigo-600">{dashboardData.usersCount.toLocaleString()}</p>
                                )}
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-lg font-semibold text-gray-700">Total Insurance Forms</h3>
                                {dashboardData.loading ? (
                                    <p className="text-3xl font-bold text-green-600">Loading...</p>
                                ) : dashboardData.error ? (
                                    <p className="text-red-500">Error</p>
                                ) : (
                                    <p className="text-3xl font-bold text-green-600">{dashboardData.formsCount.toLocaleString()}</p>
                                )}
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-lg font-semibold text-gray-700">Recent Activity</h3>
                                <p className="text-gray-600 mt-2">Check the latest forms and users</p>
                            </div>
                        </div>
                    </div>
                } />

                <Route path="users" element={
                    <div className="p-6">
                        <UsersTable />
                    </div>
                } />

                <Route path="insurance-forms" element={
                    <div className="p-6">
                        <InsuranceFormsTable />
                    </div>
                } />

                <Route path="users/:userId/forms" element={
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-6">User Forms</h2>
                        <InsuranceFormsTable userSpecific={true} />
                    </div>
                } />
            </Route>

            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
    );
};

export default AdminRoutes;
