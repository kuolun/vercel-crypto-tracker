<template>
  <div>
    <h1>加密貨幣投資</h1>
    <form @submit.prevent="addInvestment">
      <input v-model="coinId" placeholder="加密貨幣代號" required />
      <p>invest twd</p>
      <input v-model="amountInvested" placeholder="投資金額" type="number" required />
      <p>buy price cost</p>
      <input v-model="buyPrice" placeholder="買入成本" type="number" required />
      <button type="submit">添加投資</button>
    </form>
    <div v-if="investment">
      <p>目前價格: {{ investment.currentPrice }}</p>
      <p>獲利或虧損: {{ calculateProfitOrLoss() }}</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const coinId = ref('')
    const amountInvested = ref(0)
    const buyPrice = ref(0)
    const investment = ref(null)

    const addInvestment = async () => {
      const response = await fetch('http://localhost:5000/api/investments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: 'user123',
          coinId: coinId.value,
          amountInvested: amountInvested.value,
          buyPrice: buyPrice.value
        })
      })
      const data = await response.json()
      investment.value = data
    }

    const calculateProfitOrLoss = () => {
      if (!investment.value) return 0
      const currentTotal = investment.value.currentPrice * amountInvested.value
      const investedTotal = buyPrice.value * amountInvested.value
      return currentTotal - investedTotal
    }

    return {
      coinId,
      amountInvested,
      buyPrice,
      investment,
      addInvestment,
      calculateProfitOrLoss
    }
  }
}
</script>
