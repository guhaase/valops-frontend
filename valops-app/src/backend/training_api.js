/**
 * API para o Catálogo de Treinamentos
 * 
 * Este arquivo implementa os endpoints da API para gerenciar o catálogo de materiais
 * de treinamento usado na aba "Treinamento" da etapa de testes.
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const db = require('./db'); // Importa conexão com o banco de dados

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destPath = path.join(__dirname, '../uploads/training');
    
    // Garantir que o diretório existe
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }
    
    cb(null, destPath);
  },
  filename: (req, file, cb) => {
    const uniquePrefix = uuidv4();
    cb(null, `${uniquePrefix}-${file.originalname}`);
  },
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  }
});

/**
 * @route GET /api/training/materials
 * @desc Obter todos os materiais de treinamento com opções de filtragem
 * @access Public
 */
router.get('/materials', async (req, res) => {
  try {
    const {
      category,
      search,
      level,
      dateRange,
      minRating,
      page = 1,
      pageSize = 10
    } = req.query;
    
    // Cálculo para paginação
    const offset = (page - 1) * pageSize;
    
    // Construir a consulta SQL base
    let query = `
      SELECT m.*, 
        c.name AS category_name, 
        c.icon AS category_icon,
        GROUP_CONCAT(t.name) AS tags
      FROM training_materials m
      LEFT JOIN training_categories c ON m.category_id = c.id
      LEFT JOIN training_material_tags mt ON m.id = mt.material_id
      LEFT JOIN training_tags t ON mt.tag_id = t.id
      WHERE m.is_active = true
    `;
    
    const queryParams = [];
    
    // Adicionar filtros à consulta
    if (category) {
      query += ` AND m.category_id = ?`;
      queryParams.push(category);
    }
    
    if (search) {
      query += ` AND (m.title LIKE ? OR m.description LIKE ? OR t.name LIKE ?)`;
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }
    
    if (level) {
      query += ` AND m.level = ?`;
      queryParams.push(level);
    }
    
    if (dateRange) {
      const now = new Date();
      let startDate;
      
      if (dateRange === 'last_week') {
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
      } else if (dateRange === 'last_month') {
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
      } else if (dateRange === 'last_year') {
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
      }
      
      if (startDate) {
        query += ` AND m.publish_date >= ?`;
        queryParams.push(startDate.toISOString().split('T')[0]);
      }
    }
    
    if (minRating) {
      query += ` AND m.rating >= ?`;
      queryParams.push(parseFloat(minRating));
    }
    
    // Agrupar por ID do material
    query += ` GROUP BY m.id`;
    
    // Ordenar por data de publicação mais recente por padrão
    query += ` ORDER BY m.publish_date DESC`;
    
    // Adicionar paginação
    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(parseInt(pageSize), parseInt(offset));
    
    // Consulta para contar total de registros (sem paginação)
    let countQuery = query.replace(
      'SELECT m.*, c.name AS category_name, c.icon AS category_icon, GROUP_CONCAT(t.name) AS tags',
      'SELECT COUNT(DISTINCT m.id) as total'
    );
    countQuery = countQuery.split('ORDER BY')[0]; // Remover ORDER BY
    countQuery = countQuery.split('LIMIT')[0]; // Remover LIMIT
    
    // Executar consultas
    const [materials, countResult] = await Promise.all([
      db.query(query, queryParams),
      db.query(countQuery, queryParams.slice(0, -2)) // Remove os parâmetros de LIMIT e OFFSET
    ]);
    
    // Processar os resultados
    const formattedMaterials = materials.map(material => ({
      ...material,
      tags: material.tags ? material.tags.split(',') : [],
      publish_date: material.publish_date.toISOString().split('T')[0],
      created_at: material.created_at.toISOString(),
      updated_at: material.updated_at.toISOString(),
    }));
    
    const totalCount = countResult[0].total;
    const totalPages = Math.ceil(totalCount / pageSize);
    
    res.json({
      items: formattedMaterials,
      pagination: {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        totalItems: totalCount,
        totalPages
      }
    });
  } catch (error) {
    console.error('Erro ao obter materiais de treinamento:', error);
    res.status(500).json({ error: 'Erro ao obter materiais de treinamento' });
  }
});

/**
 * @route GET /api/training/materials/:id
 * @desc Obter detalhes de um material de treinamento específico
 * @access Public
 */
