import {
  decksInfo,
  createDeck,
  openDeck,
  drawCard,
} from "../controllers/gameController";

const routes = (app) => {
  app
    .route("/decks")
    .get(decksInfo)
    .post(createDeck)
    .put((req, res) => {
      res.send(
        {
          "Should set 'deckId' in": "PUT /decks/deckId",
        },
        404
      );
    });

  app.route("/decks/:deckId").get(openDeck).put(drawCard);
};

export default routes;
