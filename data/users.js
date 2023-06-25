import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin",
    email: "admin@admin.com",
    phone: "9876543218",
    password: bcrypt.hashSync("admin@123", 12),
    isAdmin: true,
    // isConfirmed: true,
    avatar: "https://res.cloudinary.com/dsj8hlygt/image/upload/v1676272996/icon_user_tkwxy7.png",
  },
  {
    name: "User",
    email: "user@example.com",
    phone: "1234567890",
    password: bcrypt.hashSync("user@123", 12),
    // isConfirmed: true,
    avatar: "https://res.cloudinary.com/dsj8hlygt/image/upload/v1676272996/icon_user_tkwxy7.png",
  },
  {
    name: "Xyz",
    email: "xyz@gmail.com",
    phone: "1212123434",
    password: bcrypt.hashSync("xyz@123", 12),
    // isConfirmed: true,
    avatar: "https://res.cloudinary.com/dsj8hlygt/image/upload/v1676272996/icon_user_tkwxy7.png",
  },
];

export default users;
