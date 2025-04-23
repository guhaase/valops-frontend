// src/models/computer-vision/components/OverviewContent.jsx
import React from 'react';
import { Book, BarChart2, Target, CheckCircle2 } from 'lucide-react';

const OverviewContent = () => {
  return (
    <div>
      <h3 className="text-xl font-semibold text-blue-800 mb-4">Modelos de Visão Computacional</h3>
      
      <div className="p-4 bg-blue-50 rounded-lg mb-6">
        <p className="mb-4">
          Visão Computacional é a área da Inteligência Artificial que capacita 
          computadores a interpretar e entender o mundo visual, processando e analisando 
          imagens e vídeos de forma similar à visão humana. Esta área tem evoluído significativamente 
          com os avanços das redes neurais profundas.
        </p>
        <p>
          Os modelos de visão computacional são utilizados em diversas aplicações como reconhecimento facial, 
          detecção de objetos, carros autônomos, controle de qualidade industrial, diagnóstico médico 
          por imagem, e interação homem-máquina, transformando como os sistemas computacionais 
          interagem com o mundo real.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center mb-3">
            <Target className="h-6 w-6 text-blue-600 mr-2" />
            <h4 className="font-semibold text-gray-700">Objetivos</h4>
          </div>
          <ul className="space-y-2">
            <li className="flex items-start text-sm">
              <span className="text-green-500 mr-2 mt-1">•</span>
              <span>Extrair informações significativas de imagens e vídeos</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-green-500 mr-2 mt-1">•</span>
              <span>Identificar e classificar objetos, pessoas e cenários</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-green-500 mr-2 mt-1">•</span>
              <span>Detectar padrões e anomalias em conteúdo visual</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-green-500 mr-2 mt-1">•</span>
              <span>Automatizar tarefas de análise visual que normalmente requerem percepção humana</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center mb-3">
            <BarChart2 className="h-6 w-6 text-blue-600 mr-2" />
            <h4 className="font-semibold text-gray-700">Desafios Comuns</h4>
          </div>
          <ul className="space-y-2">
            <li className="flex items-start text-sm">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <span>Variação em iluminação, ângulo e escala</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <span>Necessidade de grandes conjuntos de dados anotados</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <span>Custo computacional elevado para treinamento</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <span>Robustez em ambientes não controlados</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <span>Generalização para objetos ou cenários não vistos no treinamento</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-6">
        <div className="flex items-center mb-3">
          <CheckCircle2 className="h-6 w-6 text-blue-600 mr-2" />
          <h4 className="font-semibold text-gray-700">Tipos de Tarefas em Visão Computacional</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-2">Classificação de Imagens</h5>
            <p className="text-sm text-gray-600">
              Atribuir uma ou mais categorias/classes a uma imagem inteira, 
              identificando o objeto ou conceito principal representado.
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-2">Detecção de Objetos</h5>
            <p className="text-sm text-gray-600">
              Localizar e classificar múltiplos objetos em uma imagem, 
              geralmente indicando suas posições através de caixas delimitadoras.
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-2">Segmentação Semântica</h5>
            <p className="text-sm text-gray-600">
              Atribuir uma classe a cada pixel da imagem, criando uma compreensão 
              detalhada de todos os elementos presentes na cena.
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-2">Segmentação de Instâncias</h5>
            <p className="text-sm text-gray-600">
              Identificar cada objeto individualmente no nível de pixel, distinguindo 
              entre diferentes instâncias da mesma classe.
            </p>
          </div>

          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-2">Estimação de Pose</h5>
            <p className="text-sm text-gray-600">
              Detectar a posição de pontos-chave que representam articulações 
              ou características do corpo humano para análise de postura e movimento.
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-2">Reconhecimento de Ações</h5>
            <p className="text-sm text-gray-600">
              Identificar atividades ou ações em sequências de vídeo, 
              compreendendo o comportamento dinâmico dos objetos ou pessoas.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-center mb-3">
          <Book className="h-6 w-6 text-blue-600 mr-2" />
          <h4 className="font-semibold text-gray-700">Conceitos Fundamentais</h4>
        </div>
        
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-1">Extração de Características</h5>
            <p className="text-sm text-gray-600">
              Processo de identificar e isolar padrões visuais relevantes em uma imagem, 
              como bordas, cantos, texturas e gradientes, que são fundamentais para o reconhecimento visual.
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-1">Redes Neurais Convolucionais (CNNs)</h5>
            <p className="text-sm text-gray-600">
              Arquitetura de rede neural especializada no processamento de dados com estrutura 
              em grade, como imagens, utilizando operações de convolução para extrair hierarquias 
              de características visuais.
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-1">Transfer Learning</h5>
            <p className="text-sm text-gray-600">
              Técnica que utiliza modelos pré-treinados em grandes conjuntos de dados como ponto de partida, 
              adaptando-os para tarefas específicas de visão computacional com menos dados de treinamento.
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-1">Data Augmentation</h5>
            <p className="text-sm text-gray-600">
              Conjunto de técnicas para aumentar artificialmente a quantidade e diversidade dos dados 
              de treinamento, aplicando transformações como rotação, zoom, espelhamento e alterações 
              de cor nas imagens existentes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewContent;