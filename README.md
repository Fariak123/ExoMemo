# Todo Mobile App

A mobile task and planning application built with **Expo, React Native, TypeScript, and Zustand**.

The app is designed around three focused views — **Agenda, Today, and History** — with task management, deadline tracking, local notifications, search, filtering and editing.
## Features

### Task & Plan Management

* Create both **Tasks** and **Plans**
* Add a title and description
* Assign a priority: **Low, Medium, or High**
* Add or remove a deadline
* Enable or disable deadline notifications
* Edit existing tasks and plans
* Mark tasks as completed and reopen them later

### Agenda

Shows all currently ongoing tasks and plans.

* Sorted by closest deadline
* Deadline status indicators:

  * Green — more than 7 days remaining
  * Yellow — 4–7 days remaining
  * Red — 3 days or less, including overdue deadlines

Ongoing tasks use a red deadline indicator, while completed tasks use a strikethrough title.

### History

Shows completed tasks grouped by completion date.

* Newest completion dates first
* Completed titles shown with strikethrough
* Tasks remain editable through the details modal

### Deadline Notifications

Tasks can optionally schedule local deadline reminders.

When notifications are enabled, reminders are scheduled:

* 7 days before the deadline
* Every day afterwards
* At the deadline

Notifications are cancelled when a task is completed or deleted and recreated when an eligible task is reopened or edited.

## Tech Stack

| Technology                                 | Purpose                                     |
| ------------------------------------------ | ------------------------------------------- |
| **TypeScript**                             | Type safety and application logic           |
| **React Native**                           | Mobile UI                                   |
| **Expo**                                   | Development and native platform integration |
| **Expo Router**                            | Application routing                         |
| **Zustand**                                | Global state management                     |
| **AsyncStorage**                           | Persistent local task storage               |
| **expo-notifications**                     | Local scheduled notifications               |
| **expo-crypto**                            | UUID generation                             |
| **lucide-react-native**                    | Icons                                       |

### State Management

Zustand manages:

* Tasks
* Current screen
* Task/Plan filter
* Priority filter
* Search state
* Ordering
* Selected task

## Getting Started

### Prerequisites

* Node.js
* npm
* Expo CLI / Expo tooling
* Expo Go for development on a physical device

### Installation

Clone the repository:

```bash
git clone https://github.com/Fariak123/ExoMemo.git
cd ExoMemo
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npx expo start
```

Open the project using Expo Go or an available emulator/simulator.

### Useful Commands

Start Expo:

```bash
npx expo start
```

Clear the Metro cache:

```bash
npx expo start -c
```

Run TypeScript checks:

```bash
npx tsc --noEmit
```

Check the Expo project:

```bash
npx expo-doctor
```

## Screenshots

### Agenda

![Agenda](https://github.com/Fariak123/ExoMemo/blob/main/assets/images/Agenda.jpg?raw=true)

### Add Task

![Add Task](https://github.com/Fariak123/ExoMemo/blob/main/assets/images/AddTask.jpg?raw=true)

### Today

![Today](https://github.com/Fariak123/ExoMemo/blob/main/assets/images/Today.jpg?raw=true)

### History

![History](https://github.com/Fariak123/ExoMemo/blob/main/assets/images/History.jpg?raw=true)

### Task Details

![Task Details](https://github.com/Fariak123/ExoMemo/blob/main/assets/images/Details.jpg?raw=true)

## License

This project is intended as a personal portfolio and learning project.
