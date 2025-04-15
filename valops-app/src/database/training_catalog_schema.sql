-- Esquema do Banco de Dados para Catálogo de Treinamentos

-- Tabela de Categorias de Treinamento
CREATE TABLE training_categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  icon VARCHAR(50),
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela para Materiais de Treinamento
CREATE TABLE training_materials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type ENUM('video', 'document', 'book', 'course') NOT NULL,
  category_id VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  duration VARCHAR(50),
  pages INT,
  author VARCHAR(100) NOT NULL,
  level ENUM('Iniciante', 'Intermediário', 'Avançado') NOT NULL,
  rating DECIMAL(3,1) DEFAULT 0.0,
  rating_count INT DEFAULT 0,
  thumbnail VARCHAR(255),
  url VARCHAR(255) NOT NULL,
  file_path VARCHAR(255),
  publish_date DATE NOT NULL,
  lessons INT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  view_count INT DEFAULT 0,
  download_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES training_categories(id) ON DELETE CASCADE
);

-- Tabela Tags para Materiais de Treinamento
CREATE TABLE training_tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY (name)
);

-- Tabela de Relacionamento entre Materiais e Tags
CREATE TABLE training_material_tags (
  material_id INT NOT NULL,
  tag_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (material_id, tag_id),
  FOREIGN KEY (material_id) REFERENCES training_materials(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES training_tags(id) ON DELETE CASCADE
);

-- Tabela para Avaliações de Usuários
CREATE TABLE training_ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  material_id INT NOT NULL,
  user_id INT NOT NULL,
  rating DECIMAL(2,1) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (material_id) REFERENCES training_materials(id) ON DELETE CASCADE,
  UNIQUE KEY (material_id, user_id)
);

-- Tabela para Estatísticas de Treinamento
CREATE TABLE training_statistics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  total_materials INT DEFAULT 0,
  video_content_hours INT DEFAULT 0,
  total_courses INT DEFAULT 0,
  average_rating DECIMAL(3,1) DEFAULT 0.0,
  total_downloads INT DEFAULT 0,
  total_views INT DEFAULT 0,
  last_calculated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela para Histórico de Uso do Usuário
CREATE TABLE training_user_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  material_id INT NOT NULL,
  progress_percentage INT DEFAULT 0,
  last_position VARCHAR(50), -- Armazena a posição de parada em vídeos ou a última página em documentos
  is_completed BOOLEAN DEFAULT false,
  first_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (material_id) REFERENCES training_materials(id) ON DELETE CASCADE,
  UNIQUE KEY (user_id, material_id)
);

-- Tabela para Controle de Acesso
CREATE TABLE training_access_controls (
  id INT AUTO_INCREMENT PRIMARY KEY,
  material_id INT NOT NULL,
  access_type ENUM('public', 'registered', 'team', 'role') NOT NULL DEFAULT 'public',
  team_id INT,
  role_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (material_id) REFERENCES training_materials(id) ON DELETE CASCADE
);

-- Inserir categorias padrão
INSERT INTO training_categories (id, name, icon, description, display_order) VALUES
('all', 'Todos', NULL, 'Todos os materiais de treinamento', 0),
('videos', 'Vídeos', 'Video', 'Vídeos tutoriais e webinars', 1),
('books', 'Livros', 'BookOpen', 'Livros e guias digitais', 2),
('docs', 'Documentação', 'FileText', 'Documentação técnica e manuais', 3),
('courses', 'Cursos', 'BookOpenCheck', 'Cursos completos e workshops', 4);

-- Criar uma visão para facilitar a consulta de materiais com suas tags
CREATE VIEW view_training_materials AS
SELECT m.*, 
       c.name AS category_name, 
       c.icon AS category_icon,
       GROUP_CONCAT(t.name SEPARATOR ',') AS tags
FROM training_materials m
LEFT JOIN training_categories c ON m.category_id = c.id
LEFT JOIN training_material_tags mt ON m.id = mt.material_id
LEFT JOIN training_tags t ON mt.tag_id = t.id
WHERE m.is_active = true
GROUP BY m.id;

-- Trigger para atualizar estatísticas após inserção de novo material
DELIMITER //
CREATE TRIGGER after_training_material_insert
AFTER INSERT ON training_materials
FOR EACH ROW
BEGIN
  -- Atualizar estatísticas
  UPDATE training_statistics
  SET total_materials = (SELECT COUNT(*) FROM training_materials WHERE is_active = true),
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
      last_calculated = CURRENT_TIMESTAMP;
END //
DELIMITER ;

-- Criar índices para melhorar a performance das consultas
CREATE INDEX idx_training_materials_type ON training_materials(type);
CREATE INDEX idx_training_materials_level ON training_materials(level);
CREATE INDEX idx_training_materials_rating ON training_materials(rating);
CREATE INDEX idx_training_materials_featured ON training_materials(is_featured);
CREATE INDEX idx_training_materials_publish_date ON training_materials(publish_date);