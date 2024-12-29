import user from "../models/user.model.js";

export const createuser = async ({ email, password }) => {
    if (!email || !password) {
        throw new Error("Email and password are required");
    }

    // Hash the password before saving it to the database
    const hashPassword = await user.hashPassword(password);

    // Create the user with the hashed password
    const newUser = await user.create({
        email,
        password: hashPassword,  // Store the hashed password
    });

    return newUser;  // Return the created user (or any other data as needed)
};
export const getAllUsers = async ({ userId }) => {
    const users = await user.find({
        _id: { $ne: userId }  //loggedin user id removed as we will return all users except the curretn user
    });
    return users;
}