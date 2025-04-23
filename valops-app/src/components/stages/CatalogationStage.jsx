// CatalogationStage.js
import React, { useState } from 'react';
import { ArrowLeft, Info, Users, Shield, FileCheck, Database, CheckCircle } from 'lucide-react';

const CatalogationStage = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button onClick={onClose} className="mr-4 p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft size={24} className="text-blue-700" />
          </button>
          <h2 className="text-2xl font-bold text-blue-800">Etapa de Catalogação GAIA</h2>
        </div>
        <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
          Etapa 2
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 px-1 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Info size={16} className="mr-2" />
              Visão Geral
            </div>
          </button>
          <button
            onClick={() => setActiveTab('responsibilities')}
            className={`pb-4 px-1 font-medium text-sm ${
              activeTab === 'responsibilities'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Users size={16} className="mr-2" />
              Responsabilidades
            </div>
          </button>
          <button
            onClick={() => setActiveTab('protection')}
            className={`pb-4 px-1 font-medium text-sm ${
              activeTab === 'protection'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Shield size={16} className="mr-2" />
              Proteção de Dados
            </div>
          </button>
          <button
            onClick={() => setActiveTab('requirements')}
            className={`pb-4 px-1 font-medium text-sm ${
              activeTab === 'requirements'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <FileCheck size={16} className="mr-2" />
              Requisitos
            </div>
          </button>
        </nav>
      </div>

      {/* Conteúdo da tab selecionada */}
      <div className="p-4">
        {activeTab === 'overview' && (
          <div>
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Sobre a Etapa de Catalogação GAIA</h3>
              <p className="mb-4">
                A etapa de Catalogação GAIA é realizada pelo Gestor responsável pelo modelo e representa o registro
                oficial do modelo no sistema corporativo de governança. Nesta fase, são definidos os aspectos 
                negociais, riscos e controles associados ao modelo.
              </p>
              <p className="mb-4">
                Esta etapa é crítica para garantir que o modelo atenda aos requisitos de governança, transparência
                e documentação exigidos pela IN 1230-1 (Governança de Inteligência Analítica e Artificial).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-700 mb-2">Entradas do Processo</h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <CheckCircle size={16} className="text-green-500 mr-2" /> Modelo com ID GAIA gerado
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle size={16} className="text-green-500 mr-2" /> Documentação técnica inicial
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle size={16} className="text-green-500 mr-2" /> Artefatos no Model Store
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle size={16} className="text-green-500 mr-2" /> Versão inicial do modelo
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-700 mb-2">Atividades</h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <CheckCircle size={16} className="text-green-500 mr-2" /> Complementação de documentação
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle size={16} className="text-green-500 mr-2" /> Definição de requisitos negociais
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle size={16} className="text-green-500 mr-2" /> Classificação de riscos
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle size={16} className="text-green-500 mr-2" /> Aprovação pelo gestor
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-700 mb-2">Saídas do Processo</h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <CheckCircle size={16} className="text-green-500 mr-2" /> Modelo catalogado no GAIA
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle size={16} className="text-green-500 mr-2" /> Documentação negocial completa
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle size={16} className="text-green-500 mr-2" /> Avaliação inicial de riscos
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle size={16} className="text-green-500 mr-2" /> Encaminhamento para USD
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-gray-700 mb-4">Fluxo de Catalogação</h4>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1 text-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex-shrink-0 h-8 w-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mx-auto mb-2">1</div>
                  <p className="text-sm font-medium">Acesso ao GAIA</p>
                </div>
                <div className="text-gray-400">→</div>
                <div className="flex-1 text-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex-shrink-0 h-8 w-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mx-auto mb-2">2</div>
                  <p className="text-sm font-medium">Complementação de dados</p>
                </div>
                <div className="text-gray-400">→</div>
                <div className="flex-1 text-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex-shrink-0 h-8 w-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mx-auto mb-2">3</div>
                  <p className="text-sm font-medium">Aprovação do gestor</p>
                </div>
                <div className="text-gray-400">→</div>
                <div className="flex-1 text-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex-shrink-0 h-8 w-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mx-auto mb-2">4</div>
                  <p className="text-sm font-medium">Encaminhamento USD</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'responsibilities' && (
          <div>
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Responsabilidades na Catalogação</h3>
            
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <p className="mb-3">
                A etapa de Catalogação GAIA é de responsabilidade do Gestor do Modelo, conforme definido na
                IN 1230-1: <span className="italic">"Compete ao Gestor do Modelo efetuar a catalogação dos modelos no GAIA, 
                fornecendo todas as informações, bem como observar e cumprir as respectivas ações necessárias em cada 
                uma das fases do CVdM."</span>
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <Users size={20} className="text-blue-600 mr-2" />
                  Gestor do Modelo
                </h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium text-gray-700">Responsabilidades:</p>
                    <ul className="mt-2 space-y-1">
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Complementar as informações técnicas do modelo</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Definir os requisitos negociais e objetivos do modelo</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Identificar stakeholders e usuários</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Classificar o modelo quanto à criticidade e risco</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Aprovar a catalogação para prosseguimento no fluxo</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium text-gray-700">Competências necessárias:</p>
                    <ul className="mt-2 space-y-1">
                      <li className="text-sm flex">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Conhecimento do negócio e objetivos estratégicos</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Entendimento básico de modelos analíticos/IA</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Visão de riscos e governança de dados</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <Shield size={20} className="text-blue-600 mr-2" />
                  Equipe USD
                </h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium text-gray-700">Responsabilidades:</p>
                    <ul className="mt-2 space-y-1">
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Avaliar aspectos de proteção de dados pessoais</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Verificar conformidade com a LGPD</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Identificar riscos relacionados à privacidade</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Recomendar controles e mitigações</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Aprovar o modelo para prosseguir à etapa de validação</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium text-gray-700">Prazos:</p>
                    <ul className="mt-2 space-y-1">
                      <li className="text-sm flex">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Análise inicial em até 5 dias úteis</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Recomendações em até 10 dias úteis</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Aprovação para próxima etapa em até 15 dias úteis</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Importante:</strong> O Gestor do Modelo deve garantir que todas as informações inseridas no GAIA
                    estejam corretas e completas. A qualidade da catalogação impacta diretamente no processo de validação
                    subsequente e na qualidade geral da governança de modelos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'protection' && (
          <div>
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Proteção de Dados</h3>
            
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <p className="mb-3">
                Após a aprovação pelo Gestor, o modelo é encaminhado para a área "USD" que realiza uma análise
                detalhada dos aspectos de proteção de dados pessoais e conformidade com a LGPD (Lei Geral de 
                Proteção de Dados). Esta etapa é essencial para garantir que o modelo atenda aos requisitos
                legais e éticos relacionados ao uso de dados pessoais.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <Shield size={20} className="text-blue-600 mr-2" />
                  Aspectos Avaliados
                </h4>
                <ul className="space-y-3">
                  <li className="flex">
                    <div className="flex-shrink-0 h-6 w-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mr-3">1</div>
                    <div>
                      <p className="text-sm font-medium">Dados Pessoais Utilizados</p>
                      <p className="text-xs text-gray-500">Identificação dos dados pessoais presentes nos conjuntos de treinamento</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 h-6 w-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mr-3">2</div>
                    <div>
                      <p className="text-sm font-medium">Base Legal</p>
                      <p className="text-xs text-gray-500">Verificação da base legal para processamento dos dados</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 h-6 w-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mr-3">3</div>
                    <div>
                      <p className="text-sm font-medium">Dados Sensíveis</p>
                      <p className="text-xs text-gray-500">Identificação e tratamento especial para dados sensíveis</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 h-6 w-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mr-3">4</div>
                    <div>
                      <p className="text-sm font-medium">Finalidade</p>
                      <p className="text-xs text-gray-500">Avaliação se o uso dos dados está alinhado com sua finalidade declarada</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 h-6 w-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mr-3">5</div>
                    <div>
                      <p className="text-sm font-medium">Retenção de Dados</p>
                      <p className="text-xs text-gray-500">Verificação dos períodos de retenção e políticas de exclusão</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <Database size={20} className="text-blue-600 mr-2" />
                  Resultados da Avaliação
                </h4>
                
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded">
                    <p className="text-sm font-semibold text-green-700">Aprovação Direta</p>
                    <p className="text-xs text-gray-600 mt-1">
                      O modelo não utiliza dados pessoais ou está em total conformidade com a LGPD e políticas internas
                    </p>
                  </div>
                  
                  <div className="p-3 bg-yellow-50 rounded">
                    <p className="text-sm font-semibold text-yellow-700">Aprovação com Recomendações</p>
                    <p className="text-xs text-gray-600 mt-1">
                      O modelo pode prosseguir, mas há recomendações de melhorias para proteção de dados
                    </p>
                  </div>
                  
                  <div className="p-3 bg-red-50 rounded">
                    <p className="text-sm font-semibold text-red-700">Necessidade de Ajustes</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Existem questões críticas que precisam ser resolvidas antes de prosseguir
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-gray-50 rounded">
                  <p className="text-sm font-medium text-gray-700">Registros Gerados:</p>
                  <ul className="mt-2 space-y-1">
                    <li className="text-sm flex">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Relatório de avaliação de proteção de dados</span>
                    </li>
                    <li className="text-sm flex">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Recomendações de controles e mitigações</span>
                    </li>
                    <li className="text-sm flex">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Evidências de conformidade com a LGPD</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-gray-700 mb-4">Processo de Análise de Proteção de Dados</h4>
              
              <div className="overflow-hidden">
                <div className="flex">
                  <div className="w-1/4 border-r border-gray-200 p-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                      <span className="text-blue-800 font-bold">1</span>
                    </div>
                    <p className="text-sm font-medium">Recebimento</p>
                    <p className="text-xs text-gray-500 mt-1">Modelo encaminhado após aprovação do Gestor</p>
                  </div>
                  
                  <div className="w-1/4 border-r border-gray-200 p-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                      <span className="text-blue-800 font-bold">2</span>
                    </div>
                    <p className="text-sm font-medium">Análise Inicial</p>
                    <p className="text-xs text-gray-500 mt-1">Verificação dos dados utilizados e finalidade</p>
                  </div>
                  
                  <div className="w-1/4 border-r border-gray-200 p-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                      <span className="text-blue-800 font-bold">3</span>
                    </div>
                    <p className="text-sm font-medium">Avaliação Detalhada</p>
                    <p className="text-xs text-gray-500 mt-1">Análise de conformidade e riscos à privacidade</p>
                  </div>
                  
                  <div className="w-1/4 p-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                      <span className="text-blue-800 font-bold">4</span>
                    </div>
                    <p className="text-sm font-medium">Conclusão</p>
                    <p className="text-xs text-gray-500 mt-1">Aprovação ou recomendação de ajustes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'requirements' && (
          <div>
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Requisitos de Catalogação</h3>
            
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <p className="mb-3">
                Para que a etapa de Catalogação GAIA seja concluída com sucesso, o Gestor do Modelo deve
                preencher uma série de informações e requisitos no sistema. Estas informações são essenciais
                para o processo de governança e para as etapas de validação subsequentes.
              </p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requisitos</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Obrigatório</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Informações Básicas</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <ul className="list-disc list-inside">
                        <li>Nome do modelo</li>
                        <li>Descrição de negócio</li>
                        <li>Objetivo e finalidade</li>
                        <li>Área responsável</li>
                      </ul>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Sim</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Responsáveis</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <ul className="list-disc list-inside">
                        <li>Gestor do modelo</li>
                        <li>Desenvolvedor técnico</li>
                        <li>Stakeholders envolvidos</li>
                      </ul>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Sim</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Classificação</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <ul className="list-disc list-inside">
                        <li>Tipo de modelo (classificação, regressão, etc.)</li>
                        <li>Criticidade para o negócio</li>
                        <li>Nível de risco</li>
                      </ul>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Sim</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Informações Técnicas</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <ul className="list-disc list-inside">
                        <li>Plataforma de desenvolvimento</li>
                        <li>Algoritmos utilizados</li>
                        <li>Métricas de desempenho</li>
                        <li>Requisitos técnicos</li>
                      </ul>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Sim</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Dados</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <ul className="list-disc list-inside">
                        <li>Fontes de dados utilizadas</li>
                        <li>Periodicidade de atualização</li>
                        <li>Dados pessoais envolvidos</li>
                        <li>Políticas de retenção</li>
                      </ul>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Sim</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Documentação</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <ul className="list-disc list-inside">
                        <li>Documentação técnica complementar</li>
                        <li>Manuais de usuário (se aplicável)</li>
                        <li>Políticas de governança</li>
                      </ul>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Parcial</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-700 mb-3">Aprovação do Gestor</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Após o preenchimento de todas as informações obrigatórias, o Gestor do Modelo deve aprovar
                  formalmente a catalogação no GAIA. Esta aprovação indica que:
                </p>
                <ul className="space-y-2">
                  <li className="text-sm flex">
                    <CheckCircle size={16} className="text-green-500 mr-2 flex-shrink-0" />
                    <span>As informações inseridas estão corretas e completas</span>
                  </li>
                  <li className="text-sm flex">
                    <CheckCircle size={16} className="text-green-500 mr-2 flex-shrink-0" />
                    <span>O modelo atende aos requisitos negociais definidos</span>
                  </li>
                  <li className="text-sm flex">
                    <CheckCircle size={16} className="text-green-500 mr-2 flex-shrink-0" />
                    <span>A classificação de risco foi devidamente realizada</span>
                  </li>
                  <li className="text-sm flex">
                    <CheckCircle size={16} className="text-green-500 mr-2 flex-shrink-0" />
                    <span>O modelo está pronto para avaliação da equipe USD</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-700 mb-3">Conclusão da Etapa</h4>
                <p className="text-sm text-gray-600 mb-4">
                  A etapa de Catalogação GAIA é concluída quando:
                </p>
                <ol className="space-y-3">
                  <li className="flex">
                    <div className="flex-shrink-0 h-6 w-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mr-3">1</div>
                    <div className="text-sm">
                      <p>Todas as informações obrigatórias foram preenchidas no GAIA</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 h-6 w-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mr-3">2</div>
                    <div className="text-sm">
                      <p>O Gestor do Modelo aprovou formalmente a catalogação</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 h-6 w-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mr-3">3</div>
                    <div className="text-sm">
                      <p>O modelo foi encaminhado para a equipe USD</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 h-6 w-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mr-3">4</div>
                    <div className="text-sm">
                      <p>A USD concluiu a análise de proteção de dados</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 h-6 w-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mr-3">5</div>
                    <div className="text-sm">
                      <p>O modelo foi aprovado para seguir para a etapa de Extração de Artefatos</p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogationStage;