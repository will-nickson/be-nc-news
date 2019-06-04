const { expect } = require("chai");
const request = require("supertest");

const {
  formatDate,
  renameKeys,
  replaceKeysOfObject,
  createReferenceObject
} = require("../utils");

describe("/utils", () => {
  describe("formatDate()", () => {
    it("Converts single-object array to have correct based timestamp", () => {
      const input = [{ title: "Lorem Ipsum", created_at: 1546300800000 }];
      const expected = [
        { title: "Lorem Ipsum", created_at: "2019-01-01T00:00:00.000Z" }
      ];
      expect(formatDate(input)).to.eql(expected);
    });
    it("Converts multiple-object array to have correct based timestamp", () => {
      const input = [
        { title: "Lorem Ipsum", created_at: 1546300800000 },
        { title: "Dolor Sit", created_at: 1478100731000 },
        { title: "Amet Consectetur", created_at: 1276642472000 }
      ];
      const expected = [
        { title: "Lorem Ipsum", created_at: "2019-01-01T00:00:00.000Z" },
        { title: "Dolor Sit", created_at: "2016-11-02T15:32:11.000Z" },
        { title: "Amet Consectetur", created_at: "2010-06-15T22:54:32.000Z" }
      ];
      expect(formatDate(input)).to.eql(expected);
    });
    it("Does not mutate input array or objects inside of it", () => {
      const input = [
        { title: "Lorem Ipsum", created_at: 1546300800000 },
        { title: "Dolor Sit", created_at: 1478100731000 },
        { title: "Amet Consectetur", created_at: 1276642472000 }
      ];
      const output = formatDate(input);
      expect(output).to.not.equal(input);
      output.forEach((element, index) => {
        expect(element).to.not.equal(input[index]);
      });
    });
    it("Returns converted data with specified timestamp key", () => {
      const input = [
        { title: "Lorem Ipsum", timestamp: 1546300800000 },
        { title: "Dolor Sit", timestamp: 1478100731000 },
        { title: "Amet Consectetur", timestamp: 1276642472000 }
      ];
      const expected = [
        { title: "Lorem Ipsum", timestamp: "2019-01-01T00:00:00.000Z" },
        { title: "Dolor Sit", timestamp: "2016-11-02T15:32:11.000Z" },
        { title: "Amet Consectetur", timestamp: "2010-06-15T22:54:32.000Z" }
      ];
      expect(formatDate(input, "timestamp")).to.eql(expected);
    });

    describe("renameKeys()", () => {
      it("Renames a key of a single-object array", () => {
        const input = [{ test: 5 }];
        const output = [{ chocolate: 5 }];
        expect(renameKeys(input, "test", "chocolate")).to.eql(output);
      });
      it("Renames keys of a multi-object array", () => {
        const input = [{ test: 5 }, { test: "abc" }, { test: true }];
        const output = [
          { chocolate: 5 },
          { chocolate: "abc" },
          { chocolate: true }
        ];
        expect(renameKeys(input, "test", "chocolate")).to.eql(output);
      });
      it("Does not mutate input array or objects inside of it", () => {
        const input = [{ test: 5 }, { test: "abc" }, { test: true }];
        const output = renameKeys(input, "test", "chocolate");
        expect(output).to.not.equal(input);
        output.forEach((element, index) => {
          expect(element).to.not.equal(input[index]);
        });
      });
    });

    describe("replaceKeysOfObject()", () => {
      it("Replaces key based on lookup object in single-object array", () => {
        const input = [{ title: "Moby Dick", author: "Herman Melville" }];
        const output = [{ book_id: 1, author: "Herman Melville" }];
        const lookup = { "Moby Dick": 1 };
        expect(replaceKeysOfObject(input, "title", "book_id", lookup)).to.eql(
          output
        );
      });
      it("Replaces key based on lookup object in multi-object array", () => {
        const input = [
          { title: "Moby Dick", author: "Herman Melville" },
          { title: "Winnie the Pooh", author: "A. A. Milne" },
          { title: "The Old Man and the Sea", author: "Ernest Hemingway" }
        ];
        const output = [
          { book_id: 1, author: "Herman Melville" },
          { book_id: 2, author: "A. A. Milne" },
          { book_id: 3, author: "Ernest Hemingway" }
        ];
        const lookup = {
          "Moby Dick": 1,
          "Winnie the Pooh": 2,
          "The Old Man and the Sea": 3
        };
        expect(replaceKeysOfObject(input, "title", "book_id", lookup)).to.eql(
          output
        );
      });
      it("Does not mutate input array or objects inside of it", () => {
        const input = [
          { title: "Moby Dick", author: "Herman Melville" },
          { title: "Winnie the Pooh", author: "A. A. Milne" },
          { title: "The Old Man and the Sea", author: "Ernest Hemingway" }
        ];
        const lookup = {
          "Moby Dick": 1,
          "Winnie the Pooh": 2,
          "The Old Man and the Sea": 3
        };
        const output = replaceKeysOfObject(input, "title", "book_id", lookup);
        expect(output).to.not.equal(input);
        output.forEach((element, index) => {
          expect(element).to.not.equal(input[index]);
        });
      });
    });

    describe("createReferenceObject()", () => {
      it("Retrieves the key-key pair as object from single-object array", () => {
        const input = [{ title: "Moby Dick", article_id: 5 }];
        const expected = { "Moby Dick": 5 };
        expect(createReferenceObject(input, "title", "article_id")).to.eql(
          expected
        );
      });
      it("Retrieves the key-key pair as object from multiple-object array", () => {
        const input = [
          { title: "Moby Dick", article_id: 5 },
          { title: "Don Quixote", article_id: 6 },
          { title: "Count of Monte Cristo", article_id: 6 }
        ];
        const expected = {
          "Moby Dick": 5,
          "Don Quixote": 6,
          "Count of Monte Cristo": 6
        };
        expect(createReferenceObject(input, "title", "article_id")).to.eql(
          expected
        );
      });
    });
  });
});
