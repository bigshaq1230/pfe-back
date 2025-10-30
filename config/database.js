const { ExistDB } = require('existdb');

class ExistDBClient {
  constructor() {
    this.client = new ExistDB({
      baseURL: process.env.EXIST_DB_URL || 'http://localhost:8080/exist',
      username: process.env.EXIST_DB_USER || 'admin',
      password: process.env.EXIST_DB_PASS || 'admin'
    });
  }

  async connect() {
    try {
      await this.client.connect();
      console.log('✅ Connecté à eXist-DB');
      return true;
    } catch (error) {
      console.error('❌ Erreur de connexion à eXist-DB:', error);
      return false;
    }
  }

  async storeXML(collection, documentName, xmlContent) {
    try {
      const result = await this.client.storeDocument(
        `/db/smart-waste/${collection}`,
        documentName,
        xmlContent
      );
      return result;
    } catch (error) {
      console.error('Erreur lors du stockage XML:', error);
      throw error;
    }
  }

  async getXML(collection, documentName) {
    try {
      const result = await this.client.getDocument(
        `/db/smart-waste/${collection}/${documentName}`
      );
      return result;
    } catch (error) {
      console.error('Erreur lors de la récupération XML:', error);
      throw error;
    }
  }

  async queryXPath(xpathQuery) {
    try {
      const result = await this.client.executeXPath(xpathQuery);
      return result;
    } catch (error) {
      console.error('Erreur lors de la requête XPath:', error);
      throw error;
    }
  }
}

module.exports = new ExistDBClient();