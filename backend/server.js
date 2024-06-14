// 引入必要的模組
const express = require('express') // Express 框架
const mongoose = require('mongoose') // Mongoose，用於連接和操作 MongoDB
const cors = require('cors') // CORS 中間件，用於允許跨來源請求
const { mongoURI } = require('./config') // 從 config 文件中獲取 MongoDB 連接字串

// 建立 Express 應用程式
const app = express()
const port = process.env.PORT || 5000 // 設定伺服器運行端口，默認為 5000

// 使用 CORS 中間件
app.use(cors())

// 使用內建的 JSON 處理中間件
app.use(express.json())

// 連接到 MongoDB Atlas
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true, // 使用新的 URL 解析器
    useUnifiedTopology: true // 使用新的服務發現和監視引擎
  })
  .then(() => {
    console.log('Connected to MongoDB Atlas') // 成功連接後的控制台輸出
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB Atlas', err) // 連接失敗後的錯誤處理
  })

// 定義投資資料模型
const investmentSchema = new mongoose.Schema({
  userId: String, // 用戶 ID
  coinId: String, // 加密貨幣代號
  amountInvested: Number, // 投資金額
  buyPrice: Number, // 買入成本
  currentPrice: Number // 當前價格
})

// 建立 Investment 模型
const Investment = mongoose.model('Investment', investmentSchema)

// 建立 API 來處理投資數據的 POST 請求
app.post('/api/investments', async (req, res) => {
  const { userId, coinId, amountInvested, buyPrice } = req.body // 從請求體中獲取投資數據

  // 獲取實時價格
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`
  )
  const data = await response.json() // 解析 JSON 回應
  const currentPrice = data[coinId].usd // 獲取加密貨幣的當前價格

  // 建立新的 Investment 文件並保存到資料庫
  const investment = new Investment({ userId, coinId, amountInvested, buyPrice, currentPrice })
  await investment.save() // 保存投資數據
  res.send(investment) // 返回保存的投資數據
})

// 啟動伺服器並監聽指定端口
app.listen(port, () => {
  console.log(`Server is running on port ${port}`) // 伺服器啟動後的控制台輸出
})
