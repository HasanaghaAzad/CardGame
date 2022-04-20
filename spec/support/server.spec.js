var request = require("request");

describe("HTTP codes", () => {
  it("/ should return 200 Ok", (done) => {
    request.get("http://localhost:6000/", (err, res) => {
      expect(res.statusCode).toEqual(200);
      done();
    });
  });

  it("/decks should return 200 Ok", (done) => {
    request.get("http://localhost:6000/decks", (err, res) => {
      expect(res.statusCode).toEqual(200);
      done();
    });
  });

  it("/decks/12345 should return 404", (done) => {
    request.get("http://localhost:6000/decks/12345", (err, res) => {
      expect(res.statusCode).toEqual(404);
      done();
    });
  });
});

describe("/decks", () => {
  it("should create deck", (done) => {
    request.post(
      {
        url: "http://localhost:6000/decks",
        form: { type: "SHORT", shuffled: "true" },
      },
      (err, res, body) => {
        expect(res.statusCode).toEqual(200);

        done();
      }
    );
  });

  it("Create & Open Deck ", (done) => {
    request.post(
      {
        url: "http://localhost:6000/decks",
        form: { type: "SHORT", shuffled: "true" },
      },
      (err, res, body) => {
        createdID = JSON.parse(body).deckId;

        request.get("http://localhost:6000/decks/" + createdID, (err, res) => {
          expect(res.statusCode).toEqual(200);

          done();
        });
      }
    );
  });

  it("Create and Draw 2 cards ", (done) => {
    request.post(
      {
        url: "http://localhost:6000/decks",
        form: { type: "SHORT", shuffled: "true" },
      },
      (err, res, body) => {
        let parsedBody = JSON.parse(body);
        createdID = parsedBody.deckId;

        request.put(
          "http://localhost:6000/decks/" + createdID,
          { form: { count: "2" } },
          (err, res, body) => {
            expect(JSON.parse(body).length).toEqual(2);

            done();
          }
        );
      }
    );
  });
});
