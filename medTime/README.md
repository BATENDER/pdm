# Medication Hopper

<div align="center">
  <img src="assets/grasshopper_mascot.png" alt="Medication Hopper Logo" width="120" height="120">
  <h3>Seu assistente de lembretes de medicação</h3>
</div>

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação e Uso](#-instalação-e-uso)
- [Papéis de Usuário](#-papéis-de-usuário)
- [Capturas de Tela](#-capturas-de-tela)
- [Próximos Passos](#-próximos-passos)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

## 🔍 Sobre o Projeto

O **Medication Hopper** é um aplicativo de lembretes de medicação desenvolvido com React Native e Expo, inspirado no design do Google Grasshopper. Seu objetivo principal é ajudar pacientes a seguir corretamente seus tratamentos medicamentosos, reduzindo esquecimentos e erros na administração de medicamentos.

O aplicativo foi projetado pensando em três grupos principais:
- **Pacientes** que precisam seguir tratamentos medicamentosos
- **Cuidadores e familiares** responsáveis pelo monitoramento
- **Profissionais de saúde** que acompanham a adesão ao tratamento

## ✨ Funcionalidades

### Gerenciamento de Medicações
- Cadastro de medicamentos com nome, dosagem e observações
- Interface intuitiva e acessível
- Armazenamento seguro dos dados

### Agendamento Personalizado
- Criação de horários específicos para cada medicação
- Vinculação com medicamentos cadastrados
- Organização visual em listas

### Sistema de Alertas
- Notificações no horário exato da medicação
- Lembretes suaves para minimizar frustração
- Modal interativo para confirmar administração
- Alertas para cuidadores via API

### Histórico Completo
- Registro de medicações tomadas
- Identificação de doses perdidas
- Rastreamento de agendamentos criados
- Visualização cronológica para análise

### Acesso Multiusuário
- Três níveis de permissão: Usuário, Cuidador e Administrador
- Navegação condicional baseada no papel do usuário
- Sistema de autenticação seguro

## 🛠️ Tecnologias Utilizadas

- **React Native**: Framework para desenvolvimento mobile multiplataforma
- **Expo**: Plataforma para simplificar o desenvolvimento React Native
- **TypeScript**: Linguagem tipada para maior segurança e produtividade
- **AsyncStorage**: Armazenamento local persistente
- **Context API**: Gerenciamento de estado e autenticação
- **Expo Notifications**: Sistema de notificações em tempo real
- **React Navigation**: Navegação entre telas

## 📁 Estrutura do Projeto

```
MedicationReminderApp/
├── assets/                  # Imagens e recursos estáticos
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── AddMedicationModal.tsx
│   │   ├── AddScheduleModal.tsx
│   │   └── MedicationAlertModal.tsx
│   ├── context/             # Contextos React
│   │   └── AuthContext.tsx  # Contexto de autenticação
│   ├── navigation/          # Configuração de navegação
│   │   └── AppNavigator.tsx
│   ├── screens/             # Telas do aplicativo
│   │   ├── AlertScreen.tsx
│   │   ├── HistoryScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── MedicationListScreen.tsx
│   │   ├── ScheduleListScreen.tsx
│   │   └── SplashScreen.tsx
│   └── utils/               # Utilitários e helpers
│       ├── notifications.ts # Gerenciamento de notificações
│       └── storage.ts       # Funções de armazenamento
├── App.tsx                  # Ponto de entrada do aplicativo
├── app.json                 # Configuração do Expo
└── package.json             # Dependências do projeto
```

## 🚀 Instalação e Uso

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn
- Expo CLI

### Passos para Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/medication-hopper.git
   cd medication-hopper
   ```

2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```

3. Instale as dependências específicas do Expo:
   ```bash
   npx expo install react-native-screens react-native-safe-area-context @react-navigation/native @react-navigation/stack expo-notifications @react-native-async-storage/async-storage react-native-modal react-native-uuid
   ```

4. Inicie o aplicativo:
   ```bash
   npx expo start
   ```

5. Use o aplicativo Expo Go no seu dispositivo móvel para escanear o QR code ou execute em um emulador.

## 👥 Papéis de Usuário

### Usuário (Paciente)
- Acesso à lista de medicações
- Acesso aos agendamentos
- Recebimento de alertas de medicação

### Cuidador
- Acesso à lista de medicações
- Acesso aos agendamentos
- Acesso ao histórico de medicação
- Recebimento de notificações sobre o paciente

### Administrador
- Acesso completo a todas as funcionalidades
- Configurações avançadas do sistema
- Gerenciamento de usuários

## 📱 Capturas de Tela

*Nota: Adicione capturas de tela do seu aplicativo aqui quando disponíveis.*

## 🔮 Próximos Passos

- **Sincronização em nuvem**: Permitir acesso aos dados de qualquer dispositivo
- **Integração com dispositivos de saúde**: Conectar com monitores de pressão, glicosímetros, etc.
- **Expansão para versão web completa**: Facilitar o acesso por parte de cuidadores e profissionais de saúde
- **Relatórios avançados**: Gerar insights sobre a adesão ao tratamento
- **Suporte a múltiplos idiomas**: Internacionalização do aplicativo

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests para melhorar o aplicativo.

1. Faça um fork do projeto
2. Crie sua branch de feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.

---

<div align="center">
  <p>Desenvolvido com ❤️ pela Equipe Medication Hopper</p>
</div>
