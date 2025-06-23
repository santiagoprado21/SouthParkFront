import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, User, Lock } from "lucide-react";
import { toast } from "sonner";
import type { User } from "@/pages/Index";

interface LoginModalProps {
  onClose: () => void;
  onLogin: (user: User) => void;
}

export const LoginModal = ({ onClose, onLogin }: LoginModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    if (!isLogin && !formData.name) {
      toast.error('Por favor ingresa tu nombre');
      return;
    }

    // Simulación de autenticación
    const isAdmin = formData.email === 'admin@southpark.com';
    
    const user: User = {
      id: Date.now().toString(),
      name: isLogin ? (isAdmin ? 'Administrador' : 'Usuario Demo') : formData.name,
      email: formData.email,
      phone: formData.phone,
      role: isAdmin ? 'admin' : 'client',
      createdAt: new Date().toISOString()
    };

    // Para login de cliente demo
    if (isLogin && formData.email === 'cliente@demo.com') {
      const clientUser: User = {
        id: 'demo-client',
        name: 'Cliente Demo',
        email: 'cliente@demo.com',
        role: 'client',
        createdAt: new Date().toISOString()
      };
      onLogin(clientUser);
      toast.success(`¡Bienvenido ${clientUser.name}!`);
      return;
    }

    onLogin(user);
    toast.success(`¡Bienvenido ${user.name}!`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white shadow-2xl">
        <CardHeader className="relative">
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2"
          >
            <X className="w-4 h-4" />
          </Button>
          <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-club-blue to-club-green bg-clip-text text-transparent">
            {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="name">Nombre Completo</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1"
                  placeholder="Tu nombre completo"
                />
              </div>
            )}

            <div>
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="mt-1"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="mt-1"
                placeholder="Tu contraseña"
              />
            </div>

            {!isLogin && (
              <div>
                <Label htmlFor="phone">Teléfono (Opcional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="mt-1"
                  placeholder="+56 9 1234 5678"
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-club-blue to-club-green hover:from-club-green hover:to-club-blue text-white"
            >
              <User className="w-4 h-4 mr-2" />
              {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            </p>
            <Button
              onClick={() => setIsLogin(!isLogin)}
              variant="link"
              className="text-club-blue hover:text-club-green"
            >
              {isLogin ? 'Regístrate aquí' : 'Inicia sesión aquí'}
            </Button>
          </div>

          {isLogin && (
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
              <p className="font-medium mb-2">Usuarios de prueba:</p>
              <p><strong>Admin:</strong> admin@southpark.com</p>
              <p><strong>Cliente:</strong> cliente@demo.com</p>
              <p className="mt-2 text-xs">Contraseña: cualquiera</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