router.get('/materials/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Consulta principal para obter detalhes do material
    const query = `
      SELECT m.*, 
        c.name AS category_name, 
        c.icon AS category_icon
      FROM training_materials m
      LEFT JOIN training_categories c ON m.category_id = c.id
      WHERE m.id = ? AND m.is_active = true
    `;
    
    // Consulta para obter as tags do material
    const tagsQuery = `
      SELECT t.id, t.name 
      FROM training_tags t
      JOIN training_material_tags mt ON t.id = mt.tag_id
      WHERE mt.material_id = ?
    `;
    
    // Executar consultas
    const [materialResult, tagsResult] = await Promise.all([
      db.query(query, [id]),
      db.query(tagsQuery, [id])
    ]);
    
    if (materialResult.length === 0) {
      return res.status(404).json({ error: 'Material não encontrado' });
    }
    
    const material = materialResult[0];
    material.tags = tagsResult;
    
    // Atualizar contador de visualizações
    await db.query('UPDATE training_materials SET view_count = view_count + 1 WHERE id = ?', [id]);
    
    // Formatar datas para o frontend
    material.publish_date = material.publish_date.toISOString().split('T')[0];
    material.created_at = material.created_at.toISOString();
    material.updated_at = material.updated_at.toISOString();
    
    res.json(material);
  } catch (error) {
    console.error('Erro ao obter material de treinamento:', error);
    res.status(500).json({ error: 'Erro ao obter material de treinamento' });
  }
});

/**
 * @route GET /api/training/categories
 * @desc Obter todas as categorias de treinamento
 * @access Public
 */
router.get('/categories', async (req, res) => {
  try {
    const query = `
      SELECT * FROM training_categories
      ORDER BY display_order ASC
    `;
    
    const categories = await db.query(query);
    res.json(categories);
  } catch (error) {
    console.error('Erro ao obter categorias de treinamento:', error);
    res.status(500).json({ error: 'Erro ao obter categorias de treinamento' });
  }
});

/**
 * @route GET /api/training/statistics
 * @desc Obter estatísticas sobre os materiais de treinamento
 * @access Public
 */
router.get('/statistics', async (req, res) => {
  try {
    const query = `SELECT * FROM training_statistics ORDER BY id DESC LIMIT 1`;
    const statistics = await db.query(query);
    
    if (statistics.length === 0) {
      // Se não houver estatísticas, calcular em tempo real
      const [totalMaterials] = await db.query('SELECT COUNT(*) as count FROM training_materials WHERE is_active = true');
      const [totalCourses] = await db.query('SELECT COUNT(*) as count FROM training_materials WHERE type = "course" AND is_active = true');
      const [avgRating] = await db.query('SELECT AVG(rating) as avg FROM training_materials WHERE is_active = true AND rating > 0');
      
      // Calcular horas de conteúdo em vídeo
      const [videoHours] = await db.query(`
        SELECT SUM(
          CASE 
            WHEN type = 'video' AND duration LIKE '%min%' THEN CAST(SUBSTRING_INDEX(duration, ' ', 1) AS UNSIGNED) / 60
            WHEN type = 'video' AND duration LIKE '%hora%' THEN CAST(SUBSTRING_INDEX(duration, ' ', 1) AS UNSIGNED)
            WHEN type = 'course' AND duration LIKE '%hora%' THEN CAST(SUBSTRING_INDEX(duration, ' ', 1) AS UNSIGNED)
            ELSE 0
          END
        ) as hours
        FROM training_materials
        WHERE is_active = true
      `);
      
      const stats = {
        total_materials: totalMaterials[0].count,
        total_courses: totalCourses[0].count,
        average_rating: avgRating[0].avg || 0,
        video_content_hours: Math.round(videoHours[0].hours || 0)
      };
      
      return res.json(stats);
    }
    
    res.json(statistics[0]);
  } catch (error) {
    console.error('Erro ao obter estatísticas de treinamento:', error);
    res.status(500).json({ error: 'Erro ao obter estatísticas de treinamento' });
  }
});

/**
 * @route GET /api/training/tags
 * @desc Obter todas as tags disponíveis
 * @access Public
 */
