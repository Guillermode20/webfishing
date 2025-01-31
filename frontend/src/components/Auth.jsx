import { useState } from 'preact/hooks';

export default function Auth({ onAuth }) {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? '/auth/login' : '/auth/register';
        
        try {
            const response = await fetch(`http://localhost:4000${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            
            if (response.ok) {
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    onAuth(true);
                }
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Auth error:', error);
            alert('Authentication failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-center text-3xl font-bold">
                    {isLogin ? 'Login' : 'Register'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="text"
                            placeholder="Username"
                            required
                            className="w-full px-3 py-2 border rounded-md"
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                        />
                    </div>
                    {!isLogin && (
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                required
                                className="w-full px-3 py-2 border rounded-md"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                    )}
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            className="w-full px-3 py-2 border rounded-md"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                    >
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>
                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="w-full text-blue-500 hover:text-blue-600"
                >
                    {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
                </button>
            </div>
        </div>
    );
}
