class ITechnologyRepository {
  async create(technology) {
    throw new Error('Method not implemented');
  }

  async findById(id) {
    throw new Error('Method not implemented');
  }

  async findByProject(projectId) {
    throw new Error('Method not implemented');
  }

  async update(id, technologyData) {
    throw new Error('Method not implemented');
  }

  async delete(id) {
    throw new Error('Method not implemented');
  }

  async findAll() {
    throw new Error('Method not implemented');
  }

  async findByCategory(category) {
    throw new Error('Method not implemented');
  }

  async findByRiskLevel(riskLevel) {
    throw new Error('Method not implemented');
  }

  async updateRiskLevel(id, newRiskLevel) {
    throw new Error('Method not implemented');
  }
}

module.exports = ITechnologyRepository;

