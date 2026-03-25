# lcu-toolkit

> Interact with the League Client (LCU) API to customize your profile, status, and rank display.

Đổi status, avatar, rank hiển thị, background lobby — tất cả qua LCU API, không cần can thiệp vào game.

---

## Yêu cầu

- Node.js 16+
- League of Legends đang chạy trên máy

---

## Cài đặt

```bash
npm install league-connect
```

---

## Dùng như nào

```js
const LeagueTool = require("./leagueTool");

const tool = new LeagueTool();
const connected = await tool.connect();

if (!connected) {
  console.log("Mở League client trước đã");
  process.exit(1);
}

await tool.changeStatus("đang tilt");
await tool.changeRank("challenger", "I");
```

---

## API

Tất cả method đều trả về `{ error: boolean, msg?: string }`.

### `connect()`

Kết nối tới League client đang chạy. Phải gọi trước mọi thứ.

```js
const ok = await tool.connect(); // true | false
```

---

### `changeStatus(statusMessage, availability?)`

Đổi status message và trạng thái hiển thị.

```js
await tool.changeStatus("đang ăn cơm", "dnd");
```

| Param | Type | Default | Mô tả |
|---|---|---|---|
| `statusMessage` | `string` | — | Dòng chữ hiển thị dưới tên |
| `availability` | `string` | `"chat"` | `chat` / `away` / `dnd` |

---

### `changeAvatar(iconId)`

Đổi avatar profile (icon trong chat).

```js
await tool.changeAvatar(4895);
```

---

### `customChibi(iconId)`

Đổi chibi/icon summoner hiển thị trên profile.

```js
await tool.customChibi(4895);
```

---

### `changeBackground(skinId)`

Đổi background lobby.

```js
await tool.changeBackground(267001); // Ahri default
```

---

### `changeRank(tier?, division?, queue?)`

Fake rank hiển thị trong chat — chỉ thay đổi phía client, không ảnh hưởng rank thật.

```js
await tool.changeRank("challenger", "I", "RANKED_SOLO_5x5");
```

| Param | Type | Default |
|---|---|---|
| `tier` | `string` | `DIAMOND` |
| `division` | `string` | `I` |
| `queue` | `string` | `RANKED_SOLO_5x5` |

---

## Lưu ý

- Tool này chỉ giao tiếp với **League client**, không đụng vào game hay server Riot.
- Rank fake chỉ hiển thị với bạn bè trong client — không thay đổi rank thật trên server.
- Mỗi lần League restart thì cần gọi `connect()` lại.

---

## Author

**Thiệu Trung Kiên**
- GitHub: [@ttkienn](https://github.com/ttkienn)
- Facebook: [Thiệu Trung Kiên](https://facebook.com/ttkiennn)

---

## License

MIT
