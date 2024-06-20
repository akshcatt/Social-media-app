import user from "../models/user.js";

//read 
export const getUser = async (req, res) => {
    try {
        const { id } = await req.params;
        const existingUser = await user.findById(id);
        res.status(200).json(existingUser);
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}

export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;
        const existingUser = await user.findById(id);

        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const friends = await Promise.all(
            existingUser.friends.map((friendId) => user.findById(friendId))
        );

        const formattedFriends = friends.map(({ _id, firstName, lastName, occupation, location, picturePath }) => {
            return { _id, firstName, lastName, occupation, location, picturePath };
        });

        res.status(200).json(formattedFriends);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//update
export const addRemoveFriend = async (req, res) => {
    try {
        const { id, friendId } = req.params;
        const existingUser = await user.findById(id);
        const friend = await user.findById(friendId);

        if (!existingUser || !friend) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (existingUser.friends.includes(friendId)) {
            existingUser.friends = existingUser.friends.filter((fId) => fId !== friendId);
            friend.friends = friend.friends.filter((uId) => uId !== id);
        } else {
            existingUser.friends.push(friendId);
            friend.friends.push(id);
        }

        await existingUser.save();
        await friend.save();

        const friends = await Promise.all(
            existingUser.friends.map((friendId) => user.findById(friendId))
        );

        const formattedFriends = friends.map(({ _id, firstName, lastName, occupation, location, picturePath }) => {
            return { _id, firstName, lastName, occupation, location, picturePath };
        });

        res.status(200).json(formattedFriends);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};