# CardGame

Card Game like Poker and Blackjack. The goal is to create an API to handle decks and cards to be used in any game like these.

## INSTALL

### Download and install code

Terminal

git clone https://github.com/HasanaghaAzad/CardGame.git

cd CardGame

npm install

### Install Docker

I used Docker for mongoDB.
https://docs.docker.com/get-docker/

### Install MongoDB

Terminal

docker pull mongo

docker run --name mongodb -p 37017:27017 -d mongo

## START

npm start

## USAGE

GET /decks/ HTTP/1.1
Host: localhost:6000

### Create a new Deck

POST /decks/ HTTP/1.1
Host: localhost:6000
Content-Type: application/x-www-form-urlencoded
Content-Length: 24

shuffled=false&type=FULL

### Open a Deck

GET /decks/625fca849c5d860fee5a9297 HTTP/1.1
Host: localhost:6000

_625fca849c5d860fee5a9297 is deckId what we got when created new Deck_

### Draw a Card

PUT /decks/625fca849c5d860fee5a9297 HTTP/1.1
Host: localhost:6000
Content-Type: application/x-www-form-urlencoded
Content-Length: 7

count=2

_625fca849c5d860fee5a9297 is deckId what we got when created new Deck_
_count is count of cards to draw_
