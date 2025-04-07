const { Like } = require('../models');

exports.toggleLike = async (req, res) => {
  const { PostId } = req.body;
  const UserId = req.user.userId;

  try {
    const existingLike = await Like.findOne({ where: { PostId, UserId } });

    if (existingLike) {
      await existingLike.destroy();
      return res.status(200).json({ message: 'Like retiré' });
    }

    await Like.create({ PostId, UserId });
    res.status(201).json({ message: 'Post liké' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur toggle like' });
  }
};
