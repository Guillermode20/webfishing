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
        <div className="min-h-screen bg-slate-900 flex items-center justify-center crt-effect retro-bg">
            <div className="ps1-window bg-indigo-900 p-8 text-green-400 dither-bg w-full max-w-md">
                <h2 className="retro-text text-2xl text-center mb-8">
                    {isLogin ? 'LOGIN' : 'REGISTER'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="text"
                            placeholder="Username"
                            required
                            className="w-full bg-indigo-950 text-green-400 retro-text text-xs p-4 border-4 border-green-400 focus:outline-none"
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
                                className="w-full bg-indigo-950 text-green-400 retro-text text-xs p-4 border-4 border-green-400 focus:outline-none"
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
                            className="w-full bg-indigo-950 text-green-400 retro-text text-xs p-4 border-4 border-green-400 focus:outline-none"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>
                    <button
                        type="submit"
                        className="retro-button w-full bg-green-400 text-indigo-900 py-2 px-4"
                    >
                        {isLogin ? 'LOGIN' : 'REGISTER'}
                    </button>
                </form>
                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="w-full text-green-400 hover:text-green-500"
                >
                    {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
                </button>
            </div>
        </div>
    );
}
