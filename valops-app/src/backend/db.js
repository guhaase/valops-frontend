/**
 * Módulo de conexão com o banco de dados
 * 
 * Este arquivo implementa a conexão com o banco de dados MySQL/MariaDB
 * para o catálogo de treinamentos e outras funcionalidades da aplicação.
 */

const mysql = require('mysql2/promise');
const config = require('../config');

// Configuração da pool de conexões
const pool = mysql.createPool({
  host: config.db.host || '10.2.98.165',
  user: config.db.user || 'valops',
  password: config.db.password || 'valops_password',
  database: config.db.database || 'valops_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/**
 * Executa uma consulta SQL no banco de dados
 * @param {string} sql - Consulta SQL a ser executada
 * @param {Array} params - Parâmetros para a consulta (opcional)
 * @returns {Promise<Array>} - Resultado da consulta
 */
async function query(sql, params = []) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Erro ao executar consulta SQL:', error);
    throw error;
  }
}

/**
 * Obtém uma conexão do pool para usar em transações
 * @returns {Promise<Connection>} - Conexão com o banco de dados
 */
async function getConnection() {
  try {
    return await pool.getConnection();
  } catch (error) {
    console.error('Erro ao obter conexão com o banco de dados:', error);
    throw error;
  }
}

/**
 * Inicializa o banco de dados, criando tabelas se necessário
 */
async function initDatabase() {
  try {
    // Verifica se as tabelas do catálogo de treinamentos existem
    const [tables] = await pool.execute(
      "SHOW TABLES LIKE 'training_%'"
    );
    
    // Se as tabelas não existirem, cria a estrutura inicial
    if (tables.length === 0) {
      console.log('Inicializando estrutura do banco de dados para o catálogo de treinamentos...');
      
      // Lê o arquivo SQL com o esquema
      const fs = require('fs');
      const path = require('path');
      const schemaPath = path.join(__dirname, '../database/training_catalog_schema.sql');
      
      if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        // Divide o arquivo SQL em instruções separadas
        const statements = schema
          .replace(/--.*$/gm, '') // Remove comentários
          .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comentários de múltiplas linhas
          .split(/;\s*$/m) // Divide pelo delimitador de instrução
          .filter(statement => statement.trim().length > 0); // Remove instruções vazias
        
        // Executa cada instrução separadamente
        for (const statement of statements) {
          if (statement.trim().startsWith('DELIMITER')) continue; // Ignora statements DELIMITER
          await pool.execute(statement);
        }
        
        console.log('Esquema do banco de dados inicializado com sucesso.');
      } else {
        console.error('Arquivo de esquema não encontrado:', schemaPath);
      }
    }
    
    // Verifica se há dados no catálogo de treinamentos
    const [categoriesCount] = await pool.execute(
      "SELECT COUNT(*) as count FROM training_categories"
    );
    
    // Se não houver categorias, adiciona categorias padrão
    if (categoriesCount[0].count === 0) {
      await pool.execute(`
        INSERT INTO training_categories (id, name, icon, description, display_order) VALUES
        ('all', 'Todos', NULL, 'Todos os materiais de treinamento', 0),
        ('videos', 'Vídeos', 'Video', 'Vídeos tutoriais e webinars', 1),
        ('books', 'Livros', 'BookOpen', 'Livros e guias digitais', 2),
        ('docs', 'Documentação', 'FileText', 'Documentação técnica e manuais', 3),
        ('courses', 'Cursos', 'BookOpenCheck', 'Cursos completos e workshops', 4)
      `);
      
      console.log('Categorias padrão adicionadas.');
    }
    
    // Inicializa as estatísticas se necessário
    const [statsCount] = await pool.execute(
      "SELECT COUNT(*) as count FROM training_statistics"
    );
    
    if (statsCount[0].count === 0) {
      await pool.execute(`
        INSERT INTO training_statistics 
          (total_materials, video_content_hours, total_courses, average_rating, last_calculated) 
        VALUES (0, 0, 0, 0, NOW())
      `);
      
      console.log('Estatísticas inicializadas.');
    }
    
    console.log('Banco de dados inicializado com sucesso.');
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    throw error;
  }
}

// Inicializar o banco de dados em inicialização
initDatabase().catch(console.error);

module.exports = {
  query,
  getConnection,
  pool
};