router.get('/tags', async (req, res) => {
  try {
    const query = `SELECT * FROM training_tags ORDER BY name ASC`;
    const tags = await db.query(query);
    res.json(tags);
  } catch (error) {
    console.error('Erro ao obter tags de treinamento:', error);
    res.status(500).json({ error: 'Erro ao obter tags de treinamento' });
  }
});

/**
 * @route GET /api/training/featured
 * @desc Obter materiais de treinamento em destaque
 * @access Public
 */
router.get('/featured', async (req, res) => {
  try {
    const { limit = 4 } = req.query;
    
    const query = `
      SELECT m.*, 
        c.name AS category_name, 
        c.icon AS category_icon,
        GROUP_CONCAT(t.name) AS tags
      FROM training_materials m
      LEFT JOIN training_categories c ON m.category_id = c.id
      LEFT JOIN training_material_tags mt ON m.id = mt.material_id
      LEFT JOIN training_tags t ON mt.tag_id = t.id
      WHERE m.is_active = true AND m.is_featured = true
      GROUP BY m.id
      ORDER BY m.publish_date DESC
      LIMIT ?
    `;
    
    const materials = await db.query(query, [parseInt(limit)]);
    
    const formattedMaterials = materials.map(material => ({
      ...material,
      tags: material.tags ? material.tags.split(',') : [],
      publish_date: material.publish_date.toISOString().split('T')[0],
      created_at: material.created_at.toISOString(),
      updated_at: material.updated_at.toISOString(),
    }));
    
    res.json(formattedMaterials);
  } catch (error) {
    console.error('Erro ao obter materiais em destaque:', error);
    res.status(500).json({ error: 'Erro ao obter materiais em destaque' });
  }
});

/**
 * @route POST /api/training/materials/:id/track
 * @desc Registra uma visualização ou download de material
 * @access Public
 */
router.post('/materials/:id/track', async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;
    
    if (!['view', 'download'].includes(action)) {
      return res.status(400).json({ error: 'Ação inválida' });
    }
    
    // Verificar se o material existe
    const [material] = await db.query('SELECT id FROM training_materials WHERE id = ? AND is_active = true', [id]);
    
    if (material.length === 0) {
      return res.status(404).json({ error: 'Material não encontrado' });
    }
    
    // Atualizar contador apropriado
    if (action === 'view') {
      await db.query('UPDATE training_materials SET view_count = view_count + 1 WHERE id = ?', [id]);
    } else {
      await db.query('UPDATE training_materials SET download_count = download_count + 1 WHERE id = ?', [id]);
    }
    
    // Se o usuário estiver autenticado, registrar na tabela de histórico
    if (req.user) {
      await db.query(
        'INSERT INTO training_user_history (user_id, material_id, last_accessed) VALUES (?, ?, NOW()) ON DUPLICATE KEY UPDATE last_accessed = NOW()',
        [req.user.id, id]
      );
    }
    
    res.json({ success: true, message: `${action === 'view' ? 'Visualização' : 'Download'} registrado com sucesso` });
  } catch (error) {
    console.error(`Erro ao registrar ${req.body.action}:`, error);
    res.status(500).json({ error: `Erro ao registrar ${req.body.action}` });
  }
});

/**
 * @route POST /api/training/materials/:id/progress
 * @desc Atualiza o progresso do usuário em um material
 * @access Private
 */
router.post('/materials/:id/progress', async (req, res) => {
  try {
    // Verificar se o usuário está autenticado
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }
    
    const { id } = req.params;
    const { percentage, position, completed } = req.body;
    
    // Verificar se o material existe
    const [material] = await db.query('SELECT id FROM training_materials WHERE id = ? AND is_active = true', [id]);
    
    if (material.length === 0) {
      return res.status(404).json({ error: 'Material não encontrado' });
    }
    
    // Atualizar progresso
    await db.query(
      `INSERT INTO training_user_history 
        (user_id, material_id, progress_percentage, last_position, is_completed, last_accessed) 
      VALUES (?, ?, ?, ?, ?, NOW()) 
      ON DUPLICATE KEY UPDATE 
        progress_percentage = ?, 
        last_position = ?, 
        is_completed = ?, 
        last_accessed = NOW()`,
      [
        req.user.id, id, percentage, position, completed ? 1 : 0,
        percentage, position, completed ? 1 : 0
      ]
    );
    
    // Obter o registro atualizado
    const [userHistory] = await db.query(
      'SELECT * FROM training_user_history WHERE user_id = ? AND material_id = ?',
      [req.user.id, id]
    );
    
    res.json(userHistory[0]);
  } catch (error) {
    console.error('Erro ao atualizar progresso:', error);
    res.status(500).json({ error: 'Erro ao atualizar progresso' });
  }
});

