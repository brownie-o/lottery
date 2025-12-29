import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLotteryStore = defineStore('lottery', () => {
  const currentDraw = ref(null)
  const history = ref([])
  const isConfirmed = ref(false)

  const generateRandom = (min, max) => {
    return Math.round(Math.random() * (max - min)) + min
  }

  const saveHistory = () => {
    localStorage.setItem('lotteryHistory', JSON.stringify(history.value))
  }

  const saveCurrentDraw = () => {
    if (currentDraw.value) {
      localStorage.setItem('lotteryCurrentDraw', JSON.stringify(currentDraw.value))
    } else {
      localStorage.removeItem('lotteryCurrentDraw')
    }
  }

  const roll = () => {
    isConfirmed.value = false
    let lotteryA = []
    // Generate 6 unique numbers (1-38)
    while (lotteryA.length < 6) {
      const number = generateRandom(1, 38)
      if (!lotteryA.includes(number)) {
        lotteryA.push(number)
      }
    }
    // Sort for better readability
    lotteryA.sort((a, b) => a - b)

    // Generate 1 special number (1-8)
    const lotteryB = generateRandom(1, 8)

    const draw = {
      id: Date.now(),
      numbers: lotteryA,
      special: lotteryB,
      date: new Date().toLocaleString()
    }

    currentDraw.value = draw
    saveCurrentDraw()
  }

  const updateCurrentDraw = (numbers, special) => {
    if (currentDraw.value) {
      currentDraw.value.numbers = numbers.sort((a, b) => a - b)
      currentDraw.value.special = special
      saveCurrentDraw()
    }
  }

  const confirmDraw = () => {
    if (currentDraw.value && !isConfirmed.value) {
      history.value.unshift(currentDraw.value)
      saveHistory()
      isConfirmed.value = true
      currentDraw.value = null // Clear current draw after confirming
      saveCurrentDraw() // Clear from storage
    }
  }

  const removeHistoryItem = (id) => {
    history.value = history.value.filter(item => item.id !== id)
    saveHistory()
  }

  const updateComment = (id, comment) => {
    const item = history.value.find(item => item.id === id)
    if (item) {
      item.comment = comment
      saveHistory()
    }
  }

  const loadHistory = () => {
    const saved = localStorage.getItem('lotteryHistory')
    if (saved) {
      try {
        history.value = JSON.parse(saved)
      } catch (e) {
        console.error("Failed to parse history", e)
        history.value = []
      }
    }

    // Load current draw persistence
    const savedCurrent = localStorage.getItem('lotteryCurrentDraw')
    if (savedCurrent) {
      try {
        currentDraw.value = JSON.parse(savedCurrent)
      } catch (e) {
        console.error("Failed to parse current draw", e)
      }
    }
  }

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear the history?')) {
      history.value = []
      localStorage.removeItem('lotteryHistory')
    }
  }

  return {
    currentDraw,
    history,
    isConfirmed,
    roll,
    confirmDraw,
    updateCurrentDraw,
    removeHistoryItem,
    updateComment,
    loadHistory,
    clearHistory
  }
})
