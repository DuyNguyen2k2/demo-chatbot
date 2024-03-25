require("dotenv").config();
let getHomePage = (req, res) => {
  return res.send("Xin chào");
};

let postWebhook = (req, res) => {
  const body = req.body;

  // Kiểm tra loại sự kiện
  if (body.object === "page") {
    // Duyệt qua mỗi mục nhập, có thể có nhiều mục nhập nếu được gửi cùng lúc
    body.entry.forEach(function (entry) {
      // Lấy tin nhắn. entry.messaging là một mảng, nhưng
      // sẽ chỉ chứa một tin nhắn, vì vậy chúng ta sẽ lấy phần tử đầu tiên
      const webhookEvent = entry.messaging[0];
      console.log(webhookEvent);
    });

    // Trả lời '200 OK' để báo hiệu rằng sự kiện đã được nhận
    res.status(200).send("EVENT_RECEIVED");
  } else {
    // Trả lời 404 nếu sự kiện không phải từ trang
    res.sendStatus(404);
  }
};

let getWebhook = (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  // Parse ra các query params
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  // Kiểm tra token và mode
  if (mode && token) {
    // Kiểm tra mode và token có đúng hay không
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
};
module.exports = {
  getHomePage: getHomePage,
  getWebhook: getWebhook,
  postWebhook: postWebhook,
};
