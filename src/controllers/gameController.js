import console from "console";
import { json } from "express/lib/response";
import mongoose from "mongoose";
import { DecksSchema } from "../models/gameModel";

const Deck = mongoose.model("Deck", DecksSchema);

export const decksInfo = (req, res) => {
  res.send({
    "Create a new Deck":
      "POST /decks Content-Type: application/x-www-form-urlencoded shuffled=false&type=FULL",
    "Open a Deck": "GET /decks/deckId",
    "Draw a Card": "PUT /decks/deckId",
  });
};

export const createDeck = (req, res) => {
  let errors = false;
  if (
    typeof req.body.shuffled === "undefined" ||
    (req.body.shuffled !== "true" && req.body.shuffled !== "false")
  ) {
    errors = true;
    res.send({
      "Should set 'shuffled' in application/x-www-form-urlencoded":
        "true | false",
    });
  }
  if (!errors) {
    if (
      typeof req.body.type === "undefined" ||
      (req.body.type !== "FULL" && req.body.type !== "SHORT")
    ) {
      errors = true;
      res.send({
        "Should set 'type' in application/x-www-form-urlencoded":
          "FULL | SHORT",
      });
    }
  }

  if (!errors) {
    let newDeck = new Deck(req.body);
    let cards = createCardsDeck(req.body.type);
    if (req.body.shuffled == true) {
      cards = shuffle(cards);
    }
    newDeck.remaining = cards.length;
    newDeck.cards = cards;
    newDeck.save((err, deck) => {
      if (err) {
        res.send(err);
      } else {
        res.json({
          deckId: deck["_id"],
          type: deck.type,
          shuffled: deck.shuffled,
          remaining: deck.remaining,
        });
      }
    });
  }
};

export const openDeck = (req, res) => {
  Deck.findById(req.params.deckId, (err, deck) => {
    if (err) {
      if (err.name == "CastError" && err.path == "_id") {
        res.send(
          {
            "404 ERROR": "Not finded deck with deckId " + req.params.deckId,
          },
          404
        );
      } else {
        res.send(err);
      }
    } else {
      res.json({
        deckId: deck["_id"],
        type: deck["type"],
        shuffled: deck["shuffled"],
        remaining: deck["remaining"],
        cards: deck["cards"].map((item) => {
          return {
            value: item.value,
            suit: item.suit,
            code: item.code,
          };
        }),
      });
    }
  });
};

export const drawCard = (req, res) => {
  let errors = false;
  if (typeof req.params.deckId === "undefined") {
    errors = true;
    res.send({
      "Should set 'deckId' in PUT /decks/deckId": "",
    });
  }
  if (!errors) {
    Deck.findById(req.params.deckId, (err, deck) => {
      if (err) {
        if (err.name == "CastError" && err.path == "_id") {
          res.send({
            "404 ERROR": "Not finded deck with deckId " + req.params.deckId,
          });
        } else {
          res.send(err);
        }
      } else {
        let cards = deck.cards;
        if (typeof req.body.count === "undefined") {
          res.send({
            "Should set 'count' in application/x-www-form-urlencoded":
              "count of cards to draw",
          });
        } else if (isNaN(parseInt(req.body.count))) {
          res.send({ "ERROR: ": "count should be number" });
        } else if (req.body.count < 1) {
          res.send({ "ERROR: ": "count should be more than 0" });
        } else if (req.body.count > cards.length) {
          res.send({
            error: "count couldn`t be more than remaining card count",
          });
        } else {
          let taken = cards.slice(0, req.body.count);

          let updatedDeck = {
            cards: cards.slice(req.body.count, cards.length),
            remaining: cards.length,
          };

          Deck.findByIdAndUpdate(
            { _id: req.params.deckId },
            updatedDeck,
            { new: true, UseFindAndModify: false },
            (err, deck) => {
              if (err) {
                res.send(err);
              }
              taken = taken.map((item) => {
                return {
                  value: item.value,
                  suit: item.suit,
                  code: item.code,
                };
              });
              res.json(taken);
            }
          );
        }
      }
    });
  }
};

function createCardsDeck(type) {
  if (type === "SHORT") {
    return createShortDeck();
  }
  return createFullDeck();
}

function createShortDeck() {
  const fs = require("fs");
  let rawdata = fs.readFileSync("decks/short.json");
  return JSON.parse(rawdata);
}
function createFullDeck() {
  const fs = require("fs");
  let rawdata = fs.readFileSync("decks/full.json");
  return JSON.parse(rawdata);
}
function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}
