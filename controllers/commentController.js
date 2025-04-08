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

exports.getCommentsByPost = async (req, res) => {
  const { postId } = req.params;
  try {
    const comments = await Comment.findAll({
      where: { PostId: postId },
      order: [['createdAt', 'ASC']],
    });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Erreur récupération des commentaires' });
  }
};