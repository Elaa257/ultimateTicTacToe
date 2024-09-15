import { DataSource } from 'typeorm';
import { User } from './src/user/user.entity';
import { Game } from './src/game/game.entity';
import { Role } from './src/auth/roles/enum.roles';
import { validateOrReject } from 'class-validator';
import * as crypto from 'crypto';

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'tmp.sqlite',
  entities: [User, Game],
  synchronize: true, // Use with caution in production
});

async function seed() {
  await AppDataSource.initialize();

  const userRepository = AppDataSource.getRepository(User);
  const gameRepository = AppDataSource.getRepository(Game);

  // Create 5 users
  const users = [];
  for (let i = 1; i <= 5; i++) {
    const user = new User();
    user.email = `user${i}@example.com`;
    user.password = crypto.createHmac('sha256', 'password123').digest('hex');
    user.nickname = `User${i}`;
    user.role = Role.User;
    await validateOrReject(user); // Validate before saving
    await userRepository.save(user);
    users.push(user);
  }

  // For each user, create 3 games
  for (const user of users) {
    for (let j = 0; j < 3; j++) {
      const game = new Game();

      // Mark the game as finished
      game.finished = true;

      // Initialize the board (you can set this to a real game state if desired)
      game.board = Array(9).fill(0);

      game.player1 = user;

      // Select a random opponent who is not the current user
      let opponent;
      do {
        opponent = users[Math.floor(Math.random() * users.length)];
      } while (opponent.id === user.id);

      game.player2 = opponent;

      // Since the game is finished, 'turn' can be set to null
      game.turn = null;

      // Record the ELO before the game
      game.player1EloBefore = user.elo;
      game.player2EloBefore = opponent.elo;

      // Decide if the game is a draw
      const isDraw = Math.random() < 0.3; // 30% chance of draw
      game.draw = isDraw;

      // ELO calculation constants
      const K = 32; // ELO K-factor

      if (isDraw) {
        // It's a draw
        game.winner = null;
        game.loser = null;

        // Update players' stats
        user.draw += 1;
        opponent.draw += 1;

        // Calculate expected scores
        const expectedScoreUser =
          1 / (1 + Math.pow(10, (opponent.elo - user.elo) / 400));
        const expectedScoreOpponent =
          1 / (1 + Math.pow(10, (user.elo - opponent.elo) / 400));

        // Update ELO ratings
        user.elo += K * (0.5 - expectedScoreUser);
        opponent.elo += K * (0.5 - expectedScoreOpponent);
      } else {
        // There's a winner and a loser
        const userWins = Math.random() < 0.5;
        if (userWins) {
          game.winner = user;
          game.loser = opponent;
          user.wins += 1;
          opponent.loses += 1;
        } else {
          game.winner = opponent;
          game.loser = user;
          opponent.wins += 1;
          user.loses += 1;
        }

        // Calculate expected scores
        const expectedScoreUser =
          1 / (1 + Math.pow(10, (opponent.elo - user.elo) / 400));
        const expectedScoreOpponent =
          1 / (1 + Math.pow(10, (user.elo - opponent.elo) / 400));

        // Update ELO ratings
        if (userWins) {
          user.elo += K * (1 - expectedScoreUser);
          opponent.elo += K * (0 - expectedScoreOpponent);
        } else {
          user.elo += K * (0 - expectedScoreUser);
          opponent.elo += K * (1 - expectedScoreOpponent);
        }
      }

      // Round ELO ratings to integers
      user.elo = Math.round(user.elo);
      opponent.elo = Math.round(opponent.elo);

      // Record the ELO after the game
      game.player1EloAfter = user.id === game.player1.id ? user.elo : opponent.elo;
      game.player2EloAfter = opponent.id === game.player2.id ? opponent.elo : user.elo;

      // Save updated users
      await userRepository.save(user);
      await userRepository.save(opponent);

      await validateOrReject(game); // Validate before saving
      await gameRepository.save(game);
    }
  }

  console.log('Seeding completed.');
  process.exit();
}

seed().catch((error) => {
  console.error('Error during seeding:', error);
  process.exit(1);
});
