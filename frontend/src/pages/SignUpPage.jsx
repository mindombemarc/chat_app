import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  User,
  Phone,          // import icône téléphone
  CheckCircle,    // import icône vérification
} from "lucide-react";
import { Link } from "react-router-dom";

import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",   // <-- ajouté ici
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
   if (!formData.fullName.trim()) return toast.error("Le nom complet est requis");
if (!formData.email.trim()) return toast.error("L'email est requis");
if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Le format de l'email est invalide");
if (!formData.phone.trim()) return toast.error("Le numéro de téléphone est requis");
if (!/^\+243\d{9}$/.test(formData.phone)) return toast.error("Le format du numéro de téléphone est invalide (ex: +243XXXXXXXXX)");
if (!formData.password) return toast.error("Le mot de passe est requis");
if (formData.password.length < 6) return toast.error("Le mot de passe doit contenir au moins 6 caractères");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();

    if (success === true) signup(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
              group-hover:bg-primary/20 transition-colors"
              >
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Crée un compte sur Yabiso</h1>
              <p className="text-base-content/60">Fongola compte nayo</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative">
            {/* Nom complet */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Nom complet</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="Marc Mindombe exemple"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="MarcMindombe@gmail.com exemple"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Téléphone */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Numéro de téléphone</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="size-5 text-base-content/40" />
                </div>
                <input
                  type="tel"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="+243xxxxxxxxx"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Mot de passe</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  chargement...
                </>
              ) : (
                "Crée un compte"
              )}
            </button>

           
          </form>

          <div className="text-center mt-8">
            <p className="text-base-content/60">
              Vous avez déjà un compte ?{" "}
              <Link to="/login" className="link link-primary">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}

      <AuthImagePattern
        title="s'inscrire sur Yabiso"
        subtitle="Vous permet de retrouver votre famille , vos ami(e) rester connecter avec votre monde !."
      />
    </div>
  );
};
export default SignUpPage;
