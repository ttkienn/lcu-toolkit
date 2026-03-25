/**
 * @author ttkienn (Thiệu Trung Kiên)
 * @facebook: https://www.facebook.com/ttkiennn
 * @tele: t.me/vel1x0
 * @created 2026-03-25
 */

const { authenticate, createHttp1Request } = require("league-connect");

class LeagueTool {
  #credentials = null;

  async connect() {
    try {
      this.#credentials = await authenticate();
      return true;
    } catch {
      return false;
    }
  }

  async #request(method, url, body) {
    if (!this.#credentials) throw new Error("Chưa kết nối LCU");
    return createHttp1Request({ method, url, body }, this.#credentials);
  }

  async #getMe() {
    const res = await this.#request("GET", "/lol-chat/v1/me");
    return res.json();
  }

  async changeStatus(statusMessage, availability = "chat") {
    try {
      const profile = await this.#getMe();
      const res = await this.#request("PUT", "/lol-chat/v1/me", {
        ...profile,
        statusMessage,
        availability,
      });
      return res.ok ? { error: false } : { error: true, msg: await res.text() };
    } catch (e) {
      return { error: true, msg: e.message };
    }
  }

  async changeAvatar(iconId) {
    try {
      const res = await this.#request("PUT", "/lol-chat/v1/me", { icon: iconId });
      return res.ok ? { error: false } : { error: true, msg: await res.text() };
    } catch (e) {
      return { error: true, msg: e.message };
    }
  }

  async customChibi(iconId) {
    try {
      const res = await this.#request(
        "PUT",
        "/lol-summoner/v1/current-summoner/icon",
        { profileIconId: iconId }
      );
      return res.ok ? { error: false } : { error: true, msg: await res.text() };
    } catch (e) {
      return { error: true, msg: e.message };
    }
  }

  async changeBackground(skinId) {
    try {
      const res = await this.#request(
        "POST",
        "/lol-summoner/v1/current-summoner/summoner-profile",
        { key: "backgroundSkinId", value: skinId }
      );
      return res.ok ? { error: false } : { error: true, msg: await res.text() };
    } catch (e) {
      return { error: true, msg: e.message };
    }
  }

  async changeRank(tier = "DIAMOND", division = "I", queue = "RANKED_SOLO_5x5") {
    try {
      const profile = await this.#getMe();
      const lol = typeof profile.lol === "string"
        ? JSON.parse(profile.lol)
        : (profile.lol ?? {});

      const res = await this.#request("PUT", "/lol-chat/v1/me", {
        ...profile,
        lol: {
          ...lol,
          rankedLeagueTier: tier.toUpperCase(),
          rankedLeagueDivision: division.toUpperCase(),
          rankedLeagueQueue: queue.toUpperCase(),
        },
      });
      return res.ok ? { error: false } : { error: true, msg: await res.text() };
    } catch (e) {
      return { error: true, msg: e.message };
    }
  }
}

module.exports = LeagueTool;
