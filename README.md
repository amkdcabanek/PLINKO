# Plinko Web Game

Welcome to the Plinko Web Game! This project is a web-based adaptation of the classic Plinko game, where players can drop balls onto a board filled with pegs and score points by landing in bins. https://amkdcabanek.github.io/PLINKO/

## Project Structure

The project consists of the following files and directories:

- `index.html`: The main HTML document that sets up the structure of the web application.
- `css/style.css`: Contains the styles for the web application, defining the layout, colors, fonts, and other visual aspects of the game.
- `js/game.js`: The entry point for the game logic. It initializes the game, handles user input, updates the game state, and renders the game elements on the canvas.
- `js/classes/`: Contains JavaScript classes for the game:
  - `Ball.js`: Represents a ball in the game.
  - `Bin.js`: Represents a scoring bin in the game.
  - `Divider.js`: Represents the dividers between the bins.
  - `Peg.js`: Represents the pegs in the Plinko board.
- `js/utils.js`: Contains utility functions used throughout the game.
- `assets/sounds/`: Contains audio assets for sound effects:
  - `bounce.mp3`: Sound effect for when a ball bounces off a peg or divider.
  - `score.mp3`: Sound effect for when a ball lands in a scoring bin.

## Getting Started

To run the Plinko Web Game locally, follow these steps:

1. Clone the repository to your local machine.
2. Open `index.html` in your web browser.
3. Enjoy playing the Plinko game!

## Usage

- Click or press the spacebar to drop a ball onto the board.
- Watch as the ball bounces off the pegs and lands in one of the scoring bins.
- Your score will be updated based on the bin where the ball lands.

## Contributing

If you'd like to contribute to the project, feel free to fork the repository and submit a pull request. Any improvements or bug fixes are welcome!

## License

This project is open-source and available under the MIT License.
