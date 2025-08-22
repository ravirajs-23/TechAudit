class IQuestionRepository {
  async create(question) {
    throw new Error('Method not implemented');
  }

  async findById(id) {
    throw new Error('Method not implemented');
  }

  async findBySection(sectionId) {
    throw new Error('Method not implemented');
  }

  async update(id, questionData) {
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

  async searchByText(searchText) {
    throw new Error('Method not implemented');
  }

  async moveQuestion(id, newOrder) {
    throw new Error('Method not implemented');
  }

  async updateWeight(id, newWeight) {
    throw new Error('Method not implemented');
  }
}

module.exports = IQuestionRepository;
