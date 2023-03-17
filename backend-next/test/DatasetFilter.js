/* eslint-disable @typescript-eslint/no-var-requires */
"use strict";

const utils = require("./LoginUtils");
const { TestData } = require("./TestData");
const sandbox = require("sinon").createSandbox();

let accessTokenIngestor = null,
  accessTokenUser1 = null,
  accessTokenUser2 = null,
  accessTokenUser3 = null,
  accessTokenArchiveManager = null;

let datasetPid1 = null,
  encodedDatasetPid1 = null,
  datasetPid2 = null,
  encodedDatasetPid2 = null,
  datasetPid3 = null,
  encodedDatasetPid3 = null,
  datasetPid4 = null,
  encodedDatasetPid4 = null;


const RawCorrect1 = {
  ...TestData.RawCorrect,
  datasetName: "This is the first correct test raw dataset",
  description: "There was no ice cream in the freezer, nor did they have money to go to the store. Part of the first two datasets",
  isPublished: true,
  ownerGroup: "group1",
  accessGroups: ["group5"],
};
  
const RawCorrect2 = {
  ...TestData.RawCorrect,
  datasetName: "This is the second correct test raw dataset",
  description: "There was no telling what thoughts would come from the machine. Part of the first two datasets",
  isPublished: false,
  ownerGroup: "group2",
  accessGroups: ["group6"],
};
  
const RawCorrect3 = {
  ...TestData.RawCorrect,
  datasetName: "This is the third correct test raw dataset",
  description: "The opportunity of a lifetime passed before him as he tried to decide between a cone or a cup. Last and third dataset",
  isPublished: false,
  ownerGroup: "group3",
  accessGroups: ["group6"],
};

const RawCorrect4 = {
  ...TestData.RawCorrect,
  datasetName: "This is the fourth correct test dataset, and it is raw",
  description: "After coating myself in vegetable oil I found my success rate skyrocketed",
  isPublished: false,
  ownerGroup: "group4",
  accessGroups: ["group6"],
};

