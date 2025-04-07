const { User } = require('../models');

exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: ['id', 'username', 'email', 'createdAt'],
    });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erreur récupération profil' });
  }
};

exports.getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'email', 'createdAt'],
    });
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    if (parseInt(id) !== req.user.userId)
      return res.status(403).json({ message: 'Non autorisé à supprimer ce compte' });

    await User.destroy({ where: { id } });
    res.status(200).json({ message: 'Compte supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur suppression' });
  }
};
