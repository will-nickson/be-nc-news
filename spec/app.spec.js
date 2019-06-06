process.env.NODE_ENV = "test";

const chai = require("chai");
const { expect } = require("chai");
const request = require("supertest");

chai.use(require("chai-sorted"));

const app = require("../app");
const connection = require("../db/connection");

describe.only("/", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  describe("/API", () => {
    it("GET status:200", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body.ok).to.equal(true);
        });
    });
    describe("/TOPICS", () => {
      it("GET status: 200 returns all topics", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body.topics).to.be.an("array");
            expect(body.topics[0]).to.contain.keys("description", "slug");
          });
      });
    });
    describe("/USERS", () => {
      describe("/default", () => {});
      describe("/byUserName", () => {
        it("GET status: 200 returns user by id", () => {
          return request(app)
            .get("/api/users/icellusedkars")
            .expect(200)
            .then(({ body }) => {
              expect(body.user).to.contain.keys(
                "username",
                "name",
                "avatar_url"
              );
              expect(body.user.username).to.equal("icellusedkars");
            });
        });
      });
      describe("/ERRORS", () => {
        it("GET status: 404 for invalid path", () => {
          return request(app)
            .get("/api/users/blahblah/invalid")
            .expect(404);
        });
      });
    });
    describe("/ARTICLES", () => {
      describe("/articles", () => {
        it("GET /articles status: 200 - returns an array of article objects", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles[0]).to.contain.keys(
                "author",
                "title",
                "article_id",
                "topic",
                "created_at",
                "votes",
                "comment_count"
              );
            });
        });
        it("GET /articles status: 200 - returns the comment count for each article", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
              expect(+body.articles[7].comment_count).to.equal(13);
            });
        });
        it("GET /articles status: 200 - sorts array by articles date desc", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.be.sorted("created_at", {
                descending: "true"
              });
            });
        });
      });
      describe("/byArticleId", () => {
        it("GET /:article_id status: 200 - returns an article object by article_id", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body }) => {
              expect(body.article).to.contain.keys(
                "author",
                "title",
                "article_id",
                "body",
                "topic",
                "created_at",
                "votes"
              );
            });
        });
        it("GET /:article_id status: 200 - return comment_count for article", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body }) => {
              expect(body.article).to.contain.keys("comment_count");
              expect(+body.article.comment_count).to.equal(13);
            });
        });
        it("PATCH /:article_id status: 200 - increments votes and returns updated article", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: 1 })
            .expect(200)
            .then(({ body }) => {
              expect(body.article.votes).to.eql(101);
            });
        });
        it("PATCH /:article_id status: 200 - decrements votes and returns updated article", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: -1 })
            .expect(200)
            .then(({ body }) => {
              expect(body.article.votes).to.eql(99);
            });
        });
        it("POST /:article_id/comments status: 201 - adds comment to article by ID and returns the comment", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .send({ username: "icellusedkars", body: "this is a test comment" })
            .expect(201)
            .then(({ body }) => {
              expect(body.comment).to.contain.keys(
                "comment_id",
                "votes",
                "created_at",
                "author",
                "body",
                "article_id"
              );
            });
        });
        it("GET /:article_id/comments status: 200 - returns an array of comments for article_id", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).to.contain.keys(
                "comment_id",
                "votes",
                "created_at",
                "author",
                "body"
              );
            });
        });
        it("GET /:article_id/comments status: 200 - returns an array with results sortedBy created_at descending default", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).to.contain.keys(
                "comment_id",
                "votes",
                "created_at",
                "author",
                "body"
              );
            });
        });
      });
      describe("/ERRORS", () => {
        it("GET status: 404 - for invalid path", () => {
          return request(app)
            .get("/api/articles/1/invalidBlah")
            .expect(404);
        });
        it("GET status: 400 - for invalid article_id", () => {
          return request(app)
            .get("/api/articles/notAnArticle")
            .expect(400);
        });
        it("PATCH status: 404 - for resource that does not exist", () => {
          return request(app)
            .patch("/api/articles/10000")
            .send({ inc_votes: 1000 })
            .expect(404);
        });
        it("PATCH status: 400 - for invalid article_id", () => {
          return request(app)
            .patch("/api/articles/notAnArticle")
            .send({ inc_votes: 1 })
            .expect(400);
        });
        it("POST status: 400 - for invalid article_id", () => {
          return request(app)
            .post("/api/articles/invalid/comment")
            .send({ username: "icellusedkars", body: "this is a test comment" })
            .expect(400);
        });
        it("POST status: 404 - for resource that does not exist", () => {
          return request(app)
            .post("/api/articles/invalid/comment")
            .send({ username: "icellusedkars", body: "this is a test comment" })
            .expect(404);
        });
        it("POST status: 400 - for empty body", () => {
          return request(app)
            .post("/api/articles/invalid/comment")
            .send({ username: "icellusedkars", body: "" })
            .expect(400);
        });
      });
    });
    describe.only("/COMMENTS", () => {
      describe("/byCommentId", () => {
        it("PATCH /:comment_id status: 200 - returns a comment object by comment_id", () => {
          return request(app)
            .patch("/api/comments/1/")
            .expect(200)
            .then(({ body }) => {
              expect(body.comment).to.contain.keys(
                "comment_id",
                "votes",
                "created_at",
                "author",
                "body"
              );
            });
        });
        it("PATCH /:comment_id status: 200 - updates comments votes", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: 1 })
            .expect(200)
            .then(({ body }) => {
              expect(body.comment.votes).to.eql(17);
            });
        });
      });
    });
  });
});
