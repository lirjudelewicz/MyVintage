import { Request, Response } from 'express';
import Post from '../models/Post';

export const createPost = async (req: Request, res: Response): Promise<void> => {
    const { title, description, category, price, condition, year, brand, style, images } = req.body;

    if (!title || !description || !category || price === undefined || !condition || !year || !brand || !style) {
        res.status(400).json({ message: 'title, description, category, price, condition, year, brand and style are required' });
        return;
    }

    const post = await Post.create({
        seller: req.jwtUser!.userId,
        title, description, category, price, condition, year, brand, style,
        images: images ?? [],
    });

    res.status(201).json(post);
};

export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
    const { category, condition, status, minPrice, maxPrice } = req.query;

    const filter: Record<string, unknown> = {};
    if (category)  filter.category  = category;
    if (condition) filter.condition = condition;
    if (status)    filter.status    = status;
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) (filter.price as Record<string, unknown>).$gte = Number(minPrice);
        if (maxPrice) (filter.price as Record<string, unknown>).$lte = Number(maxPrice);
    }

    const posts = await Post.find(filter).populate('seller', 'username profilePicture').sort({ createdAt: -1 });
    res.json(posts);
};

export const getPostsByUser = async (req: Request, res: Response): Promise<void> => {
    const posts = await Post.find({ seller: req.params.userId })
        .populate('seller', 'username profilePicture')
        .sort({ createdAt: -1 });
    res.json(posts);
};

export const getPostById = async (req: Request, res: Response): Promise<void> => {
    const post = await Post.findById(req.params.id).populate('seller', 'username profilePicture');

    if (!post) {
        res.status(404).json({ message: 'Post not found' });
        return;
    }

    res.json(post);
};

export const updatePost = async (req: Request, res: Response): Promise<void> => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        res.status(404).json({ message: 'Post not found' });
        return;
    }

    if (post.seller.toString() !== req.jwtUser!.userId) {
        res.status(403).json({ message: 'Forbidden: you are not the seller of this post' });
        return;
    }

    const allowed = ['title', 'description', 'category', 'price', 'condition', 'year', 'brand', 'style', 'images', 'status'];
    allowed.forEach((field) => {
        if (req.body[field] !== undefined) {
            (post as unknown as Record<string, unknown>)[field] = req.body[field];
        }
    });

    await post.save();
    res.json(post);
};

export const deletePost = async (req: Request, res: Response): Promise<void> => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        res.status(404).json({ message: 'Post not found' });
        return;
    }

    if (post.seller.toString() !== req.jwtUser!.userId) {
        res.status(403).json({ message: 'Forbidden: you are not the seller of this post' });
        return;
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
};
