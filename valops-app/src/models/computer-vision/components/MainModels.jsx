// src/models/computer-vision/components/MainModels.jsx
import React, { useState } from 'react';
import { PlusCircle, MinusCircle, Code, Check, X, HelpCircle, Copy } from 'lucide-react';

const CodeBlock = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset após 2 segundos
    } catch (err) {
      console.error('Falha ao copiar texto: ', err);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
        title="Copiar código"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <pre className="text-sm">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

const MainModels = () => {
  // Estado para controlar quais modelos estão expandidos
  const [expandedModels, setExpandedModels] = useState({});

  // Função para alternar a expansão de um modelo
  const toggleModel = (modelId) => {
    setExpandedModels(prev => ({
      ...prev,
      [modelId]: !prev[modelId]
    }));
  };

  // Dados dos principais modelos de visão computacional
  const models = [
    {
      id: 'cnn',
      name: 'Redes Neurais Convolucionais (CNN)',
      description: 'Arquitetura de rede neural especializada no processamento de dados visuais, utilizando camadas de convolução para extração de características hierárquicas em imagens.',
      strengths: [
        'Excelente para extração automática de características visuais',
        'Invariância a transformações espaciais através de pooling',
        'Compartilhamento de parâmetros que reduz o número total de parâmetros',
        'Escalável para imagens de alta resolução',
        'Altamente eficaz em diversas tarefas de visão computacional'
      ],
      weaknesses: [
        'Requer grandes volumes de dados para treinamento eficaz',
        'Computacionalmente intensivo, especialmente em redes profundas',
        'Baixa transparência (difícil interpretabilidade)',
        'Suscetível a adversarial attacks',
        'Desempenho pode degradar com variações extremas de iluminação, pose ou oclusão'
      ],
      useCases: [
        'Classificação de imagens',
        'Detecção de objetos',
        'Reconhecimento facial',
        'Diagnóstico médico por imagem',
        'Veículos autônomos'
      ],
      hyperparameters: [
        { name: 'Número de camadas', description: 'Quantidade de camadas convolucionais e de pooling na arquitetura' },
        { name: 'Tamanho dos filtros', description: 'Dimensões dos kernels de convolução (ex: 3x3, 5x5)' },
        { name: 'Número de filtros', description: 'Quantidade de filtros em cada camada convolucional' },
        { name: 'Stride', description: 'Passo de deslocamento do filtro na operação de convolução' },
        { name: 'Padding', description: 'Adição de pixels nas bordas da imagem antes da convolução' },
        { name: 'Função de ativação', description: 'Função não-linear aplicada após as convoluções (ReLU, Sigmoid, etc.)' }
      ],
      code: `import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# Definindo o modelo CNN
model = Sequential([
    # Primeira camada convolucional
    Conv2D(32, (3, 3), activation='relu', padding='same', input_shape=(224, 224, 3)),
    MaxPooling2D((2, 2)),
    
    # Segunda camada convolucional
    Conv2D(64, (3, 3), activation='relu', padding='same'),
    MaxPooling2D((2, 2)),
    
    # Terceira camada convolucional
    Conv2D(128, (3, 3), activation='relu', padding='same'),
    MaxPooling2D((2, 2)),
    
    # Achatamento e camadas densas
    Flatten(),
    Dense(512, activation='relu'),
    Dropout(0.5),
    Dense(10, activation='softmax')  # 10 classes de saída
])

# Compilando o modelo
model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# Data augmentation para treinamento
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    fill_mode='nearest'
)`
    },
    {
      id: 'rcnn',
      name: 'R-CNN e suas variantes (Fast/Faster R-CNN)',
      description: 'Família de modelos para detecção de objetos que combina propostas de regiões com classificação usando CNNs, evoluindo para versões mais rápidas e eficientes.',
      strengths: [
        'Alta precisão na detecção de múltiplos objetos',
        'Localização exata através de caixas delimitadoras',
        'Versões mais recentes (Fast/Faster) são significativamente mais rápidas',
        'Capacidade de detectar objetos de diferentes escalas',
        'Bom desempenho mesmo com objetos parcialmente ocultos'
      ],
      weaknesses: [
        'Treinamento complexo, especialmente a versão original R-CNN',
        'Requer anotação detalhada (caixas delimitadoras)',
        'Processamento em múltiplos estágios',
        'Pode ter dificuldades com objetos muito pequenos',
        'Computacionalmente intensivo comparado a modelos de detecção de etapa única'
      ],
      useCases: [
        'Sistemas de vigilância',
        'Contagem de objetos em imagens',
        'Carros autônomos',
        'Inspeção industrial',
        'Análise de imagens médicas'
      ],
      hyperparameters: [
        { name: 'Backbone', description: 'Rede base para extração de características (ex: ResNet, VGG)' },
        { name: 'Anchor sizes', description: 'Tamanhos das âncoras para detecção de objetos de diferentes escalas' },
        { name: 'RPN NMS threshold', description: 'Limiar para supressão não-máxima na rede de proposta de regiões' },
        { name: 'Detection NMS threshold', description: 'Limiar para supressão não-máxima na etapa final de detecção' },
        { name: 'RPN batch size', description: 'Tamanho do batch para treinamento da rede de proposta de regiões' }
      ],
      code: `import torch
import torchvision
from torchvision.models.detection import FasterRCNN
from torchvision.models.detection.rpn import AnchorGenerator

# Carregando um backbone pré-treinado (ResNet50)
backbone = torchvision.models.resnet50(pretrained=True)
backbone_output_features = 2048

# Extrator de características do backbone
backbone = torch.nn.Sequential(
    backbone.conv1,
    backbone.bn1,
    backbone.relu,
    backbone.maxpool,
    backbone.layer1,
    backbone.layer2,
    backbone.layer3,
    backbone.layer4
)

# Configuração de âncoras para diferentes escalas e proporções
anchor_generator = AnchorGenerator(
    sizes=((32, 64, 128, 256, 512),),
    aspect_ratios=((0.5, 1.0, 2.0),)
)

# Configuração da rede de propostas de regiões
roi_pooler = torchvision.ops.MultiScaleRoIAlign(
    featmap_names=['0'],
    output_size=7,
    sampling_ratio=2
)`
    },
    {
      id: 'yolo',
      name: 'YOLO (You Only Look Once)',
      description: 'Modelo de detecção de objetos de etapa única que divide a imagem em regiões e prevê caixas delimitadoras e probabilidades de classe para cada região simultaneamente.',
      strengths: [
        'Extremamente rápido, permitindo detecção em tempo real',
        'Processamento de etapa única (fim-a-fim)',
        'Considera o contexto global da imagem',
        'Fácil balanceamento entre velocidade e precisão através de diferentes versões',
        'Bom desempenho em hardware com recursos limitados'
      ],
      weaknesses: [
        'Precisão geralmente menor que modelos de duas etapas como Faster R-CNN',
        'Dificuldade com objetos pequenos e agrupados',
        'Limitações na generalização para objetos em poses incomuns',
        'Pode perder detalhes finos em imagens complexas',
        'Desbalanceamento entre classes pode afetar significativamente o desempenho'
      ],
      useCases: [
        'Aplicações em tempo real',
        'Videovigilância',
        'Contagem e rastreamento de objetos em vídeo',
        'Robótica e drones',
        'Aplicativos móveis de realidade aumentada'
      ],
      hyperparameters: [
        { name: 'Confidence threshold', description: 'Limiar de confiança para considerar uma detecção válida' },
        { name: 'NMS threshold', description: 'Limiar para supressão não-máxima' },
        { name: 'Anchor boxes', description: 'Configurações das caixas âncora' },
        { name: 'Input size', description: 'Tamanho da imagem de entrada (afeta velocidade vs. precisão)' },
        { name: 'Backbone', description: 'Rede base para extração de características (Darknet, CSPNet, etc.)' }
      ],
      code: `import torch
import numpy as np
from models.experimental import attempt_load
from utils.datasets import letterbox
from utils.general import non_max_suppression, scale_coords
from utils.plots import plot_one_box
import cv2

# Carregando o modelo YOLOv5
weights = 'yolov5s.pt'  # ou 'yolov5m.pt', 'yolov5l.pt', 'yolov5x.pt'
device = torch.device('cuda') if torch.cuda.is_available() else torch.device('cpu')
model = attempt_load(weights, map_location=device)
model.to(device).eval()

# Obtendo nomes das classes
names = model.module.names if hasattr(model, 'module') else model.names

# Função para detecção
def detect(image_path, conf_thres=0.25, iou_thres=0.45, img_size=640):
    # Carregando e preparando a imagem
    img0 = cv2.imread(image_path)
    img = letterbox(img0, img_size)[0]
    img = img.transpose(2, 0, 1)  # HWC para CHW
    img = np.ascontiguousarray(img)
    img = torch.from_numpy(img).to(device)
    img = img.float() / 255.0  # 0 - 255 para 0.0 - 1.0
    if img.ndimension() == 3:
        img = img.unsqueeze(0)`
    },
    {
      id: 'ssd',
      name: 'SSD (Single Shot MultiBox Detector)',
      description: 'Detector de objetos de passo único que elimina a geração de propostas de região e usa múltiplas camadas de diferentes resoluções para detecção em várias escalas.',
      strengths: [
        'Detecção rápida em tempo real',
        'Boa precisão, especialmente para objetos de tamanho médio e grande',
        'Treina e infere em uma única passagem (fim-a-fim)',
        'Arquitetura relativamente simples e fácil de implementar',
        'Bom equilíbrio entre velocidade e precisão'
      ],
      weaknesses: [
        'Desempenho inferior em objetos pequenos',
        'Sensível à escolha das caixas padrão (default boxes)',
        'Requer ajuste fino para datasets específicos',
        'Menos preciso que modelos de dois estágios como Faster R-CNN',
        'Pode ter dificuldades com objetos densamente agrupados'
      ],
      useCases: [
        'Aplicações móveis de realidade aumentada',
        'Sistemas de segurança e vigilância',
        'Detecção de objetos em dispositivos com recursos limitados',
        'Análise de tráfego em tempo real',
        'Robótica e sistemas automatizados'
      ],
      hyperparameters: [
        { name: 'Default box scales', description: 'Escalas das caixas padrão para diferentes camadas de características' },
        { name: 'Default box aspect ratios', description: 'Proporções das caixas padrão para detecção' },
        { name: 'Confidence threshold', description: 'Limite de confiança para detecções válidas' },
        { name: 'NMS threshold', description: 'Limite para supressão não-máxima' },
        { name: 'Backbone', description: 'Rede base para extração de características (ex: VGG, MobileNet)' }
      ],
      code: `import torch
import torch.nn as nn
import torchvision
from torchvision.models.detection import SSD300_VGG16_Weights
from torchvision.models.detection.ssd import SSD300_VGG16_Weights

# Carregando modelo SSD pré-treinado
model = torchvision.models.detection.ssd300_vgg16(weights=SSD300_VGG16_Weights.DEFAULT)
model.eval()

# Pré-processamento da imagem
from PIL import Image
import torchvision.transforms as transforms

def process_image(image_path):
    image = Image.open(image_path).convert("RGB")
    transform = transforms.Compose([
        transforms.Resize((300, 300)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                             std=[0.229, 0.224, 0.225])
    ])
    return transform(image).unsqueeze(0)`
    },
    {
      id: 'unet',
      name: 'U-Net',
      description: 'Arquitetura de rede neural em formato U para segmentação de imagens, especialmente eficaz para segmentação biomédica, com conexões diretas entre camadas correspondentes do codificador e decodificador.',
      strengths: [
        'Excelente para segmentação semântica precisa',
        'Eficaz mesmo com conjuntos de dados pequenos',
        'Preserva detalhes espaciais através de conexões skip',
        'Arquitetura simétrica com codificador-decodificador',
        'Versátil para diferentes tipos de segmentação de imagem'
      ],
      weaknesses: [
        'Pode ser computacionalmente pesado para imagens de alta resolução',
        'Sensível a ruído e variações nos dados',
        'Requer ajustes para objetos de diferentes escalas',
        'Treinamento pode ser instável sem normalização adequada',
        'Pode ter dificuldades com limites de objetos ambíguos'
      ],
      useCases: [
        'Segmentação de imagens médicas',
        'Detecção de lesões em radiografias',
        'Segmentação celular em microscopia',
        'Mapeamento de satélite e detecção de estradas',
        'Segmentação de imagens industriais para controle de qualidade'
      ],
      hyperparameters: [
        { name: 'Depth', description: 'Profundidade da rede (número de camadas de downsampling/upsampling)' },
        { name: 'Number of filters', description: 'Número de filtros em cada camada' },
        { name: 'Learning rate', description: 'Taxa de aprendizado para o treinamento' },
        { name: 'Loss function', description: 'Função de perda (Dice, BCE, combinações)' },
        { name: 'Batch normalization', description: 'Uso de normalização em lote após camadas convolucionais' }
      ],
      code: `import torch
import torch.nn as nn
import torch.nn.functional as F

# Definindo o bloco duplo de convolução para U-Net
class DoubleConv(nn.Module):
    def __init__(self, in_channels, out_channels):
        super().__init__()
        self.double_conv = nn.Sequential(
            nn.Conv2d(in_channels, out_channels, kernel_size=3, padding=1),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True),
            nn.Conv2d(out_channels, out_channels, kernel_size=3, padding=1),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True)
        )

    def forward(self, x):
        return self.double_conv(x)

# Implementação da U-Net
class UNet(nn.Module):
    def __init__(self, in_channels=3, out_channels=1, features=[64, 128, 256, 512]):
        super(UNet, self).__init__()
        self.downs = nn.ModuleList()
        self.ups = nn.ModuleList()
        self.pool = nn.MaxPool2d(kernel_size=2, stride=2)`
    },
    {
      id: 'mask-rcnn',
      name: 'Mask R-CNN',
      description: 'Extensão do Faster R-CNN que adiciona um ramo para predição de máscara de segmentação para cada instância, permitindo segmentação de instâncias além da detecção de objetos.',
      strengths: [
        'Combina detecção de objetos e segmentação de instâncias',
        'Alta precisão em tarefas de segmentação',
        'Pode distinguir diferentes instâncias do mesmo objeto',
        'Fornece informações detalhadas sobre a forma dos objetos',
        'Arquitetura flexível, base para muitas extensões'
      ],
      weaknesses: [
        'Computacionalmente intensivo durante treinamento e inferência',
        'Mais lento que métodos de detecção simples',
        'Requer dados de treinamento com anotações detalhadas (máscaras)',
        'Complexidade na implementação e ajuste',
        'Não ideal para aplicações em tempo real com recursos limitados'
      ],
      useCases: [
        'Segmentação médica avançada',
        'Contagem e análise de multidões',
        'Robótica e manipulação de objetos',
        'Edição e composição de imagens automatizada',
        'Mapeamento de cenas urbanas e análise de satélite'
      ],
      hyperparameters: [
        { name: 'RPN proposals', description: 'Número de propostas da Rede de Propostas de Região' },
        { name: 'ROI positive ratio', description: 'Proporção de ROIs positivos/negativos durante treinamento' },
        { name: 'Mask size', description: 'Resolução da máscara predita' },
        { name: 'FPN levels', description: 'Níveis da Rede de Pirâmide de Características' },
        { name: 'Backbone', description: 'Rede base para extração de características (ex: ResNet)' }
      ],
      code: `import torch
import torchvision
from torchvision.models.detection import maskrcnn_resnet50_fpn
from torchvision.models.detection.mask_rcnn import MaskRCNN_ResNet50_FPN_Weights

# Carregando modelo pré-treinado
model = maskrcnn_resnet50_fpn(weights=MaskRCNN_ResNet50_FPN_Weights.DEFAULT)
model.eval()

# Processamento de imagem
from PIL import Image
import numpy as np
import torchvision.transforms as T

def get_prediction(img_path, threshold=0.5):
    img = Image.open(img_path).convert("RGB")
    transform = T.Compose([T.ToTensor()])
    img_tensor = transform(img)
    
    with torch.no_grad():
        prediction = model([img_tensor])`
    },
    {
      id: 'siamese',
      name: 'Redes Siamesas',
      description: 'Arquitetura que utiliza duas ou mais sub-redes idênticas com pesos compartilhados para comparar ou relacionar diferentes entradas, frequentemente usada para verificação facial ou rastreamento visual.',
      strengths: [
        'Excelente para comparação, verificação e correspondência de imagens',
        'Funciona bem com poucos exemplos (few-shot learning)',
        'Eficaz para verificação de identidade e rastreamento',
        'Compartilhamento de pesos reduz o número de parâmetros',
        'Robustez a variações de fundo e iluminação'
      ],
      weaknesses: [
        'Pode ter dificuldades com grandes variações de aparência',
        'A função de similaridade precisa ser cuidadosamente projetada',
        'Treinamento pode ser complexo devido ao design de triplets ou pares',
        'Menos eficaz para classificação multiclasse direta',
        'Desempenho depende da qualidade dos embeddings aprendidos'
      ],
      useCases: [
        'Verificação facial e biometria',
        'Rastreamento de objetos em vídeo',
        'Correspondência de assinaturas',
        'Correspondência de impressões digitais',
        'Detecção de falsificações'
      ],
      hyperparameters: [
        { name: 'Margin', description: 'Margem para função de perda contrastiva ou triplet' },
        { name: 'Embedding size', description: 'Dimensionalidade do espaço de embedding' },
        { name: 'Similarity metric', description: 'Métrica para medir similaridade (distância euclidiana, cosseno, etc.)' },
        { name: 'Mining strategy', description: 'Estratégia para mineração de pares/triplets difíceis' },
        { name: 'Backbone', description: 'Arquitetura CNN utilizada como backbone da rede' }
      ],
      code: `import torch
import torch.nn as nn
import torch.nn.functional as F
import torchvision.models as models
import torchvision.transforms as transforms
from torch.utils.data import DataLoader, Dataset
from PIL import Image

# Definindo a rede Siamesa
class SiameseNetwork(nn.Module):
    def __init__(self, embedding_dim=128):
        super(SiameseNetwork, self).__init__()
        
        # Usando ResNet18 pré-treinado como base
        self.backbone = models.resnet18(pretrained=True)
        
        # Removendo a camada de classificação
        features_dim = self.backbone.fc.in_features
        self.backbone.fc = nn.Identity()
        
        # Adicionando camada de embedding
        self.embedding = nn.Sequential(
            nn.Linear(features_dim, embedding_dim),
            nn.BatchNorm1d(embedding_dim)
        )`
    }
  ];

  // Helper para mostrar/esconder atributos
  const FeatureSection = ({ title, items, color = "blue" }) => (
    <div className={`p-3 mb-3 bg-${color}-50 rounded-lg`}>
      <h5 className="font-medium text-gray-800 mb-2">{title}</h5>
      <ul className="space-y-1">
        {items.map((item, index) => (
          <li key={index} className="text-sm flex items-start">
            <Check size={16} className={`text-${color}-500 mr-2 flex-shrink-0 mt-0.5`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div>
      <h3 className="text-xl font-semibold text-blue-800 mb-4">Principais Modelos de Visão Computacional</h3>
      
      <div className="p-4 bg-blue-50 rounded-lg mb-6">
        <p>
          Esta seção apresenta os principais algoritmos e arquiteturas utilizados em tarefas de visão computacional,
          destacando suas características, pontos fortes e fracos, aplicações comuns e principais hiperparâmetros
          a serem ajustados. Os modelos cobrem desde classificação básica de imagens até segmentação de instâncias
          e rastreamento visual.
        </p>
      </div>
      
      <div className="space-y-4">
        {models.map(model => (
          <div key={model.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div 
              className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer"
              onClick={() => toggleModel(model.id)}
            >
              <h4 className="font-semibold text-blue-800">{model.name}</h4>
              <div>
                {expandedModels[model.id] ? (
                  <MinusCircle size={20} className="text-gray-600" />
                ) : (
                  <PlusCircle size={20} className="text-gray-600" />
                )}
              </div>
            </div>
            
            {expandedModels[model.id] && (
              <div className="p-4">
                <p className="text-gray-700 mb-4">{model.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <FeatureSection 
                    title="Pontos Fortes" 
                    items={model.strengths} 
                    color="green" 
                  />
                  <FeatureSection 
                    title="Pontos Fracos" 
                    items={model.weaknesses} 
                    color="red" 
                  />
                </div>
                
                <div className="mb-4">
                  <h5 className="font-medium text-gray-800 mb-2">Casos de Uso Comuns</h5>
                  <div className="flex flex-wrap gap-2">
                    {model.useCases.map((useCase, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                        {useCase}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h5 className="font-medium text-gray-800 mb-2">Principais Hiperparâmetros</h5>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="text-left text-sm font-medium text-gray-700 pb-2">Parâmetro</th>
                          <th className="text-left text-sm font-medium text-gray-700 pb-2">Descrição</th>
                        </tr>
                      </thead>
                      <tbody>
                        {model.hyperparameters.map((param, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                            <td className="py-2 pr-4 text-sm font-medium text-gray-800">{param.name}</td>
                            <td className="py-2 text-sm text-gray-600">{param.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-800 mb-2 flex items-center">
                    <Code size={18} className="text-blue-600 mr-2" />
                    Exemplo de Implementação
                  </h5>
                  <CodeBlock code={model.code} language="python" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex items-center justify-center">
        <HelpCircle size={16} className="text-blue-600 mr-2" />
        <span className="text-sm text-gray-600">
          Clique em cada modelo para ver detalhes completos e exemplos de implementação.
        </span>
      </div>
    </div>
  );
};

export default MainModels;