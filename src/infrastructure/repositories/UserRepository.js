const UserModel = require('../database/models/UserModel');
const IUserRepository = require('../../domain/repositories/IUserRepository');

class UserRepository extends IUserRepository {
  async create(user) {
    try {
      const userData = {
        email: user.email,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive
      };

      const newUser = new UserModel(userData);
      const savedUser = await newUser.save();
      
      return this.mapToEntity(savedUser);
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('User with this email already exists');
      }
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      const user = await UserModel.findById(id);
      return user ? this.mapToEntity(user) : null;
    } catch (error) {
      throw new Error(`Failed to find user by ID: ${error.message}`);
    }
  }

  async findByEmail(email) {
    try {
      const user = await UserModel.findOne({ email: email.toLowerCase() });
      return user ? this.mapToEntity(user) : null;
    } catch (error) {
      throw new Error(`Failed to find user by email: ${error.message}`);
    }
  }

  async update(id, userData) {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        { $set: userData },
        { new: true, runValidators: true }
      );
      
      if (!updatedUser) {
        throw new Error('User not found');
      }
      
      return this.mapToEntity(updatedUser);
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const deletedUser = await UserModel.findByIdAndDelete(id);
      if (!deletedUser) {
        throw new Error('User not found');
      }
      return true;
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  async findAll() {
    try {
      const users = await UserModel.find();
      return users.map(user => this.mapToEntity(user));
    } catch (error) {
      throw new Error(`Failed to find all users: ${error.message}`);
    }
  }

  async findByRole(role) {
    try {
      const users = await UserModel.findByRole(role);
      return users.map(user => this.mapToEntity(user));
    } catch (error) {
      throw new Error(`Failed to find users by role: ${error.message}`);
    }
  }

  async findActiveUsers() {
    try {
      const users = await UserModel.findActiveUsers();
      return users.map(user => this.mapToEntity(user));
    } catch (error) {
      throw new Error(`Failed to find active users: ${error.message}`);
    }
  }

  async updateLastLogin(id) {
    try {
      await UserModel.findByIdAndUpdate(id, { lastLogin: new Date() });
    } catch (error) {
      console.error('Failed to update last login:', error.message);
    }
  }

  async updateRefreshToken(id, refreshToken) {
    try {
      await UserModel.findByIdAndUpdate(id, { refreshToken });
    } catch (error) {
      throw new Error(`Failed to update refresh token: ${error.message}`);
    }
  }

  // Helper method to map MongoDB document to domain entity
  mapToEntity(userDoc) {
    return {
      id: userDoc._id.toString(),
      email: userDoc.email,
      password: userDoc.password,
      firstName: userDoc.firstName,
      lastName: userDoc.lastName,
      role: userDoc.role,
      isActive: userDoc.isActive,
      lastLogin: userDoc.lastLogin,
      refreshToken: userDoc.refreshToken,
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt
    };
  }
}

module.exports = UserRepository;
