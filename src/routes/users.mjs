import { request, Router } from "express";
import {
	query,
	validationResult,
	body,
	matchedData,
	checkSchema,
} from "express-validator";
import mongoose from "mongoose"; 
import { User } from "../mongoose/schemas/user.mjs";
import { createUsersValidationSchema } from "../utils/validationSchemas.mjs";
import { hashPassword } from "../utils/helpers.mjs";

const router = Router();

router.post(
	"/users",
	checkSchema(createUsersValidationSchema),
	async (request, response) => {
		const result = validationResult(request);
		if (!result.isEmpty())
			return response.status(400).json({ errors: result.array() });
		const data = matchedData(request);
		try {
			const existingUser = await User.findOne({
				email: data.email,
			});
			if (existingUser) {
				return response
					.status(400)
					.json({ msg: "This user already exits" });
			}
			data.password = hashPassword(data.password);
			const newUser = new User(data);
			const savedUser = await newUser.save();
			response.status(201).json({
				message: "User created successfully.",
				user: savedUser,
			});
			return;
		} catch (err) {
			console.error("Error creating user:", err);
			return response.status(500).json({
				message: "Internal server error. Please try again later.",
				error: err.message,
			});
		}
	}
);

router.get("/users", async (request, response) => {
	try {
		const users = await User.find();
		return response.status(200).json(users);
	} catch (error) {
		console.error("Error fetching users:", error);
		return response
			.status(500)
			.json({ msg: "Server error, try again later." });
	}
});
router.get("/users/:id", async (request, response) => {
	const { id } = request.params;

	try {
		const users = await User.findById(id);
		return response.status(200).json(users);
	} catch (error) {
		console.error("Error fetching the user", error);
		return response.status(500).json({ msg: "Internal server error" });
	}
});
router.patch("/users/:id", async (request, response) => {
	const { id } = request.params;
	const updateData = request.body;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return response.status(400).json({ msg: "Invalid user ID format" });
	}
	try {
		const updatedUser = await User.findByIdAndUpdate(id, updateData, {
			new: true,
		});
		if (!updatedUser) {
			return response.status(404).json({ msg: "User not found" });
		}
		return response
			.status(200)
			.json({ msg: "User updated successfully", updatedUser });
	} catch (error) {
		console.error("Error updating user:", error);
		return response.status(500).json({ msg: "Internal server error" });
	}
});

router.delete("/users/:id", async (request, response) => {
	const { id } = request.params;

	try {
		const deletedUser = await User.findByIdAndDelete(id);
		if (!deletedUser) {
			return response.status(404).json({ msg: "User not found" });
		}
		return response.status(200).json({ msg: "User deleted successfully" });
	} catch (error) {
		console.error("Error deleting user:", error);
		return response.status(500).json({ msg: "Internal server error" });
	}
});

export default router;
