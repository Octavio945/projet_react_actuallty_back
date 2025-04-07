const { Comment } = require('../models');

exports.addComment = async (req, res) => {
  const { content, PostId } = req.body;
  try {
    const comment = await Comment.create({
      content,
      PostId,
      UserId: req.user.userId,
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Erreur ajout commentaire' });
  }
};
