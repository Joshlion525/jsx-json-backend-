export const createUsersValidationSchema = {
	fullname: {
		isString: { errorMessage: "Fullname must be a string" },
		notEmpty: { errorMessage: "Fullname cannot be empty" },
		isLength: {
			options: { min: 5, max: 32 },
			errorMessage:
				"Fullname must be at least 5 characters with max of 32 characters",
		},
	},
	email: {
		isEmail: { errorMessage: "Invalid email address" },
		normalizeEmail: true,
	},
	password: {
		isLength: {
			options: { min: 5 },
			errorMessage: "Password must be at least 5 characters long",
		},
	},
};
