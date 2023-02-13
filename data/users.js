import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin",
    email: "admin@admin.com",
    password: bcrypt.hashSync("admin@123", 12),
    isAdmin: true,
    isConfirmed: true,
    avatar: "/images/icon_user.png",
  },
  {
    name: "User",
    email: "user@example.com",
    password: bcrypt.hashSync("user@123", 12),
    isConfirmed: true,
    avatar: "/images/icon_user.png",
  },
  {
    name: "Xyz",
    email: "xyz@gmail.com",
    password: bcrypt.hashSync("xyz@123", 12),
    isConfirmed: true,
    avatar: "/images/icon_user.png",
  },
];

export default users;
