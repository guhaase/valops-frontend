import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';

// Função para ler configuração de estágios desativados
const getDisabledStages = () => {
  try {
    const disabledStagesStr = localStorage.getItem('valops_disabled_stages');
    if (disabledStagesStr) {
      return JSON.parse(disabledStagesStr);
    }
  } catch (error) {
    console.error('Erro ao ler estágios desativados:', error);
  }
  // Padrão: nenhum estágio desativado
  return [];
};

// Função para salvar configuração de estágios desativados
const saveDisabledStages = (stagesArray) => {
  try {
    localStorage.setItem('valops_disabled_stages', JSON.stringify(stagesArray));
  } catch (error) {
    console.error('Erro ao salvar estágios desativados:', error);
  }
};

const ImprovedJourneyFlow = ({ onStageClick }) => {
  const [hoveredStage, setHoveredStage] = useState(null);
  // Estado para controlar quais estágios estão desativados
  const [disabledStages, setDisabledStages] = useState(getDisabledStages());
  
  // Detectar Alt+Shift+S para abrir painel de configuração de estágios (S de "stages")
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Alt+Shift+S
      if (e.altKey && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        
        // Mostrar diálogo de configuração
        const currentDisabled = getDisabledStages();
        const allStages = ['validation', 'implementation'];
        
        const message = `
Configuração de estágios do ValOps:

Estágios atualmente desativados: ${currentDisabled.join(', ') || 'Nenhum'}

Digite:
- "ativar todos" para ativar todos os estágios
- "desativar validation" para desativar o estágio de Validação
- "desativar implementation" para desativar o estágio de Implementação
- "desativar ambos" para desativar os dois estágios
        `;
        
        const input = prompt(message);
        
        if (input) {
          const command = input.toLowerCase().trim();
          
          if (command === 'ativar todos') {
            saveDisabledStages([]);
            setDisabledStages([]);
            alert('Todos os estágios foram ativados! Atualize a página para ver as mudanças.');
          } 
          else if (command === 'desativar validation') {
            const newDisabled = ['validation'];
            saveDisabledStages(newDisabled);
            setDisabledStages(newDisabled);
            alert('Estágio de Validação desativado! Atualize a página para ver as mudanças.');
          }
          else if (command === 'desativar implementation') {
            const newDisabled = ['implementation'];
            saveDisabledStages(newDisabled);
            setDisabledStages(newDisabled);
            alert('Estágio de Implementação desativado! Atualize a página para ver as mudanças.');
          }
          else if (command === 'desativar ambos') {
            const newDisabled = ['validation', 'implementation'];
            saveDisabledStages(newDisabled);
            setDisabledStages(newDisabled);
            alert('Estágios de Validação e Implementação desativados! Atualize a página para ver as mudanças.');
          }
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const stages = [
    {
      id: 'development',
      number: 1,
      title: 'Desenvolvimento',
      description: 'Criação do modelo',
      tools: ['AnalyticsLabb/H2O', 'IBM AI Platform', 'Databricks'],
      color: 'blue'
    },
    {
      id: 'catalogation',
      number: 2,
      title: 'Catalogação GAIA',
      description: 'Registro oficial',
      tools: ['Gestor responsável', 'Definições negociais', 'Aprovação do gestor'],
      color: 'indigo'
    },
    {
      id: 'extraction',
      number: 3,
      title: 'Extração Artefatos',
      description: 'Preparação',
      tools: ['Model Store (S3)', 'Interface agnóstica', 'Preparação testes'],
      color: 'purple'
    },
    {
      id: 'testing',
      number: 4,
      title: 'Testes',
      description: 'Avaliação',
      tools: ['MAIA (automático)', 'Chiron (manual)', 'AnalyticsLabb'],
      color: 'pink'
    },
    {
      id: 'validation',
      number: 5,
      title: 'Validação',
      description: 'Decisão',
      tools: ['Critérios DICOI', 'Autônoma/Manual', 'Geração AVL'],
      color: 'rose'
    },
    {
      id: 'implementation',
      number: 6,
      title: 'Implementação',
      description: 'Produção',
      tools: ['Deploy', 'Monitoramento', 'ID em produção'],
      color: 'orange'
    }
  ];

  // Função para gerar classes de cores com base nas cores do Tailwind
  const getColorClass = (baseColor, element, variant) => {
    const colorMap = {
      blue: {
        bg: 'bg-blue-500',
        border: 'border-blue-500',
        text: 'text-blue-700',
        hover: 'hover:bg-blue-600',
        textLight: 'text-blue-500'
      },
      indigo: {
        bg: 'bg-indigo-500',
        border: 'border-indigo-500',
        text: 'text-indigo-700',
        hover: 'hover:bg-indigo-600',
        textLight: 'text-indigo-500'
      },
      purple: {
        bg: 'bg-purple-500',
        border: 'border-purple-500',
        text: 'text-purple-700',
        hover: 'hover:bg-purple-600',
        textLight: 'text-purple-500'
      },
      pink: {
        bg: 'bg-pink-500',
        border: 'border-pink-500',
        text: 'text-pink-700',
        hover: 'hover:bg-pink-600',
        textLight: 'text-pink-500'
      },
      rose: {
        bg: 'bg-red-500',
        border: 'border-red-500',
        text: 'text-red-700',
        hover: 'hover:bg-red-600',
        textLight: 'text-red-500'
      },
      orange: {
        bg: 'bg-orange-500',
        border: 'border-orange-500',
        text: 'text-orange-700',
        hover: 'hover:bg-orange-600',
        textLight: 'text-orange-500'
      }
    };

    return colorMap[baseColor][element];
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Ciclo de Vida de Validação de Modelos</h2>
      
      {/* Timeline container */}
      <div className="relative mb-16">
        {/* Main horizontal line */}
        <div className="absolute h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 top-16 left-0 right-0 rounded-full"></div>
        
        {/* Stages container */}
        <div className="flex justify-between items-start relative">
          {stages.map((stage, index) => (
            <div 
              key={stage.id}
              className={`relative z-10 transition-all duration-300 transform ${disabledStages.includes(stage.id) ? 'opacity-70 hover:opacity-100' : ''}`}
              style={{ 
                width: '16%',
                transform: hoveredStage === stage.id ? 'translateY(-8px)' : 'none'
              }}
              onMouseEnter={() => setHoveredStage(stage.id)}
              onMouseLeave={() => setHoveredStage(null)}
              onClick={() => {
                // Verificar se o estágio está desativado na configuração
                if (disabledStages.includes(stage.id)) {
                  // Exibir alerta informativo em vez de abrir o estágio
                  alert(`O estágio "${stage.title}" está em desenvolvimento e será disponibilizado em breve!`);
                } else {
                  // Chamar a função normalmente para estágios disponíveis
                  onStageClick(stage.id);
                }
              }}
            >
              {/* Number Circle */}
              <div className={`mx-auto mb-4 w-10 h-10 rounded-full ${getColorClass(stage.color, 'bg')} text-white flex items-center justify-center font-bold text-lg shadow-lg border-2 border-white transition-all duration-300`}>
                {stage.number}
              </div>
              
              {/* Content Card */}
              <div className={`p-4 bg-white border-t-4 ${getColorClass(stage.color, 'border')} rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer h-full relative`}>
                {/* Tarja "Em Breve" para estágios desativados */}
                {disabledStages.includes(stage.id) && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-red-600 text-white text-xs py-1 px-2 rounded-lg font-bold shadow-md transform rotate-12">
                      Em Breve
                    </div>
                  </div>
                )}
                
                <h3 className={`font-bold ${getColorClass(stage.color, 'text')} mb-1 text-center`}>{stage.title}</h3>
                <p className="text-sm text-gray-600 mb-3 text-center">{stage.description}</p>
                <ul className="text-xs space-y-1">
                  {stage.tools.map((tool, idx) => (
                    <li key={idx} className="flex items-start">
                      <ChevronRight size={12} className={`${getColorClass(stage.color, 'textLight')} mt-1 mr-1 flex-shrink-0`} />
                      <span>{tool}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Arrow to next stage */}
              {index < stages.length - 1 && (
                <div className="hidden md:block absolute top-14 -right-4 z-20">
                  <ArrowRight size={20} className="text-gray-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Description Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold text-blue-800 mb-4">Sobre o ValOps</h2>
        <p className="text-gray-700">
          O ValOps é uma plataforma de validação prévia para modelos de Inteligência Analítica e Artificial,
          alinhada com a IN 1230-1 (Governança de Inteligência Analítica e Artificial). Cada etapa acima
          representa parte do ciclo de vida completo de validação de modelos, independente da plataforma de origem.
        </p>
        <p className="text-gray-700 mt-4">
          Clique em cada etapa para ver detalhes, métricas e requisitos específicos. O processo garante a qualidade, 
          conformidade e governança de modelos antes de sua implementação em produção.
        </p>
        
        {/* Aviso sobre funcionalidades em desenvolvimento */}
        {disabledStages.length > 0 && (
          <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Funcionalidades em desenvolvimento</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    {disabledStages.includes('validation') && disabledStages.includes('implementation') ? (
                      <>Os estágios de <strong>Validação</strong> e <strong>Implementação</strong> estão em desenvolvimento e serão disponibilizados nas próximas atualizações.</>
                    ) : disabledStages.includes('validation') ? (
                      <>O estágio de <strong>Validação</strong> está em desenvolvimento e será disponibilizado nas próximas atualizações.</>
                    ) : disabledStages.includes('implementation') ? (
                      <>O estágio de <strong>Implementação</strong> está em desenvolvimento e será disponibilizado nas próximas atualizações.</>
                    ) : null}
                    {" "}O sistema está sendo construído de forma incremental.
                  </p>
                </div>
                <div className="mt-2 text-xs text-yellow-600">
                  <p>Dica: Pressione Alt+Shift+S para configurar os estágios disponíveis (apenas para administradores).</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImprovedJourneyFlow;