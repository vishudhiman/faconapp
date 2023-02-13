import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin",
    email: "admin@admin.com",
    password: bcrypt.hashSync("admin@123", 12),
    isAdmin: true,
    isConfirmed: true,
    avatar: "https://res.cloudinary.com/dsj8hlygt/image/upload/v1676272996/icon_user_tkwxy7.png",
  },
  {
    name: "User",
    email: "user@example.com",
    password: bcrypt.hashSync("user@123", 12),
    isConfirmed: true,
    avatar: "https://res.cloudinary.com/dsj8hlygt/image/upload/v1676272996/icon_user_tkwxy7.png",
  },
  {
    name: "Xyz",
    email: "xyz@gmail.com",
    password: bcrypt.hashSync("xyz@123", 12),
    isConfirmed: true,
    avatar: "https://res.cloudinary.com/dsj8hlygt/image/upload/v1676272996/icon_user_tkwxy7.png",
  },
];

export default users;
