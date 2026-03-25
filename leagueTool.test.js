/**
 * @author ttkienn (Thiệu Trung Kiên)
 * @facebook: https://www.facebook.com/ttkiennn
 * @tele: t.me/vel1x0
 * @created 2026-03-25
 */
const { authenticate, createHttp1Request } = require("league-connect");
const LeagueTool = require("./leagueTool");

jest.mock("league-connect");

const fakeRes = (ok, body = {}) => ({
  ok,
  json: () => Promise.resolve(body),
  text: () => Promise.resolve("lcu error"),
});

const makeConnectedTool = async () => {
  authenticate.mockResolvedValue({ token: "abc" });
  const tool = new LeagueTool();
  await tool.connect();
  return tool;
};

describe("LeagueTool", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("connect", () => {
    it("returns true when authenticate succeeds", async () => {
      authenticate.mockResolvedValue({ token: "abc" });
      expect(await new LeagueTool().connect()).toBe(true);
    });

    it("returns false when authenticate throws", async () => {
      authenticate.mockRejectedValue(new Error("not found"));
      expect(await new LeagueTool().connect()).toBe(false);
    });
  });

  describe("changeStatus", () => {
    it("returns error if not connected", async () => {
      const res = await new LeagueTool().changeStatus("hi");
      expect(res).toEqual({ error: true, msg: "Chưa kết nối LCU" });
    });

    it("merges statusMessage and availability into existing profile", async () => {
      const tool = await makeConnectedTool();
      createHttp1Request
        .mockResolvedValueOnce(fakeRes(true, { summonerName: "Faker", availability: "away" }))
        .mockResolvedValueOnce(fakeRes(true));

      await tool.changeStatus("đang ăn cơm", "dnd");

      expect(createHttp1Request.mock.calls[1][0].body).toMatchObject({
        summonerName: "Faker",
        statusMessage: "đang ăn cơm",
        availability: "dnd",
      });
    });

    it("returns error when PUT fails", async () => {
      const tool = await makeConnectedTool();
      createHttp1Request
        .mockResolvedValueOnce(fakeRes(true, {}))
        .mockResolvedValueOnce(fakeRes(false));

      expect((await tool.changeStatus("test")).error).toBe(true);
    });
  });

  describe("changeRank", () => {
    it("parses lol field when it comes back as a JSON string", async () => {
      const tool = await makeConnectedTool();
      createHttp1Request
        .mockResolvedValueOnce(fakeRes(true, { lol: JSON.stringify({ someField: "x" }) }))
        .mockResolvedValueOnce(fakeRes(true));

      await tool.changeRank("challenger", "i");

      expect(createHttp1Request.mock.calls[1][0].body.lol).toMatchObject({
        someField: "x",
        rankedLeagueTier: "CHALLENGER",
      });
    });

    it("uppercases tier, division and queue before sending", async () => {
      const tool = await makeConnectedTool();
      createHttp1Request
        .mockResolvedValueOnce(fakeRes(true, { lol: {} }))
        .mockResolvedValueOnce(fakeRes(true));

      await tool.changeRank("diamond", "ii", "ranked_solo_5x5");

      const { lol } = createHttp1Request.mock.calls[1][0].body;
      expect(lol.rankedLeagueTier).toBe("DIAMOND");
      expect(lol.rankedLeagueDivision).toBe("II");
      expect(lol.rankedLeagueQueue).toBe("RANKED_SOLO_5x5");
    });
  });
});
