import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../auth/authProvider";

function LoginCard() {
    const navigate = useNavigate();
    const { refreshSessionData } = useContext(AuthContext);

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "Teacher",
        remember: false,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                    remember: formData.remember,
                }),
            });

            const data = await response.json();
            console.log("Data Received", data);

            if (!response.ok) {
                setError(data.message || "Login failed");
                return;
            }

            await refreshSessionData();
            navigate("/idcard", { replace: true });
        } catch (err) {
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 backdrop-blur-xl rounded-2xl border border-gray-800/50 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-primary via-accent to-secondary" />

            <div className="px-20 py-10">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-lock text-primary text-2xl" />
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">
                        Welcome Back
                    </h2>

                    <p className="text-gray-400">
                        Sign in to your SchoolDigify account
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-400/10 border border-red-400/30 text-red-300">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">
                                Email Address
                            </label>

                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                                className="w-full p-4 rounded-xl bg-gray-900/50 border border-gray-700 text-white"
                                placeholder="name@school.edu"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            password: e.target.value,
                                        })
                                    }
                                    className="w-full p-4 rounded-xl bg-gray-900/50 border border-gray-700 text-white"
                                    placeholder="Password"
                                    required
                                />

                                <button
                                    type="button"
                                    className="absolute right-4 top-1/2 -translate-y-1/2"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    <i
                                        className={`fas ${showPassword
                                            ? "fa-eye-slash"
                                            : "fa-eye"
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <label className="flex items-center gap-2 text-sm text-gray-400">
                                <input
                                    type="checkbox"
                                    checked={formData.remember}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            remember:
                                                e.target.checked,
                                        })
                                    }
                                />
                                Remember me
                            </label>

                            <select
                                value={formData.role}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        role: e.target.value,
                                    })
                                }
                                className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"
                            >
                                <option>Teacher</option>
                                <option>Admin</option>
                                <option>Student</option>
                                <option>Parent</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold"
                        >
                            {isLoading
                                ? "Signing In..."
                                : "Sign In"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginCard;