class IQuestionnaireRepository {
  async create(questionnaire) {
    throw new Error('Method not implemented');
  }

  async findById(id) {
    throw new Error('Method not implemented');
  }

  async findByTechnology(technologyId) {
    throw new Error('Method not implemented');
  }

  async update(id, questionnaireData) {
    throw new Error('Method not implemented');
  }

  async delete(id) {
    throw new Error('Method not implemented');
  }

  async findAll() {
    throw new Error('Method not implemented');
  }

  async findLatestVersion(technologyId) {
    throw new Error('Method not implemented');
  }

  async findByTitle(title) {
    throw new Error('Method not implemented');
  }

  async updateVersion(id, newVersion) {
    throw new Error('Method not implemented');
  }

  async updateTitle(id, newTitle) {
    throw new Error('Method not implemented');
  }
}

module.exports = IQuestionnaireRepository;

