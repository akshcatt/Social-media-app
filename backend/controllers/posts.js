import post from "../models/post.js";
import user from "../models/user.js";
//create
export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body;
        const User = await user.findById(userId);
        const newPost = new post({
            userId,
            firstName: User.firstName,
            lastName: User.lastName,
            location: User.location,
            description,
            userPicturePath: User.picturePath,
            picturePath,
            likes: {},
            comments: []
        })
        await newPost.save();
        const Post = await post.find();

        res.status(201).json(Post);
    } catch (error) {
        res.status(409).json({ message: error.message })
    }
}

//read
export const getFeedPosts = async (req, res) => {
    try {
        const feedPost = await post.find();

        res.status(201).json(feedPost);
    } catch (error) {
        res.status(409).json({ message: error.message })
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = await req.params;
        const userPost = await post.find({ userId });
        
        res.status(200).json({userPost, userId});
    } catch (error) {
        res.status(409).json({ message: error.message })
    }
}

//update
export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        // Find the post by ID
        const likedPost = await post.findById(id);
        if (!likedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the user has already liked the post
        const isLiked = likedPost.likes.get(userId);

        // Update the likes map based on the current status
        if (isLiked) {
            likedPost.likes.delete(userId);
        } else {
            likedPost.likes.set(userId, true);
        }

        // Save the updated post
        const updatedPost = await likedPost.save();

        // Respond with the updated post
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};