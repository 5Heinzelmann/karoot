**Product Requirements Document (PRD)**

**Product Name:** Karoot!
**Objective:** Create an interactive web application for hosting and participating in real-time quiz games with multiple-choice questions.

---

### 1. Features

#### 1.1 Game Creation
- Hosts can create new quiz games with custom titles
- System generates a unique 4-digit numeric game code
- Hosts can add, edit, and delete questions while in draft mode

#### 1.2 Question Management
- Each question has exactly 4 answer options
- One option must be marked as correct
- Questions can only be modified in draft status

#### 1.3 Game Participation
- Players join using the 4-digit game code and a unique nickname
- Real-time display of participants in the lobby
- Host controls game flow (start, quit)

#### 1.4 Quiz Gameplay
- Questions displayed in a 2x2 grid layout
- 15-second countdown timer for each question
- Players select answers and receive feedback
- Host sees answer distribution and controls progression

---

### 2. Database Design

#### 2.1 Tables

1. **Games Table**
    - **Fields**:
        - `id`: Unique game identifier
        - `title`: Game title
        - `host_id`: ID of the user hosting the game
        - `status`: Game state (draft, lobby, in_progress, finished)
        - `code`: Unique 4-digit numeric game code

2. **Participants Table**
    - **Fields**:
        - `id`: Unique participant identifier
        - `game_id`: Game the participant belongs to
        - `name`: Unique nickname within the game

3. **Questions Table**
    - **Fields**:
        - `id`: Unique question identifier
        - `game_id`: Game the question belongs to
        - `text`: Question text
        - `order`: Question sequence number

4. **Options Table**
    - **Fields**:
        - `id`: Unique option identifier
        - `question_id`: Question the option belongs to
        - `text`: Option text
        - `is_correct`: Boolean indicating if this is the correct answer

5. **Answers Table**
    - **Fields**:
        - `id`: Unique answer identifier
        - `participant_id`: Participant who provided the answer
        - `question_id`: Question being answered
        - `option_id`: Selected option

---

### 3. Game States

1. **Draft**
    - Questions can be created, edited, or deleted
    - Initial state when a game is created

2. **Lobby**
    - Participants can join the game using the code
    - Host can see the list of participants

3. **In Progress**
    - Active gameplay with questions and answers
    - Timer countdown for each question

4. **Finished**
    - Game has ended
    - Simple completion screen

---

### 4. Application Routes

1. **Home Route (`/`)**:
    - Join game form (code + nickname)
    - Create game button (requires login)
    - Game creation form appears directly on this page

2. **Game View (`/game/:id`)**:
    - Main game interface for players
    - Dynamic content based on game status in database
    - Adapts interface according to current game state
    - Handles all game states (draft, lobby, in_progress, finished)

3. **Host Control (`/game/:id/host`)**:
    - Host-specific controls and views
    - Adapts based on current game status in database
    - Provides appropriate controls for each game state

---

### 5. User Flow

#### 5.1 Host Flow
1. Host logs in and creates a new game with title
2. System generates a 4-digit numeric game code
3. Host adds questions with 4 options each (marking one as correct)
4. Host changes game status to lobby
5. Host shares the game code with participants
6. When ready, host starts the game
7. Host controls progression through questions
8. Host ends the game after the final question

#### 5.2 Player Flow
1. Player enters the 4-digit game code and unique nickname
2. Player waits in lobby until host starts the game
3. Player answers each question within the 15-second time limit
4. After each question, player sees correct answer and their selection
5. At game end, player sees completion screen

---
Design System:
1. **Color Scheme**: Use a vibrant color scheme with orange as the dominant color. Complement it with green for the carrot leaves and earthy tones for a natural look.
2. **Illustrative Elements**: Utilize playful illustrations of carrots in various shapes and sizes. These can be used as icons for different categories or buttons.
3. **Animations**: Integrate simple animations, such as a carrot growing or the sudden sprouting of carrot leaves for correct answers. This adds fun and vibrancy to the app.
4. **Typography**: Choose a rounded and friendly font that reflects the organic and playful nature of the theme.
5. **Background Patterns**: Design the background with a subtle pattern of stylized carrots that doesn’t interfere with the user experience but subtly integrates the theme into the design.
6. **Transition Accents**: Use animations during transitions between questions or when displaying results, such as carrots growing or being lifted out of earth cubes.

---

**Additional Considerations:**
- No scoring or leaderboard in the initial version