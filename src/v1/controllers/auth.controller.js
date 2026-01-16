import bcrypt from 'bcryptjs';
import { generateToken } from '../services/jwt.service.js';

// this is an example controller for handling authentication (register, login)
export const register = async (req, res) => {
  // TODO : enregistrer l'utilisateur
  res.json({ message: 'Register OK' });
};

export const login = async (req, res) => {
  // TODO : vérifier email + mot de passe

  const token = generateToken({
    id: 1,
    role: 'user'
  });

  res.json({ token });
};
