const tf = require('@tensorflow/tfjs')
require('tfjs-node-save')

const loadModel = async () => {
  const model = await tf.loadLayersModel('file://src/assets/model/model.json')
  return model
}

const genAllPosibleMoves = (board, player) => {
  const moves = []

  for (let i = 0; i < board.length; i++) {
    if (board[i] === 2) {
      const move = [...board]
      move[i] = player
      moves.push([move, i])
    }
  }

  return moves
}

const shuffle = (array) => {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

const handleTicTacToe = async (req, res) => {
  const model = await loadModel()

  const { board } = req.body
  const data = genAllPosibleMoves(board, 1)
  shuffle(data)
  // console.log(data)

  const predictions = []
  for (let i = 0; i < data.length; i++) {
    const board = data[i][0]
    const move = data[i][1]

    //x = 0
    //o = 1
    //b = 2

    const x = tf.tensor2d(board, [1, 9])
    const prediction = model.predict(x).dataSync()
    const prob = prediction[0]
    const value = prob < 0.5 ? 0 : 1
    //0 gana x
    //1 gana o

    predictions.push([board, value, move])
  }

  predictions.sort((a, b) => {
    return b[1] - a[1]
  })

  // console.log(predictions)

  res.status(200).json({
    ok: true,
    prediction: predictions[0][0],
    prob: predictions[0][1],
    move: predictions[0][2]
  })
}

module.exports = { handleTicTacToe }
