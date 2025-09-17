import bcrypt from 'bcrypt';
import { createUser, findUserByUsername } from '../models/User.js';

const registerUser = async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const userData = { username, password: hash, email };
    const result = await createUser(userData);
    res.status(201).json({ message: 'User created successfully', userId: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    res.status(500).json({ error: 'Error creating user' });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const user = await findUserByUsername(username);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

    res.status(200).json({ message: 'Login successful', user: { id: user.id, username: user.username } });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

export { registerUser, loginUser };