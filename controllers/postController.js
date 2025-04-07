const { Post, Like,Comment, User } = require('../models');

exports.createPost = async (req, res) => {
  const { content } = req.body;
  try {
    const newPost = await Post.create({
      content,
      UserId: req.user.userId,
    });
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: 'Erreur création post', error: err.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Erreur récupération des posts' });
  }
};

exports.deletePost = async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await Post.findByPk(postId);

    if (!post) return res.status(404).json({ message: 'Post introuvable' });
    if (post.UserId !== req.user.userId) return res.status(403).json({ message: 'Non autorisé' });

    await post.destroy();
    res.status(200).json({ message: 'Post supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur suppression post' });
  }
};


exports.likePost = async (req, res) => {
  const userId = req.user.id;  // Récupère l'ID de l'utilisateur à partir du JWT
  const { postId } = req.params;

  try {
    // Vérifier si l'utilisateur a déjà liké ce post
    const existingLike = await Like.findOne({ where: { UserId: userId, PostId: postId } });

    if (existingLike) {
      // L'utilisateur a déjà liké le post, il peut unliker
      await existingLike.destroy();  // Supprime le like
      return res.status(200).json({ message: 'Post unliked', liked: false, count: await getLikesCount(postId) });
    }

    // Si l'utilisateur n'a pas encore liké ce post, on crée un like
    await Like.create({ UserId: userId, PostId: postId });

    // Renvoyer la réponse avec l'état du like et le nombre de likes
    res.status(201).json({ message: 'Post liked', liked: true, count: await getLikesCount(postId) });
  } catch (error) {
    console.error('Erreur lors du like/unlike', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Fonction pour compter les likes d'un post
const getLikesCount = async (postId) => {
  const count = await Like.count({ where: { PostId: postId } });
  return count;
};

// Récupérer les commentaires d'un post spécifique
exports.getCommentsForPost = async (req, res) => {
  const postId = req.params.postId;  // Récupère l'ID du post à partir des paramètres de la route

  try {
    const comments = await Comment.findAll({
      where: { PostId: postId },
      include: [
        {
          model: User,  // Inclure les informations sur l'utilisateur qui a posté le commentaire
          attributes: ['username'] // On peut inclure d'autres champs comme 'email', 'id', etc.
        }
      ],
      order: [['createdAt', 'ASC']] // Optionnel : trier les commentaires par date de création
    });

    if (comments.length === 0) {
      return res.status(404).json({ message: 'Aucun commentaire trouvé pour ce post' });
    }

    res.status(200).json(comments);  // Renvoyer la liste des commentaires
  } catch (err) {
    console.error('Erreur lors de la récupération des commentaires', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};