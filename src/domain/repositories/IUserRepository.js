class IUserRepository {
  async create(user) {
    throw new Error('create method must be implemented');
  }

  async findById(id) {
    throw new Error('findById method must be implemented');
  }

  async findByEmail(email) {
    throw new Error('findByEmail method must be implemented');
  }

  async update(id, userData) {
    throw new Error('update method must be implemented');
  }

  async delete(id) {
    throw new Error('delete method must be implemented');
  }

  async findAll() {
    throw new Error('findAll method must be implemented');
  }

  async findByRole(role) {
    throw new Error('findByRole method must be implemented');
  }
}

module.exports = IUserRepository;
