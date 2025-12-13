import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { adminAuthAPI } from '../../api/admin';
import { theme } from '../../theme';

const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const navigation = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
        { name: 'Users', href: '/admin/users', icon: '👥' },
        { name: 'Insurance Forms', href: '/admin/insurance-forms', icon: '📋' },
    ];

    const handleLogout = () => {
        adminAuthAPI.logout();
        navigate('/admin/login');
    };

    // Check if admin is authenticated
    useEffect(() => {
        if (!adminAuthAPI.isAuthenticated()) {
            navigate('/admin/login');
        }
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile menu button */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
                <div className="flex items-center justify-between px-4 py-3">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="text-gray-500 hover:text-gray-600 focus:outline-none"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                    <h1 className="text-xl font-bold" style={{ color: theme.colors.primary[600] }}>
                        Admin Panel
                    </h1>
                    <div className="w-6"></div> {/* Spacer for alignment */}
                </div>
            </div>

            {/* Mobile sidebar */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setMobileMenuOpen(false)}></div>
                    <div className="relative flex flex-col flex-1 w-72 max-w-xs bg-white">
                        <div className="p-4 border-b border-gray-200">
                            <h1 className="text-xl font-bold" style={{ color: theme.colors.primary[600] }}>
                                Admin Panel
                            </h1>
                        </div>
                        <nav className="flex-1 px-2 py-4 space-y-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-md ${location.pathname === item.href
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    style={{
                                        backgroundColor: location.pathname === item.href ? theme.colors.primary[50] : 'transparent',
                                        color: location.pathname === item.href ? theme.colors.primary[800] : '#4B5563'
                                    }}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <span className="mr-3 text-lg">{item.icon}</span>
                                    {item.name}
                                </Link>
                            ))}
                            <button
                                onClick={handleLogout}
                                className="w-full text-left group flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            >
                                <span className="mr-3 text-lg">🚪</span>
                                Sign out
                            </button>
                        </nav>
                    </div>
                </div>
            )}

            {/* Desktop sidebar */}
            <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
                <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
                    <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                        <div className="flex items-center shrink-0 px-4">
                            <h1
                                className="text-2xl font-bold"
                                style={{ color: theme.colors.primary[600] }}
                            >
                                Admin Panel
                            </h1>
                        </div>
                        <nav className="mt-5 flex-1 px-2 space-y-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-md ${location.pathname === item.href
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    style={{
                                        backgroundColor: location.pathname === item.href ? theme.colors.primary[50] : 'transparent',
                                        color: location.pathname === item.href ? theme.colors.primary[800] : '#4B5563'
                                    }}
                                >
                                    <span className="mr-3 text-lg">{item.icon}</span>
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="shrink-0 flex border-t border-gray-200 p-4">
                        <button
                            onClick={handleLogout}
                            className="shrink-0 w-full group block"
                        >
                            <div className="flex items-center">
                                <div>
                                    <div
                                        className="text-sm font-medium"
                                        style={{ color: theme.colors.primary[700] }}
                                    >
                                        Sign out
                                    </div>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="md:pl-64 flex flex-col pt-12 md:pt-0">
                <main className="flex-1">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            <div className="py-2">
                                <Outlet />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