describe("DatasetFilter: Test retrieving datasets using filtering capabilities", () => {
  beforeEach((done) => {
    utils.getToken(
      appUrl,
      {
        username: "ingestor",
        password: "aman",
      },
      (tokenVal) => {
        accessTokenIngestor = tokenVal;
        utils.getToken(
          appUrl,
          {
            username: "user1",
            password: "a609316768619f154ef58db4d847b75e",
          },
          (tokenVal) => {
            accessTokenUser1 = tokenVal;
            utils.getToken(
              appUrl,
              {
                username: "user2",
                password: "f522d1d715970073a6413474ca0e0f63",
              },
              (tokenVal) => {
                accessTokenUser2 = tokenVal;
                utils.getToken(
                  appUrl,
                  {
                    username: "user3",
                    password: "70dc489e8ee823ae815e18d664424df2",
                  },
                  (tokenVal) => {
                    accessTokenUser3 = tokenVal;
                    utils.getToken(
                      appUrl,
                      {
                        username: "archiveManager",
                        password: "aman",
                      },
                      (tokenVal) => {
                        accessTokenArchiveManager = tokenVal;
                        done();
                      },
                    );
                  },
                );
              },
            );
          },
        );
      },
    );
  });

  afterEach((done) => {
    sandbox.restore();
    done();
  });

  it("adds dataset 1", async () => {
    return request(appUrl)
      .post("/api/v3/Datasets")
      .send(RawCorrect1)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("ownerGroup").and.equal(RawCorrect1.ownerGroup);
        res.body.should.have.property("type").and.equal(RawCorrect1.type);
        res.body.should.have.property("isPublished").and.equal(RawCorrect1.isPublished);
        res.body.should.have.property("pid").and.be.string;
        datasetPid1 = res.body["pid"];
        encodedDatasetPid1 = encodeURIComponent(datasetPid1);
      });
  });

  it("adds dataset 2", async () => {
    return request(appUrl)
      .post("/api/v3/Datasets")
      .send(RawCorrect2)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("ownerGroup").and.equal(RawCorrect2.ownerGroup);
        res.body.should.have.property("type").and.equal(RawCorrect2.type);
        res.body.should.have.property("isPublished").and.equal(RawCorrect2.isPublished);
        res.body.should.have.property("pid").and.be.string;
        datasetPid2 = res.body["pid"];
        encodedDatasetPid2 = encodeURIComponent(datasetPid2);
      });
  });

  it("adds dataset 3", async () => {
    return request(appUrl)
      .post("/api/v3/Datasets")
      .send(RawCorrect3)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("ownerGroup").and.equal(RawCorrect3.ownerGroup);
        res.body.should.have.property("type").and.equal(RawCorrect3.type);
        res.body.should.have.property("isPublished").and.equal(RawCorrect3.isPublished);
        res.body.should.have.property("pid").and.be.string;
        datasetPid3 = res.body["pid"];
        encodedDatasetPid3 = encodeURIComponent(datasetPid3);
      });
  });

  it("adds dataset 4", async () => {
    return request(appUrl)
      .post("/api/v3/Datasets")
      .send(RawCorrect4)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("ownerGroup").and.equal(RawCorrect4.ownerGroup);
        res.body.should.have.property("type").and.equal(RawCorrect4.type);
        res.body.should.have.property("isPublished").and.equal(RawCorrect4.isPublished);
        res.body.should.have.property("pid").and.be.string;
        datasetPid4 = res.body["pid"];
        encodedDatasetPid4 = encodeURIComponent(datasetPid4);
      });
  });

  it("retrieve single dataset by its name", async () => {
    const query = { where: { datasetName: RawCorrect1.datasetName } };
    return request(appUrl)
      .get("/api/v3/Datasets")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .query("filter=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.be.an("array").to.have.lengthOf(1);
        res.body[0]["pid"].should.be.equal(datasetPid1);
      });
  });

  it("retrieve datasets with \"correct test raw\" in dataset name using loopback style \"like\" operator", async () => {
    const query = { where: { datasetName: { like: "correct test raw" }}};
    return request(appUrl)
      .get("/api/v3/Datasets")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .query("filter=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.be.an("array").to.have.lengthOf(3);
      });
  });

  it("count how many datasets with \"correct test raw\" in dataset name using loopback style \"like\" operator", async () => {
    const query = { where: { datasetName: { like: "correct test raw" }}};
    return request(appUrl)
      .get("/api/v3/Datasets/count")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .query("filter=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body["count"].should.be.equal(3);
      });
  });

  it("retrieve one dataset with \"correct test raw\" in dataset name using loopback style \"like\" operator", async () => {
    const query = { where: { datasetName: { like: "correct test raw" }}};
    return request(appUrl)
      .get("/api/v3/Datasets/findOne")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .query("filter=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body["pid"].should.be.oneOf([datasetPid1, datasetPid2, datasetPid3]);
      });
  });

  it("retrieve datasets with \"correct test raw\" in dataset name using mongo regex operator", async () => {
    const query = { where: { datasetName: { "$regex": "correct test raw" }}};
    return request(appUrl)
      .get("/api/v3/Datasets")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .query("filter=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.be.an("array").to.have.lengthOf(3);
      });
  });

  it("count how many datasets with \"correct test raw\" in dataset name using mongo regex operator", async () => {
    const query = { where: { datasetName: { "$regex": "correct test raw" }}};
    return request(appUrl)
      .get("/api/v3/Datasets/count")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .query("filter=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body["count"].should.be.equal(3);
      });
  });

  it("retrieve one datasets with \"correct test raw\" in dataset name using mongo regex operator", async () => {
    const query = { where: { datasetName: { "$regex": "correct test raw" }}};
    return request(appUrl)
      .get("/api/v3/Datasets/findOne")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .query("filter=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body["pid"].should.be.oneOf([datasetPid1, datasetPid2, datasetPid3]);
      });
  });


  it("retrieve datasets with \"third correct\" in dataset name using loopback style \"like\" operator", async () => {
    const query = { where: { datasetName: { like: "third correct" }}};
    return request(appUrl)
      .get("/api/v3/Datasets")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .query("filter=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.be.an("array").to.have.lengthOf(1);
        res.body[0]["pid"].should.be.equal(datasetPid3);
      });
  });

  it("retrieve one dataset with \"third correct\" in dataset name using loopback style \"like\" operator", async () => {
    const query = { where: { datasetName: { like: "third correct" }}};
    return request(appUrl)
      .get("/api/v3/Datasets/findOne")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .query("filter=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body["pid"].should.be.equal(datasetPid3);
      });
  });

  it("count how many datasets with \"third correct\" in dataset name using loopback style \"like\" operator", async () => {
    const query = { where: { datasetName: { like: "third correct" }}};
    return request(appUrl)
      .get("/api/v3/Datasets/count")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .query("filter=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body["count"].should.be.equal(1);
      });
  });

  it("retrieve datasets with \"third correct\" in dataset name using mongo \"regex\" operator", async () => {
    const query = { where: { datasetName: { "$regex": "third correct" }}};
    return request(appUrl)
      .get("/api/v3/Datasets")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .query("filter=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.be.an("array").to.have.lengthOf(1);
        res.body[0]["pid"].should.be.equal(datasetPid3);
      });
  });

  it("retrieve one dataset with \"third correct\" in dataset name using mongo \"regex\" operator", async () => {
    const query = { where: { datasetName: { "$regex": "third correct" }}};
    return request(appUrl)
      .get("/api/v3/Datasets/findOne")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .query("filter=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body["pid"].should.be.equal(datasetPid3);
      });
  });

  it("count how many datasets with \"third correct\" in dataset name using mongo \"regex\" operator", async () => {
    const query = { where: { datasetName: { "$regex": "third correct" }}};
    return request(appUrl)
      .get("/api/v3/Datasets/count")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .query("filter=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body["count"].should.be.equal(1);
      });
  });

  it("retrieve datasets with \"Part of the first two dataset\" in description using loopback style \"like\" operator", async () => {
    const query = { where: { description: { like: "Part of the first two datasets" }}};
    return request(appUrl)
      .get("/api/v3/Datasets")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .query("filter=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.be.an("array").to.have.lengthOf(2);
        res.body[0]["pid"].should.be.oneOf([datasetPid1, datasetPid2]);
        res.body[1]["pid"].should.be.oneOf([datasetPid1, datasetPid2]);
      });
  });

  it("retrieve one dataset with \"Part of the first two dataset\" in description using loopback style \"like\" operator", async () => {
    const query = { where: { description: { like: "Part of the first two datasets" }}};
    return request(appUrl)
      .get("/api/v3/Datasets/findOne")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .query("filter=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body["pid"].should.be.oneOf([datasetPid1, datasetPid2]);
      });
  });

  it("count how many datasets with \"Part of the first two dataset\" in description using loopback style \"like\" operator", async () => {
    const query = { where: { description: { like: "Part of the first two datasets" }}};
    return request(appUrl)
      .get("/api/v3/Datasets/count")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .query("filter=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body["count"].should.be.equal(2);
      });
  });

  it("retrieve datasets with \"Part of the first two dataset\" in description using \"regex\" operator", async () => {
    const query = { where: { description: { "$regex": "Part of the first two datasets" }}};
    return request(appUrl)
      .get("/api/v3/Datasets")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .query("filter=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.be.an("array").to.have.lengthOf(2);
        res.body[0]["pid"].should.be.oneOf([datasetPid1, datasetPid2]);
        res.body[1]["pid"].should.be.oneOf([datasetPid1, datasetPid2]);
      });
  });

  it("retrieve one dataset with \"Part of the first two dataset\" in description using mongo \"regex\" operator", async () => {
    const query = { where: { description: { "$regex": "Part of the first two datasets" }}};
    return request(appUrl)
      .get("/api/v3/Datasets/findOne")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .query("filter=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body["pid"].should.be.oneOf([datasetPid1, datasetPid2]);
      });
  });

  it("count how many datasets with \"Part of the first two dataset\" in description using mongo \"regex\" operator", async () => {
    const query = { where: { description: { "$regex": "Part of the first two datasets" }}};
    return request(appUrl)
      .get("/api/v3/Datasets/count")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .query("filter=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body["count"].should.be.equal(2);
      });
  });

  it("retrieve datasets with \"lifetime passed\" in description using loopback style \"like\" operator", async () => {
    const query = { where: { description: { like: "lifetime passed" }}};
    return request(appUrl)
      .get("/api/v3/Datasets")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .query("filter=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.be.an("array").to.have.lengthOf(1);
        res.body[0]["pid"].should.be.equal(datasetPid3);
      });
  });

  it("retrieve one dataset with \"lifetime passed\" in description using loopback style \"like\" operator", async () => {
    const query = { where: { description: { like: "lifetime passed" }}};
    return request(appUrl)
      .get("/api/v3/Datasets/findOne")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .query("filter=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body["pid"].should.be.equal(datasetPid3);
      });
  });

  it("count how many datasets with \"lifetime passed\" in description using loopback style \"like\" operator", async () => {
    const query = { where: { description: { like: "lifetime passed" }}};
    return request(appUrl)
      .get("/api/v3/Datasets/count")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .query("filter=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body["count"].should.be.equal(1);
      });
  });

  it("retrieve datasets with \"lifetime passed\" in description using \"regex\" operator", async () => {
    const query = { where: { description: { "$regex": "lifetime passed" }}};
    return request(appUrl)
      .get("/api/v3/Datasets")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .query("filter=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.be.an("array").to.have.lengthOf(1);
        res.body[0]["pid"].should.be.equal(datasetPid3);
      });
  });

  it("retrieve one dataset with \"lifetime passed\" in description using \"regex\" operator", async () => {
    const query = { where: { description: { "$regex": "lifetime passed" }}};
    return request(appUrl)
      .get("/api/v3/Datasets/findOne")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .query("filter=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body["pid"].should.be.equal(datasetPid3);
      });
  });

  it("count how many datasets with \"lifetime passed\" in description using \"regex\" operator", async () => {
    const query = { where: { description: { "$regex": "lifetime passed" }}};
    return request(appUrl)
      .get("/api/v3/Datasets/count")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .query("filter=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body["count"].should.be.equal(1);
      });
  });

  it("retrieve datasets with \"second\" or \"third\" together with \"dataset\" in description using \"regex\" operator", async () => {
    const query = { where: { datasetName: { "$regex": "(second|third).*dataset" }}};
    return request(appUrl)
      .get("/api/v3/Datasets")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .query("filter=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.be.an("array").to.have.lengthOf(2);
        res.body[0]["pid"].should.be.oneOf([datasetPid2, datasetPid3]);
        res.body[1]["pid"].should.be.oneOf([datasetPid2, datasetPid3]);
      });
  });

  it("retrieve one dataset with \"second\" or \"third\" together with \"dataset\" in description using \"regex\" operator", async () => {
    const query = { where: { datasetName: { "$regex": "(second|third).*dataset" }}};
    return request(appUrl)
      .get("/api/v3/Datasets/findOne")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .query("filter=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body["pid"].should.be.oneOf([datasetPid2, datasetPid3]);
      });
  });

  it("count how many datasets with \"second\" or \"third\" together with \"dataset\" in description using \"regex\" operator", async () => {
    const query = { where: { datasetName: { "$regex": "(second|third).*dataset" }}};
    return request(appUrl)
      .get("/api/v3/Datasets/count")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .query("filter=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body["count"].should.be.equal(2);
      });
  });

  it("retrieve datasets with \"cream\" and \"money\" or \"opportunity\" and \"decide\" in description using \"regex\" operator", async () => {
    const query = { where: { description: { "$regex": "(cream.*money|opportunity.*decide)" }}};
    return request(appUrl)
      .get("/api/v3/Datasets")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .query("filter=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.be.an("array").to.have.lengthOf(2);
        res.body[0]["pid"].should.be.oneOf([datasetPid1, datasetPid3]);
        res.body[1]["pid"].should.be.oneOf([datasetPid1, datasetPid3]);
      });
  });

  it("retrieve one dataset with \"cream\" and \"money\" or \"opportunity\" and \"decide\" in description using \"regex\" operator", async () => {
    const query = { where: { description: { "$regex": "(cream.*money|opportunity.*decide)" }}};
    return request(appUrl)
      .get("/api/v3/Datasets/findOne")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .query("filter=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body["pid"].should.be.oneOf([datasetPid1, datasetPid3]);
      });
  });

  it("count how many datasets with \"cream\" and \"money\" or \"opportunity\" and \"decide\" in description using \"regex\" operator", async () => {
    const query = { where: { description: { "$regex": "(cream.*money|opportunity.*decide)" }}};
    return request(appUrl)
      .get("/api/v3/Datasets/count")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .query("filter=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body["count"].should.be.equal(2);
      });
  });

  it("should delete dataset 1", async () => {
    return request(appUrl)
      .delete("/api/v3/datasets/" + encodedDatasetPid1)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenArchiveManager}` })
      .expect(200)
      .expect("Content-Type", /json/);
  });

  it("should delete dataset 2", async () => {
    return request(appUrl)
      .delete("/api/v3/datasets/" + encodedDatasetPid2)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenArchiveManager}` })
      .expect(200)
      .expect("Content-Type", /json/);
  });

  it("should delete dataset 3", async () => {
    return request(appUrl)
      .delete("/api/v3/datasets/" + encodedDatasetPid3)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenArchiveManager}` })
      .expect(200)
      .expect("Content-Type", /json/);
  });

  it("should delete dataset 4", async () => {
    return request(appUrl)
      .delete("/api/v3/datasets/" + encodedDatasetPid4)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenArchiveManager}` })
      .expect(200)
      .expect("Content-Type", /json/);
  });

});