/**
 * @route POST /api/training/materials/:id/rate
 * @desc Avalia um material de treinamento
 * @access Private
 */
router.post('/materials/:id/rate', async (req, res) => {
  try {
    // Verificar se o usuário está autenticado
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }
    
    const { id } = req.params;
    const { value, comment } = req.body;
    
    // Validar valor da avaliação
    if (value < 0 || value > 5) {
      return res.status(400).json({ error: 'Valor de avaliação inválido' });
    }
    
    // Verificar se o material existe
    const [material] = await db.query('SELECT id FROM training_materials WHERE id = ? AND is_active = true', [id]);
    
    if (material.length === 0) {
      return res.status(404).json({ error: 'Material não encontrado' });
    }
    
    // Verificar se o usuário já avaliou este material
    const [existingRating] = await db.query(
      'SELECT id FROM training_ratings WHERE material_id = ? AND user_id = ?',
      [id, req.user.id]
    );
    
    const conn = await db.getConnection();
    
    try {
      await conn.beginTransaction();
      
      if (existingRating.length > 0) {
        // Atualizar avaliação existente
        await conn.query(
          'UPDATE training_ratings SET rating = ?, comment = ?, updated_at = NOW() WHERE id = ?',
          [value, comment, existingRating[0].id]
        );
      } else {
        // Criar nova avaliação
        await conn.query(
          'INSERT INTO training_ratings (material_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
          [id, req.user.id, value, comment]
        );
      }
      
      // Recalcular e atualizar avaliação média do material
      const [avgResult] = await conn.query(
        'SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM training_ratings WHERE material_id = ?',
        [id]
      );
      
      await conn.query(
        'UPDATE training_materials SET rating = ?, rating_count = ? WHERE id = ?',
        [avgResult[0].avg_rating, avgResult[0].count, id]
      );
      
      await conn.commit();
      
      res.json({ 
        success: true,
        message: 'Avaliação registrada com sucesso',
        rating: {
          value,
          comment,
          average: avgResult[0].avg_rating,
          count: avgResult[0].count
        }
      });
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Erro ao avaliar material:', error);
    res.status(500).json({ error: 'Erro ao avaliar material' });
  }
});

/**
 * @route POST /api/training/materials
 * @desc Adiciona um novo material de treinamento
 * @access Admin
 */
