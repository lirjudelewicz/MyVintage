import { Router } from 'express';
import { createPost, getAllPosts, getPostsByUser, getPostById, updatePost, deletePost } from '../controllers/post.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Vintage post listings
 */

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, category, price, condition, year, brand, style]
 *             properties:
 *               title:       { type: string, example: "Vintage Levi's Jacket" }
 *               description: { type: string, example: "Great condition denim jacket from the 80s" }
 *               category:    { type: string, enum: [clothing, accessories, jewelry, furniture, art, electronics, books, other] }
 *               price:       { type: number, example: 75 }
 *               condition:   { type: string, enum: [like_new, excellent, good, fair, poor] }
 *               year:        { type: number, example: 1985 }
 *               brand:       { type: string, example: "Levi's" }
 *               style:       { type: string, example: "Casual" }
 *               images:      { type: array, items: { type: string } }
 *     responses:
 *       201:
 *         description: Post created
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, createPost);

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all posts (with optional filters)
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: condition
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *     responses:
 *       200:
 *         description: List of posts
 */
router.get('/', getAllPosts);

/**
 * @swagger
 * /api/posts/user/{userId}:
 *   get:
 *     summary: Get all posts by a specific user
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of posts by user
 */
router.get('/user/:userId', getPostsByUser);

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Get a single post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Post found
 *       404:
 *         description: Post not found
 */
router.get('/:id', getPostById);

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Update a post (seller only)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:       { type: string }
 *               description: { type: string }
 *               category:    { type: string }
 *               price:       { type: number }
 *               condition:   { type: string }
 *               year:        { type: number }
 *               brand:       { type: string }
 *               style:       { type: string }
 *               images:      { type: array, items: { type: string } }
 *               status:      { type: string, enum: [active, sold, inactive] }
 *     responses:
 *       200:
 *         description: Post updated
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Post not found
 */
router.put('/:id', authenticate, updatePost);

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete a post (seller only)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Post deleted
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Post not found
 */
router.delete('/:id', authenticate, deletePost);

export default router;
