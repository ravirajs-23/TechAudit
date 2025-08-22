class ISectionRepository {
  async create(section) {
    throw new Error('Method not implemented');
  }

  async findById(id) {
    throw new Error('Method not implemented');
  }

  async findByQuestionnaire(questionnaireId) {
    throw new Error('Method not implemented');
  }

  async update(id, sectionData) {
    throw new Error('Method not implemented');
  }

  async delete(id) {
    throw new Error('Method not implemented');
  }

  async findAll() {
    throw new Error('Method not implemented');
  }

  async findByWeightRange(minWeight, maxWeight) {
    throw new Error('Method not implemented');
  }

  async moveSection(id, newOrder) {
    throw new Error('Method not implemented');
  }

  async updateWeight(id, newWeight) {
    throw new Error('Method not implemented');
  }
}

module.exports = ISectionRepository;

