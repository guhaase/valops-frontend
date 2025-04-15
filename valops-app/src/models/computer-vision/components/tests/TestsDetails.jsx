// src/models/computer-vision/components/tests/TestsDetails.jsx
import React, { useState } from 'react';
import { Info, CheckCircle, Code, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

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


const TestsDetails = () => {
  // Estado para controlar quais seções estão expandidas
  const [expandedSections, setExpandedSections] = useState({
    specificTests: true,
    codeExamples: false,
    checklist: true
  });

  // Função para alternar a expansão de uma seção
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Dados dos testes para tipos específicos de visão computacional
  const specificTests = [
    {
      id: 'classification',
      name: 'Classificação de Imagens',
      description: 'Atribuição de uma categoria ou rótulo a uma imagem inteira.',
      tests: [
        { name: 'Acurácia', importance: 'Alta', notes: 'Proporção de imagens classificadas corretamente' },
        { name: 'Top-K Acurácia', importance: 'Média', notes: 'Se a classe correta está entre as K previsões mais prováveis' },
        { name: 'Precisão, Recall, F1-Score', importance: 'Alta', notes: 'Especialmente útil para classes desbalanceadas' },
        { name: 'Matriz de Confusão', importance: 'Alta', notes: 'Para identificar confusões específicas entre classes' },
        { name: 'AUC-ROC', importance: 'Média', notes: 'Para avaliar performance em diferentes thresholds' },
        { name: 'Cross-validation', importance: 'Alta', notes: 'Validação em múltiplos folds para robustez' },
        { name: 'Robustez a ruído/transformações', importance: 'Média', notes: 'Testes com variações como rotação, zoom, ruído' }
      ]
    },
  ];

  // Código para calcular métricas
  const codeSnippets = {
    objectDetection: `import numpy as np
from pycocotools.coco import COCO
from pycocotools.cocoeval import COCOeval
import cv2
import torch
from torchvision.ops import box_iou, nms

# Exemplo de cálculo de IoU para caixas delimitadoras
def calculate_iou(box1, box2):
    """
    Calcula IoU entre dois bounding boxes [x1, y1, x2, y2]
    """
    # Convertendo para o formato esperado pelo PyTorch
    box1_tensor = torch.tensor([box1], dtype=torch.float)
    box2_tensor = torch.tensor([box2], dtype=torch.float)
    
    # Calculando IoU
    iou = box_iou(box1_tensor, box2_tensor).item()
    return iou

# Exemplo de avaliação usando o COCO API
def evaluate_coco_detection(ground_truth_json, predictions_json):
    """
    Avalia modelo de detecção usando o protocolo COCO
    """
    # Inicializando o COCO ground truth
    coco_gt = COCO(ground_truth_json)
    
    # Carregando predições no formato COCO
    coco_dt = coco_gt.loadRes(predictions_json)
    
    # Inicializando o avaliador COCO
    coco_eval = COCOeval(coco_gt, coco_dt, 'bbox')
    
    # Opcional: configurar parâmetros da avaliação
    # coco_eval.params.iouThrs = ...
    # coco_eval.params.areaRng = ...
    
    # Realizar avaliação
    coco_eval.evaluate()
    coco_eval.accumulate()
    coco_eval.summarize()
    
    # Acessar métricas específicas
    mAP = coco_eval.stats[0]  # AP @IoU=0.50:0.95
    mAP_50 = coco_eval.stats[1]  # AP @IoU=0.50
    
    return {
        "mAP": mAP,
        "mAP_50": mAP_50,
        "metrics": coco_eval.stats
    }

# Exemplo de Non-Maximum Suppression 
def apply_nms(boxes, scores, iou_threshold=0.5):
    """
    Aplica Non-Maximum Suppression para filtrar detecções redundantes
    """
    if len(boxes) == 0:
        return []
    
    # Convertendo para tensores PyTorch
    boxes_tensor = torch.tensor(boxes, dtype=torch.float)
    scores_tensor = torch.tensor(scores, dtype=torch.float)
    
    # Aplicando NMS
    keep_indices = nms(boxes_tensor, scores_tensor, iou_threshold)
    
    # Convertendo índices para lista Python
    keep_indices = keep_indices.tolist()
    
    # Retornando boxes após NMS
    filtered_boxes = [boxes[i] for i in keep_indices]
    filtered_scores = [scores[i] for i in keep_indices]
    
    return filtered_boxes, filtered_scores`,
    
    segmentation: `import numpy as np
import torch
import torch.nn.functional as F
from sklearn.metrics import confusion_matrix
import cv2

# Cálculo de IoU para segmentação
def calculate_iou_segmentation(pred_mask, gt_mask):
    """
    Calcula IoU para máscaras de segmentação
    pred_mask e gt_mask são arrays binários onde 1 representa o objeto
    """
    intersection = np.logical_and(pred_mask, gt_mask).sum()
    union = np.logical_or(pred_mask, gt_mask).sum()
    
    iou = intersection / union if union > 0 else 0
    return iou

# Cálculo de Dice Coefficient (F1-score espacial)
def calculate_dice_coefficient(pred_mask, gt_mask):
    """
    Calcula coeficiente Dice para máscaras de segmentação
    """
    intersection = np.logical_and(pred_mask, gt_mask).sum()
    return (2. * intersection) / (pred_mask.sum() + gt_mask.sum())

# Avaliação completa de segmentação semântica multi-classe
def evaluate_semantic_segmentation(pred, gt, num_classes):
    """
    Avalia segmentação semântica multi-classe
    pred e gt são arrays onde cada pixel contém o ID da classe
    """
    # Criando máscaras binárias para cada classe
    ious = []
    dices = []
    pixel_accuracy = []
    
    for class_id in range(num_classes):
        pred_mask = (pred == class_id)
        gt_mask = (gt == class_id)
        
        # Calculando IoU e Dice para a classe atual
        iou = calculate_iou_segmentation(pred_mask, gt_mask)
        dice = calculate_dice_coefficient(pred_mask, gt_mask)
        
        ious.append(iou)
        dices.append(dice)
        
        # Precisão por pixel para esta classe
        true_pos = np.logical_and(pred_mask, gt_mask).sum()
        total = gt_mask.sum()
        accuracy = true_pos / total if total > 0 else 0
        pixel_accuracy.append(accuracy)
    
    # Calculando matriz de confusão
    cm = confusion_matrix(gt.flatten(), pred.flatten(), labels=range(num_classes))
    
    # Calculando mIoU (média de IoU por classe)
    miou = np.mean(ious)
    
    # Calculando precisão global (porcentagem de pixels corretamente classificados)
    global_accuracy = np.sum(np.diag(cm)) / np.sum(cm)
    
    return {
        "class_ious": ious,
        "class_dices": dices,
        "class_pixel_accuracy": pixel_accuracy,
        "miou": miou,
        "mean_dice": np.mean(dices),
        "global_pixel_accuracy": global_accuracy,
        "confusion_matrix": cm
    }

# Boundary F1-score (BF-score) para avaliar precisão de bordas
def compute_boundary_f1_score(pred_mask, gt_mask, radius=2):
    """
    Calcula F1-score de bordas para avaliar a precisão das bordas dos segmentos
    """
    # Extraindo bordas das máscaras
    gt_boundary = cv2.Canny(gt_mask.astype(np.uint8) * 255, 100, 200)
    pred_boundary = cv2.Canny(pred_mask.astype(np.uint8) * 255, 100, 200)
    
    # Dilatando bordas para considerar pequenos deslocamentos
    kernel = np.ones((radius, radius), np.uint8)
    gt_boundary_dilated = cv2.dilate(gt_boundary, kernel, iterations=1)
    pred_boundary_dilated = cv2.dilate(pred_boundary, kernel, iterations=1)
    
    # Calculando verdadeiros positivos, falsos positivos e falsos negativos
    tp = np.logical_and(pred_boundary, gt_boundary_dilated).sum()
    fp = np.logical_and(pred_boundary, np.logical_not(gt_boundary_dilated)).sum()
    fn = np.logical_and(gt_boundary, np.logical_not(pred_boundary_dilated)).sum()
    
    # Calculando precisão e recall
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0
    
    # Calculando F1-score
    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0
    
    return {
        "boundary_precision": precision,
        "boundary_recall": recall,
        "boundary_f1": f1
    }`,
    
    faceRecognition: `import numpy as np
from sklearn.metrics import roc_curve, auc, precision_recall_curve
import matplotlib.pyplot as plt
import torch
import torch.nn.functional as F

# Cálculo de distância entre embeddings faciais
def calculate_face_similarity(embedding1, embedding2, metric='cosine'):
    """
    Calcula a similaridade entre dois embeddings faciais
    """
    if metric == 'cosine':
        # Convertendo para tensores PyTorch
        emb1 = torch.tensor(embedding1, dtype=torch.float)
        emb2 = torch.tensor(embedding2, dtype=torch.float)
        
        # Normalizando os embeddings
        emb1 = F.normalize(emb1, p=2, dim=0)
        emb2 = F.normalize(emb2, p=2, dim=0)
        
        # Calculando similaridade de cosseno (1 = idêntico, 0 = diferente)
        similarity = torch.dot(emb1, emb2).item()
        return similarity
    
    elif metric == 'euclidean':
        return -np.linalg.norm(embedding1 - embedding2)  # Negativo para que valores maiores sejam mais similares
    
    else:
        raise ValueError(f"Métrica não suportada: {metric}")

# Avaliação de sistema de verificação facial
def evaluate_face_verification(pairs, embeddings_dict, ground_truth, threshold=0.5):
    """
    Avalia um sistema de verificação facial
    pairs: lista de pares (id1, id2) para verificar
    embeddings_dict: dicionário com embeddings para cada ID
    ground_truth: lista de 1 (mesmo) ou 0 (diferente) para cada par
    """
    # Calculando similaridades para todos os pares
    similarities = []
    for id1, id2 in pairs:
        similarity = calculate_face_similarity(embeddings_dict[id1], embeddings_dict[id2])
        similarities.append(similarity)
    
    # Convertendo para arrays numpy
    similarities = np.array(similarities)
    ground_truth = np.array(ground_truth)
    
    # Calculando predições com base no threshold
    predictions = (similarities >= threshold).astype(int)
    
    # Calculando métricas básicas
    true_positives = np.sum((predictions == 1) & (ground_truth == 1))
    false_positives = np.sum((predictions == 1) & (ground_truth == 0))
    true_negatives = np.sum((predictions == 0) & (ground_truth == 0))
    false_negatives = np.sum((predictions == 0) & (ground_truth == 1))
    
    # Verificação de divisão por zero
    accuracy = (true_positives + true_negatives) / len(ground_truth)
    far = false_positives / (false_positives + true_negatives) if (false_positives + true_negatives) > 0 else 0
    frr = false_negatives / (false_negatives + true_positives) if (false_negatives + true_positives) > 0 else 0
    
    # Gerando curva ROC
    fpr, tpr, thresholds = roc_curve(ground_truth, similarities)
    roc_auc = auc(fpr, tpr)
    
    # Encontrando EER (Equal Error Rate)
    fnr = 1 - tpr  # False Negative Rate
    eer_threshold = thresholds[np.nanargmin(np.absolute(fnr - fpr))]
    eer = fpr[np.nanargmin(np.absolute(fnr - fpr))]
    
    return {
        "accuracy": accuracy,
        "far": far,
        "frr": frr,
        "roc_auc": roc_auc,
        "eer": eer,
        "eer_threshold": eer_threshold,
        "fpr": fpr,
        "tpr": tpr,
        "thresholds": thresholds
    }

# Função para plotar curvas ROC e calcular EER (igual taxa de erro)
def plot_roc_and_eer(ground_truth, similarities):
    """
    Plota curva ROC e identifica o ponto de EER (Equal Error Rate)
    """
    fpr, tpr, thresholds = roc_curve(ground_truth, similarities)
    roc_auc = auc(fpr, tpr)
    
    # Calculando Equal Error Rate
    fnr = 1 - tpr
    eer_idx = np.nanargmin(np.absolute(fnr - fpr))
    eer = fpr[eer_idx]
    eer_threshold = thresholds[eer_idx]
    
    # Plotando curva ROC
    plt.figure(figsize=(10, 8))
    plt.plot(fpr, tpr, color='darkorange', lw=2, label=f'ROC curve (area = {roc_auc:.2f})')
    plt.plot([0, 1], [1, 0], color='navy', lw=2, linestyle='--')
    plt.plot([eer, eer], [0, 1-eer], 'r--', label=f'EER = {eer:.2f}')
    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.05])
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.title('Receiver Operating Characteristic')
    plt.legend(loc="lower right")
    
    return {
        "eer": eer,
        "eer_threshold": eer_threshold,
        "roc_auc": roc_auc
    }`
  };

  // Checklist de avaliação para modelos de visão computacional
  const checklistItems = [
    'Selecione métricas específicas para o tipo de tarefa de visão computacional',
    'Utilize datasets públicos e padronizados para benchmark quando possível',
    'Teste o modelo em condições variadas (iluminação, ângulos, escalas)',
    'Avalie tanto a qualidade das previsões quanto a velocidade/eficiência computacional',
    'Para aplicações em tempo real, meça o FPS em hardware representativo do ambiente final',
    'Assegure que o conjunto de teste seja representativo dos dados reais de produção',
    'Identifique e analise casos de falha para entender limitações do modelo',
    'Compare desempenho com modelos estabelecidos na literatura ou baselines simples',
    'Considere avaliação humana para aspectos subjetivos (ex: qualidade visual em geração de imagens)',
    'Valide o modelo em múltiplos grupos demográficos para detectar vieses (especialmente reconhecimento facial)'
  ];

  // Componente para seção expansível
  const ExpandableSection = ({ title, isExpanded, onToggle, children }) => (
    <div className="mb-6 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div
        className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer"
        onClick={onToggle}
      >
        <h4 className="font-semibold text-gray-700">{title}</h4>
        <div>
          {isExpanded ? (
            <ChevronUp size={20} className="text-gray-600" />
          ) : (
            <ChevronDown size={20} className="text-gray-600" />
          )}
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div>
      {/* Testes específicos por tipo de visão computacional */}
      <ExpandableSection
        title="Testes Específicos por Tipo de Tarefa"
        isExpanded={expandedSections.specificTests}
        onToggle={() => toggleSection('specificTests')}
      >
        <div className="space-y-6">
          {specificTests.map(testGroup => (
            <div key={testGroup.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="mb-4">
                <h5 className="text-lg font-semibold text-blue-800 mb-1">{testGroup.name}</h5>
                <p className="text-gray-700">{testGroup.description}</p>
              </div>
              
              <div className="overflow-hidden">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Teste/Métrica
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Importância
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Observações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {testGroup.tests.map((test, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {test.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium
                            ${test.importance === 'Muito Alta' && 'bg-green-100 text-green-800'}
                            ${test.importance === 'Alta' && 'bg-blue-100 text-blue-800'}
                            ${test.importance === 'Média' && 'bg-yellow-100 text-yellow-800'}
                            ${test.importance === 'Variável' && 'bg-purple-100 text-purple-800'}
                          `}>
                            {test.importance}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {test.notes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </ExpandableSection>
      
      {/* Exemplos práticos de código para cálculo de métricas */}
      <ExpandableSection
        title="Exemplos de Implementação"
        isExpanded={expandedSections.codeExamples}
        onToggle={() => toggleSection('codeExamples')}
      >
        <div>
          <h5 className="font-medium text-gray-800 mb-3 flex items-center">
            <Code className="h-5 w-5 text-blue-600 mr-2" />
            Avaliação de Detecção de Objetos
          </h5>
          <CodeBlock code={codeSnippets.objectDetection} language="python" />

          
          <h5 className="font-medium text-gray-800 mt-6 mb-3 flex items-center">
            <Code className="h-5 w-5 text-blue-600 mr-2" />
            Avaliação de Segmentação
          </h5>
          <CodeBlock code={codeSnippets.segmentation} language="python" />
          
          <h5 className="font-medium text-gray-800 mt-6 mb-3 flex items-center">
            <Code className="h-5 w-5 text-blue-600 mr-2" />
            Avaliação de Reconhecimento Facial
          </h5>
          <CodeBlock code={codeSnippets.faceRecognition} language="python" />
        </div>
      </ExpandableSection>
      
      {/* Checklist de Avaliação para Modelos de Visão Computacional */}
      <ExpandableSection
        title="Checklist de Avaliação para Modelos de Visão Computacional"
        isExpanded={expandedSections.checklist}
        onToggle={() => toggleSection('checklist')}
      >
        <div className="bg-blue-50 p-4 rounded-lg">
          <ul className="space-y-2">
            {checklistItems.map((item, index) => (
              <li key={index} className="flex items-start text-sm">
                <CheckCircle size={16} className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h5 className="text-sm font-medium text-yellow-800">Importante</h5>
              <p className="text-sm text-yellow-700 mt-1">
                A escolha das métricas de avaliação deve ser guiada pelo contexto específico da aplicação. 
                Por exemplo, em sistemas críticos de segurança, a capacidade de detectar todos os casos positivos 
                (recall) pode ser prioritária, enquanto em sistemas de triagem, minimizar falsos positivos (precisão) 
                pode ser mais importante. Considere também o custo computacional e requisitos de tempo real da sua aplicação.
              </p>
            </div>
          </div>
        </div>
      </ExpandableSection>
    </div>
  );
};

export default TestsDetails;