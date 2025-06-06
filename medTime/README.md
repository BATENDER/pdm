# Medication Hopper - React Native (Expo) App

Este é um aplicativo de lembrete de medicação desenvolvido com React Native e Expo, inspirado no design do Google Grasshopper.

## Visão Geral

O aplicativo permite que um responsável (guardião) gerencie medicamentos e agendamentos para um paciente, receba notificações e marque as medicações como administradas.

## Funcionalidades Implementadas (Base)

*   **Estrutura do Projeto:** Configurado com TypeScript e Expo.
*   **Navegação:** Telas principais (Splash, Login, Home, Lista de Medicamentos, Lista de Agendamentos, Alerta, Histórico) conectadas via React Navigation (Stack).
*   **Armazenamento Local:** Funções básicas para salvar/carregar dados (medicamentos, agendamentos, histórico) usando AsyncStorage.
*   **Notificações Locais:** Configuração inicial para solicitar permissões e agendar notificações (incluindo um segundo lembrete suave) usando `expo-notifications`.
*   **Design Básico (Estilo Grasshopper):**
    *   Paleta de cores inspirada (verdes predominantes).
    *   Mascote Gafanhoto gerado e integrado (Splash, Login, Home, Alerta).
    *   Layouts das telas principais com estilo visual inicial.
*   **CRUD Básico (UI):** Telas de lista para Medicamentos e Agendamentos com botões de Adicionar/Editar/Excluir (navegação e lógica completa de formulários pendentes).
*   **Tela de Alerta:** Exibe detalhes da medicação e possui um botão interativo (imagem) para marcar como administrada.
*   **Tela de Histórico:** Exibe registros de medicações administradas.
*   **Login Simulado:** Tela de login básica para o guardião (usuário 'guardian', senha 'password').
*   **Integração API (Simulada):** Placeholder para notificar a equipe de manutenção quando um alerta é exibido.

## Como Executar

1.  **Descompacte** o arquivo `MedicationReminderApp.zip`.
2.  **Navegue** até o diretório `MedicationReminderApp` no seu terminal:
    ```bash
    cd MedicationReminderApp
    ```
3.  **Instale as dependências** (se necessário, certifique-se de ter Node.js e npm/yarn instalados):
    ```bash
    npm install
    # ou
    # yarn install
    ```
4.  **Inicie o aplicativo** usando o Expo Go no seu dispositivo móvel ou em um emulador:
    ```bash
    npx expo start
    ```
    Siga as instruções no terminal para abrir o aplicativo.

## Próximos Passos / TODOs

*   **Implementar Formulários:** Criar telas e lógica para adicionar/editar medicamentos e agendamentos.
*   **Autenticação Segura:** Substituir o login simulado por um sistema de autenticação robusto (ex: Firebase Auth, backend próprio com `expo-secure-store`).
*   **Gerenciamento de Estado:** Implementar um gerenciador de estado (Context API, Zustand, Redux) para compartilhar dados entre as telas de forma mais eficaz.
*   **Notificações Avançadas:**
    *   Armazenar IDs de notificação para cancelamento específico.
    *   Lidar com interações de notificação (ex: marcar como tomado diretamente da notificação).
    *   Refinar a lógica do segundo alarme.
*   **Integração API Real:** Implementar a chamada real para a API de notificação da equipe de manutenção.
*   **Refinamento de UI/UX:**
    *   Melhorar o design e adicionar mais elementos visuais/animações no estilo Grasshopper.
    *   Testar e otimizar a usabilidade em diferentes dispositivos.
*   **Testes:** Adicionar testes unitários e de integração.
*   **Acessibilidade:** Realizar testes completos com leitores de tela e ajustar conforme necessário.

## Estrutura de Pastas

```
MedicationReminderApp/
├── assets/             # Imagens e fontes
├── src/
│   ├── navigation/     # Configuração do React Navigation
│   ├── screens/        # Componentes de tela
│   └── utils/          # Funções utilitárias (storage, notifications)
├── App.tsx             # Ponto de entrada principal
├── app.json            # Configuração do Expo
├── package.json        # Dependências e scripts
└── tsconfig.json       # Configuração do TypeScript
```