router.post('/materials', upload.fields([
  { name: 'file', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), async (req, res) => {
  try {
    // Verificar se o usuário está autenticado e é administrador
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    const {
      title,
      type,
      category_id,
      description,
      duration,
      pages,
      author,
      level,
      url,
      publish_date,
      lessons,
      is_featured,
      tags
    } = req.body;
    
    // Validar campos obrigatórios
    if (!title || !type || !category_id || !description || !author || !level) {
      return res.status(400).json({ error: 'Campos obrigatórios não fornecidos' });
    }
    
    // Verificar se a categoria existe
    const [category] = await db.query('SELECT id FROM training_categories WHERE id = ?', [category_id]);
    
    if (category.length === 0) {
      return res.status(400).json({ error: 'Categoria inválida' });
    }
    
    // Processar arquivos enviados
    let filePath = null;
    let thumbnailPath = null;
    
    if (req.files && req.files.file && req.files.file[0]) {
      filePath = req.files.file[0].path.replace(/\\/g, '/');
    }
    
    if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
      thumbnailPath = req.files.thumbnail[0].path.replace(/\\/g, '/');
    }
    
    const conn = await db.getConnection();
    
    try {
      await conn.beginTransaction();
      
      // Inserir o material
      const [insertResult] = await conn.query(
        `INSERT INTO training_materials 
          (title, type, category_id, description, duration, pages, author, 
          level, thumbnail, url, file_path, publish_date, lessons, is_featured) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title,
          type,
          category_id,
          description,
          duration || null,
          pages ? parseInt(pages) : null,
          author,
          level,
          thumbnailPath,
          url,
          filePath,
          publish_date || new Date().toISOString().split('T')[0],
          lessons ? parseInt(lessons) : null,
          is_featured === 'true' ? 1 : 0
        ]
      );
      
      const materialId = insertResult.insertId;
      
      // Processar tags
      if (tags) {
        const tagList = typeof tags === 'string' ? JSON.parse(tags) : tags;
        
        if (Array.isArray(tagList) && tagList.length > 0) {
          for (const tag of tagList) {
            // Verificar se a tag já existe ou criar nova
            let tagId;
            
            const [existingTag] = await conn.query('SELECT id FROM training_tags WHERE name = ?', [tag]);
            
            if (existingTag.length > 0) {
              tagId = existingTag[0].id;
            } else {
              const [newTag] = await conn.query('INSERT INTO training_tags (name) VALUES (?)', [tag]);
              tagId = newTag.insertId;
            }
            
            // Associar tag ao material
            await conn.query(
              'INSERT INTO training_material_tags (material_id, tag_id) VALUES (?, ?)',
              [materialId, tagId]
            );
          }
        }
      }
      
      // Atualizar estatísticas
      await conn.query(`
        UPDATE training_statistics
        SET 
          total_materials = (SELECT COUNT(*) FROM training_materials WHERE is_active = true),
          video_content_hours = (
            SELECT IFNULL(SUM(
              CASE 
                WHEN type = 'video' AND duration LIKE '%min%' THEN CAST(SUBSTRING_INDEX(duration, ' ', 1) AS UNSIGNED) / 60
                WHEN type = 'video' AND duration LIKE '%hora%' THEN CAST(SUBSTRING_INDEX(duration, ' ', 1) AS UNSIGNED)
                WHEN type = 'course' AND duration LIKE '%hora%' THEN CAST(SUBSTRING_INDEX(duration, ' ', 1) AS UNSIGNED)
                ELSE 0
              END
            ), 0)
            FROM training_materials
            WHERE is_active = true
          ),
          total_courses = (SELECT COUNT(*) FROM training_materials WHERE type = 'course' AND is_active = true),
          average_rating = (SELECT AVG(rating) FROM training_materials WHERE is_active = true AND rating > 0),
          last_calculated = NOW()
      `);
      
      await conn.commit();
      
      // Obter o material completo para retornar
      const [newMaterial] = await db.query(
        `SELECT m.*, c.name AS category_name
         FROM training_materials m
         LEFT JOIN training_categories c ON m.category_id = c.id
         WHERE m.id = ?`,
        [materialId]
      );
      
      const [materialTags] = await db.query(
        `SELECT t.id, t.name
         FROM training_tags t
         JOIN training_material_tags mt ON t.id = mt.tag_id
         WHERE mt.material_id = ?`,
        [materialId]
      );
      
      newMaterial[0].tags = materialTags;
      newMaterial[0].publish_date = newMaterial[0].publish_date.toISOString().split('T')[0];
      
      res.status(201).json(newMaterial[0]);
    } catch (error) {
      await conn.rollback();
      
      // Remover arquivos em caso de erro
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      if (thumbnailPath && fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
      
      throw error;
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Erro ao adicionar material de treinamento:', error);
    res.status(500).json({ error: 'Erro ao adicionar material de treinamento' });
  }
});

/**
 * @route PUT /api/training/materials/:id
 * @desc Atualiza um material de treinamento existente
 * @access Admin
 */
router.put('/materials/:id', upload.fields([
  { name: 'file', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), async (req, res) => {
  try {
    // Verificar se o usuário está autenticado e é administrador
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    const { id } = req.params;
    const {
      title,
      type,
      category_id,
      description,
      duration,
      pages,
      author,
      level,
      url,
      publish_date,
      lessons,
      is_featured,
      tags
    } = req.body;
    
    // Verificar se o material existe
    const [existingMaterial] = await db.query(
      'SELECT file_path, thumbnail FROM training_materials WHERE id = ?',
      [id]
    );
    
    if (existingMaterial.length === 0) {
      return res.status(404).json({ error: 'Material não encontrado' });
    }
    
    // Processar arquivos enviados
    let filePath = existingMaterial[0].file_path;
    let thumbnailPath = existingMaterial[0].thumbnail;
    
    if (req.files && req.files.file && req.files.file[0]) {
      // Remover arquivo antigo se existir
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      filePath = req.files.file[0].path.replace(/\\/g, '/');
    }
    
    if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
      // Remover thumbnail antigo se existir
      if (thumbnailPath && fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
      thumbnailPath = req.files.thumbnail[0].path.replace(/\\/g, '/');
    }
    
    const conn = await db.getConnection();
    
    try {
      await conn.beginTransaction();
      
      // Atualizar o material
      await conn.query(
        `UPDATE training_materials 
         SET 
           title = ?,
           type = ?,
           category_id = ?,
           description = ?,
           duration = ?,
           pages = ?,
           author = ?,
           level = ?,
           thumbnail = ?,
           url = ?,
           file_path = ?,
           publish_date = ?,
           lessons = ?,
           is_featured = ?,
           updated_at = NOW()
         WHERE id = ?`,
        [
          title,
          type,
          category_id,
          description,
          duration || null,
          pages ? parseInt(pages) : null,
          author,
          level,
          thumbnailPath,
          url,
          filePath,
          publish_date,
          lessons ? parseInt(lessons) : null,
          is_featured === 'true' ? 1 : 0,
          id
        ]
      );
      
      // Atualizar tags
      if (tags) {
        // Remover associações antigas
        await conn.query('DELETE FROM training_material_tags WHERE material_id = ?', [id]);
        
        const tagList = typeof tags === 'string' ? JSON.parse(tags) : tags;
        
        if (Array.isArray(tagList) && tagList.length > 0) {
          for (const tag of tagList) {
            // Verificar se a tag já existe ou criar nova
            let tagId;
            
            const [existingTag] = await conn.query('SELECT id FROM training_tags WHERE name = ?', [tag]);
            
            if (existingTag.length > 0) {
              tagId = existingTag[0].id;
            } else {
              const [newTag] = await conn.query('INSERT INTO training_tags (name) VALUES (?)', [tag]);
              tagId = newTag.insertId;
            }
            
            // Associar tag ao material
            await conn.query(
              'INSERT INTO training_material_tags (material_id, tag_id) VALUES (?, ?)',
              [id, tagId]
            );
          }
        }
      }
      
      // Atualizar estatísticas
      await conn.query(`
        UPDATE training_statistics
        SET 
          video_content_hours = (
            SELECT IFNULL(SUM(
              CASE 
                WHEN type = 'video' AND duration LIKE '%min%' THEN CAST(SUBSTRING_INDEX(duration, ' ', 1) AS UNSIGNED) / 60
                WHEN type = 'video' AND duration LIKE '%hora%' THEN CAST(SUBSTRING_INDEX(duration, ' ', 1) AS UNSIGNED)
                WHEN type = 'course' AND duration LIKE '%hora%' THEN CAST(SUBSTRING_INDEX(duration, ' ', 1) AS UNSIGNED)
                ELSE 0
              END
            ), 0)
            FROM training_materials
            WHERE is_active = true
          ),
          total_courses = (SELECT COUNT(*) FROM training_materials WHERE type = 'course' AND is_active = true),
          average_rating = (SELECT AVG(rating) FROM training_materials WHERE is_active = true AND rating > 0),
          last_calculated = NOW()
      `);
      
      await conn.commit();
      
      // Obter o material atualizado para retornar
      const [updatedMaterial] = await db.query(
        `SELECT m.*, c.name AS category_name
         FROM training_materials m
         LEFT JOIN training_categories c ON m.category_id = c.id
         WHERE m.id = ?`,
        [id]
      );
      
      const [materialTags] = await db.query(
        `SELECT t.id, t.name
         FROM training_tags t
         JOIN training_material_tags mt ON t.id = mt.tag_id
         WHERE mt.material_id = ?`,
        [id]
      );
      
      updatedMaterial[0].tags = materialTags;
      updatedMaterial[0].publish_date = updatedMaterial[0].publish_date.toISOString().split('T')[0];
      
      res.json(updatedMaterial[0]);
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Erro ao atualizar material de treinamento:', error);
    res.status(500).json({ error: 'Erro ao atualizar material de treinamento' });
  }
});

/**
 * @route DELETE /api/training/materials/:id
 * @desc Remove um material de treinamento
 * @access Admin
 */
router.delete('/materials/:id', async (req, res) => {
  try {
    // Verificar se o usuário está autenticado e é administrador
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    const { id } = req.params;
    const { permanently } = req.query;
    
    // Verificar se o material existe
    const [material] = await db.query(
      'SELECT id, file_path, thumbnail FROM training_materials WHERE id = ?',
      [id]
    );
    
    if (material.length === 0) {
      return res.status(404).json({ error: 'Material não encontrado' });
    }
    
    // Exclusão lógica ou permanente
    if (permanently === 'true') {
      const conn = await db.getConnection();
      
      try {
        await conn.beginTransaction();
        
        // Remover associações de tags
        await conn.query('DELETE FROM training_material_tags WHERE material_id = ?', [id]);
        
        // Remover avaliações
        await conn.query('DELETE FROM training_ratings WHERE material_id = ?', [id]);
        
        // Remover histórico de uso
        await conn.query('DELETE FROM training_user_history WHERE material_id = ?', [id]);
        
        // Remover controles de acesso
        await conn.query('DELETE FROM training_access_controls WHERE material_id = ?', [id]);
        
        // Remover o material
        await conn.query('DELETE FROM training_materials WHERE id = ?', [id]);
        
        await conn.commit();
        
        // Remover arquivos físicos
        if (material[0].file_path && fs.existsSync(material[0].file_path)) {
          fs.unlinkSync(material[0].file_path);
        }
        
        if (material[0].thumbnail && fs.existsSync(material[0].thumbnail)) {
          fs.unlinkSync(material[0].thumbnail);
        }
        
        // Atualizar estatísticas
        await db.query(`
          UPDATE training_statistics
          SET 
            total_materials = (SELECT COUNT(*) FROM training_materials WHERE is_active = true),
            video_content_hours = (
              SELECT IFNULL(SUM(
                CASE 
                  WHEN type = 'video' AND duration LIKE '%min%' THEN CAST(SUBSTRING_INDEX(duration, ' ', 1) AS UNSIGNED) / 60
                  WHEN type = 'video' AND duration LIKE '%hora%' THEN CAST(SUBSTRING_INDEX(duration, ' ', 1) AS UNSIGNED)
                  WHEN type = 'course' AND duration LIKE '%hora%' THEN CAST(SUBSTRING_INDEX(duration, ' ', 1) AS UNSIGNED)
                  ELSE 0
                END
              ), 0)
              FROM training_materials
              WHERE is_active = true
            ),
            total_courses = (SELECT COUNT(*) FROM training_materials WHERE type = 'course' AND is_active = true),
            average_rating = (SELECT AVG(rating) FROM training_materials WHERE is_active = true AND rating > 0),
            last_calculated = NOW()
        `);
      } catch (error) {
        await conn.rollback();
        throw error;
      } finally {
        conn.release();
      }
    } else {
      // Exclusão lógica (apenas desativa)
      await db.query('UPDATE training_materials SET is_active = false, updated_at = NOW() WHERE id = ?', [id]);
      
      // Atualizar estatísticas
      await db.query(`
        UPDATE training_statistics
        SET 
          total_materials = (SELECT COUNT(*) FROM training_materials WHERE is_active = true),
          video_content_hours = (
            SELECT IFNULL(SUM(
              CASE 
                WHEN type = 'video' AND duration LIKE '%min%' THEN CAST(SUBSTRING_INDEX(duration, ' ', 1) AS UNSIGNED) / 60
                WHEN type = 'video' AND duration LIKE '%hora%' THEN CAST(SUBSTRING_INDEX(duration, ' ', 1) AS UNSIGNED)
                WHEN type = 'course' AND duration LIKE '%hora%' THEN CAST(SUBSTRING_INDEX(duration, ' ', 1) AS UNSIGNED)
                ELSE 0
              END
            ), 0)
            FROM training_materials
            WHERE is_active = true
          ),
          total_courses = (SELECT COUNT(*) FROM training_materials WHERE type = 'course' AND is_active = true),
          average_rating = (SELECT AVG(rating) FROM training_materials WHERE is_active = true AND rating > 0),
          last_calculated = NOW()
      `);
    }
    
    res.json({ 
      success: true, 
      message: permanently === 'true' 
        ? 'Material removido permanentemente'
        : 'Material desativado'
    });
  } catch (error) {
    console.error('Erro ao remover material de treinamento:', error);
    res.status(500).json({ error: 'Erro ao remover material de treinamento' });
  }
});

module.exports = router;